<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SavedTripsTab from '../components/SavedTripsTab.vue'
import SharedTripsTab from '../components/SharedTripsTab.vue'
import TripPlannerTab from '../components/TripPlannerTab.vue'
import TripsTabs, { type TripsTab } from '../components/TripsTabs.vue'

const route = useRoute()
const router = useRouter()

const activeTab = computed<TripsTab>(() => {
  const tab = route.query.tab

  if (tab === 'planner' || tab === 'shared') {
    return tab
  }

  return 'saved'
})

const tabs: { id: TripsTab; label: string }[] = [
  { id: 'saved', label: 'My Trips' },
  { id: 'planner', label: 'Trip Planner' },
  { id: 'shared', label: 'Shared Trips' },
]

const selectTab = (tab: TripsTab) => {
  router.push({
    path: '/trips',
    query: tab === 'saved' ? undefined : { tab },
  })
}
</script>

<template>
  <main class="min-h-full bg-cream">
    <div class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="m-0 text-[28px] font-bold text-slate-800">My Trips</h1>
          <p class="mt-2 text-[14px] text-slate-500">
            Plan a new adventure, manage saved trips, and browse shared itineraries.
          </p>
        </div>
      </div>

      <TripsTabs :active-tab="activeTab" :tabs="tabs" @select="selectTab" />

      <SavedTripsTab v-if="activeTab === 'saved'" @start-planning="selectTab('planner')" />
      <TripPlannerTab v-else-if="activeTab === 'planner'" />
      <SharedTripsTab v-else @empty-action="selectTab('saved')" />
    </div>
  </main>
</template>
