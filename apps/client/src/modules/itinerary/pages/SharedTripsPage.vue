<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import SharedTripsTab from '../components/SharedTripsTab.vue'

const router = useRouter()

const navigateToTrips = () => {
  router.push('/trips')
}
</script>

<template>
  <main class="min-h-full bg-cream">
    <div class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="m-0 text-[28px] font-bold text-slate-800">Shared Trips</h1>
          <p class="mt-2 text-[14px] text-slate-500">
            Browse public itineraries shared by travelers.
          </p>
        </div>

        <RouterLink
          to="/trips"
          class="inline-flex items-center justify-center rounded-xl border border-weather-border bg-white px-4 py-2.5 text-[14px] font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          My Trips
        </RouterLink>
      </div>

      <SharedTripsTab @empty-action="navigateToTrips" />
    </div>
  </main>
</template>
