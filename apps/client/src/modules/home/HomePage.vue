<template>
  <main class="flex-1 h-screen overflow-y-auto bg-cream box-border font-sans custom-scrollbar">
    <div class="py-5 px-4 sm:py-6 sm:px-6 md:py-8 md:px-8 max-w-[1100px] mx-auto">

      <!-- Hero Banner -->
      <section class="relative rounded-2xl sm:rounded-[20px] overflow-hidden h-[200px] sm:h-[240px] md:h-[280px] animate-fade-in-up">
        <div class="absolute inset-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=1200&q=80"
            alt="Angkor Wat Temple"
            class="w-full h-full object-cover"
            style="animation: kenBurns 20s ease-in-out infinite alternate;"
          />
        </div>
        <div class="absolute inset-0 bg-gradient-to-r from-black/65 via-black/40 to-transparent"></div>
        <div class="relative z-10 flex flex-col justify-end h-full p-5 pb-6 sm:p-6 sm:pb-8 md:p-8 md:pb-10">
          <span class="text-[10px] sm:text-[11px] font-semibold tracking-[2px] text-accent-gold-light uppercase mb-1.5 sm:mb-2">Discover Cambodia</span>
          <h1 class="text-[20px] sm:text-[24px] md:text-[28px] font-bold text-white m-0 mb-3 sm:mb-4 leading-tight max-w-[420px]">Where will your next<br/>adventure take you?</h1>
          <div class="relative max-w-[320px] sm:max-w-[380px]">
            <svg class="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-white/50" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input v-model="searchQuery" type="text" placeholder="Search destinations, places, experiences..." class="w-full py-2.5 sm:py-3 pl-9 sm:pl-10 pr-4 rounded-xl bg-white/20 backdrop-blur-md border border-white/25 text-xs sm:text-sm text-white placeholder:text-white/60 outline-none transition-all duration-200 focus:bg-white/30 focus:border-white/40" />
          </div>
        </div>
      </section>

      <!-- AI Suggestion Card -->
      <section class="mt-4 sm:mt-6 animate-fade-in-up delay-2">
        <div class="bg-ai-teal rounded-2xl p-4 sm:p-5 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-white transition-all duration-300 cursor-pointer hover:-translate-y-0.5" style="animation: shimmerGlow 3s ease-in-out infinite;">
          <div class="flex items-start sm:items-center gap-3 sm:gap-4">
            <div class="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/></svg>
            </div>
            <div>
              <p class="text-[10px] sm:text-[11px] font-semibold tracking-[1.5px] uppercase text-white/70 m-0 mb-1">Trip Suggestion</p>
              <h3 class="text-[14px] sm:text-[15px] font-bold m-0 mb-1">Perfect 2-day trip to Koh Kong</h3>
              <p class="text-[12px] sm:text-[13px] text-white/75 m-0 leading-snug">Based on the dry season (Dec-Apr), Tatai waterfall hike + mangrove kayaking + overnight ecolodge. Est. budget: $85/person.</p>
            </div>
          </div>
          <button class="bg-white text-ai-teal-dark px-5 py-2 rounded-xl text-[13px] font-semibold border-none cursor-pointer transition-all duration-200 hover:bg-white/90 hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] shrink-0 w-full sm:w-auto text-center">Plan it</button>
        </div>
      </section>

      <!-- Weather Section -->
      <section class="mt-6 sm:mt-8 animate-fade-in-up delay-4">
        <h2 class="text-[14px] sm:text-[15px] font-bold text-slate-800 m-0 mb-3 sm:mb-4 flex items-center gap-2">
          <span class="text-lg"></span> Weather in Cambodia
        </h2>
        <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div v-for="(w, i) in weatherData" :key="w.city" class="bg-white rounded-xl border border-weather-border p-3 sm:p-4 flex items-center gap-2.5 sm:gap-3 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] animate-fade-in-up" :style="{ animationDelay: `${0.25 + i * 0.08}s` }">
            <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-base sm:text-xl shrink-0" :class="w.bgClass">{{ w.icon }}</div>
            <div class="min-w-0">
              <p class="text-[11px] sm:text-[12px] text-slate-400 m-0 mb-0.5 font-medium truncate">{{ w.city }}</p>
              <p class="text-[16px] sm:text-[18px] font-bold text-slate-800 m-0">{{ w.temp }}°C</p>
              <p class="text-[10px] sm:text-[11px] text-slate-400 m-0 truncate">{{ w.condition }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Trending Destinations -->
      <section class="mt-8 sm:mt-10 mb-8 sm:mb-10 animate-fade-in-up delay-6">
        <div class="flex justify-between items-center mb-4 sm:mb-5">
          <h2 class="text-[14px] sm:text-[15px] font-bold text-slate-800 m-0 flex items-center gap-2">
            <span class="text-base"></span> Trending Destinations
          </h2>
          <RouterLink to="/explore?filter=trending" class="text-[12px] sm:text-[13px] font-semibold text-sidebar-active no-underline flex items-center gap-1 hover:underline transition-colors duration-200">
            View all
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </RouterLink>
        </div>

        <!-- Filter Tabs -->
        <div class="flex gap-1.5 sm:gap-2 mb-5 sm:mb-6 flex-wrap">
          <button v-for="tab in tabs" :key="tab" @click="activeTab = tab" :class="['px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[12px] sm:text-[13px] font-medium border cursor-pointer transition-all duration-200', activeTab === tab ? 'bg-sidebar-active text-white border-sidebar-active shadow-[0_2px_8px_rgba(42,90,66,0.2)]' : 'bg-white text-slate-500 border-weather-border hover:border-slate-300 hover:text-slate-700']">
            {{ tab }}
          </button>
        </div>

        <!-- Destination Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          <TransitionGroup name="card-filter">
          <div v-for="(dest, i) in filteredDestinations" :key="dest.name" class="group bg-white rounded-2xl border border-weather-border overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:border-slate-300 animate-scale-in" :style="{ animationDelay: `${0.35 + i * 0.06}s` }">
            <div class="w-full h-32 sm:h-36 lg:h-40 bg-cream-dark flex items-center justify-center overflow-hidden">
              <img v-if="dest.image" :src="dest.image" :alt="dest.name" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <svg v-else class="text-slate-300" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
            </div>
            <div class="p-3 sm:p-4">
              <div class="flex justify-between items-start mb-1">
                <h4 class="text-[13px] sm:text-[14px] font-semibold text-slate-800 m-0">{{ dest.name }}</h4>
                <span class="text-[11px] sm:text-[12px] font-medium text-amber-500 flex items-center gap-0.5">⭐ {{ dest.rating }}</span>
              </div>
              <p class="text-[11px] sm:text-[12px] text-slate-400 m-0 mb-2 sm:mb-2.5 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                {{ dest.location }}
              </p>
              <div class="flex gap-1.5">
                <span v-for="tag in dest.tags" :key="tag" class="text-[10px] sm:text-[11px] text-slate-500 border border-weather-border px-2 py-0.5 rounded-full">{{ tag }}</span>
              </div>
            </div>
          </div>
          </TransitionGroup>
        </div>
        <!-- Empty state for destinations -->
        <div v-if="filteredDestinations.length === 0" class="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
          <div class="w-16 h-16 rounded-2xl bg-cream-dark flex items-center justify-center text-3xl mb-4">🔍</div>
          <p class="text-[14px] font-semibold text-slate-600 m-0 mb-1">No destinations found</p>
          <p class="text-[12px] text-slate-400 m-0">Try adjusting your search or filter criteria</p>
        </div>
      </section>

      <!-- Continue Planning -->
      <section class="mt-8 sm:mt-10 animate-fade-in-up delay-7">
        <h2 class="text-[14px] sm:text-[15px] font-bold text-slate-800 m-0 mb-4 sm:mb-5 flex items-center gap-2">
          <span class="text-base"></span> Continue Planning
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <div v-for="(trip, i) in ongoingTrips" :key="trip.title" class="group relative rounded-2xl overflow-hidden h-[160px] sm:h-[180px] cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] animate-scale-in" :style="{ animationDelay: `${0.4 + i * 0.08}s` }">
            <img :src="trip.image" :alt="trip.title" class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
            <div class="relative z-10 flex flex-col justify-end h-full p-4 sm:p-5">
              <h4 class="text-[14px] sm:text-[15px] font-bold text-white m-0 mb-0.5">{{ trip.title }}</h4>
              <p class="text-[11px] sm:text-[12px] text-white/70 m-0 mb-3">{{ trip.duration }}</p>
              <div>
                <div class="flex justify-between items-center mb-1.5">
                  <span class="text-[11px] text-white/60 font-medium">Planning progress</span>
                  <span class="text-[11px] font-bold text-white">{{ trip.progress }}%</span>
                </div>
                <div class="w-full h-[5px] bg-white/20 rounded-full overflow-hidden">
                  <div class="h-full bg-accent-gold rounded-full transition-all duration-700 ease-out" :style="{ width: trip.progress + '%' }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Hidden Gems -->
      <section v-if="filteredHiddenGems.length > 0" class="mt-8 sm:mt-10 animate-fade-in-up delay-8">
        <div class="flex justify-between items-center mb-4 sm:mb-5">
          <h2 class="text-[14px] sm:text-[15px] font-bold text-slate-800 m-0 flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span> Hidden Gems
          </h2>
          <a href="#" class="text-[12px] sm:text-[13px] font-semibold text-sidebar-active no-underline flex items-center gap-1 hover:underline transition-colors duration-200">
            Explore more
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <div v-for="(gem, i) in filteredHiddenGems" :key="gem.name" class="group bg-white rounded-2xl border border-weather-border overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:border-slate-300 flex animate-scale-in" :style="{ animationDelay: `${0.45 + i * 0.08}s` }">
            <div class="w-[110px] sm:w-[130px] shrink-0 overflow-hidden">
              <img :src="gem.image" :alt="gem.name" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>
            <div class="p-3 sm:p-4 flex flex-col justify-center min-w-0">
              <h4 class="text-[13px] sm:text-[14px] font-semibold text-slate-800 m-0 mb-0.5">{{ gem.name }}</h4>
              <p class="text-[11px] sm:text-[12px] text-slate-400 m-0 mb-1.5 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                {{ gem.province }}
              </p>
              <p class="text-[11px] sm:text-[12px] text-slate-500 m-0 leading-snug line-clamp-2">{{ gem.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Upcoming Events -->
      <section v-if="filteredUpcomingEvents.length > 0" class="mt-8 sm:mt-10 animate-fade-in-up delay-9">
        <div class="flex justify-between items-center mb-4 sm:mb-5">
          <h2 class="text-[14px] sm:text-[15px] font-bold text-slate-800 m-0 flex items-center gap-2">
            <span class="text-base"></span> Upcoming Events
          </h2>
          <a href="#" class="text-[12px] sm:text-[13px] font-semibold text-sidebar-active no-underline flex items-center gap-1 hover:underline transition-colors duration-200">
            See all
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          <div v-for="(evt, i) in filteredUpcomingEvents" :key="evt.title" class="group bg-white rounded-2xl border border-weather-border overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:border-slate-300 animate-scale-in" :style="{ animationDelay: `${0.5 + i * 0.06}s` }">
            <div class="relative h-28 sm:h-32 overflow-hidden">
              <img :src="evt.image" :alt="evt.title" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div class="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-sm rounded-lg px-2.5 py-1.5 text-center shadow-sm min-w-[44px]">
                <p class="text-[10px] font-semibold text-accent-gold uppercase m-0 leading-none">{{ evt.month }}</p>
                <p class="text-[18px] font-bold text-slate-800 m-0 leading-tight">{{ evt.day }}</p>
              </div>
            </div>
            <div class="p-3 sm:p-4">
              <h4 class="text-[13px] sm:text-[14px] font-semibold text-slate-800 m-0 mb-1">{{ evt.title }}</h4>
              <p class="text-[11px] sm:text-[12px] text-slate-400 m-0 mb-1 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                {{ evt.location }}
              </p>
              <p class="text-[11px] sm:text-[12px] text-slate-500 m-0 leading-snug">{{ evt.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Travel Tips -->
      <section v-if="filteredTravelTips.length > 0" class="mt-8 sm:mt-10 mb-8 sm:mb-10 animate-fade-in-up delay-10">
        <h2 class="text-[14px] sm:text-[15px] font-bold text-slate-800 m-0 mb-4 sm:mb-5 flex items-center gap-2">
          <span class="text-base"></span> Travel Tips
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          <div v-for="(tip, i) in filteredTravelTips" :key="tip.title" class="group bg-white rounded-2xl border border-weather-border p-4 sm:p-5 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:border-slate-300 animate-scale-in" :style="{ animationDelay: `${0.55 + i * 0.06}s` }">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3" :class="tip.bgClass">{{ tip.icon }}</div>
            <h4 class="text-[13px] sm:text-[14px] font-semibold text-slate-800 m-0 mb-1.5">{{ tip.title }}</h4>
            <p class="text-[11px] sm:text-[12px] text-slate-500 m-0 leading-snug">{{ tip.description }}</p>
          </div>
        </div>
      </section>

    </div>
  </main>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useHomepageStore } from './stores/homepage'

const homepageStore = useHomepageStore()
const {
  searchQuery,
  activeTab,
  tabs,
  weatherData,
  filteredDestinations,
  ongoingTrips,
  filteredHiddenGems,
  filteredUpcomingEvents,
  filteredTravelTips,
} = storeToRefs(homepageStore)
</script>
