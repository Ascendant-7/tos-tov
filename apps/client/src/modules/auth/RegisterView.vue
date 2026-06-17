<template>
  <div
    class="min-h-screen grid place-items-center px-5 py-8 bg-[linear-gradient(120deg,rgba(249,240,223,0.9),rgba(233,230,226,0.7)),url('/images/angkor.jpg')] bg-cover bg-center font-sans text-[#1c1b1a] relative overflow-hidden"
  >
    <!-- Glow -->
    <div
      class="absolute inset-[-20%_0_0_0] blur-lg opacity-80 pointer-events-none bg-[radial-gradient(circle_at_15%_15%,rgba(255,168,110,0.35),transparent_55%), radial-gradient(circle_at_80%_10%,rgba(110,208,255,0.3),transparent_50%), radial-gradient(circle_at_60%_80%,rgba(29,106,150,0.22),transparent_60%)]"
    ></div>

    <div
      class="w-full max-w-[1100px] grid md:grid-cols-[1.1fr_0.9fr] rounded-[28px] overflow-hidden shadow-[0_30px_80px_rgba(38,37,35,0.25)] bg-white/95 backdrop-blur transition-all duration-700"
    >
      <!-- LEFT PANEL -->
      <aside
        class="hidden md:flex relative flex-col justify-between p-12 text-[#f7f2ea] bg-[linear-gradient(160deg,rgba(7,38,72,0.98),rgba(14,110,158,0.92))]"
      >
        <div class="space-y-3">
          <h1 class="text-[34px] font-serif leading-tight">Tos Tuv Cambodia</h1>
          <p class="text-sm opacity-80 max-w-xs leading-relaxed">
            Start a new journey with curated routes and trusted guides.
          </p>
        </div>

        <div class="space-y-3">
          <span
            class="text-[11px] tracking-[1.8px] uppercase px-4 py-1 rounded-full bg-white/20 inline-block"
          >
            New horizons
          </span>
          <h2 class="text-3xl font-serif leading-tight">Meet the world halfway.</h2>
          <p class="opacity-85 max-w-xs leading-relaxed">
            Build itineraries, collect memories, and keep every plan in one place.
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
      <main class="p-10 md:p-14 flex flex-col gap-6 bg-white/95 min-h-[600px] justify-center">
        <!-- STEP 1: ACCOUNT DETAILS -->
        <div v-if="currentStep === 1" class="space-y-6">
          <div class="space-y-2">
            <span class="uppercase text-xs tracking-[2px] text-[#0b6f91] font-semibold">
              Create account
            </span>
            <h1 class="text-4xl font-serif">Register</h1>
            <p class="text-sm text-gray-600">Use your email to start planning your next adventure.</p>
          </div>

          <div v-if="errorMessage" class="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100">
            {{ errorMessage }}
          </div>

          <form @submit.prevent="handleSendOTP" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <input
                v-model="form.firstName"
                type="text"
                placeholder="First Name"
                required
                class="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-sm focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition"
              />
              <input
                v-model="form.lastName"
                type="text"
                placeholder="Last Name"
                required
                class="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-sm focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition"
              />
            </div>

            <div class="space-y-1">
              <input
                v-model="form.email"
                type="email"
                placeholder="Email Address"
                required
                class="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-sm focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition"
                :class="{ 'border-red-300 focus:ring-red-100': form.email && !isEmailValid }"
              />
              <p v-if="form.email && !isEmailValid" class="text-[10px] text-red-500 font-bold uppercase tracking-wider">
                Invalid email format
              </p>
            </div>

            <div class="space-y-3">
              <div class="relative">
                <input
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Password"
                  required
                  class="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-sm focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold uppercase"
                >
                  {{ showPassword ? 'Hide' : 'Show' }}
                </button>
              </div>

              <!-- Password Strength -->
              <div v-if="form.password" class="space-y-1.5">
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
                <div class="flex justify-between items-center">
                  <p class="text-[10px] uppercase tracking-wider font-bold" :class="strengthColor">
                    {{ strengthText }}
                  </p>
                  <p class="text-[9px] text-gray-400 uppercase tracking-tighter">
                    Min 8 chars, Upper, Digit, Special
                  </p>
                </div>
              </div>

              <input
                v-model="form.confirmPassword"
                type="password"
                placeholder="Confirm Password"
                required
                class="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-sm focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition"
                :class="{ 'border-red-300 focus:ring-red-100': form.confirmPassword && form.password !== form.confirmPassword }"
              />
            </div>

            <label class="flex items-center gap-3 cursor-pointer group">
              <div class="relative flex items-center">
                <input 
                  type="checkbox" 
                  v-model="form.accept" 
                  required 
                  class="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-300 transition-all checked:border-[#0b6f91] checked:bg-[#0b6f91]"
                />
                <span class="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </span>
              </div>
              <span class="text-xs text-gray-600">I agree to the <a href="#" class="text-[#0b6f91] font-bold hover:underline">Terms & Conditions</a></span>
            </label>

            <button
              type="submit"
              :disabled="loading || !isStep1Valid"
              class="w-full bg-gradient-to-r from-[#0b5678] to-[#2aa8d1] text-white py-4 rounded-xl font-semibold hover:-translate-y-0.5 hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {{ loading ? 'Sending...' : 'Create account →' }}
            </button>
          </form>

          <p class="text-sm text-center text-gray-600">
            Already have an account?
            <router-link to="/login" class="text-[#1476a5] font-semibold hover:underline">
              Log in
            </router-link>
          </p>
        </div>

        <!-- STEP 2: OTP VERIFICATION -->
        <div v-if="currentStep === 2" class="space-y-6">
          <div class="space-y-2">
            <span class="uppercase text-xs tracking-[2px] text-[#0b6f91] font-semibold">
              Verification
            </span>
            <h1 class="text-4xl font-serif">Verify OTP</h1>
            <p class="text-sm text-gray-600">
              We've sent a 6-digit code to <span class="font-semibold text-gray-800">{{ form.email }}</span>
            </p>
          </div>

          <div v-if="errorMessage" class="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100">
            {{ errorMessage }}
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
            <div class="bg-blue-50 p-4 rounded-xl border border-blue-100 space-y-1">
              <p class="text-xs text-blue-800 font-medium">
                Tip: If you don't see the code, please check your <span class="font-bold">Spam folder</span>.
              </p>
            </div>

            <p class="text-sm text-gray-500">
              Code expires in: <span class="font-mono font-bold text-[#0b6f91]">{{ formattedTimer }}</span>
            </p>

            <button
              @click="handleVerifyOTP"
              :disabled="loading || !isOtpComplete"
              class="w-full bg-gradient-to-r from-[#0b5678] to-[#2aa8d1] text-white py-4 rounded-xl font-semibold hover:-translate-y-0.5 hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {{ loading ? 'Verifying...' : 'Verify & Complete →' }}
            </button>

            <button
              @click="handleSendOTP"
              :disabled="resendTimer > 0 || loading"
              class="text-sm font-semibold text-[#1476a5] hover:underline disabled:opacity-50 disabled:no-underline"
            >
              {{ resendTimer > 0 ? `Resend available in ${resendTimer}s` : 'Resend Code' }}
            </button>
          </div>
        </div>

        <!-- STEP 3: SUCCESS -->
        <div v-if="currentStep === 3" class="text-center space-y-6">
          <div class="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <div class="space-y-2">
            <h1 class="text-4xl font-serif">Welcome!</h1>
            <p class="text-sm text-gray-600">Your account has been verified. Let's start your journey.</p>
          </div>

          <button
            @click="router.push('/login')"
            class="w-full bg-gradient-to-r from-[#0b5678] to-[#2aa8d1] text-white py-4 rounded-xl font-semibold hover:-translate-y-0.5 hover:shadow-lg transition"
          >
            Go to Login →
          </button>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const currentStep = ref(1)
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const showPassword = ref(false)

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  accept: false,
})

