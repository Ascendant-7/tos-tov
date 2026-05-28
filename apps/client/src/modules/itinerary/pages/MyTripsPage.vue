<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import type { ExploreDestination } from '@/modules/explore/components/DestinationCard.vue'
import { useItineraryStore } from '@/modules/itinerary/stores/itineraryStore'
import {
  createTrip,
  getSharedTrips,
  getTrips,
  updateTrip,
  type Trip,
} from '../services/itinerary.service'

type TripsTab = 'saved' | 'planner' | 'shared'

const route = useRoute()
const router = useRouter()
const itineraryStore = useItineraryStore()

const trips = ref<Trip[]>([])
const sharedTrips = ref<Trip[]>([])
const isLoadingTrips = ref(false)
const isLoadingSharedTrips = ref(false)
const tripsLoaded = ref(false)
const sharedTripsLoaded = ref(false)
const tripsErrorMessage = ref('')
const sharedTripsErrorMessage = ref('')
const plannerErrorMessage = ref('')
const updatingTripId = ref<string | null>(null)

const tripName = ref('')
const tripDescription = ref('')
const isCreatingTrip = ref(false)

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

const hasTrips = computed(() => trips.value.length > 0)
const hasSharedTrips = computed(() => sharedTrips.value.length > 0)
const hasSelectedTrip = computed(() => !!itineraryStore.currentTripId)

