<template>
  <aside class="w-[260px] h-screen flex flex-col bg-white border-r border-slate-100 py-6 px-4 box-border font-sans">
    <!-- Logo Section -->
    <div class="flex items-center gap-3 mb-10 px-2">
      <div class="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-xl flex items-center justify-center text-white shadow-[0_4px_12px_rgba(99,102,241,0.25)]">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
          <line x1="9" x2="9" y1="3" y2="18"></line>
          <line x1="15" x2="15" y1="6" y2="21"></line>
        </svg>
      </div>
      <div>
        <h1 class="text-lg font-bold text-slate-900 leading-tight m-0">TosDerLg</h1>
        <p class="text-xs text-slate-500 mt-0.5 m-0">Smart Travel Planning</p>
      </div>
    </div>

    <!-- Navigation Menu -->
    <nav class="flex flex-col gap-2 flex-1">
      <router-link to="/" class="group flex items-center gap-4 py-3 px-4 rounded-xl no-underline text-slate-700 font-semibold text-[15px] transition-all duration-200 relative overflow-hidden hover:bg-slate-50 hover:text-slate-900 hover:translate-x-1" exact-active-class="!bg-gradient-to-br !from-blue-500 !to-blue-600 !text-white !shadow-[0_4px_12px_rgba(59,130,246,0.25)]">
        <svg class="w-5 h-5 text-slate-500 transition-colors duration-200 group-hover:text-blue-500 group-[.router-link-exact-active]:text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        <span>Home</span>
      </router-link>

      <router-link to="/explore" class="group flex items-center gap-4 py-3 px-4 rounded-xl no-underline text-slate-700 font-semibold text-[15px] transition-all duration-200 relative overflow-hidden hover:bg-slate-50 hover:text-slate-900 hover:translate-x-1" active-class="!bg-gradient-to-br !from-blue-500 !to-blue-600 !text-white !shadow-[0_4px_12px_rgba(59,130,246,0.25)]">
        <svg class="w-5 h-5 text-slate-500 transition-colors duration-200 group-hover:text-blue-500 group-[.router-link-active]:text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
        </svg>
        <span>Explore</span>
      </router-link>

      <router-link to="/trip-planner" class="group flex items-center gap-4 py-3 px-4 rounded-xl no-underline text-slate-700 font-semibold text-[15px] transition-all duration-200 relative overflow-hidden hover:bg-slate-50 hover:text-slate-900 hover:translate-x-1" active-class="!bg-gradient-to-br !from-blue-500 !to-blue-600 !text-white !shadow-[0_4px_12px_rgba(59,130,246,0.25)]">
        <svg class="w-5 h-5 text-slate-500 transition-colors duration-200 group-hover:text-blue-500 group-[.router-link-active]:text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
          <line x1="16" x2="16" y1="2" y2="6"/>
          <line x1="8" x2="8" y1="2" y2="6"/>
          <line x1="3" x2="21" y1="10" y2="10"/>
        </svg>
        <span>Trip Planner</span>
      </router-link>

      <router-link to="/routes" class="group flex items-center gap-4 py-3 px-4 rounded-xl no-underline text-slate-700 font-semibold text-[15px] transition-all duration-200 relative overflow-hidden hover:bg-slate-50 hover:text-slate-900 hover:translate-x-1" active-class="!bg-gradient-to-br !from-blue-500 !to-blue-600 !text-white !shadow-[0_4px_12px_rgba(59,130,246,0.25)]">
        <svg class="w-5 h-5 text-slate-500 transition-colors duration-200 group-hover:text-blue-500 group-[.router-link-active]:text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="3 11 22 2 13 21 11 13 3 11"/>
        </svg>
        <span>Routes</span>
      </router-link>

      <router-link to="/social" class="group flex items-center gap-4 py-3 px-4 rounded-xl no-underline text-slate-700 font-semibold text-[15px] transition-all duration-200 relative overflow-hidden hover:bg-slate-50 hover:text-slate-900 hover:translate-x-1" active-class="!bg-gradient-to-br !from-blue-500 !to-blue-600 !text-white !shadow-[0_4px_12px_rgba(59,130,246,0.25)]">
        <svg class="w-5 h-5 text-slate-500 transition-colors duration-200 group-hover:text-blue-500 group-[.router-link-active]:text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
        <span>Social Travel</span>
      </router-link>

      <router-link to="/community" class="group flex items-center gap-4 py-3 px-4 rounded-xl no-underline text-slate-700 font-semibold text-[15px] transition-all duration-200 relative overflow-hidden hover:bg-slate-50 hover:text-slate-900 hover:translate-x-1" active-class="!bg-gradient-to-br !from-blue-500 !to-blue-600 !text-white !shadow-[0_4px_12px_rgba(59,130,246,0.25)]">
        <svg class="w-5 h-5 text-slate-500 transition-colors duration-200 group-hover:text-blue-500 group-[.router-link-active]:text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        <span>Community</span>
      </router-link>

      <router-link to="/profile" class="group flex items-center gap-4 py-3 px-4 rounded-xl no-underline text-slate-700 font-semibold text-[15px] transition-all duration-200 relative overflow-hidden hover:bg-slate-50 hover:text-slate-900 hover:translate-x-1" active-class="!bg-gradient-to-br !from-blue-500 !to-blue-600 !text-white !shadow-[0_4px_12px_rgba(59,130,246,0.25)]">
        <svg class="w-5 h-5 text-slate-500 transition-colors duration-200 group-hover:text-blue-500 group-[.router-link-active]:text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        <span>Profile</span>
      </router-link>
    </nav>


  </aside>
</template>

<script setup lang="ts">
// Vue 3 Navigation Component using Vue Router
</script>
