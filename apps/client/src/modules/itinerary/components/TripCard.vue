<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { Trip } from '../services/itinerary.service'

withDefaults(
  defineProps<{
    trip: Trip
    variant?: 'saved' | 'shared'
    isUpdating?: boolean
  }>(),
  {
    variant: 'saved',
    isUpdating: false,
  },
)

const emit = defineEmits<{
  toggleVisibility: [trip: Trip]
}>()

const formatDate = (value?: string, fallback = 'Recently created') => {
  if (!value) return fallback

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

const isPublicTrip = (trip: Trip) => trip.visibility === 'public'
</script>

<template>
  <article
    class="rounded-2xl border border-weather-border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
  >
    <div class="mb-5">
      <p class="mb-2 text-[12px] font-semibold uppercase tracking-wide text-slate-400">
        {{
          formatDate(trip.created_at, variant === 'shared' ? 'Recently shared' : 'Recently created')
        }}
      </p>
      <span
        :class="[
          'mb-3 inline-flex rounded-full px-2.5 py-1 text-[12px] font-semibold',
          isPublicTrip(trip) ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600',
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

    <div v-if="variant === 'saved'" class="grid grid-cols-1 gap-2 sm:grid-cols-2">
      <button
        type="button"
        :disabled="isUpdating"
        class="inline-flex items-center justify-center rounded-xl border border-weather-border bg-white px-4 py-2.5 text-[14px] font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
        @click="emit('toggleVisibility', trip)"
      >
        {{ isUpdating ? 'Updating...' : isPublicTrip(trip) ? 'Make Private' : 'Make Public' }}
      </button>

      <RouterLink
        :to="`/trips/${encodeURIComponent(trip.id)}`"
        class="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-[14px] font-semibold text-white transition hover:bg-slate-800"
      >
        View Itinerary
      </RouterLink>
    </div>

    <RouterLink
      v-else
      :to="`/trips/${encodeURIComponent(trip.id)}`"
      class="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-[14px] font-semibold text-white transition hover:bg-slate-800"
    >
      View Public Itinerary
    </RouterLink>
  </article>
</template>
