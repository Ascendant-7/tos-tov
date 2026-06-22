<template>
  <div
    class="min-h-screen grid place-items-center px-5 py-8 bg-[linear-gradient(120deg,rgba(249,240,223,0.9),rgba(233,230,226,0.7)),url('/images/angkor.jpg')] bg-cover bg-center text-[#1c1b1a] relative overflow-hidden"
  >
    <!-- Glow -->
    <div
      class="absolute inset-[-20%_0_0_0] blur-lg opacity-80 pointer-events-none bg-[radial-gradient(circle_at_15%_15%,rgba(255,168,110,0.35),transparent_55%), radial-gradient(circle_at_80%_10%,rgba(110,208,255,0.3),transparent_50%), radial-gradient(circle_at_60%_80%,rgba(29,106,150,0.22),transparent_60%)]"
    ></div>

    <div
      class="w-full max-w-[1100px] grid md:grid-cols-[1.1fr_0.9fr] rounded-[28px] overflow-hidden shadow-[0_30px_80px_rgba(38,37,35,0.25)] bg-white/95 backdrop-blur transition-all duration-700"
    >
      <!-- LEFT PANEL (Same as Login for consistency) -->
      <aside
        class="hidden md:flex relative flex-col justify-between p-12 text-[#f7f2ea] bg-[linear-gradient(160deg,rgba(7,38,72,0.98),rgba(14,110,158,0.92))]"
      >
        <div class="space-y-3">
          <h1 class="text-[34px] font-serif leading-tight">Tos Tuv Cambodia</h1>
          <p class="text-sm opacity-80 max-w-xs leading-relaxed">
            Every journey begins with a single step. Let's get you back on track.
          </p>
        </div>

        <div class="space-y-3">
          <span
            class="text-[11px] tracking-[1.8px] uppercase px-4 py-1 rounded-full bg-white/20 inline-block"
          >
            Security First
          </span>
          <h2 class="text-3xl font-serif leading-tight">Secure your account.</h2>
          <p class="opacity-85 max-w-xs leading-relaxed">
            We use one-time passwords to ensure your data remains yours alone.
          </p>
        </div>

        <!-- Decorations -->
        <div
          class="absolute -right-32 -bottom-32 w-80 h-80 rounded-full bg-gradient-to-br from-orange-300 to-orange-500 opacity-70 blur-sm"
        ></div>
        <div
          class="absolute left-[-80px] top-1/2 w-60 h-60 rounded-full border border-white/30 rotate-[-10deg]"
        ></div>
      </aside>

      <!-- FORM AREA -->
      <main class="p-10 md:p-14 flex flex-col gap-6 bg-white/95 min-h-[500px] justify-center">
        <!-- STEP 1: ENTER EMAIL -->
        <div v-if="currentStep === 1" class="space-y-6">
          <div class="space-y-2">
            <span class="uppercase text-xs tracking-[2px] text-[#0b6f91] font-semibold">
              Recovery
            </span>
            <h1 class="text-4xl font-serif">Forgot Password?</h1>
            <p class="text-sm text-gray-600">Enter your email and we'll send you an OTP code.</p>
          </div>

          <div v-if="error" class="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100">
            {{ error }}
          </div>

          <form @submit.prevent="handleSendOTP" class="space-y-5">
            <input
              v-model="email"
              type="email"
              placeholder="Email Address"
              required
              class="w-full px-4 py-4 rounded-xl border border-gray-300 bg-white text-sm focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition"
            />
            <button
              type="submit"
              :disabled="loading"
              class="w-full bg-gradient-to-r from-[#0b5678] to-[#2aa8d1] text-white py-4 rounded-xl font-semibold hover:-translate-y-0.5 hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {{ loading ? 'Sending...' : 'Send OTP Code →' }}
            </button>
          </form>

          <p class="text-sm text-center text-gray-600">
            Remembered your password?
            <router-link to="/login" class="text-[#1476a5] font-semibold hover:underline">
              Back to Login
            </router-link>
          </p>
        </div>

        <!-- STEP 2: ENTER OTP -->
        <div v-if="currentStep === 2" class="space-y-6">
          <div class="space-y-2">
            <span class="uppercase text-xs tracking-[2px] text-[#0b6f91] font-semibold">
              Verification
            </span>
            <h1 class="text-4xl font-serif">Verify OTP</h1>
            <p class="text-sm text-gray-600">
              We've sent a 6-digit code to <span class="font-semibold text-gray-800">{{ email }}</span>
            </p>
          </div>

          <div v-if="error" class="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100">
            {{ error }}
          </div>

          <div class="flex justify-between gap-2">
            <input
              v-for="(digit, index) in 6"
              :key="index"
              :id="'otp-' + index"
              v-model="otpDigits[index]"
              type="text"
              maxlength="1"
              @input="handleOtpInput($event, index)"
              @keydown.delete="handleOtpDelete($event, index)"
              @paste="handleOtpPaste"
              class="w-12 h-14 text-center text-xl font-bold rounded-xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition"
            />
          </div>

          <div class="text-center space-y-4">
            <p class="text-sm text-gray-500">
              Code expires in: <span class="font-mono font-bold text-[#0b6f91]">{{ formattedTimer }}</span>
            </p>

            <button
              @click="handleVerifyOTP"
              :disabled="loading || !isOtpComplete"
              class="w-full bg-gradient-to-r from-[#0b5678] to-[#2aa8d1] text-white py-4 rounded-xl font-semibold hover:-translate-y-0.5 hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {{ loading ? 'Verifying...' : 'Verify & Proceed →' }}
            </button>

            <button
              @click="handleSendOTP"
              :disabled="timer > 0 || loading"
              class="text-sm font-semibold text-[#1476a5] hover:underline disabled:opacity-50 disabled:no-underline"
            >
              Resend Code
            </button>
          </div>
        </div>

        <!-- STEP 3: NEW PASSWORD -->
        <div v-if="currentStep === 3" class="space-y-6">
          <div class="space-y-2">
            <span class="uppercase text-xs tracking-[2px] text-[#0b6f91] font-semibold">
              New Password
            </span>
            <h1 class="text-4xl font-serif">Secure Account</h1>
            <p class="text-sm text-gray-600">Create a strong password for your journey.</p>
          </div>

          <div v-if="error" class="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100">
            {{ error }}
          </div>

          <form @submit.prevent="handleResetPassword" class="space-y-4">
            <div class="relative">
              <input
                v-model="newPassword"
                :type="showPassword ? 'text' : 'password'"
                placeholder="New Password"
                required
                class="w-full px-4 py-4 rounded-xl border border-gray-300 bg-white text-sm focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {{ showPassword ? 'Hide' : 'Show' }}
              </button>
            </div>

            <!-- Strength Indicator -->
            <div class="space-y-1.5">
              <div class="flex gap-1 h-1">
                <div
                  v-for="i in 4"
                  :key="i"
                  class="flex-1 rounded-full transition-colors duration-500"
                  :class="[
                    passwordStrength >= i
                      ? (passwordStrength <= 1 ? 'bg-red-400' : passwordStrength <= 2 ? 'bg-orange-400' : passwordStrength <= 3 ? 'bg-yellow-400' : 'bg-green-500')
                      : 'bg-gray-200'
                  ]"
                ></div>
              </div>
              <p class="text-[10px] uppercase tracking-wider font-bold" :class="strengthColor">
                {{ strengthText }}
              </p>
            </div>

            <input
              v-model="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              required
              class="w-full px-4 py-4 rounded-xl border border-gray-300 bg-white text-sm focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition"
            />

            <button
              type="submit"
              :disabled="loading || !isPasswordValid"
              class="w-full bg-gradient-to-r from-[#0b5678] to-[#2aa8d1] text-white py-4 rounded-xl font-semibold hover:-translate-y-0.5 hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {{ loading ? 'Updating...' : 'Reset Password →' }}
            </button>
          </form>
        </div>

        <!-- STEP 4: SUCCESS -->
        <div v-if="currentStep === 4" class="text-center space-y-6">
          <div class="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <div class="space-y-2">
            <h1 class="text-4xl font-serif">All set!</h1>
            <p class="text-sm text-gray-600">Your password has been successfully reset.</p>
          </div>

          <button
            @click="$router.push('/login')"
            class="w-full bg-gradient-to-r from-[#0b5678] to-[#2aa8d1] text-white py-4 rounded-xl font-semibold hover:-translate-y-0.5 hover:shadow-lg transition"
          >
            Back to Login
          </button>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { supabase } from '../../services/supabase'