// Validation
const isEmailValid = computed(() => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
})

const passwordStrength = computed(() => {
  let score = 0
  const pass = form.password
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

const isStep1Valid = computed(() => {
  return (
    form.firstName &&
    form.lastName &&
    isEmailValid.value &&
    passwordStrength.value >= 3 && // Good or Strong
    form.password === form.confirmPassword &&
    form.accept
  )
})

// OTP State
const otpDigits = ref(['', '', '', '', '', ''])
const expiryTimer = ref(600) // 10 minutes
const resendTimer = ref(0)
let expiryInterval: ReturnType<typeof setInterval> | null = null
let resendInterval: ReturnType<typeof setInterval> | null = null

const formattedTimer = computed(() => {
  const mins = Math.floor(expiryTimer.value / 60)
  const secs = expiryTimer.value % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
})

const isOtpComplete = computed(() => otpDigits.value.every(d => d !== ''))

const startTimers = () => {
  // Expiry Timer (10 mins)
  if (expiryInterval) clearInterval(expiryInterval)
  expiryTimer.value = 120
  expiryInterval = setInterval(() => {
    if (expiryTimer.value > 0) expiryTimer.value--
    else if (expiryInterval) clearInterval(expiryInterval)
  }, 1000)

  // Resend Timer (60s)
  if (resendInterval) clearInterval(resendInterval)
  resendTimer.value = 60
  resendInterval = setInterval(() => {
    if (resendTimer.value > 0) resendTimer.value--
    else if (resendInterval) clearInterval(resendInterval)
  }, 1000)
}

const handleOtpInput = (e: Event, index: number) => {
  const target = e.target as HTMLInputElement
  const val = target.value
  if (val && !/^\d$/.test(val)) {
    otpDigits.value[index] = ''
    return
  }
  if (val && index < 5) {
    document.getElementById(`otp-${index + 1}`)?.focus()
  }
}

const handleOtpDelete = (_e: KeyboardEvent, index: number) => {
  if (!otpDigits.value[index] && index > 0) {
    document.getElementById(`otp-${index - 1}`)?.focus()
  }
}

const handleOtpPaste = (e: ClipboardEvent) => {
  e.preventDefault()
  const pastedData = e.clipboardData?.getData('text').slice(0, 6) || ''
  if (!/^\d+$/.test(pastedData)) return

  pastedData.split('').forEach((d, i) => {
    if (i < 6) otpDigits.value[i] = d
  })
  document.getElementById(`otp-${Math.min(pastedData.length, 5)}`)?.focus()
}

// Actions
const handleSendOTP = async () => {
  try {
    errorMessage.value = ''
    loading.value = true

    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: form.email,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
      }),
    })

    const result = await response.json()
    if (!response.ok) {
      throw new Error(result.message || 'Registration failed')
    }

    currentStep.value = 2
    startTimers()
    setTimeout(() => document.getElementById('otp-0')?.focus(), 100)
  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : 'Something went wrong'
  } finally {
    loading.value = false
  }
}

const handleVerifyOTP = async () => {
  try {
    errorMessage.value = ''
    loading.value = true
    const token = otpDigits.value.join('')

    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: form.email,
        token,
        type: 'signup'
      }),
    })

    const result = await response.json()
    if (!response.ok) {
      throw new Error(result.message || 'Verification failed')
    }

    currentStep.value = 3
  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : 'Invalid or expired code'
  } finally {
    loading.value = false
  }
}

onUnmounted(() => {
  if (expiryInterval) clearInterval(expiryInterval)
  if (resendInterval) clearInterval(resendInterval)
})
</script>
