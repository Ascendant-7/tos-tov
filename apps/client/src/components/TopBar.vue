<template>
  <header class="flex items-center justify-between px-4 sm:px-8 py-3 sm:py-4 bg-cream border-b border-weather-border/60 animate-slide-down sticky top-0 z-20 gap-3">
    <!-- Left: Hamburger + Title -->
    <div class="flex items-center gap-3 shrink-0">
      <!-- Mobile hamburger -->
      <button
        @click="$emit('toggle-sidebar')"
        class="lg:hidden w-9 h-9 rounded-lg bg-white border border-weather-border flex items-center justify-center text-slate-600 cursor-pointer transition-all duration-200 hover:bg-cream-dark"
        aria-label="Toggle menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
      </button>
      <h2 class="text-base sm:text-lg font-semibold text-slate-800 m-0 whitespace-nowrap">{{ pageTitle }}</h2>
    </div>

    <!-- Right Section -->
    <div class="flex items-center gap-2 sm:gap-4">
      <!-- Search Bar (hidden on small screens) -->
      <div class="relative hidden sm:block">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <input
          type="text"
          placeholder="Search destinations..."
          class="w-[180px] md:w-[240px] py-2 pl-9 pr-4 rounded-xl border border-weather-border bg-white text-sm text-slate-600 outline-none transition-all duration-200 focus:border-sidebar-active focus:shadow-[0_0_0_3px_rgba(42,90,66,0.08)] placeholder:text-slate-400"
        />
      </div>

      <!-- Mobile search button (visible on small screens only) -->
      <button class="sm:hidden w-9 h-9 rounded-xl bg-white border border-weather-border flex items-center justify-center text-slate-500 cursor-pointer transition-all duration-200 hover:bg-cream-dark" aria-label="Search">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      </button>

      <!-- Notification Bell -->
      <button class="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white border border-weather-border flex items-center justify-center text-slate-500 cursor-pointer transition-all duration-200 hover:bg-cream-dark hover:text-slate-700 hover:border-slate-300">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
        <span class="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-2 h-2 bg-red-500 rounded-full"></span>
      </button>

      <!-- User Avatar -->
      <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-accent-gold flex items-center justify-center text-white text-xs sm:text-sm font-bold cursor-pointer transition-transform duration-200 hover:scale-105 shadow-[0_2px_8px_rgba(200,169,81,0.3)]">
        YO
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

defineEmits<{ 'toggle-sidebar': [] }>()

const route = useRoute()

const pageTitles: Record<string, string> = {
  home: 'Dashboard',
  explore: 'Explore',
  'trip-planner': 'Trip Planner',
  'route-intel': 'Route Intel',
  social: 'Social Travel',
  community: 'Community',
  profile: 'Profile',
}

const pageTitle = computed(() => {
  const name = route.name as string
  return pageTitles[name] || 'Dashboard'
})
</script>