const currentStep = ref(1)
const loading = ref(false)
const error = ref('')

// Step 1: Email
const email = ref('')

// Step 2: OTP
const otpDigits = ref(['', '', '', '', '', ''])
const timer = ref(120) // 2 minutes
let interval: ReturnType<typeof setInterval> | null = null

const formattedTimer = computed(() => {
  const mins = Math.floor(timer.value / 60)
  const secs = timer.value % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
})

const isOtpComplete = computed(() => otpDigits.value.every(d => d !== ''))

const startTimer = () => {
  if (interval) clearInterval(interval)
  timer.value = 120
  interval = setInterval(() => {
    if (timer.value > 0) timer.value--
    else {
      if (interval) clearInterval(interval)
    }
  }, 1000)
}

const handleOtpInput = (e: Event, index: number) => {
  const target = e.target as HTMLInputElement
  const val = target.value
  // Only allow numbers
  if (val && !/^\d$/.test(val)) {
    otpDigits.value[index] = ''
    return
  }

  if (val && index < 5) {
    const nextInput = document.getElementById(`otp-${index + 1}`)
    nextInput?.focus()
  }
}

const handleOtpDelete = (_e: KeyboardEvent, index: number) => {
  if (!otpDigits.value[index] && index > 0) {
    const prevInput = document.getElementById(`otp-${index - 1}`)
    prevInput?.focus()
  }
}

