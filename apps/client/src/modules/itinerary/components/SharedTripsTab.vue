<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { getSharedTrips, type Trip } from '../services/itinerary.service'
import TripCard from './TripCard.vue'

withDefaults(
  defineProps<{
    emptyActionLabel?: string
  }>(),
  {
    emptyActionLabel: 'Manage My Trips',
  },
)

const emit = defineEmits<{
  emptyAction: []
}>()

const trips = ref<Trip[]>([])
const isLoading = ref(true)
const errorMessage = ref('')

const hasTrips = computed(() => trips.value.length > 0)

const loadSharedTrips = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    trips.value = await getSharedTrips()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Failed to load shared trips.'
  } finally {
    isLoading.value = false
  }
}

onMounted(loadSharedTrips)
</script>

<template>
  <section>
    <p
      v-if="errorMessage"
      class="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ errorMessage }}
    </p>

    <div
      v-if="isLoading"
      class="rounded-2xl border border-weather-border bg-white p-6 text-sm text-slate-500 shadow-sm"
    >
      Loading shared trips...
    </div>

    <div v-else-if="hasTrips" class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <TripCard v-for="trip in trips" :key="trip.id" :trip="trip" variant="shared" />
    </div>

    <section
      v-else
      class="rounded-2xl border border-weather-border bg-white p-8 text-center shadow-sm"
    >
      <h2 class="m-0 text-[20px] font-bold text-slate-800">No shared trips yet</h2>
      <p class="mx-auto mt-2 max-w-md text-[14px] leading-6 text-slate-500">
        Public trips will appear here when travelers choose to share their itinerary.
      </p>
      <button
        type="button"
        class="mt-5 inline-flex items-center justify-center rounded-xl bg-sidebar-active px-4 py-2.5 text-[14px] font-semibold text-white transition hover:bg-sidebar-active/90"
        @click="emit('emptyAction')"
      >
        {{ emptyActionLabel }}
      </button>
    </section>
  </section>
</template>
