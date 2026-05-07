<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { createDay, getItinerary } from '../services/itineraryService'
import DayColumn from '../components/DayColumn.vue'
import type { ItineraryResponse } from '../types/itineraryItem.types'

const route = useRoute()
const itinerary = ref<ItineraryResponse | null>(null)
const errorMessage = ref('')
const isCreatingDay = ref(false)
const tripId = ref<string | undefined>(undefined)

onMounted(async () => {
  tripId.value = typeof route.query.tripId === 'string' ? route.query.tripId : undefined

  try {
    itinerary.value = await getItinerary(tripId.value)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load itinerary.'
    errorMessage.value = message
  }
})

const handleAddDay = async () => {
  if (!tripId.value || !itinerary.value) return

  isCreatingDay.value = true
  errorMessage.value = ''

  try {
    const newDay = await createDay(tripId.value)
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
        :disabled="isCreatingDay || !itinerary"
        @click="handleAddDay"
      >
        {{ isCreatingDay ? 'Adding Day...' : 'Add Day' }}
      </button>
    </div>

    <p v-if="errorMessage" class="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {{ errorMessage }}
    </p>

    <div v-if="itinerary">
      <DayColumn
        v-for="day in itinerary.days"
        :key="day.id"
        :day="day"
      />
    </div>
  </div>
</template>