const handleOtpPaste = (e: ClipboardEvent) => {
  e.preventDefault()
  const pastedData = e.clipboardData?.getData('text').slice(0, 6) || ''
  if (!/^\d+$/.test(pastedData)) return

  const digits = pastedData.split('')
  digits.forEach((d, i) => {
    if (i < 6) otpDigits.value[i] = d
  })

  const lastIndex = Math.min(digits.length, 5)
  document.getElementById(`otp-${lastIndex}`)?.focus()
}

// Step 3: Password
const newPassword = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)

const passwordStrength = computed(() => {
  let score = 0
  const pass = newPassword.value
  if (pass.length >= 8) score++
  if (/[A-Z]/.test(pass)) score++
  if (/[0-9]/.test(pass)) score++
  if (/[^A-Za-z0-9]/.test(pass)) score++
  return score
})

const strengthText = computed(() => {
  const texts = ['', 'Weak', 'Fair', 'Good', 'Strong']
  return texts[passwordStrength.value]
})

const strengthColor = computed(() => {
  const colors = ['', 'text-red-500', 'text-orange-500', 'text-yellow-500', 'text-green-500']
  return colors[passwordStrength.value]
})

const isPasswordValid = computed(() => {
  return newPassword.value.length >= 8 && newPassword.value === confirmPassword.value
})

// Logic
const handleSendOTP = async () => {
  try {
    loading.value = true
    error.value = ''

    // In a real scenario, use resetPasswordForEmail.
    // For this 6-digit OTP demo, we use signInWithOtp which sends a 6-digit code.
    const { error: supaError } = await supabase.auth.signInWithOtp({
      email: email.value,
      options: {
        shouldCreateUser: false // We only want to reset for existing users
      }
    })

    if (supaError) throw supaError

    currentStep.value = 2
    startTimer()
    // Auto focus first box
    setTimeout(() => {
      document.getElementById('otp-0')?.focus()
    }, 100)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to send code'
  } finally {
    loading.value = false
  }
}

const handleVerifyOTP = async () => {
  try {
    loading.value = true
    error.value = ''
    const token = otpDigits.value.join('')

    const { error: supaError } = await supabase.auth.verifyOtp({
      email: email.value,
      token,
      type: 'email' // Using 'email' type as we used signInWithOtp
    })

    if (supaError) throw supaError

    // Once verified, Supabase has signed us in. We move to step 3 to update password.
    currentStep.value = 3
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Invalid or expired code'
  } finally {
    loading.value = false
  }
}

const handleResetPassword = async () => {
  try {
    loading.value = true
    error.value = ''

    const { error: supaError } = await supabase.auth.updateUser({
      password: newPassword.value
    })

    if (supaError) throw supaError

    // Success! Log out and show success screen
    await supabase.auth.signOut()
    currentStep.value = 4
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to update password'
  } finally {
    loading.value = false
  }
}

onUnmounted(() => {
  if (interval) clearInterval(interval)
})
</script>
