<script setup lang="ts">
import { computed, ref } from 'vue'
import MapView from './MapView.vue'
import { calculateTripStats } from '@/modules/map/utils/tripStats'
import type { MapDestination, RouteSummary, TripStats, TravelProfile } from '@/modules/map/types/maps'

const props = withDefaults(
  defineProps<{
    destinations: MapDestination[]
    profile?: TravelProfile
  }>(),
  {
    profile: 'driving-car',
  },
)

const route = ref<RouteSummary | null>(null)

const stats = computed<TripStats>(() => {
  if (!route.value) {
    return {
      totalDistanceKm: 0,
      totalDurationMinutes: 0,
    }
  }

  return calculateTripStats(route.value)
})

const destinationCount = computed(() => props.destinations.length)
</script>

<template>
  <section class="mb-6 overflow-hidden rounded-lg border border-slate-200 bg-white">
    <div
      class="flex flex-col gap-3 border-b border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <p class="text-sm font-bold text-slate-900">Trip route</p>
        <p class="mt-0.5 text-xs font-medium text-slate-500">
          {{ destinationCount }} mapped destinations
        </p>
      </div>

      <div class="grid grid-cols-2 gap-2 text-right">
        <div>
          <p class="text-[11px] font-bold uppercase text-slate-400">Total Distance</p>
          <p class="text-sm font-bold text-slate-900">{{ stats.totalDistanceKm.toFixed(1) }} km</p>
        </div>
        <div>
          <p class="text-[11px] font-bold uppercase text-slate-400">Travel Time</p>
          <p class="text-sm font-bold text-slate-900">{{ stats.totalDurationMinutes }} min</p>
        </div>
      </div>
    </div>

    <MapView
      :destinations="destinations"
      :profile="profile"
      @route-loaded="route = $event"
      @route-error="route = null"
    />
  </section>
</template>
