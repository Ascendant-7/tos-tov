<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { curatedTripPlans, type CuratedTripPlan } from '../data'
import { createTrip, createDay, createItem } from '../services/itinerary.service'
import { useItineraryStore } from '../stores/itineraryStore'

const router = useRouter()
const itineraryStore = useItineraryStore()
const isCreatingTrip = ref(false)
const errorMessage = ref('')

async function useSharedPlan(plan: CuratedTripPlan) {
  isCreatingTrip.value = true
  errorMessage.value = ''

  try {
    const trip = await createTrip({
      title: plan.title,
      description: `${plan.description} Estimated budget: $${plan.budget}.`,
    })

    itineraryStore.setCurrentTripId(trip.id)

    for (let dayIndex = 0; dayIndex < plan.itinerary.length; dayIndex++) {
      const dayItems = plan.itinerary[dayIndex] || []
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
    errorMessage.value = error instanceof Error ? error.message : 'Failed to use shared trip.'
  } finally {
    isCreatingTrip.value = false
  }
}
</script>

<template>
  <section>
    <p
      v-if="errorMessage"
      class="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ errorMessage }}
    </p>

    <div class="mb-6 rounded-2xl border border-weather-border bg-white p-6 shadow-sm">
      <p class="text-[12px] font-bold uppercase tracking-wide text-green-700">Shared Trip Ideas</p>
      <h2 class="mt-1 text-[24px] font-bold text-slate-900">Ready-made Cambodia trips</h2>
      <p class="mt-2 text-[14px] leading-6 text-slate-500">
        Browse sample public trips inspired by travel-guide style itineraries. Each plan includes
        days, activities, food, hotel, transport, and estimated cost.
      </p>
    </div>

    <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <article
        v-for="plan in curatedTripPlans"
        :key="plan.id"
        class="overflow-hidden rounded-3xl border border-weather-border bg-white shadow-sm"
      >
        <div class="border-b border-slate-100 bg-gradient-to-r from-green-50 to-sky-50 p-5">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-[12px] font-bold uppercase tracking-wide text-green-700">
                {{ plan.province }} · {{ plan.baseDays }} days
              </p>
              <h3 class="mt-1 text-[20px] font-bold text-slate-900">{{ plan.title }}</h3>
              <p class="mt-2 text-[14px] leading-6 text-slate-600">{{ plan.description }}</p>
            </div>

            <div class="shrink-0 rounded-2xl bg-white px-4 py-3 text-right shadow-sm">
              <p class="text-[12px] font-semibold text-slate-500">Budget</p>
              <p class="text-[22px] font-bold text-green-700">$ {{ plan.budget }}</p>
            </div>
          </div>

          <div class="mt-4 flex flex-wrap gap-2">
            <span
              v-for="highlight in plan.highlights"
              :key="highlight"
              class="rounded-full bg-white px-3 py-1 text-[12px] font-semibold text-slate-600"
            >
              {{ highlight }}
            </span>
          </div>
        </div>

        <div class="p-5">
          <div class="space-y-4">
            <div
              v-for="(dayItems, dayIndex) in plan.itinerary"
              :key="dayIndex"
              class="rounded-2xl border border-slate-100 bg-slate-50 p-4"
            >
              <h4 class="mb-3 text-[15px] font-bold text-slate-800">Day {{ dayIndex + 1 }}</h4>

              <div class="space-y-2">
                <div
                  v-for="item in dayItems.slice(0, 3)"
                  :key="`${item.time}-${item.title}`"
                  class="flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2"
                >
                  <div class="min-w-0">
                    <p class="truncate text-[13px] font-bold text-slate-800">{{ item.title }}</p>
                    <p class="text-[12px] capitalize text-slate-500">
                      {{ item.time }} · {{ item.category }}
                    </p>
                  </div>

                  <p class="shrink-0 text-[13px] font-bold text-green-700">$ {{ item.cost }}</p>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            :disabled="isCreatingTrip"
            class="mt-5 w-full rounded-xl bg-sidebar-active px-4 py-3 text-[14px] font-bold text-white transition-colors hover:bg-sidebar-active/90 disabled:opacity-60"
            @click="useSharedPlan(plan)"
          >
            {{ isCreatingTrip ? 'Creating Trip...' : 'Use This Trip Plan' }}
          </button>
        </div>
      </article>
    </div>
  </section>
</template>
