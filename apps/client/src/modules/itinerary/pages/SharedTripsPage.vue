<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { getSharedTrips, type Trip } from '../services/itinerary.service'

const trips = ref<Trip[]>([])
const isLoading = ref(true)
const errorMessage = ref('')

const hasTrips = computed(() => trips.value.length > 0)

const formatDate = (value?: string) => {
  if (!value) return 'Recently shared'

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

const loadSharedTrips = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    trips.value = await getSharedTrips()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Failed to load shared trips.'
  } finally {
    isLoading.value = false
  }
}

onMounted(loadSharedTrips)
</script>

<template>
  <main class="min-h-full bg-cream">
    <div class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="m-0 text-[28px] font-bold text-slate-800">Shared Trips</h1>
          <p class="mt-2 text-[14px] text-slate-500">Browse public itineraries shared by travelers.</p>
        </div>

        <RouterLink
          to="/trips"
          class="inline-flex items-center justify-center rounded-xl border border-weather-border bg-white px-4 py-2.5 text-[14px] font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          My Trips
        </RouterLink>
      </div>

      <p v-if="errorMessage" class="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {{ errorMessage }}
      </p>

      <div v-if="isLoading" class="rounded-2xl border border-weather-border bg-white p-6 text-sm text-slate-500 shadow-sm">
        Loading shared trips...
      </div>

      <div v-else-if="hasTrips" class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <article
          v-for="trip in trips"
          :key="trip.id"
          class="rounded-2xl border border-weather-border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div class="mb-5">
            <p class="mb-2 text-[12px] font-semibold uppercase tracking-wide text-slate-400">
              {{ formatDate(trip.created_at) }}
            </p>
            <span class="mb-3 inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-[12px] font-semibold text-emerald-700">
              Public
            </span>
            <h2 class="m-0 text-[20px] font-bold text-slate-800">
              {{ trip.title }}
            </h2>
            <p class="mt-2 line-clamp-2 text-[14px] leading-6 text-slate-500">
              {{ trip.description || 'No description yet.' }}
            </p>
          </div>

          <RouterLink
            :to="`/trips/${encodeURIComponent(trip.id)}`"
            class="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-[14px] font-semibold text-white transition hover:bg-slate-800"
          >
            View Public Itinerary
          </RouterLink>
        </article>
      </div>

      <section v-else class="rounded-2xl border border-weather-border bg-white p-8 text-center shadow-sm">
        <h2 class="m-0 text-[20px] font-bold text-slate-800">No shared trips yet</h2>
        <p class="mx-auto mt-2 max-w-md text-[14px] leading-6 text-slate-500">
          Public trips will appear here when travelers choose to share their itinerary.
        </p>
        <RouterLink
          to="/trips"
          class="mt-5 inline-flex items-center justify-center rounded-xl bg-sidebar-active px-4 py-2.5 text-[14px] font-semibold text-white transition hover:bg-sidebar-active/90"
        >
          Manage My Trips
        </RouterLink>
      </section>
    </div>
  </main>
</template>
