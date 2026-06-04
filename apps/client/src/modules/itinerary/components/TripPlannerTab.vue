<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { ExploreDestination } from '@/modules/explore/components/DestinationCard.vue'
import { useItineraryStore } from '../stores/itineraryStore'
import { createTrip } from '../services/itinerary.service'

const router = useRouter()
const itineraryStore = useItineraryStore()

const tripName = ref('')
const tripDescription = ref('')
const isCreatingTrip = ref(false)
const plannerErrorMessage = ref('')

async function createAndNavigateToTrip() {
  if (!tripName.value.trim()) return

  isCreatingTrip.value = true
  plannerErrorMessage.value = ''

  try {
    const trip = await createTrip({
      title: tripName.value.trim(),
      description: tripDescription.value.trim() || undefined,
    })
    itineraryStore.setCurrentTripId(trip.id)

    await router.push(`/trips/${encodeURIComponent(trip.id)}`)
  } catch (error) {
    plannerErrorMessage.value = error instanceof Error ? error.message : 'Failed to create trip.'
  } finally {
    isCreatingTrip.value = false
  }
}

function handleAddDestinationToDay(destination: ExploreDestination) {
  if (!destination.id) return

  if (itineraryStore.currentTripId) {
    router.push(
      `/trips/${encodeURIComponent(itineraryStore.currentTripId)}?addDestination=${destination.id}`,
    )
  } else {
    tripName.value = `Trip - ${destination.name}`
    createAndNavigateToTrip()
  }
}

</script>

<template>
  <section>
    <p
      v-if="plannerErrorMessage"
      class="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ plannerErrorMessage }}
    </p>

    <section
      v-if="itineraryStore.hasPendingDestinations"
      class="mb-8 rounded-2xl border border-weather-border bg-white p-6 shadow-sm"
    >
      <h2 class="mb-4 text-[20px] font-bold text-slate-800">Destinations to Add</h2>
      <div class="space-y-3">
        <div
          v-for="dest in itineraryStore.pendingDestinations"
          :key="dest.id"
          class="flex items-center justify-between gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4"
        >
          <div class="min-w-0">
            <h3 class="text-[15px] font-bold text-slate-800">{{ dest.name }}</h3>
            <p class="mt-1 text-[13px] text-slate-600">
              {{ dest.location_name || dest.province }}
            </p>
          </div>
          <div class="flex shrink-0 items-center gap-2">
            <button
              type="button"
              class="rounded-lg bg-sidebar-active px-3 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-sidebar-active/90"
              @click="handleAddDestinationToDay(dest)"
            >
              Add to Day
            </button>
            <button
              type="button"
              class="rounded-lg bg-slate-200 px-3 py-1.5 text-[13px] font-medium text-slate-600 transition-colors hover:bg-slate-300"
              @click="dest.id && itineraryStore.removePendingDestination(dest.id)"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="rounded-2xl border border-weather-border bg-white p-6 shadow-sm"
    >
      <h2 class="mb-4 text-[20px] font-bold text-slate-800">Create New Trip</h2>
      <div class="space-y-3">
        <input
          v-model="tripName"
          type="text"
          placeholder="Enter trip name (e.g., Summer 2026)"
          class="w-full rounded-xl border border-weather-border px-4 py-3 text-[14px] focus:border-sidebar-active focus:outline-none"
        />
        <input
          v-model="tripDescription"
          type="text"
          placeholder="Trip description (optional)"
          class="w-full rounded-xl border border-weather-border px-4 py-3 text-[14px] focus:border-sidebar-active focus:outline-none"
        />
        <button
          type="button"
          :disabled="!tripName.trim() || isCreatingTrip"
          class="w-full rounded-xl bg-sidebar-active px-4 py-3 text-[14px] font-bold text-white transition-colors hover:bg-sidebar-active/90 disabled:cursor-not-allowed disabled:opacity-60"
          @click="createAndNavigateToTrip"
        >
          {{ isCreatingTrip ? 'Creating Trip...' : 'Create Trip' }}
        </button>
      </div>
    </section>

  </section>
</template>
