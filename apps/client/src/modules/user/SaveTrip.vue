<template>
  <div class="space-y-6">
    <!-- Loading State -->
    <div v-if="loading" class="py-16 text-center">
      <div class="inline-flex items-center gap-3 text-[#8b857e]">
        <div class="w-5 h-5 border-2 border-[#0f4f3f]/20 border-t-[#0f4f3f] rounded-full animate-spin"></div>
        <span class="text-sm font-medium">Loading saved destinations…</span>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="savedDestinations.length === 0" class="py-16 text-center bg-white rounded-2xl border border-dashed border-[#dcd1c0] text-gray-500">
      <div class="text-4xl mb-4">❤️</div>
      <p class="font-medium">You haven't saved any destinations yet.</p>
      <p class="text-sm mt-1">Click the heart icon on destinations you love to see them here.</p>
      <router-link to="/explore" class="text-[#0f4f3f] font-semibold hover:underline mt-4 inline-block">
        Explore destinations to save
      </router-link>
    </div>

    <!-- Saved Destinations Table -->
    <div v-else class="bg-white border border-[#efe9df] rounded-2xl shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="bg-[#fcfaf7] text-[#6b645c] uppercase text-[11px] tracking-wider">
            <tr>
              <th class="px-4 py-3 text-left font-semibold">Destination</th>
              <th class="px-4 py-3 text-left font-semibold">Location</th>
              <th class="px-4 py-3 text-left font-semibold">Saved On</th>
              <th class="px-4 py-3 text-left font-semibold">Category</th>
              <th class="px-4 py-3 text-right font-semibold">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#f0ebe1]">
            <tr
              v-for="fav in savedDestinations"
              :key="fav.id"
              class="hover:bg-[#fefbf6] transition cursor-pointer"
              @click="$router.push(`/explore/${fav.destination_id}`)"
            >
              <td class="px-4 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 overflow-hidden rounded-xl bg-[#f8f4ee] shrink-0">
                    <img
                      v-if="fav.destinations?.cover_image_url"
                      :src="fav.destinations.cover_image_url"
                      class="w-full h-full object-cover"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center text-lg">🏞️</div>
                  </div>
                  <div class="min-w-0">
                    <p class="font-semibold text-[#2b2b2b] truncate">{{ fav.destinations?.name || 'Unknown' }}</p>
                    <p class="text-xs text-gray-500 line-clamp-1">{{ fav.destinations?.description || '' }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-4 text-[#8b857e]">
                📍 {{ fav.destinations?.location_name || fav.destinations?.province || '—' }}
              </td>
              <td class="px-4 py-4 text-[#8b857e]">{{ formatDate(fav.created_at) }}</td>
              <td class="px-4 py-4">
                <span
                  v-if="fav.destinations?.category"
                  class="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600"
                >
                  {{ fav.destinations.category }}
                </span>
              </td>
              <td class="px-4 py-4 text-right">
                <button
                  @click.stop="handleUnsave(fav.destination_id)"
                  :disabled="unsaving === fav.destination_id"
                  class="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-[#efe9df] bg-[#fcfaf7] text-xs font-semibold text-[#6b645c] hover:bg-[#f26b5e] hover:text-white hover:border-[#f26b5e] transition disabled:opacity-50"
                  title="Unsave Destination"
                >
                  <template v-if="unsaving === fav.destination_id">
                    <div class="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    Removing…
                  </template>
                  <template v-else>
                    ❤️ Unsave
                  </template>
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
import { ref, onMounted } from 'vue'
import { getFavorites, removeFavorite, type FavoriteItem } from '@/modules/explore/services/favoritesApi'

const loading = ref(false)
const savedDestinations = ref<FavoriteItem[]>([])
const unsaving = ref<string | null>(null)

onMounted(async () => {
  loading.value = true
  try {
    savedDestinations.value = await getFavorites()
  } catch (err) {
    console.error('[SaveTrip] Error loading favorites:', err)
  } finally {
    loading.value = false
  }
})

const handleUnsave = async (destinationId: string) => {
  unsaving.value = destinationId
  try {
    await removeFavorite(destinationId)
    savedDestinations.value = savedDestinations.value.filter(f => f.destination_id !== destinationId)
  } catch (err) {
    console.error('[SaveTrip] Error unsaving:', err)
  } finally {
    unsaving.value = null
  }
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
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
