<template>
  <main v-if="destination" class="min-h-screen bg-cream">
    <!-- Header with Image -->
    <div class="relative h-[400px] sm:h-[500px] overflow-hidden">
      <!-- Back Button -->
      <router-link
        to="/explore"
        class="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/90 backdrop-blur-sm text-slate-700 hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to Explore
      </router-link>

      <!-- Action Buttons -->
      <div class="absolute top-6 right-6 z-20 flex items-center gap-3">
        <button
          @click="isFavorited = !isFavorited"
          :class="[
            'w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm',
            isFavorited
              ? 'bg-red-500 text-white shadow-lg'
              : 'bg-white/90 text-slate-400 hover:text-red-500 shadow-lg',
          ]"
          aria-label="Add to favorites"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            :fill="isFavorited ? 'currentColor' : 'none'"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
            />
          </svg>
        </button>
        <button
          @click="shareDestination"
          class="w-12 h-12 rounded-full flex items-center justify-center bg-white/90 text-slate-600 hover:text-slate-800 transition-all duration-200 backdrop-blur-sm shadow-lg hover:shadow-xl"
          aria-label="Share"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
        </button>
      </div>

      <!-- Image -->
      <img
        v-if="destination.cover_image_url"
        :src="destination.cover_image_url"
        :alt="destination.name"
        class="w-full h-full object-cover"
      />
      <div
        v-else
        class="w-full h-full bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center"
      >
        <svg
          class="text-slate-500"
          xmlns="http://www.w3.org/2000/svg"
          width="80"
          height="80"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
          <circle cx="9" cy="9" r="2" />
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        </svg>
      </div>

      <!-- Gradient Overlay -->
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"
      ></div>

      <!-- Title Overlay -->
      <div class="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
        <div class="flex items-end justify-between">
          <div>
            <p class="text-white/80 text-[14px] sm:text-[16px] flex items-center gap-2 mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {{ destination.location_name || destination.province }}, {{ destination.province }}
            </p>
            <h1 class="text-[32px] sm:text-[42px] font-bold text-white m-0 mb-2">
              {{ destination.name }}
            </h1>
            <div v-if="destination.badge" class="flex items-center gap-2">
              <span
                :class="[
                  'inline-flex items-center gap-1 px-3 py-1 rounded-lg text-[12px] font-semibold text-white',
                  destination.badge === 'Trending' ? 'bg-emerald-600/90' : 'bg-purple-700/90',
                ]"
              >
                <svg
                  v-if="destination.badge === 'Trending'"
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                  <polyline points="16 7 22 7 22 13" />
                </svg>
                {{ destination.badge }}
              </span>
            </div>
          </div>
          <div
            v-if="destination.rating"
            class="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-xl"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="#FBBF24"
              stroke="#FBBF24"
              stroke-width="1"
            >
              <polygon
                points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
              />
            </svg>
            <span class="text-[16px] font-bold text-white">{{ destination.rating }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <!-- Info Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div class="bg-white p-6 rounded-2xl border border-weather-border shadow-sm">
          <p
            class="text-[13px] font-bold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Duration
          </p>
          <p class="text-[20px] font-bold text-slate-800">{{ durationLabel || 'N/A' }}</p>
        </div>

        <div class="bg-white p-6 rounded-2xl border border-weather-border shadow-sm">
          <p
            class="text-[13px] font-bold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="12" x2="12" y1="2" y2="22" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            Budget
          </p>
          <p class="text-[20px] font-bold text-slate-800">{{ budgetLabel || 'N/A' }}</p>
        </div>

        <div class="bg-white p-6 rounded-2xl border border-weather-border shadow-sm">
          <p
            class="text-[13px] font-bold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="1" />
              <path
                d="M12 1v6m6.16-1.86-4.24 4.24M19 12h-6m1.86 6.16-4.24-4.24M12 19v-6m-6.16 1.86 4.24-4.24M5 12H11M6.16 6.16l4.24 4.24"
              />
            </svg>
            Best Time
          </p>
          <p class="text-[20px] font-bold text-slate-800">Nov – Feb</p>
        </div>
      </div>

      <!-- About Section -->
      <section class="bg-white p-6 sm:p-8 rounded-3xl border border-weather-border shadow-sm mb-8">
        <h2 class="text-[24px] font-bold text-slate-800 mb-4">About</h2>
        <p class="text-[15px] text-slate-600 leading-relaxed mb-5">
          {{ destination.description || 'No description available for this destination.' }}
        </p>

        <!-- Tags -->
        <div v-if="destination.tags && destination.tags.length > 0" class="flex flex-wrap gap-2">
          <span
            v-for="tag in destination.tags"
            :key="tag"
            class="px-3 py-1.5 bg-cream text-slate-700 text-[12px] font-semibold rounded-full border border-weather-border"
          >
            {{ tag }}
          </span>
        </div>
      </section>

      <button
        @click="addToTrip"
        class="w-full rounded-2xl bg-gradient-to-r from-green-900 to-green-800 px-6 py-5 text-lg font-semibold text-white shadow-lg transition hover:opacity-95"
      >
        Add to Trip
      </button>

      <AddToTripModal
        :open="showAddToTripModal"
        :destination="destination"
        @close="showAddToTripModal = false"
      />
    </div>
  </main>
  <main v-else class="min-h-screen bg-cream flex items-center justify-center">
    <div class="text-center">
      <p class="text-slate-500 text-[16px]">Loading destination...</p>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { ExploreDestination } from '@/modules/explore/components/DestinationCard.vue'
import { useExploreStore } from '@/modules/explore/store/explore'
import AddToTripModal from '@/modules/itinerary/components/AddToTripModal.vue'

const route = useRoute()
const router = useRouter()
const exploreStore = useExploreStore()
const showAddToTripModal = ref(false)

const destination = ref<ExploreDestination | null>(null)
const isFavorited = ref(false)

onMounted(async () => {
  const destinationId = route.params.id as string

  // Load from store or fetch
  if (exploreStore.destinations.length === 0) {
    await exploreStore.loadDestinations()
  }

  const found = exploreStore.destinations.find((d) => d.id === destinationId)
  if (found) {
    destination.value = found
  } else {
    router.push('/explore')
  }
})

const durationLabel = computed(() => {
  if (!destination.value) return null
  const { duration_min, duration_max } = destination.value
  if (duration_min == null && duration_max == null) return null
  if (duration_min === duration_max) return `${duration_min} day${duration_min !== 1 ? 's' : ''}`
  if (duration_min != null && duration_max != null) return `${duration_min}–${duration_max} days`
  return `${duration_min ?? duration_max} days`
})

const budgetLabel = computed(() => {
  if (!destination.value) return null
  const { budget_min, budget_max } = destination.value
  if (budget_min == null && budget_max == null) return null
  if (budget_min === budget_max) return `$${budget_min}/day`
  if (budget_min != null && budget_max != null) return `$${budget_min}–${budget_max}/day`
  return `$${budget_min ?? budget_max}/day`
})

function shareDestination() {
  if (navigator.share && destination.value) {
    navigator
      .share({
        title: destination.value.name,
        text: destination.value.description,
        url: window.location.href,
      })
      .catch(() => {})
  }
}

function addToTrip() {
  showAddToTripModal.value = true
  // console.log('Add to trip:', destination.value?.name)
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
