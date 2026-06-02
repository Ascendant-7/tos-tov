<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { ExploreDestination } from '@/modules/explore/components/DestinationCard.vue'
import { useItineraryStore } from '../stores/itineraryStore'
import { createDay, createItem, createTrip, getItinerary } from '../services/itinerary.service'

const props = defineProps<{
  open: boolean
  destination: ExploreDestination | null
}>()

const emit = defineEmits<{
  close: []
}>()

const router = useRouter()
const itineraryStore = useItineraryStore()

const tripName = ref('')
const errorMessage = ref('')
const isSaving = ref(false)

const hasCurrentTrip = computed(() => !!itineraryStore.currentTripId)

watch(
  () => props.destination,
  (destination) => {
    tripName.value = destination ? `Trip to ${destination.name}` : ''
    errorMessage.value = ''
  },
  { immediate: true },
)

async function addDestinationToTrip(tripId: string) {
  if (!props.destination) return
  if (!props.destination.id) {
    throw new Error('This destination is missing an id.')
  }

  const itinerary = await getItinerary(tripId)
  const day = itinerary.days[0] || (await createDay(tripId, 'Day 1'))

  await createItem(day.id, {
    title: props.destination.name,
    destination_id: props.destination.id,
    time: '09:00 AM',
    category: props.destination.category || 'activity',
    duration: null,
    cost: null,
    notes: '',
    position: day.items?.length || 0,
  })
}

async function handleCreateTrip() {
  if (!props.destination || !tripName.value.trim()) return

  isSaving.value = true
  errorMessage.value = ''

  try {
    const trip = await createTrip({ title: tripName.value.trim() })
    itineraryStore.setCurrentTripId(trip.id)
    await addDestinationToTrip(trip.id)
    emit('close')
    await router.push(`/trips/${encodeURIComponent(trip.id)}`)
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Failed to add destination to trip.'
  } finally {
    isSaving.value = false
  }
}

async function handleAddToCurrentTrip() {
  if (!itineraryStore.currentTripId) return

  isSaving.value = true
  errorMessage.value = ''

  try {
    await addDestinationToTrip(itineraryStore.currentTripId)
    emit('close')
    await router.push(`/trips/${encodeURIComponent(itineraryStore.currentTripId)}`)
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Failed to add destination to trip.'
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    @click.self="emit('close')"
  >
    <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-xl font-bold text-slate-900">Add to Trip</h2>

        <button
          class="rounded-full px-3 py-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          @click="emit('close')"
        >
          Close
        </button>
      </div>

      <p class="mb-4 text-sm text-gray-600">
        {{ destination ? destination.name : 'This destination' }} will be added to Day 1.
      </p>

      <p
        v-if="errorMessage"
        class="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
      >
        {{ errorMessage }}
      </p>

      <div class="space-y-3">
        <button
          v-if="hasCurrentTrip"
          class="w-full rounded-xl bg-green-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-900 disabled:opacity-60"
          :disabled="isSaving || !destination"
          @click="handleAddToCurrentTrip"
        >
          {{ isSaving ? 'Adding...' : 'Add to Current Trip' }}
        </button>

        <div class="space-y-2">
          <label class="block text-sm font-semibold text-gray-700" for="trip-name">
            New trip name
          </label>
          <input
            id="trip-name"
            v-model="tripName"
            :disabled="isSaving"
            class="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100 disabled:bg-gray-50"
          />
        </div>

        <button
          class="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
          :disabled="isSaving || !destination || !tripName.trim()"
          @click="handleCreateTrip"
        >
          {{ isSaving ? 'Creating...' : 'Create Trip and Add' }}
        </button>
      </div>
    </div>
  </div>
</template>
