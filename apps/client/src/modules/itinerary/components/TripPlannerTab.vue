<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useItineraryStore } from '../stores/itineraryStore'
import { createTrip, createDay, createItem } from '../services/itinerary.service'
import { curatedTripPlans, type CuratedTripPlan, type CuratedTripItem } from '../data'

const router = useRouter()
const itineraryStore = useItineraryStore()

const selectedProvince = ref('Kampot')
const travelDays = ref<number>(2)
const budget = ref<number>(150)
const suggestionIndex = ref(0)
const isCreatingTrip = ref(false)
const plannerErrorMessage = ref('')

const provinces = computed(() => {
  return [...new Set(curatedTripPlans.map((plan) => plan.province))].sort()
})

const provincePlans = computed(() => {
  return curatedTripPlans.filter((plan) => plan.province === selectedProvince.value)
})

const selectedPlan = computed<CuratedTripPlan>(() => {
  const plans = provincePlans.value.length ? provincePlans.value : curatedTripPlans
  return plans[suggestionIndex.value % plans.length] as CuratedTripPlan
})

const normalizedItinerary = computed(() => {
  return normalizePlanDays(selectedPlan.value, travelDays.value)
})

const estimatedTotal = computed(() => {
  return normalizedItinerary.value.reduce((sum, day) => sum + day.reduce((daySum, item) => daySum + item.cost, 0), 0)
})

const remainingBudget = computed(() => budget.value - estimatedTotal.value)

const budgetStatus = computed(() => {
  return estimatedTotal.value <= budget.value ? 'Within budget' : 'Over budget'
})

const plannerSummary = computed(() => {
  if (budgetStatus.value === 'Within budget') {
    return `This ${travelDays.value}-day ${selectedProvince.value} suggestion fits your $${budget.value} budget.`
  }

  return `This plan is above your $${budget.value} budget, but you can still create it and edit costs later.`
})

watch([selectedProvince, travelDays, budget], () => {
  suggestionIndex.value = 0
})

function refreshSuggestion() {
  if (!provincePlans.value.length) return
  suggestionIndex.value = (suggestionIndex.value + 1) % provincePlans.value.length
}

function makeFlexibleDay(province: string, dayNumber: number): CuratedTripItem[] {
  return [
    {
      time: '09:00 AM',
      title: `Slow morning in ${province}`,
      category: 'rest',
      duration: '2 hours',
      cost: 5,
      notes: 'Flexible cafe, local walk, or rest time.',
    },
    {
      time: '12:30 PM',
      title: `Local lunch in ${province}`,
      category: 'food',
      duration: '1 hour',
      cost: 10,
      notes: 'Simple local meal estimate.',
    },
    {
      time: '03:00 PM',
      title: `Free exploration day ${dayNumber}`,
      category: 'activity',
      duration: '2 hours',
      cost: 10,
      notes: 'Open time for extra sightseeing or shopping.',
    },
  ]
}

function normalizePlanDays(plan: CuratedTripPlan, days: number): CuratedTripItem[][] {
  const itinerary = plan.itinerary.slice(0, days)

  while (itinerary.length < days) {
    itinerary.push(makeFlexibleDay(plan.province, itinerary.length + 1))
  }

  return itinerary
}

async function createSelectedPlan() {
  if (!selectedPlan.value) {
    plannerErrorMessage.value = 'No trip plan selected.'
    return
  }

  isCreatingTrip.value = true
  plannerErrorMessage.value = ''

  try {
    const trip = await createTrip({
      title: `${selectedPlan.value.province} ${travelDays.value}-Day Trip`,
      description: `${selectedPlan.value.description} Estimated budget: $${estimatedTotal.value}.`,
    })

    itineraryStore.setCurrentTripId(trip.id)

    for (let dayIndex = 0; dayIndex < normalizedItinerary.value.length; dayIndex++) {
      const dayItems = normalizedItinerary.value[dayIndex] || []
      const day = await createDay(trip.id, `Day ${dayIndex + 1}`)

      for (let itemIndex = 0; itemIndex < dayItems.length; itemIndex++) {
        const item = dayItems[itemIndex]
        if (!item) continue

        await createItem(day.id, {
          title: item.title,
          destination_id: null,
          time: item.time,
          category: item.category,
          duration: item.duration,
          cost: `$${item.cost}`,
          notes: item.notes,
          position: itemIndex,
        })
      }
    }

    await router.push(`/trips/${encodeURIComponent(trip.id)}`)
  } catch (error) {
    plannerErrorMessage.value =
      error instanceof Error ? error.message : 'Failed to create suggested trip.'
  } finally {
    isCreatingTrip.value = false
  }
}
</script>

