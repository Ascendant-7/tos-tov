<template>
  <main class="min-h-screen bg-cream">
    <!-- Header -->
    <div class="border-b border-weather-border bg-white">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div class="flex items-center justify-between gap-4">
          <div>
            <h1 class="text-[28px] font-bold text-slate-800 mb-2">Trip Planner</h1>
            <p class="text-slate-500 text-[14px]">Plan your next adventure</p>
          </div>
          <router-link
            to="/explore"
            class="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors text-[14px] font-medium"
          >
            Back to Explore
          </router-link>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <!-- Pending Destinations Section -->
      <section
        v-if="itineraryStore.hasPendingDestinations"
        class="mb-12 p-6 bg-white rounded-2xl border border-weather-border shadow-sm"
      >
        <h2 class="text-[20px] font-bold text-slate-800 mb-4">Destinations to Add</h2>
        <div class="space-y-3">
          <div
            v-for="dest in itineraryStore.pendingDestinations"
            :key="dest.id"
            class="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-xl"
          >
            <div class="min-w-0">
              <h3 class="font-bold text-slate-800 text-[15px]">{{ dest.name }}</h3>
              <p class="text-slate-600 text-[13px] mt-1">
                {{ dest.location_name || dest.province }}
              </p>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <button
                @click="handleAddDestinationToDay(dest)"
                class="px-3 py-1.5 bg-sidebar-active text-white rounded-lg text-[13px] font-medium hover:bg-sidebar-active/90 transition-colors"
              >
                Add to Day
              </button>
              <button
                @click="dest.id && itineraryStore.removePendingDestination(dest.id)"
                class="px-3 py-1.5 bg-slate-200 text-slate-600 rounded-lg text-[13px] font-medium hover:bg-slate-300 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Trip Creation/Selection -->
      <section
        v-if="!hasSelectedTrip"
        class="mb-12 p-6 bg-white rounded-2xl border border-weather-border shadow-sm"
      >
        <h2 class="text-[20px] font-bold text-slate-800 mb-4">Create New Trip</h2>
        <div class="space-y-3">
          <input
            v-model="tripName"
            type="text"
            placeholder="Enter trip name (e.g., Summer 2026)"
            class="w-full px-4 py-3 border border-weather-border rounded-xl focus:outline-none focus:border-sidebar-active text-[14px]"
          />
          <input
            v-model="tripDescription"
            type="text"
            placeholder="Trip description (optional)"
            class="w-full px-4 py-3 border border-weather-border rounded-xl focus:outline-none focus:border-sidebar-active text-[14px]"
          />
          <button
            @click="createAndNavigateToTrip"
            :disabled="!tripName.trim() || isCreatingTrip"
            class="w-full py-3 px-4 bg-sidebar-active text-white font-bold rounded-xl hover:bg-sidebar-active/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-[14px]"
          >
            {{ isCreatingTrip ? 'Creating Trip...' : 'Create Trip' }}
          </button>
        </div>
      </section>

      <!-- Existing Trip Selection -->
      <section
        v-if="hasSelectedTrip"
        class="p-6 bg-white rounded-2xl border border-weather-border shadow-sm"
      >
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-[20px] font-bold text-slate-800">Current Trip</h2>
          <button
            @click="clearTrip"
            class="text-[13px] text-slate-500 hover:text-slate-700 font-medium"
          >
            Change Trip
          </button>
        </div>
        <div class="p-4 bg-slate-50 rounded-xl border border-weather-border">
          <p class="text-[15px] font-bold text-slate-800">{{ itineraryStore.currentTripId }}</p>
          <p class="text-[13px] text-slate-500 mt-1">Ready to add destinations to this trip</p>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useItineraryStore } from '@/modules/itinerary/stores/itineraryStore'
import { createTrip } from '@/modules/itinerary/services/itinerary.service'
import type { ExploreDestination } from '@/modules/explore/components/DestinationCard.vue'

const router = useRouter()
const itineraryStore = useItineraryStore()

const tripName = ref('')
const tripDescription = ref('')
const isCreatingTrip = ref(false)

const hasSelectedTrip = ref(!!itineraryStore.currentTripId)

async function createAndNavigateToTrip() {
  if (!tripName.value.trim()) return

  isCreatingTrip.value = true
  try {
    const trip = await createTrip({
      title: tripName.value.trim(),
      description: tripDescription.value.trim() || undefined,
    })
    itineraryStore.setCurrentTripId(trip.id)

    await router.push(`/trips/${encodeURIComponent(trip.id)}`)
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

function clearTrip() {
  itineraryStore.setCurrentTripId(undefined)
  hasSelectedTrip.value = false
}
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

main {
  animation: fadeIn 0.5s ease-out;
}
</style>
