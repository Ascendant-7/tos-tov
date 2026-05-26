<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { getTrips, updateTrip, type Trip } from '../services/itinerary.service'

const trips = ref<Trip[]>([])
const isLoading = ref(true)
const errorMessage = ref('')
const updatingTripId = ref<string | null>(null)

const hasTrips = computed(() => trips.value.length > 0)

const formatDate = (value?: string) => {
  if (!value) return 'Recently created'

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

const loadTrips = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    trips.value = await getTrips()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Failed to load trips.'
  } finally {
    isLoading.value = false
  }
}

const isPublicTrip = (trip: Trip) => trip.visibility === 'public'

const toggleVisibility = async (trip: Trip) => {
  updatingTripId.value = trip.id
  errorMessage.value = ''

  try {
    const updated = await updateTrip(trip.id, {
      visibility: isPublicTrip(trip) ? 'private' : 'public',
    })

    const index = trips.value.findIndex((item) => item.id === trip.id)
    if (index !== -1) {
      trips.value[index] = updated
    }
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Failed to update trip visibility.'
  } finally {
    updatingTripId.value = null
  }
}

onMounted(loadTrips)
</script>

<template>
  <main class="min-h-full bg-cream">
    <div class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="m-0 text-[28px] font-bold text-slate-800">My Trips</h1>
          <p class="mt-2 text-[14px] text-slate-500">
            Open a saved itinerary and continue planning.
          </p>
        </div>

        <RouterLink
          to="/trip-planner"
          class="inline-flex items-center justify-center rounded-xl bg-sidebar-active px-4 py-2.5 text-[14px] font-semibold text-white transition hover:bg-sidebar-active/90"
        >
          New Trip
        </RouterLink>
      </div>

      <p
        v-if="errorMessage"
        class="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      >
        {{ errorMessage }}
      </p>

      <div
        v-if="isLoading"
        class="rounded-2xl border border-weather-border bg-white p-6 text-sm text-slate-500 shadow-sm"
      >
        Loading trips...
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
            <span
              :class="[
                'mb-3 inline-flex rounded-full px-2.5 py-1 text-[12px] font-semibold',
                isPublicTrip(trip)
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-slate-100 text-slate-600',
              ]"
            >
              {{ isPublicTrip(trip) ? 'Public' : 'Private' }}
            </span>
            <h2 class="m-0 text-[20px] font-bold text-slate-800">
              {{ trip.title }}
            </h2>
            <p class="mt-2 line-clamp-2 text-[14px] leading-6 text-slate-500">
              {{ trip.description || 'No description yet.' }}
            </p>
          </div>

          <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <button
              type="button"
              :disabled="updatingTripId === trip.id"
              class="inline-flex items-center justify-center rounded-xl border border-weather-border bg-white px-4 py-2.5 text-[14px] font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
              @click="toggleVisibility(trip)"
            >
              {{
                updatingTripId === trip.id
                  ? 'Updating...'
                  : isPublicTrip(trip)
                    ? 'Make Private'
                    : 'Make Public'
              }}
            </button>

            <RouterLink
              :to="`/trips/${encodeURIComponent(trip.id)}`"
              class="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-[14px] font-semibold text-white transition hover:bg-slate-800"
            >
              View Itinerary
            </RouterLink>
          </div>
        </article>
      </div>

      <section
        v-else
        class="rounded-2xl border border-weather-border bg-white p-8 text-center shadow-sm"
      >
        <h2 class="m-0 text-[20px] font-bold text-slate-800">No trips yet</h2>
        <p class="mx-auto mt-2 max-w-md text-[14px] leading-6 text-slate-500">
          Create a trip from the planner or add a destination from Explore to start building your
          first itinerary.
        </p>
        <RouterLink
          to="/trip-planner"
          class="mt-5 inline-flex items-center justify-center rounded-xl bg-sidebar-active px-4 py-2.5 text-[14px] font-semibold text-white transition hover:bg-sidebar-active/90"
        >
          Start Planning
        </RouterLink>
      </section>
    </div>
  </main>
</template>
