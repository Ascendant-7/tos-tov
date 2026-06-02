<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { getTrips, updateTrip, type Trip } from '../services/itinerary.service'
import TripCard from './TripCard.vue'

const emit = defineEmits<{
  startPlanning: []
}>()

const trips = ref<Trip[]>([])
const isLoadingTrips = ref(false)
const tripsErrorMessage = ref('')
const updatingTripId = ref<string | null>(null)

const hasTrips = computed(() => trips.value.length > 0)

const isAuthError = (error: unknown) =>
  error instanceof Error && (error.message.includes('(401)') || error.message.includes('(403)'))

const loadTrips = async () => {
  isLoadingTrips.value = true
  tripsErrorMessage.value = ''

  try {
    trips.value = await getTrips()
  } catch (error) {
    if (isAuthError(error)) {
      trips.value = []
      return
    }

    tripsErrorMessage.value = error instanceof Error ? error.message : 'Failed to load trips.'
  } finally {
    isLoadingTrips.value = false
  }
}

const isPublicTrip = (trip: Trip) => trip.visibility === 'public'

const toggleVisibility = async (trip: Trip) => {
  updatingTripId.value = trip.id
  tripsErrorMessage.value = ''

  try {
    const updated = await updateTrip(trip.id, {
      visibility: isPublicTrip(trip) ? 'private' : 'public',
    })

    const index = trips.value.findIndex((item) => item.id === trip.id)
    if (index !== -1) {
      trips.value[index] = updated
    }
  } catch (error) {
    tripsErrorMessage.value =
      error instanceof Error ? error.message : 'Failed to update trip visibility.'
  } finally {
    updatingTripId.value = null
  }
}

onMounted(loadTrips)
</script>

<template>
  <section>
    <p
      v-if="tripsErrorMessage"
      class="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ tripsErrorMessage }}
    </p>

    <div
      v-if="isLoadingTrips"
      class="rounded-2xl border border-weather-border bg-white p-6 text-sm text-slate-500 shadow-sm"
    >
      Loading trips...
    </div>

    <div v-else-if="hasTrips" class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <TripCard
        v-for="trip in trips"
        :key="trip.id"
        :trip="trip"
        :is-updating="updatingTripId === trip.id"
        @toggle-visibility="toggleVisibility"
      />
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
      <button
        type="button"
        class="mt-5 inline-flex items-center justify-center rounded-xl bg-sidebar-active px-4 py-2.5 text-[14px] font-semibold text-white transition hover:bg-sidebar-active/90"
        @click="emit('startPlanning')"
      >
        Start Planning
      </button>
    </section>
  </section>
</template>