const formatDate = (value?: string, fallback = 'Recently created') => {
  if (!value) return fallback

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

const selectTab = (tab: TripsTab) => {
  router.push({
    path: '/trips',
    query: tab === 'saved' ? undefined : { tab },
  })
}

const loadTrips = async () => {
  isLoadingTrips.value = true
  tripsErrorMessage.value = ''

  try {
    trips.value = await getTrips()
    tripsLoaded.value = true
  } catch (error) {
    tripsErrorMessage.value = error instanceof Error ? error.message : 'Failed to load trips.'
  } finally {
    isLoadingTrips.value = false
  }
}

const loadSharedTrips = async () => {
  isLoadingSharedTrips.value = true
  sharedTripsErrorMessage.value = ''

  try {
    sharedTrips.value = await getSharedTrips()
    sharedTripsLoaded.value = true
  } catch (error) {
    sharedTripsErrorMessage.value =
      error instanceof Error ? error.message : 'Failed to load shared trips.'
  } finally {
    isLoadingSharedTrips.value = false
  }
}

const isPublicTrip = (trip: Trip) => trip.visibility === 'public'

const toggleVisibility = async (trip: Trip) => {
  updatingTripId.value = trip.id
  tripsErrorMessage.value = ''

  try {
    const updated = await updateTrip(trip.id, {
      visibility: isPublicTrip(trip) ? 'private' : 'public',
    })

    const index = trips.value.findIndex((item) => item.id === trip.id)
    if (index !== -1) {
      trips.value[index] = updated
    }

    sharedTripsLoaded.value = false
  } catch (error) {
    tripsErrorMessage.value =
      error instanceof Error ? error.message : 'Failed to update trip visibility.'
  } finally {
    updatingTripId.value = null
  }
}

async function createAndNavigateToTrip() {
  if (!tripName.value.trim()) return

  isCreatingTrip.value = true
  plannerErrorMessage.value = ''

  try {
    const trip = await createTrip({
      title: tripName.value.trim(),
      description: tripDescription.value.trim() || undefined,
    })
    itineraryStore.setCurrentTripId(trip.id)
    tripsLoaded.value = false

    await router.push(`/trips/${encodeURIComponent(trip.id)}`)
  } catch (error) {
    plannerErrorMessage.value = error instanceof Error ? error.message : 'Failed to create trip.'
  } finally {
    isCreatingTrip.value = false
  }
}

function handleAddDestinationToDay(destination: ExploreDestination) {
  if (!destination.id) return

  if (itineraryStore.currentTripId) {
    router.push(
      `/trips/${encodeURIComponent(itineraryStore.currentTripId)}?addDestination=${destination.id}`,
    )
  } else {
    tripName.value = `Trip - ${destination.name}`
    createAndNavigateToTrip()
  }
}

function clearTrip() {
  itineraryStore.setCurrentTripId(undefined)
}

watch(
  activeTab,
  (tab) => {
    if (tab === 'saved' && !tripsLoaded.value) {
      loadTrips()
    }

    if (tab === 'shared' && !sharedTripsLoaded.value) {
      loadSharedTrips()
    }
  },
  { immediate: true },
)
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

        <!-- <RouterLink
          to="/explore"
          class="inline-flex items-center justify-center rounded-xl border border-weather-border bg-white px-4 py-2.5 text-[14px] font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Back to Explore
        </RouterLink> -->
      </div>

      <div class="mb-8 rounded-2xl border border-weather-border bg-white p-1 shadow-sm">
        <div class="grid grid-cols-3 gap-1">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            type="button"
            :class="[
              'min-h-11 rounded-xl px-3 text-[13px] font-semibold transition sm:text-[14px]',
              activeTab === tab.id
                ? 'bg-sidebar-active text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
            ]"
            @click="selectTab(tab.id)"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <section v-if="activeTab === 'saved'">
        <!-- <div class="mb-5 flex justify-end">
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-xl bg-sidebar-active px-4 py-2.5 text-[14px] font-semibold text-white transition hover:bg-sidebar-active/90"
            @click="selectTab('planner')"
          >
            New Trip
          </button>
        </div> -->

        <p
          v-if="tripsErrorMessage"
          class="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {{ tripsErrorMessage }}
        </p>

        <div
          v-if="isLoadingTrips"
          class="rounded-2xl border border-weather-border bg-white p-6 text-sm text-slate-500 shadow-sm"
        >
          Loading trips...
        </div>

        <div v-else-if="hasTrips" class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <article
            v-for="trip in trips"
            :key="trip.id"
            class="rounded-2xl border border-weather-border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div class="mb-5">
              <p class="mb-2 text-[12px] font-semibold uppercase tracking-wide text-slate-400">
                {{ formatDate(trip.created_at) }}
              </p>
              <span
                :class="[
                  'mb-3 inline-flex rounded-full px-2.5 py-1 text-[12px] font-semibold',
                  isPublicTrip(trip)
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-slate-100 text-slate-600',
                ]"
              >
                {{ isPublicTrip(trip) ? 'Public' : 'Private' }}
              </span>
              <h2 class="m-0 text-[20px] font-bold text-slate-800">
                {{ trip.title }}
              </h2>
              <p class="mt-2 line-clamp-2 text-[14px] leading-6 text-slate-500">
                {{ trip.description || 'No description yet.' }}
              </p>
            </div>

            <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <button
                type="button"
                :disabled="updatingTripId === trip.id"
                class="inline-flex items-center justify-center rounded-xl border border-weather-border bg-white px-4 py-2.5 text-[14px] font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                @click="toggleVisibility(trip)"
              >
                {{
                  updatingTripId === trip.id
                    ? 'Updating...'
                    : isPublicTrip(trip)
                      ? 'Make Private'
                      : 'Make Public'
                }}
              </button>

              <RouterLink
                :to="`/trips/${encodeURIComponent(trip.id)}`"
                class="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-[14px] font-semibold text-white transition hover:bg-slate-800"
              >
                View Itinerary
              </RouterLink>
            </div>
          </article>
        </div>

        <section
          v-else
          class="rounded-2xl border border-weather-border bg-white p-8 text-center shadow-sm"
        >
          <h2 class="m-0 text-[20px] font-bold text-slate-800">No trips yet</h2>
          <p class="mx-auto mt-2 max-w-md text-[14px] leading-6 text-slate-500">
            Create a trip from the planner or add a destination from Explore to start building your
            first itinerary.
          </p>
          <button
            type="button"
            class="mt-5 inline-flex items-center justify-center rounded-xl bg-sidebar-active px-4 py-2.5 text-[14px] font-semibold text-white transition hover:bg-sidebar-active/90"
            @click="selectTab('planner')"
          >
            Start Planning
          </button>
        </section>
      </section>

      <section v-else-if="activeTab === 'planner'">
        <p
          v-if="plannerErrorMessage"
          class="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {{ plannerErrorMessage }}
        </p>

        <section
          v-if="itineraryStore.hasPendingDestinations"
          class="mb-8 rounded-2xl border border-weather-border bg-white p-6 shadow-sm"
        >
          <h2 class="mb-4 text-[20px] font-bold text-slate-800">Destinations to Add</h2>
          <div class="space-y-3">
            <div
              v-for="dest in itineraryStore.pendingDestinations"
              :key="dest.id"
              class="flex items-center justify-between gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4"
            >
              <div class="min-w-0">
                <h3 class="text-[15px] font-bold text-slate-800">{{ dest.name }}</h3>
                <p class="mt-1 text-[13px] text-slate-600">
                  {{ dest.location_name || dest.province }}
                </p>
              </div>
              <div class="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  class="rounded-lg bg-sidebar-active px-3 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-sidebar-active/90"
                  @click="handleAddDestinationToDay(dest)"
                >
                  Add to Day
                </button>
                <button
                  type="button"
                  class="rounded-lg bg-slate-200 px-3 py-1.5 text-[13px] font-medium text-slate-600 transition-colors hover:bg-slate-300"
                  @click="dest.id && itineraryStore.removePendingDestination(dest.id)"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </section>

        <section
          v-if="!hasSelectedTrip"
          class="rounded-2xl border border-weather-border bg-white p-6 shadow-sm"
        >
          <h2 class="mb-4 text-[20px] font-bold text-slate-800">Create New Trip</h2>
          <div class="space-y-3">
            <input
              v-model="tripName"
              type="text"
              placeholder="Enter trip name (e.g., Summer 2026)"
              class="w-full rounded-xl border border-weather-border px-4 py-3 text-[14px] focus:border-sidebar-active focus:outline-none"
            />
            <input
              v-model="tripDescription"
              type="text"
              placeholder="Trip description (optional)"
              class="w-full rounded-xl border border-weather-border px-4 py-3 text-[14px] focus:border-sidebar-active focus:outline-none"
            />
            <button
              type="button"
              :disabled="!tripName.trim() || isCreatingTrip"
              class="w-full rounded-xl bg-sidebar-active px-4 py-3 text-[14px] font-bold text-white transition-colors hover:bg-sidebar-active/90 disabled:cursor-not-allowed disabled:opacity-60"
              @click="createAndNavigateToTrip"
            >
              {{ isCreatingTrip ? 'Creating Trip...' : 'Create Trip' }}
            </button>
          </div>
        </section>

        <section v-else class="rounded-2xl border border-weather-border bg-white p-6 shadow-sm">
          <div class="mb-4 flex items-center justify-between gap-3">
            <h2 class="text-[20px] font-bold text-slate-800">Current Trip</h2>
            <button
              type="button"
              class="text-[13px] font-medium text-slate-500 hover:text-slate-700"
              @click="clearTrip"
            >
              Change Trip
            </button>
          </div>
          <div class="rounded-xl border border-weather-border bg-slate-50 p-4">
            <p class="text-[15px] font-bold text-slate-800">
              {{ itineraryStore.currentTripId }}
            </p>
            <p class="mt-1 text-[13px] text-slate-500">Ready to add destinations to this trip</p>
          </div>
        </section>
      </section>

      <section v-else>
        <p
          v-if="sharedTripsErrorMessage"
          class="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {{ sharedTripsErrorMessage }}
        </p>

        <div
          v-if="isLoadingSharedTrips"
          class="rounded-2xl border border-weather-border bg-white p-6 text-sm text-slate-500 shadow-sm"
        >
          Loading shared trips...
        </div>

        <div v-else-if="hasSharedTrips" class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <article
            v-for="trip in sharedTrips"
            :key="trip.id"
            class="rounded-2xl border border-weather-border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div class="mb-5">
              <p class="mb-2 text-[12px] font-semibold uppercase tracking-wide text-slate-400">
                {{ formatDate(trip.created_at, 'Recently shared') }}
              </p>
              <span
                class="mb-3 inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-[12px] font-semibold text-emerald-700"
              >
                Public
              </span>
              <h2 class="m-0 text-[20px] font-bold text-slate-800">
                {{ trip.title }}
              </h2>
              <p class="mt-2 line-clamp-2 text-[14px] leading-6 text-slate-500">
                {{ trip.description || 'No description yet.' }}
              </p>
            </div>

            <RouterLink
              :to="`/trips/${encodeURIComponent(trip.id)}`"
              class="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-[14px] font-semibold text-white transition hover:bg-slate-800"
            >
              View Public Itinerary
            </RouterLink>
          </article>
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
            @click="selectTab('saved')"
          >
            Manage My Trips
          </button>
        </section>
      </section>
    </div>
  </main>
</template>
