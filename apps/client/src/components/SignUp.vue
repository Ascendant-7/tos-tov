<script setup>
import { ref } from 'vue';

const form = ref({
  fullName: '',
  email: '',
  password: '',
});
</script>

<template>
  <div class="min-h-screen flex flex-col md:flex-row font-sans antialiased bg-white">

    <section class="relative w-full md:w-1/2 lg:w-5/12 h-[45vh] md:h-screen">
      <img
        src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80"
        class="absolute inset-0 w-full h-full object-cover"
        alt="Waterfall"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex flex-col justify-end p-12 lg:p-20">
        <p class="text-[10px] tracking-[0.3em] text-white/80 uppercase mb-3 font-semibold">
          Established 2024
        </p>
        <h1 class="text-5xl lg:text-7xl font-bold text-white leading-tight">
          Start Your<br/>Story.
        </h1>
        <div class="w-14 h-1.5 bg-orange-400 mt-6 rounded-full"></div>
      </div>
    </section>

    <section class="flex-1 bg-[#F1F8F5] flex items-center justify-center p-8 lg:p-24 relative overflow-hidden">

      <div class="absolute -top-10 -right-10 opacity-[0.03] pointer-events-none">
        <svg width="300" height="300" viewBox="0 0 100 100" fill="currentColor" class="text-emerald-900">
          <circle cx="50" cy="50" r="40" stroke="currentColor" stroke-width="1" fill="none"/>
          <circle cx="50" cy="50" r="25" stroke="currentColor" stroke-width="6" fill="none"/>
          <circle cx="50" cy="50" r="10" fill="currentColor"/>
        </svg>
      </div>

      <div class="w-full max-w-md z-10">

        <div class="flex items-center gap-3 mb-10">
          <div class="w-6 h-6 bg-[#052116] rotate-45 flex items-center justify-center">
             <div class="w-2 h-2 bg-white -rotate-45"></div>
          </div>
          <span class="font-bold text-[#052116] tracking-tight text-[13px] uppercase">The Elevated Explorer</span>
        </div>

        <h2 class="text-3xl font-extrabold text-[#052116] mb-2">Join AngkorCurator</h2>
        <p class="text-gray-500 text-[15px] mb-10">Curate your own journey through the Kingdom of Wonder.</p>

        <div class="space-y-6">

          <div>
            <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Full Name</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-4 flex items-center text-gray-400 text-sm">👤</span>
              <input v-model="form.fullName" type="text" placeholder="John Doe" class="w-full pl-12 pr-4 py-4 bg-[#E8F2EE] border-none rounded-2xl focus:ring-2 focus:ring-emerald-200 focus:bg-white outline-none transition-all placeholder:text-gray-300" />
            </div>
          </div>

          <div>
            <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-4 flex items-center text-gray-400 text-sm">✉️</span>
              <input v-model="form.email" type="email" placeholder="explorer@khmer.com" class="w-full pl-12 pr-4 py-4 bg-[#E8F2EE] border-none rounded-2xl focus:ring-2 focus:ring-emerald-200 focus:bg-white outline-none transition-all placeholder:text-gray-300" />
            </div>
          </div>

          <div>
            <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Password</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-4 flex items-center text-gray-400 text-sm">🔒</span>
              <input type="password" placeholder="••••••••" class="w-full pl-12 pr-16 py-4 bg-[#E8F2EE] border-none rounded-2xl focus:ring-2 focus:ring-emerald-200 focus:bg-white outline-none transition-all placeholder:text-gray-300" />
              <button class="absolute inset-y-0 right-4 text-[10px] font-bold text-gray-800 uppercase">Show</button>
            </div>

            <div class="flex gap-1.5 mt-4">
              <div class="h-1 flex-1 bg-emerald-400 rounded-full"></div>
              <div class="h-1 flex-1 bg-emerald-400 rounded-full"></div>
              <div class="h-1 flex-1 bg-emerald-400 rounded-full"></div>
              <div class="h-1 flex-1 bg-gray-200 rounded-full"></div>
            </div>
            <p class="text-[10px] text-gray-400 mt-2">Strong: Include symbols and numbers</p>
          </div>

          <div class="flex items-center gap-3">
            <input type="checkbox" class="w-4 h-4 rounded-full border-gray-300 accent-[#052116]">
            <label class="text-xs text-gray-500">I agree to the <span class="font-bold text-gray-800 underline underline-offset-2">Terms of Service</span> and <span class="font-bold text-gray-800 underline underline-offset-2">Privacy Policy</span>.</label>
          </div>

          <button class="w-full py-5 bg-[#052116] text-white font-bold rounded-2xl hover:bg-black transition-colors shadow-lg shadow-emerald-900/10">
            Create Account
          </button>
        </div>

        <div class="relative my-10">
          <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-gray-200"></div></div>
          <div class="relative flex justify-center text-[10px] uppercase font-bold text-gray-400 tracking-widest">
            <span class="bg-[#F1F8F5] px-4">Or sign up with</span>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-4">
          <button class="flex-1 flex items-center justify-center gap-3 py-4 border border-gray-200 rounded-2xl bg-[#F1F8F5] hover:bg-white transition-all text-sm font-bold text-gray-700">
            <img src="https://www.svgrepo.com/show/355037/google.svg" class="w-4 h-4" />
            Google
          </button>
          <button class="flex-1 flex items-center justify-center gap-3 py-4 border border-gray-200 rounded-2xl bg-[#F1F8F5] hover:bg-white transition-all text-sm font-bold text-gray-700">
            <img src="https://www.svgrepo.com/show/448224/facebook.svg" class="w-4 h-4" />
            Facebook
          </button>
        </div>

        <p class="text-center text-sm text-gray-500 mt-10">
          Already have an account? <a href="#" class="text-black font-bold hover:underline">Sign In.</a>
        </p>

      </div>
    </section>
  </div>
</template>
