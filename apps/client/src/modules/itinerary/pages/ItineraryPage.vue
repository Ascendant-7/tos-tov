<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { createDay, createItem, getItinerary } from '../services/itinerary.service'
import { getDestinations } from '../services/destination.service'
import { useItineraryStore } from '../stores/itineraryStore'
import DayColumn from '../components/DayColumn.vue'
import type { ItineraryResponse } from '../types/itineraryItem.types'

const route = useRoute()
const router = useRouter()
const itineraryStore = useItineraryStore()
const itinerary = ref<ItineraryResponse | null>(null)
const errorMessage = ref('')
const isCreatingDay = ref(false)
const isAddingDestination = ref(false)
const tripId = route.params.tripId as string

onMounted(async () => {
  try {
    itinerary.value = await getItinerary(tripId)
    await addDestinationFromQuery()
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load itinerary.'
    errorMessage.value = message
  }
})

const addDestinationFromQuery = async () => {
  const destinationId = route.query.addDestination
  if (!tripId || !itinerary.value || typeof destinationId !== 'string') return

  isAddingDestination.value = true
  errorMessage.value = ''

  try {
    const destinations = await getDestinations()
    const destination = destinations.find((item: any) => item.id === destinationId)

    if (!destination) {
      throw new Error('Destination was not found.')
    }

    const day = itinerary.value.days[0] || (await createDay(tripId, 'Day 1'))
    if (itinerary.value.days.length === 0) {
      itinerary.value.days.push(day)
    }

    const item = await createItem(day.id, {
      title: destination.name,
      destination_id: destination.id,
      time: '09:00 AM',
      category: destination.category || 'activity',
      duration: null,
      cost: null,
      notes: '',
      position: day.items?.length || 0,
    })

    day.items.push(item)
    itineraryStore.removePendingDestination(destination.id)
    await router.replace({ name: 'trip-itinerary', params: { tripId } })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to add destination.'
    errorMessage.value = message
  } finally {
    isAddingDestination.value = false
  }
}

const handleAddDay = async () => {
  if (!tripId || !itinerary.value) return

  isCreatingDay.value = true
  errorMessage.value = ''

  try {
    const newDay = await createDay(tripId)
    itinerary.value.days.push(newDay)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to add a new day.'
    errorMessage.value = message
  } finally {
    isCreatingDay.value = false
  }
}
</script>

<template>
  <div class="p-6">
    <div class="mb-4 flex items-center justify-between gap-4">
      <h1 class="text-2xl font-bold">Itinerary</h1>

      <button
        class="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-blue-700 disabled:opacity-50"
        :disabled="isCreatingDay || isAddingDestination || !itinerary"
        @click="handleAddDay"
      >
        {{ isCreatingDay ? 'Adding Day...' : 'Add Day' }}
      </button>
    </div>

    <p
      v-if="isAddingDestination"
      class="mb-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700"
    >
      Adding destination to this trip...
    </p>

    <p
      v-if="errorMessage"
      class="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ errorMessage }}
    </p>

    <div v-if="itinerary">
      <DayColumn v-for="day in itinerary.days" :key="day.id" :day="day" />
    </div>
  </div>
</template>
