<template>
  <div class="p-6">
    <div class="mb-6 flex items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Trip Budget</h1>
        <p class="mt-1 text-sm text-slate-500">
          Automatically calculated from itinerary item costs.
        </p>
      </div>

      <button
        type="button"
        class="rounded-full bg-gray-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
        @click="router.back()"
      >
        Back
      </button>
    </div>

    <p
      v-if="errorMessage"
      class="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ errorMessage }}
    </p>

    <div v-if="itinerary" class="space-y-6">
      <section class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-semibold text-slate-500">Trip</p>
        <h2 class="mt-1 text-xl font-bold text-gray-900">
          {{ itinerary.trip?.title || 'Untitled Trip' }}
        </h2>
      </section>

      <section class="grid gap-4 md:grid-cols-4">
        <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p class="text-sm font-semibold text-slate-500">Total Budget</p>
          <p class="mt-2 text-3xl font-bold text-green-700">$ {{ totalBudget }}</p>
        </div>

        <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p class="text-sm font-semibold text-slate-500">Days</p>
          <p class="mt-2 text-3xl font-bold text-gray-900">{{ totalDays }}</p>
        </div>

        <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p class="text-sm font-semibold text-slate-500">Paid Items</p>
          <p class="mt-2 text-3xl font-bold text-gray-900">{{ paidItems.length }}</p>
        </div>

        <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p class="text-sm font-semibold text-slate-500">Average / Day</p>
          <p class="mt-2 text-3xl font-bold text-gray-900">$ {{ averagePerDay }}</p>
        </div>
      </section>

      <section class="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 class="mb-4 text-lg font-bold text-gray-900">Budget Breakdown</h2>

          <div v-if="breakdown.length" class="space-y-4">
            <div v-for="item in breakdown" :key="item.category">
              <div class="mb-2 flex items-center justify-between text-sm">
                <span class="font-semibold capitalize text-gray-700">
                  {{ item.category }}
                </span>
                <span class="font-bold text-gray-900">$ {{ item.total }}</span>
              </div>

              <div class="h-3 overflow-hidden rounded-full bg-gray-100">
                <div
                  class="h-full rounded-full bg-green-600"
                  :style="{ width: `${item.percent}%` }"
                ></div>
              </div>
            </div>
          </div>

          <p v-else class="rounded-xl border border-dashed border-gray-300 p-5 text-sm text-slate-500">
            No item costs found yet. Add costs to itinerary activities to calculate the budget.
          </p>
        </div>

        <div class="rounded-2xl border border-green-100 bg-green-50 p-5 shadow-sm">
          <h2 class="text-lg font-bold text-green-900">Budget Insight</h2>
          <p class="mt-3 text-sm leading-6 text-green-800">
            {{ budgetInsight }}
          </p>
        </div>
      </section>

      <section class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 class="mb-4 text-lg font-bold text-gray-900">Cost Items</h2>

        <div class="space-y-3">
          <div
            v-for="item in paidItems"
            :key="item.id"
            class="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3"
          >
            <div>
              <p class="font-semibold text-gray-900">{{ item.title }}</p>
              <p class="text-sm capitalize text-slate-500">{{ item.category || 'activity' }}</p>
            </div>

            <p class="font-bold text-green-700">$ {{ parseCost(item.cost) }}</p>
          </div>
        </div>
      </section>
    </div>

    <p v-else class="rounded-xl border border-gray-200 bg-white p-5 text-sm text-slate-500">
      Loading budget...
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getItinerary } from '../../itinerary/services/itinerary.service'
import type { ItineraryResponse, ItineraryItem } from '../../itinerary/types/itineraryItem.types'

const route = useRoute()
const router = useRouter()

const tripId = route.query.tripId as string
const itinerary = ref<ItineraryResponse | null>(null)
const errorMessage = ref('')

const parseCost = (cost?: string | null) => {
  if (!cost) return 0
  const number = Number(String(cost).replace(/[^0-9.]/g, ''))
  return Number.isNaN(number) ? 0 : number
}

const allItems = computed<ItineraryItem[]>(() => {
  const days = itinerary.value?.days || []

  return days.reduce<ItineraryItem[]>((items, day) => {
    return items.concat(day.items || [])
  }, [])
})

const paidItems = computed(() => {
  return allItems.value.filter((item) => parseCost(item.cost) > 0)
})

const totalBudget = computed(() => {
  return paidItems.value.reduce((total, item) => total + parseCost(item.cost), 0)
})

const totalDays = computed(() => {
  return itinerary.value?.days.length || 0
})

const averagePerDay = computed(() => {
  if (!totalDays.value) return 0
  return Number((totalBudget.value / totalDays.value).toFixed(2))
})

const breakdown = computed(() => {
  const grouped: Record<string, number> = {}

  paidItems.value.forEach((item) => {
    const category = item.category || 'other'
    grouped[category] = (grouped[category] || 0) + parseCost(item.cost)
  })

  return Object.entries(grouped).map(([category, total]) => ({
    category,
    total,
    percent: totalBudget.value ? Math.round((total / totalBudget.value) * 100) : 0,
  }))
})

const budgetInsight = computed(() => {
  if (totalBudget.value === 0) {
    return 'No budget has been calculated yet. Add costs to itinerary items to get a trip estimate.'
  }

  if (totalBudget.value <= 100) {
    return 'This looks like a budget-friendly trip. It is suitable for short local travel, shared transport, and simple food options.'
  }

  if (totalBudget.value <= 300) {
    return 'This is a moderate-budget trip. You have room for comfortable transport, meals, and some paid activities.'
  }

  return 'This is a higher-budget trip. Consider reviewing hotel, transport, and activity costs if you want to reduce expenses.'
})

onMounted(async () => {
  if (!tripId) {
    errorMessage.value = 'No trip selected. Please open Budget from an itinerary page.'
    return
  }

  try {
    itinerary.value = await getItinerary(tripId)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Failed to load budget.'
  }
})
</script>
