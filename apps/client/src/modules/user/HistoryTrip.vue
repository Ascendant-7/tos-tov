<template>
  <div class="space-y-6">
    <div v-if="completedTrips.length === 0" class="py-16 text-center bg-white rounded-2xl border border-dashed border-[#dcd1c0] text-gray-500">
      <div class="text-4xl mb-4">🏁</div>
      <p class="font-medium">No completed trips yet.</p>
      <p class="text-sm mt-1">Trips you complete will appear here as part of your travel history.</p>
    </div>

    <!-- Completed Trips List -->
    <div
      v-for="(trip, index) in completedTrips"
      :key="trip.id"
      class="group grid md:grid-cols-[auto_1fr_auto] gap-5 items-center p-4 bg-white border border-[#efe9df] rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div class="w-full md:w-24 h-40 md:h-24 overflow-hidden rounded-xl bg-[#f8f4ee] grayscale group-hover:grayscale-0 transition duration-500">
        <img
          :src="trip.image"
          class="w-full h-full object-cover"
        />
      </div>

      <div class="flex flex-col gap-1">
        <div class="flex items-center gap-2">
          <h3 class="text-base font-bold text-[#2b2b2b]">{{ trip.title }}</h3>
          <span class="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-green-50 text-green-600">
            Completed
          </span>
        </div>
        <p class="text-sm text-gray-500 line-clamp-2">{{ trip.description }}</p>
        <div class="flex items-center gap-3 mt-2 text-xs text-[#8b857e]">
          <span>📍 {{ trip.location }}</span>
          <span>📅 Finished on {{ formatDate(trip.completedAt) }}</span>
        </div>
      </div>

      <div class="flex md:flex-col gap-2">
        <button class="px-4 py-2 rounded-xl border border-[#efe9df] bg-[#fcfaf7] text-xs font-semibold hover:bg-[#0f4f3f] hover:text-white transition shadow-sm">
          View Memories
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface CompletedTrip {
  id: string
  title: string
  description: string
  location: string
  completedAt: string
  image: string
}

// Placeholder data - in a real app, this would be fetched from an API
const completedTrips = ref<CompletedTrip[]>([
  {
    id: '101',
    title: 'Summit of Mount Fuji',
    description: 'A challenging but rewarding climb to the highest peak in Japan.',
    location: 'Mount Fuji, Japan',
    completedAt: '2023-08-12T00:00:00Z',
    image: 'https://images.unsplash.com/photo-1490806678282-4417742124a2?q=80&w=400'
  },
  {
    id: '102',
    title: 'Parisian Getaway',
    description: 'Weekend exploring the Louvre, Eiffel Tower, and charming cafes of Paris.',
    location: 'Paris, France',
    completedAt: '2023-11-05T00:00:00Z',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=400'
  }
])

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
