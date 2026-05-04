<template>
  <div
    class="min-h-screen grid place-items-center px-5 py-8
    bg-[linear-gradient(120deg,rgba(249,240,223,0.9),rgba(233,230,226,0.7)),url('/images/angkor.jpg')]
    bg-cover bg-center font-sans text-[#1c1b1a] relative overflow-hidden"
  >
    <!-- Glow -->
    <div class="absolute inset-[-20%_0_0_0] blur-lg opacity-80 pointer-events-none
      bg-[radial-gradient(circle_at_15%_15%,rgba(255,168,110,0.35),transparent_55%),
      radial-gradient(circle_at_80%_10%,rgba(110,208,255,0.3),transparent_50%),
      radial-gradient(circle_at_60%_80%,rgba(29,106,150,0.22),transparent_60%)]">
    </div>

    <div
      class="w-full max-w-[1100px] grid md:grid-cols-[1.1fr_0.9fr] rounded-[28px] overflow-hidden
      shadow-[0_30px_80px_rgba(38,37,35,0.25)] bg-white/95 backdrop-blur"
    >
      <!-- LEFT PANEL -->
      <aside
        class="hidden md:flex relative flex-col justify-between p-12 text-[#f7f2ea]
        bg-[linear-gradient(160deg,rgba(7,38,72,0.98),rgba(14,110,158,0.92))]"
      >
        <div>
          <h1 class="text-3xl font-serif mb-2">Tos Tuv Cambodia</h1>
          <p class="text-sm opacity-80 max-w-xs">
            Start a new journey with curated routes and trusted guides.
          </p>
        </div>

        <div>
          <span class="text-[11px] tracking-widest uppercase px-4 py-1 rounded-full bg-white/20 inline-block mb-3">
            New horizons
          </span>
          <h2 class="text-3xl font-serif mb-3">
            Meet the world halfway.
          </h2>
          <p class="opacity-85 max-w-xs leading-relaxed">
            Build itineraries, collect memories, and keep every plan in one place.
          </p>
        </div>

        <!-- Decorations -->
        <div class="absolute -right-32 -bottom-32 w-80 h-80 rounded-full
          bg-gradient-to-br from-orange-300 to-orange-500 opacity-70"></div>

        <div class="absolute left-[-80px] top-1/2 w-60 h-60 rounded-full
          border border-white/30"></div>
      </aside>

      <!-- FORM -->
      <main class="p-10 md:p-14 flex flex-col gap-6 bg-white/95">
        <div>
          <span class="uppercase text-xs tracking-widest text-[#0b6f91] font-semibold">
            Create account
          </span>
          <h1 class="text-4xl font-serif my-2">Register</h1>
          <p class="text-sm text-gray-600">
            Use your email to start planning your next adventure.
          </p>
        </div>

        <form class="flex flex-col gap-5" @submit.prevent="handleSubmit">
          <!-- Name -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input
              v-model="form.firstName"
              type="text"
              placeholder="First name"
              required
              class="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-sm
              focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition"
            />
            <input
              v-model="form.lastName"
              type="text"
              placeholder="Last name"
              required
              class="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-sm
              focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition"
            />
          </div>

          <input
            v-model="form.email"
            type="email"
            placeholder="Email"
            required
            class="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-sm
            focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition"
          />

          <input
            v-model="form.password"
            type="password"
            placeholder="Password"
            required
            class="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-sm
            focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition"
          />

          <input
            v-model="form.confirmPassword"
            type="password"
            placeholder="Confirm password"
            required
            class="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-sm
            focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition"
          />

          <!-- Checkbox -->
          <label class="flex items-center gap-2 text-sm">
            <input type="checkbox" v-model="form.accept" required />
            I agree to the terms and privacy policy
          </label>

          <!-- Button -->
          <button
            type="submit"
            class="bg-gradient-to-r from-[#0b5678] to-[#2aa8d1] text-white py-4 rounded-xl font-semibold
            hover:-translate-y-0.5 transition flex items-center justify-center gap-2"
          >
            Create account →
          </button>

          <!-- Divider -->
          <div class="relative text-center text-sm text-gray-400 my-2">
            <span class="bg-white px-2 relative z-10">or sign up with</span>
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200"></div>
            </div>
          </div>

          <!-- Social -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button class="py-3 rounded-xl border bg-white font-semibold text-sm hover:bg-gray-50 transition">
              Google
            </button>
            <button class="py-3 rounded-xl border bg-white font-semibold text-sm hover:bg-gray-50 transition">
              Facebook
            </button>
            <button class="py-3 rounded-xl border bg-white font-semibold text-sm hover:bg-gray-50 transition">
              Apple
            </button>
          </div>
        </form>

        <p class="text-sm text-center">
          Already have an account?
          <router-link to="/login" class="text-blue-600 font-medium">
            Log in
          </router-link>
        </p>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";

const form = reactive({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  accept: false,
});

const handleSubmit = () => {
  console.log("Register:", form);
};
</script>