<template>
  <section>
    <p
      v-if="plannerErrorMessage"
      class="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ plannerErrorMessage }}
    </p>

    <section class="overflow-hidden rounded-3xl border border-weather-border bg-white shadow-sm">
      <div class="bg-gradient-to-r from-green-50 to-sky-50 px-6 py-6">
        <p class="text-[12px] font-bold uppercase tracking-wide text-green-700">
          Smart Trip Planner
        </p>
        <h2 class="mt-1 text-[26px] font-bold text-slate-900">
          Choose your budget. We suggest the trip.
        </h2>
        <p class="mt-2 max-w-2xl text-[14px] leading-6 text-slate-600">
          Select a province, days, and budget. Tos-Tov recommends a ready-made Cambodia itinerary
          with activities, meals, transport, hotels, and estimated costs.
        </p>
      </div>

      <div class="p-6">
        <div class="grid gap-4 md:grid-cols-3">
          <label>
            <span class="mb-1 block text-[13px] font-semibold text-slate-600">
              Destination Province
            </span>
            <select
              v-model="selectedProvince"
              class="w-full rounded-xl border border-weather-border px-4 py-3 text-[14px] focus:border-sidebar-active focus:outline-none"
            >
              <option v-for="province in provinces" :key="province" :value="province">
                {{ province }}
              </option>
            </select>
          </label>

          <label>
            <span class="mb-1 block text-[13px] font-semibold text-slate-600">Travel Days</span>
            <input
              v-model.number="travelDays"
              type="number"
              min="1"
              max="7"
              class="w-full rounded-xl border border-weather-border px-4 py-3 text-[14px] focus:border-sidebar-active focus:outline-none"
            />
          </label>

          <label>
            <span class="mb-1 block text-[13px] font-semibold text-slate-600">
              Total Budget ($)
            </span>
            <input
              v-model.number="budget"
              type="number"
              min="1"
              class="w-full rounded-xl border border-weather-border px-4 py-3 text-[14px] focus:border-sidebar-active focus:outline-none"
            />
          </label>
        </div>

        <div class="mt-6 rounded-2xl border border-green-100 bg-green-50 p-4">
          <p class="text-[14px] font-semibold text-green-900">{{ plannerSummary }}</p>
        </div>

        <div class="mt-6 grid gap-4 md:grid-cols-3">
          <div class="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <p class="text-[13px] font-semibold text-slate-600">Estimated Cost</p>
            <p class="mt-1 text-[28px] font-bold text-green-700">$ {{ estimatedTotal }}</p>
          </div>

          <div class="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <p class="text-[13px] font-semibold text-slate-600">Budget Status</p>
            <p
              class="mt-1 text-[22px] font-bold"
              :class="budgetStatus === 'Within budget' ? 'text-green-700' : 'text-red-600'"
            >
              {{ budgetStatus }}
            </p>
          </div>

          <div class="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <p class="text-[13px] font-semibold text-slate-600">Remaining</p>
            <p
              class="mt-1 text-[22px] font-bold"
              :class="remainingBudget >= 0 ? 'text-slate-800' : 'text-red-600'"
            >
              $ {{ remainingBudget }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <section
      v-if="selectedPlan"
      class="mt-8 overflow-hidden rounded-3xl border border-weather-border bg-white shadow-sm"
    >
      <div class="p-6">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p class="text-[12px] font-bold uppercase tracking-wide text-green-700">
              Recommended Plan
            </p>
            <h2 class="mt-1 text-[24px] font-bold text-slate-900">{{ selectedPlan.title }}</h2>
            <p class="mt-2 max-w-2xl text-[14px] leading-6 text-slate-600">
              {{ selectedPlan.description }}
            </p>
          </div>

          <div class="rounded-2xl bg-green-50 px-5 py-4 text-right">
            <p class="text-[13px] font-semibold text-green-700">{{ travelDays }} days</p>
            <p class="text-[24px] font-bold text-green-800">$ {{ estimatedTotal }}</p>
          </div>
        </div>

        <div class="mt-4 flex flex-wrap gap-2">
          <span
            v-for="highlight in selectedPlan.highlights"
            :key="highlight"
            class="rounded-full bg-slate-100 px-3 py-1 text-[12px] font-semibold text-slate-600"
          >
            {{ highlight }}
          </span>
        </div>

        <div class="mt-6 space-y-5">
          <article
            v-for="(dayItems, dayIndex) in normalizedItinerary"
            :key="dayIndex"
            class="rounded-2xl border border-slate-100 bg-slate-50 p-5"
          >
            <h3 class="mb-4 text-[18px] font-bold text-slate-800">Day {{ dayIndex + 1 }}</h3>

            <div class="space-y-3">
              <div
                v-for="item in dayItems"
                :key="`${item.time}-${item.title}`"
                class="flex items-start justify-between gap-4 rounded-xl bg-white px-4 py-3"
              >
                <div>
                  <p class="text-[13px] font-semibold capitalize text-slate-400">
                    {{ item.time }} · {{ item.category }}
                  </p>
                  <h4 class="mt-1 text-[15px] font-bold text-slate-800">{{ item.title }}</h4>
                  <p class="mt-1 text-[13px] text-slate-500">{{ item.notes }}</p>
                </div>

                <p class="shrink-0 rounded-full bg-green-50 px-3 py-1 text-[13px] font-bold text-green-700">
                  $ {{ item.cost }}
                </p>
              </div>
            </div>
          </article>
        </div>

        <div class="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            class="rounded-xl border border-weather-border bg-white px-4 py-3 text-[14px] font-bold text-slate-700 transition hover:bg-slate-50"
            @click="refreshSuggestion"
          >
            Refresh Suggestion
          </button>

          <button
            type="button"
            :disabled="isCreatingTrip"
            class="rounded-xl bg-sidebar-active px-4 py-3 text-[14px] font-bold text-white transition-colors hover:bg-sidebar-active/90 disabled:cursor-not-allowed disabled:opacity-60"
            @click="createSelectedPlan"
          >
            {{ isCreatingTrip ? 'Creating Trip...' : 'Create This Trip' }}
          </button>
        </div>
      </div>
    </section>
  </section>
</template>
