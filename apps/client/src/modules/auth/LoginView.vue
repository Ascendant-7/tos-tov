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
      <!-- LEFT PANEL -->
      <aside
        class="hidden md:flex relative flex-col justify-between p-12 text-[#f7f2ea] bg-[linear-gradient(160deg,rgba(7,38,72,0.98),rgba(14,110,158,0.92))]"
      >
        <div class="space-y-3">
          <h1 class="text-[34px] font-serif leading-tight">Tos Tuv Cambodia</h1>

          <p class="text-sm opacity-80 max-w-xs leading-relaxed">
            Travel is the only purchase that enriches you beyond material wealth.
          </p>
        </div>

        <div class="space-y-3">
          <span
            class="text-[11px] tracking-[1.8px] uppercase px-4 py-1 rounded-full bg-white/20 inline-block"
          >
            Curated journeys
          </span>

          <h2 class="text-3xl font-serif leading-tight">Chase the golden hour.</h2>

          <p class="opacity-85 max-w-xs leading-relaxed">
            Curated routes, local gems, and a planner that keeps every sunrise within reach.
          </p>
        </div>

        <!-- Decorations -->
        <div
          class="absolute -right-32 -bottom-32 w-80 h-80 rounded-full bg-gradient-to-br from-orange-300 to-orange-500 opacity-70 blur-sm"
        ></div>

        <div
          class="absolute left-[-80px] top-1/2 w-60 h-60 rounded-full border border-white/30 rotate-[-10deg]"
        ></div>

        <div
          class="absolute right-16 top-28 w-16 h-16 rounded-full bg-white/70 blur-md opacity-60"
        ></div>

        <div
          class="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-[#032032]/80 to-transparent"
        ></div>
      </aside>

      <!-- FORM -->
      <main class="p-10 md:p-14 flex flex-col gap-6 bg-white/95">
        <div class="space-y-2">
          <span class="uppercase text-xs tracking-[2px] text-[#0b6f91] font-semibold">
            Welcome back
          </span>

          <h1 class="text-4xl font-serif">Log in</h1>

          <p class="text-sm text-gray-600">Use your email to continue your journey.</p>
        </div>

        <!-- Error -->
        <div
          v-if="errorMessage"
          class="bg-red-100 text-red-700 border border-red-300 rounded-xl px-4 py-3 text-sm"
        >
          {{ errorMessage }}
        </div>

        <!-- Success -->
        <div
          v-if="successMessage"
          class="bg-green-100 text-green-700 border border-green-300 rounded-xl px-4 py-3 text-sm"
        >
          {{ successMessage }}
        </div>

        <form class="flex flex-col gap-5" @submit.prevent="handleSubmit">
          <!-- Email -->
          <input
            v-model="form.email"
            type="email"
            placeholder="Email"
            required
            class="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-sm focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition"
          />

          <!-- Password -->
          <input
            v-model="form.password"
            type="password"
            placeholder="Password"
            required
            class="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-sm focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition"
          />

          <!-- Row -->
          <div
            class="flex flex-col md:flex-row md:items-center md:justify-between text-sm text-gray-600 gap-2"
          >
            <label class="flex items-center gap-2">
              <input type="checkbox" v-model="form.remember" />
              Remember me
            </label>

            <router-link to="/forgot-password" class="text-[#1476a5] font-semibold hover:underline">
              Forgot password?
            </router-link>
          </div>

          <!-- Button -->
          <button
            type="submit"
            :disabled="loading"
            class="bg-gradient-to-r from-[#0b5678] to-[#2aa8d1] text-white py-4 rounded-xl font-semibold hover:-translate-y-0.5 hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Logging in...' : 'Login →' }}
          </button>

        </form>

        <p class="text-sm text-center text-gray-600">
          New here?

          <router-link to="/signup" class="text-[#1476a5] font-semibold hover:underline">
            Create an account
          </router-link>
        </p>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../../services/supabase'

const router = useRouter()

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const form = reactive({
  email: '',
  password: '',
  remember: true,
})

const handleSubmit = async () => {
  try {
    loading.value = true
    errorMessage.value = ''
    successMessage.value = ''

    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    })

    if (error) {
      errorMessage.value = error.message
      return
    }

    // Supabase automatically stores session (NO localStorage needed)
    console.log('LOGIN SUCCESS:', data)

    successMessage.value = 'Login successful!'

    setTimeout(() => {
      router.push('/home')
    }, 1000)
  } catch (err) {
    console.error(err)
    errorMessage.value = 'Something went wrong'
  } finally {
    loading.value = false
  }
}
</script>
