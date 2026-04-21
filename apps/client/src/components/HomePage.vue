<template>
  <main class="flex-1 h-screen overflow-y-auto py-8 px-14 bg-slate-50 box-border font-sans">
    <!-- Top Header -->


    <!-- Welcome Section -->
    <section>
      <h1 class="text-[32px] font-bold text-slate-900 mb-2 mt-0">Welcome back, Traveler! 👋</h1>
      <p class="text-[15px] text-slate-500 m-0">Discover the wonders of Cambodia • Tuesday, April 21</p>
    </section>

    <!-- Search Section -->
    <section class="mt-8">
      <div class="relative max-w-[800px] flex items-center">
        <svg class="absolute left-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <input type="text" placeholder="Where do you want to go?" class="w-full py-[18px] px-14 rounded-2xl border border-slate-200 text-[15px] text-slate-700 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.02)] outline-none transition-all duration-200 font-[inherit] focus:border-blue-500 focus:shadow-[0_4px_16px_rgba(59,130,246,0.1)]" />
        <button class="absolute right-4 bg-slate-50 border border-slate-200 rounded-xl w-9 h-9 flex items-center justify-center text-slate-500 cursor-pointer transition-all duration-200 hover:bg-slate-100 hover:text-slate-900" aria-label="Filter">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/></svg>
        </button>
      </div>
    </section>

    <!-- Quick Actions -->
    <section class="flex gap-6 mt-10 max-w-[800px] max-lg:flex-col">
      <div class="flex-1 bg-white rounded-[20px] p-6 flex flex-col items-center justify-center gap-4 border border-slate-200 cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,0,0,0.06)] hover:border-slate-300">
        <div class="w-12 h-12 rounded-2xl flex items-center justify-center bg-blue-50 text-blue-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
        </div>
        <h3 class="text-[15px] font-semibold text-slate-800 m-0">Plan Trip</h3>
      </div>
      <div class="flex-1 bg-white rounded-[20px] p-6 flex flex-col items-center justify-center gap-4 border border-slate-200 cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,0,0,0.06)] hover:border-slate-300">
        <div class="w-12 h-12 rounded-2xl flex items-center justify-center bg-green-50 text-green-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
        </div>
        <h3 class="text-[15px] font-semibold text-slate-800 m-0">Explore</h3>
      </div>
      <div class="flex-1 bg-white rounded-[20px] p-6 flex flex-col items-center justify-center gap-4 border border-slate-200 cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,0,0,0.06)] hover:border-slate-300">
        <div class="w-12 h-12 rounded-2xl flex items-center justify-center bg-purple-50 text-purple-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
        </div>
        <h3 class="text-[15px] font-semibold text-slate-800 m-0">Saved</h3>
      </div>
    </section>

    <!-- AI Trip Suggestions -->
    <section class="mt-12 bg-gradient-to-br from-blue-500 to-violet-500 rounded-3xl py-8 px-10 text-white shadow-[0_12px_32px_rgba(99,102,241,0.2)] relative overflow-hidden">
      <div class="absolute top-0 right-0 w-[300px] h-[300px] bg-[radial-gradient(circle,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0)_70%)] rounded-full translate-x-[30%] -translate-y-[30%]"></div>
      
      <div class="mb-6 relative z-10">
        <h2 class="text-xl font-bold m-0 mb-1.5 flex items-center gap-2">Trip Suggestions</h2>
        <p class="text-sm opacity-90 m-0">Based on your preferences and trending destinations</p>
      </div>
      
      <div class="flex gap-6 relative z-10 max-lg:flex-col">
        <!-- Card 1 -->
        <div class="group flex-1 bg-white/15 backdrop-blur-[12px] rounded-2xl p-6 border border-white/20 transition-all duration-300 cursor-pointer flex flex-col hover:bg-white/20 hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,0,0,0.1)]">
          <div class="text-2xl mb-3">🏖️</div>
          <h4 class="text-base font-semibold m-0 mb-1.5">2-Day Beach Escape</h4>
          <p class="text-[13px] opacity-85 m-0 mb-5 leading-snug">Koh Rong → Koh Ta Kiev</p>
          <div class="flex justify-between text-[13px] font-medium mb-4 mt-auto opacity-95">
            <span>$80-150</span>
            <span>2 days</span>
          </div>
          <a href="#" class="text-[13px] font-semibold no-underline text-white inline-flex items-center gap-1 transition-[gap] duration-200 group-hover:gap-2">Start planning <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>
        </div>
        
        <!-- Card 2 -->
        <div class="group flex-1 bg-white/15 backdrop-blur-[12px] rounded-2xl p-6 border border-white/20 transition-all duration-300 cursor-pointer flex flex-col hover:bg-white/20 hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,0,0,0.1)]">
          <div class="text-2xl mb-3">🏯</div>
          <h4 class="text-base font-semibold m-0 mb-1.5">Temple Explorer Route</h4>
          <p class="text-[13px] opacity-85 m-0 mb-5 leading-snug">Angkor Wat → Bayon → Ta Prohm</p>
          <div class="flex justify-between text-[13px] font-medium mb-4 mt-auto opacity-95">
            <span>$50-100</span>
            <span>3 days</span>
          </div>
          <a href="#" class="text-[13px] font-semibold no-underline text-white inline-flex items-center gap-1 transition-[gap] duration-200 group-hover:gap-2">Start planning <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>
        </div>
        
        <!-- Card 3 -->
        <div class="group flex-1 bg-white/15 backdrop-blur-[12px] rounded-2xl p-6 border border-white/20 transition-all duration-300 cursor-pointer flex flex-col hover:bg-white/20 hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,0,0,0.1)]">
          <div class="text-2xl mb-3">🌿</div>
          <h4 class="text-base font-semibold m-0 mb-1.5">Nature Adventure</h4>
          <p class="text-[13px] opacity-85 m-0 mb-5 leading-snug">Mondulkiri → Ratanakiri → Waterfalls</p>
          <div class="flex justify-between text-[13px] font-medium mb-4 mt-auto opacity-95">
            <span>$120-200</span>
            <span>5 days</span>
          </div>
          <a href="#" class="text-[13px] font-semibold no-underline text-white inline-flex items-center gap-1 transition-[gap] duration-200 group-hover:gap-2">Start planning <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>
        </div>
      </div>
    </section>

    <!-- Trending Now -->
    <section class="mt-12 mb-10">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg font-bold text-slate-900 flex items-center gap-3 m-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg> 
          Trending Now
        </h2>
        <a href="#" class="text-sm font-semibold text-blue-500 no-underline flex items-center gap-1 hover:underline">View all <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>
      </div>

      <!-- Trending Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Card 1 -->
        <div class="group bg-white rounded-2xl border border-slate-200 overflow-hidden cursor-pointer transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,0,0,0.06)] hover:border-slate-300">
          <div class="w-full h-44 bg-slate-100 flex items-center justify-center">
            <svg class="text-slate-300" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
          </div>
          <div class="p-4">
            <div class="flex justify-between items-start mb-1">
              <h4 class="text-[15px] font-semibold text-slate-800 m-0">Angkor Wat</h4>
              <span class="text-[13px] font-medium text-amber-500 flex items-center gap-1">⭐ 4.9</span>
            </div>
            <p class="text-[13px] text-slate-400 m-0 mb-3">Siem Reap, Cambodia</p>
            <div class="flex justify-between items-center">
              <span class="text-[15px] font-bold text-blue-500">$45<span class="text-[12px] font-normal text-slate-400">/person</span></span>
              <span class="text-[12px] text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">Cultural</span>
            </div>
          </div>
        </div>

        <!-- Card 2 -->
        <div class="group bg-white rounded-2xl border border-slate-200 overflow-hidden cursor-pointer transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,0,0,0.06)] hover:border-slate-300">
          <div class="w-full h-44 bg-slate-100 flex items-center justify-center">
            <svg class="text-slate-300" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
          </div>
          <div class="p-4">
            <div class="flex justify-between items-start mb-1">
              <h4 class="text-[15px] font-semibold text-slate-800 m-0">Koh Rong</h4>
              <span class="text-[13px] font-medium text-amber-500 flex items-center gap-1">⭐ 4.7</span>
            </div>
            <p class="text-[13px] text-slate-400 m-0 mb-3">Sihanoukville, Cambodia</p>
            <div class="flex justify-between items-center">
              <span class="text-[15px] font-bold text-blue-500">$80<span class="text-[12px] font-normal text-slate-400">/person</span></span>
              <span class="text-[12px] text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">Beach</span>
            </div>
          </div>
        </div>

        <!-- Card 3 -->
        <div class="group bg-white rounded-2xl border border-slate-200 overflow-hidden cursor-pointer transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,0,0,0.06)] hover:border-slate-300">
          <div class="w-full h-44 bg-slate-100 flex items-center justify-center">
            <svg class="text-slate-300" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
          </div>
          <div class="p-4">
            <div class="flex justify-between items-start mb-1">
              <h4 class="text-[15px] font-semibold text-slate-800 m-0">Royal Palace</h4>
              <span class="text-[13px] font-medium text-amber-500 flex items-center gap-1">⭐ 4.8</span>
            </div>
            <p class="text-[13px] text-slate-400 m-0 mb-3">Phnom Penh, Cambodia</p>
            <div class="flex justify-between items-center">
              <span class="text-[15px] font-bold text-blue-500">$25<span class="text-[12px] font-normal text-slate-400">/person</span></span>
              <span class="text-[12px] text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">Historical</span>
            </div>
          </div>
        </div>

        <!-- Card 4 -->
        <div class="group bg-white rounded-2xl border border-slate-200 overflow-hidden cursor-pointer transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,0,0,0.06)] hover:border-slate-300">
          <div class="w-full h-44 bg-slate-100 flex items-center justify-center">
            <svg class="text-slate-300" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
          </div>
          <div class="p-4">
            <div class="flex justify-between items-start mb-1">
              <h4 class="text-[15px] font-semibold text-slate-800 m-0">Kulen Mountain</h4>
              <span class="text-[13px] font-medium text-amber-500 flex items-center gap-1">⭐ 4.6</span>
            </div>
            <p class="text-[13px] text-slate-400 m-0 mb-3">Siem Reap, Cambodia</p>
            <div class="flex justify-between items-center">
              <span class="text-[15px] font-bold text-blue-500">$60<span class="text-[12px] font-normal text-slate-400">/person</span></span>
              <span class="text-[12px] text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">Nature</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Continue Planning -->
    <section class="mt-12 mb-10">
      <h2 class="text-lg font-bold text-slate-900 flex items-center gap-3 m-0 mb-6">
        <svg class="text-blue-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        Continue Planning
      </h2>

      <!-- Trip Card -->
      <div class="bg-white rounded-2xl border border-slate-200 p-6 flex items-center justify-between transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.06)] hover:border-slate-300 cursor-pointer">
        <div>
          <h4 class="text-[16px] font-semibold text-slate-800 m-0 mb-1.5">Coastal Adventure</h4>
          <p class="text-[14px] text-blue-400 m-0 mb-2">Kampot → Kep → Koh Rong</p>
          <div class="flex items-center gap-2 text-[13px] text-slate-400">
            <span>May 15-18, 2026</span>
            <span>•</span>
            <span>4 days</span>
            <span>•</span>
            <span class="text-green-500 font-semibold bg-green-50 px-2.5 py-0.5 rounded-full text-[12px]">Planning</span>
          </div>
        </div>
        <button class="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 cursor-pointer transition-all duration-200 hover:bg-slate-100 hover:text-slate-700 shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </button>
      </div>
    </section>

    <!-- Featured Destinations -->
    <section class="mt-12 mb-10">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg font-bold text-slate-900 m-0">Featured Destinations</h2>
        <a href="#" class="text-sm font-semibold text-blue-500 no-underline flex items-center gap-1 hover:underline">View all <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Card 1: Angkor Wat -->
        <div class="group bg-white rounded-2xl border border-slate-200 overflow-hidden cursor-pointer transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,0,0,0.06)] hover:border-slate-300">
          <div class="w-full h-48 bg-slate-100 flex items-center justify-center">
            <svg class="text-slate-300" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
          </div>
          <div class="p-5">
            <div class="flex justify-between items-start mb-1">
              <h4 class="text-[16px] font-semibold text-slate-800 m-0">Angkor Wat</h4>
              <span class="text-[13px] font-medium text-amber-500 flex items-center gap-1">⭐ 4.9</span>
            </div>
            <p class="text-[13px] text-slate-400 m-0 mb-3 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              Siem Reap
            </p>
            <div class="flex gap-2">
              <span class="text-[12px] text-slate-500 border border-slate-200 px-2.5 py-1 rounded-full">Temple</span>
              <span class="text-[12px] text-slate-500 border border-slate-200 px-2.5 py-1 rounded-full">UNESCO</span>
            </div>
          </div>
        </div>

        <!-- Card 2: Phnom Penh Capital -->
        <div class="group bg-white rounded-2xl border border-slate-200 overflow-hidden cursor-pointer transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,0,0,0.06)] hover:border-slate-300">
          <div class="w-full h-48 bg-slate-100 flex items-center justify-center">
            <svg class="text-slate-300" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
          </div>
          <div class="p-5">
            <div class="flex justify-between items-start mb-1">
              <h4 class="text-[16px] font-semibold text-slate-800 m-0">Phnom Penh Capital</h4>
              <span class="text-[13px] font-medium text-amber-500 flex items-center gap-1">⭐ 4.5</span>
            </div>
            <p class="text-[13px] text-slate-400 m-0 mb-3 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              Phnom Penh
            </p>
            <div class="flex gap-2">
              <span class="text-[12px] text-slate-500 border border-slate-200 px-2.5 py-1 rounded-full">City</span>
              <span class="text-[12px] text-slate-500 border border-slate-200 px-2.5 py-1 rounded-full">Culture</span>
            </div>
          </div>
        </div>

        <!-- Card 3: Koh Rong Island -->
        <div class="group bg-white rounded-2xl border border-slate-200 overflow-hidden cursor-pointer transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,0,0,0.06)] hover:border-slate-300">
          <div class="w-full h-48 bg-slate-100 flex items-center justify-center">
            <svg class="text-slate-300" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
          </div>
          <div class="p-5">
            <div class="flex justify-between items-start mb-1">
              <h4 class="text-[16px] font-semibold text-slate-800 m-0">Koh Rong Island</h4>
              <span class="text-[13px] font-medium text-amber-500 flex items-center gap-1">⭐ 4.7</span>
            </div>
            <p class="text-[13px] text-slate-400 m-0 mb-3 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              Preah Sihanouk
            </p>
            <div class="flex gap-2">
              <span class="text-[12px] text-slate-500 border border-slate-200 px-2.5 py-1 rounded-full">Beach</span>
              <span class="text-[12px] text-slate-500 border border-slate-200 px-2.5 py-1 rounded-full">Island</span>
            </div>
          </div>
        </div>

        <!-- Card 4: Kampot -->
        <div class="group bg-white rounded-2xl border border-slate-200 overflow-hidden cursor-pointer transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,0,0,0.06)] hover:border-slate-300">
          <div class="w-full h-48 bg-slate-100 flex items-center justify-center">
            <svg class="text-slate-300" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
          </div>
          <div class="p-5">
            <div class="flex justify-between items-start mb-1">
              <h4 class="text-[16px] font-semibold text-slate-800 m-0">Kampot</h4>
              <span class="text-[13px] font-medium text-amber-500 flex items-center gap-1">⭐ 4.7</span>
            </div>
            <p class="text-[13px] text-slate-400 m-0 mb-3 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              Kampot
            </p>
            <div class="flex gap-2">
              <span class="text-[12px] text-slate-500 border border-slate-200 px-2.5 py-1 rounded-full">Nature</span>
              <span class="text-[12px] text-slate-500 border border-slate-200 px-2.5 py-1 rounded-full">Culture</span>
            </div>
          </div>
        </div>

        <!-- Card 5: Battambang -->
        <div class="group bg-white rounded-2xl border border-slate-200 overflow-hidden cursor-pointer transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,0,0,0.06)] hover:border-slate-300">
          <div class="w-full h-48 bg-slate-100 flex items-center justify-center">
            <svg class="text-slate-300" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
          </div>
          <div class="p-5">
            <div class="flex justify-between items-start mb-1">
              <h4 class="text-[16px] font-semibold text-slate-800 m-0">Battambang</h4>
              <span class="text-[13px] font-medium text-amber-500 flex items-center gap-1">⭐ 4.5</span>
            </div>
            <p class="text-[13px] text-slate-400 m-0 mb-3 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              Battambang
            </p>
            <div class="flex gap-2">
              <span class="text-[12px] text-slate-500 border border-slate-200 px-2.5 py-1 rounded-full">Culture</span>
              <span class="text-[12px] text-slate-500 border border-slate-200 px-2.5 py-1 rounded-full">Historical</span>
            </div>
          </div>
        </div>

        <!-- Card 6: Koh Kong -->
        <div class="group bg-white rounded-2xl border border-slate-200 overflow-hidden cursor-pointer transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,0,0,0.06)] hover:border-slate-300">
          <div class="w-full h-48 bg-slate-100 flex items-center justify-center">
            <svg class="text-slate-300" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
          </div>
          <div class="p-5">
            <div class="flex justify-between items-start mb-1">
              <h4 class="text-[16px] font-semibold text-slate-800 m-0">Koh Kong</h4>
              <span class="text-[13px] font-medium text-amber-500 flex items-center gap-1">⭐ 4.6</span>
            </div>
            <p class="text-[13px] text-slate-400 m-0 mb-3 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              Koh Kong
            </p>
            <div class="flex gap-2">
              <span class="text-[12px] text-slate-500 border border-slate-200 px-2.5 py-1 rounded-full">Nature</span>
              <span class="text-[12px] text-slate-500 border border-slate-200 px-2.5 py-1 rounded-full">Adventure</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
// Homepage component for travel planning application
</script>
