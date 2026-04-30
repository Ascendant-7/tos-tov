<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getItinerary } from '../services/itineraryService'
import DayColumn from '../components/DayColumn.vue'

const itinerary = ref<any>(null)

onMounted(async () => {
  itinerary.value = await getItinerary()
})
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Itinerary</h1>

    <div v-if="itinerary">
      <DayColumn
        v-for="day in itinerary.days"
        :key="day.id"
        :day="day"
      />
    </div>
  </div>
</template>