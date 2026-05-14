import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { ExploreDestination } from '@/modules/explore/components/DestinationCard.vue'

export const useItineraryStore = defineStore('itinerary', () => {
  // Track destinations waiting to be added to the trip
  const pendingDestinations = ref<ExploreDestination[]>([])

  // Track current trip being edited
  const currentTripId = ref<string | undefined>(undefined)

  // Track if modal for adding destination to day is open
  const showAddToDayModal = ref(false)

  // Add a destination to pending list
  function addDestinationToTrip(destination: ExploreDestination, tripId?: string) {
    if (!pendingDestinations.value.find((d) => d.id === destination.id)) {
      pendingDestinations.value.push(destination)
    }
    if (tripId) {
      currentTripId.value = tripId
    }
  }

  // Remove destination from pending
  function removePendingDestination(destinationId: string) {
    pendingDestinations.value = pendingDestinations.value.filter((d) => d.id !== destinationId)
  }

  // Clear all pending destinations
  function clearPendingDestinations() {
    pendingDestinations.value = []
  }

  // Set current trip ID
  function setCurrentTripId(tripId: string | undefined) {
    currentTripId.value = tripId
  }

  // Check if there are pending destinations
  const hasPendingDestinations = computed(() => pendingDestinations.value.length > 0)

  return {
    pendingDestinations,
    currentTripId,
    showAddToDayModal,
    hasPendingDestinations,
    addDestinationToTrip,
    removePendingDestination,
    clearPendingDestinations,
    setCurrentTripId,
  }
})
