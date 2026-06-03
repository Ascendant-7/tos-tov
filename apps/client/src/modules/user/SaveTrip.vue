<template>
  <div class="space-y-6">
    <div v-if="savedTrips.length === 0" class="py-16 text-center bg-white rounded-2xl border border-dashed border-[#dcd1c0] text-gray-500">
      <div class="text-4xl mb-4">⭐</div>
      <p class="font-medium">You haven't saved any trips yet.</p>
      <p class="text-sm mt-1">Click the save icon on trips you're interested in to see them here.</p>
      <router-link to="/explore" class="text-[#0f4f3f] font-semibold hover:underline mt-4 inline-block">
        Explore trips to save
      </router-link>
    </div>

    <!-- Saved Trips Table -->
    <div v-else class="bg-white border border-[#efe9df] rounded-2xl shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="bg-[#fcfaf7] text-[#6b645c] uppercase text-[11px] tracking-wider">
            <tr>
              <th class="px-4 py-3 text-left font-semibold">Trip</th>
              <th class="px-4 py-3 text-left font-semibold">Location</th>
              <th class="px-4 py-3 text-left font-semibold">Saved On</th>
              <th class="px-4 py-3 text-left font-semibold">Status</th>
              <th class="px-4 py-3 text-right font-semibold">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#f0ebe1]">
            <tr
              v-for="trip in savedTrips"
              :key="trip.id"
              class="hover:bg-[#fefbf6] transition"
            >
              <td class="px-4 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 overflow-hidden rounded-xl bg-[#f8f4ee]">
                    <img :src="trip.image" class="w-full h-full object-cover" />
                  </div>
                  <div class="min-w-0">
                    <p class="font-semibold text-[#2b2b2b] truncate">{{ trip.title }}</p>
                    <p class="text-xs text-gray-500 line-clamp-2">{{ trip.description }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-4 text-[#8b857e]">📍 {{ trip.location }}</td>
              <td class="px-4 py-4 text-[#8b857e]">{{ formatDate(trip.savedAt) }}</td>
              <td class="px-4 py-4">
                <span class="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-600">
                  Interested
                </span>
              </td>
              <td class="px-4 py-4 text-right">
                <button
                  @click.stop="unsaveTrip(trip.id)"
                  class="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-[#efe9df] bg-[#fcfaf7] text-xs font-semibold text-[#6b645c] hover:bg-[#f26b5e] hover:text-white hover:border-[#f26b5e] transition"
                  title="Unsave Trip"
                >
                  ❤️ Unsave
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface SavedTrip {
  id: string
  title: string
  description: string
  location: string
  savedAt: string
  image: string
}

// Placeholder data - in a real app, this would be fetched from an API
const savedTrips = ref<SavedTrip[]>([
  {
    id: '1',
    title: 'Autumn in Kyoto',
    description: 'Exploring the ancient temples and vibrant autumn foliage of Kyoto, Japan.',
    location: 'Kyoto, Japan',
    savedAt: '2024-05-20T10:00:00Z',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=400'
  },
  {
    id: '2',
    title: 'Amalfi Coast Adventure',
    description: 'Driving along the breathtaking cliffs and colorful villages of the Amalfi Coast.',
    location: 'Amalfi, Italy',
    savedAt: '2024-05-15T14:30:00Z',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=400'
  }
])

const unsaveTrip = (id: string) => {
  savedTrips.value = savedTrips.value.filter(t => t.id !== id)
}

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
