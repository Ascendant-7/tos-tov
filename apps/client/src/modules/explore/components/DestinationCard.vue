<template>
  <router-link
    :to="`/explore/${destination.id}`"
    class="group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)] animate-scale-in block"
    :style="{ animationDelay: `${0.1 + index * 0.06}s` }"
  >
    <!-- Image Section -->
    <div class="relative h-[220px] sm:h-[240px] overflow-hidden">
      <img
        v-if="destination.cover_image_url"
        :src="destination.cover_image_url"
        :alt="destination.name"
        class="w-full h-full object-cover transition-transform duration-600 group-hover:scale-110"
      />
      <div v-else class="w-full h-full bg-cream-dark flex items-center justify-center">
        <svg class="text-slate-300" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
      </div>

      <!-- Gradient overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent"></div>

      <!-- Badge -->
      <div v-if="destination.badge" class="absolute top-3 left-3">
        <span
          :class="[
            'inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-white backdrop-blur-sm',
            destination.badge === 'Trending'
              ? 'bg-emerald-600/85'
              : 'bg-purple-700/80'
          ]"
        >
          <svg v-if="destination.badge === 'Trending'" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/></svg>
          {{ destination.badge }}
        </span>
      </div>

      <!-- Overlay Info (name + location + rating) -->
      <div class="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
        <div class="min-w-0">
          <h3 class="text-[16px] sm:text-[17px] font-bold text-white m-0 mb-0.5 drop-shadow-md">{{ destination.name }}</h3>
          <p class="text-[12px] text-white/80 m-0 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            {{ locationLabel }}
          </p>
        </div>
        <div v-if="destination.rating != null" class="flex items-center gap-1 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-lg shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="#FBBF24" stroke="#FBBF24" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <span class="text-[13px] font-bold text-white">{{ destination.rating }}</span>
        </div>
      </div>
    </div>

    <!-- Details Section -->
    <div class="bg-white p-4">
      <p class="text-[12px] sm:text-[13px] text-slate-500 m-0 mb-3 leading-relaxed line-clamp-2">{{ destination.description }}</p>

      <!-- Duration & Budget -->
      <div class="flex items-center gap-4 mb-3 text-[12px] text-slate-400">
        <span v-if="durationLabel" class="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          {{ durationLabel }}
        </span>
        <span v-if="budgetLabel" class="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          {{ budgetLabel }}
        </span>
      </div>

      <!-- Tags -->
      <div v-if="destination.tags && destination.tags.length > 0" class="flex flex-wrap gap-1.5">
        <span
          v-for="tag in destination.tags"
          :key="tag"
          class="text-[11px] text-slate-500 bg-cream px-2.5 py-0.5 rounded-full border border-weather-border transition-colors duration-200 hover:bg-cream-dark hover:text-slate-700"
        >
          {{ tag }}
        </span>
      </div>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

/**
 * Normalized destination shape used across the Explore UI.
 * Field names match the backend API response from /destinations.
 */
export interface ExploreDestination {
  id?: string
  created_at?: string
  name: string
  description?: string
  province: string
  /** City / locality from backend field `location_name` */
  location_name?: string
  category: string
  cover_image_url?: string
  duration_min?: number
  duration_max?: number
  budget_min?: number
  budget_max?: number
  rating?: number | string
  badge?: string
  tags?: string[]
}

const props = defineProps<{
  destination: ExploreDestination
  index: number
}>()

/** Show "City, Province" or just "Province" if no city set */
const locationLabel = computed(() => {
  const { location_name, province } = props.destination
  if (location_name && location_name !== province) return `${location_name}, ${province}`
  return province
})

/** Format duration as "X–Y days" from numeric min/max */
const durationLabel = computed(() => {
  const { duration_min, duration_max } = props.destination
  if (duration_min == null && duration_max == null) return null
  if (duration_min === duration_max) return `${duration_min} day${duration_min !== 1 ? 's' : ''}`
  if (duration_min != null && duration_max != null) return `${duration_min}–${duration_max} days`
  return `${duration_min ?? duration_max} days`
})

/** Format budget as "$X–Y/day" from numeric min/max */
const budgetLabel = computed(() => {
  const { budget_min, budget_max } = props.destination
  if (budget_min == null && budget_max == null) return null
  if (budget_min === budget_max) return `$${budget_min}/day`
  if (budget_min != null && budget_max != null) return `$${budget_min}–${budget_max}/day`
  return `$${budget_min ?? budget_max}/day`
})
</script>
