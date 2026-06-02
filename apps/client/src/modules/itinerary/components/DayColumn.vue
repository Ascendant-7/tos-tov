<script setup lang="ts">
import { computed, ref } from 'vue'
import ActivityCard from './ActivityCard.vue'
import AddActivityModal from './AddActivityModal.vue'
import { createItem, updateItem, deleteItem } from '../services/itinerary.service'

const props = defineProps<{
  day: any
  isEditing?: boolean
}>()

interface RouteStop {
  id: string
  stopNumber: number
  title: string
  category: string
  time: string
  isLast: boolean
}

const showModal = ref(false)
const showRouteDetails = ref(false)
const editingItem = ref<any>(null)
const isLoading = ref(false)
const errorMessage = ref('')

const parseDurationMinutes = (duration?: string | null) => {
  if (!duration) return 0

  const hourMatch = duration.match(/(\d+(?:\.\d+)?)\s*(?:h|hr|hour)/i)
  const minuteMatch = duration.match(/(\d+)\s*(?:m|min|minute)/i)
  const plainNumberMatch = duration.match(/^(\d+)$/)

  const hours = hourMatch ? Number(hourMatch[1]) * 60 : 0
  const minutes = minuteMatch ? Number(minuteMatch[1]) : 0

  if (!hours && !minutes && plainNumberMatch) {
    return Number(plainNumberMatch[1])
  }

  return Math.round(hours + minutes)
}

const formatMinutes = (minutes: number) => {
  if (minutes <= 0) return 'No duration set'
  if (minutes < 60) return `${minutes} min`

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  return remainingMinutes ? `${hours}h ${remainingMinutes}m` : `${hours}h`
}

const getTimeMinutes = (time?: string | null) => {
  if (!time) return null

  const match = time.match(/(\d{1,2}):(\d{2})(?:\s*(AM|PM))?/i)
  if (!match) return null

  let hours = Number(match[1])
  const minutes = Number(match[2])
  const meridiem = match[3]?.toUpperCase()

  if (meridiem === 'PM' && hours < 12) hours += 12
  if (meridiem === 'AM' && hours === 12) hours = 0

  return hours * 60 + minutes
}

const routeIntel = computed(() => {
  const items = props.day.items || []
  const totalDuration = items.reduce(
    (total: number, item: any) => total + parseDurationMinutes(item.duration),
    0,
  )
  const timedItems = items.filter((item: any) => getTimeMinutes(item.time) !== null)
  const hasUnusualMidnightTime = items.some((item: any) => /12:\d{2}\s*AM/i.test(item.time || ''))
  const hasLongTransfer = items.some((item: any) => parseDurationMinutes(item.duration) >= 180)

  let pacing = 'Easy'
  if (items.length >= 5 || totalDuration >= 480) {
    pacing = 'Heavy'
  } else if (items.length >= 3 || totalDuration >= 240) {
    pacing = 'Balanced'
  }

  const recommendation =
    pacing === 'Heavy'
      ? 'Consider moving one stop to another day.'
      : pacing === 'Balanced'
        ? 'This day is workable with a little buffer between stops.'
        : 'This day has room for one more light stop.'

  const warning = hasUnusualMidnightTime
    ? 'A midnight time appears in this day. Check if AM/PM is correct.'
    : hasLongTransfer
      ? 'One activity has a long travel block. Keep the next stop flexible.'
      : timedItems.length < items.length
        ? 'Some stops do not have a time yet, so pacing is estimated.'
        : 'No major timing issues detected.'

  return {
    pacing,
    recommendation,
    warning,
    movementLabel: formatMinutes(totalDuration),
    transport:
      hasLongTransfer || totalDuration >= 180
        ? 'Train or car'
        : items.length > 2
          ? 'Tuk-tuk or taxi'
          : 'Walk or short ride',
  }
})

const routeLinks = computed(() =>
  (props.day.items || []).slice(0, -1).map((item: any, index: number) => {
    const nextItem = props.day.items[index + 1]
    const currentTime = getTimeMinutes(item.time)
    const nextTime = getTimeMinutes(nextItem?.time)
    const gap = currentTime !== null && nextTime !== null ? nextTime - currentTime : null

    const gapLabel =
      gap === null || gap <= 0 ? 'Timing needs review' : `${formatMinutes(gap)} between stops`

    const note =
      gap !== null && gap > 180
        ? 'Large gap. Good moment for rest, check-in, or travel.'
        : gap !== null && gap < 45
          ? 'Tight move. Keep transport ready.'
          : 'Comfortable transfer window.'

    return {
      key: `${item.id}-${nextItem?.id || index}`,
      label: `${item.title || 'Stop'} -> ${nextItem?.title || 'Next stop'}`,
      gapLabel,
      note,
    }
  }),
)

const routeStops = computed<RouteStop[]>(() =>
  (props.day.items || []).map((item: any, index: number) => ({
    id: item.id || `${props.day.id}-${index}`,
    stopNumber: index + 1,
    title: item.title || `Stop ${index + 1}`,
    category: item.category || 'activity',
    time: item.time || 'Time not set',
    isLast: index === (props.day.items || []).length - 1,
  })),
)

const handleAdd = async (item: any) => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    if (editingItem.value) {
      // Update existing item
      const updated = await updateItem(item.id, item)
      const index = props.day.items.findIndex((i: any) => i.id === item.id)
      props.day.items[index] = updated
      editingItem.value = null
    } else {
      // Create new item
      const created = await createItem(props.day.id, item)
      props.day.items.push(created)
    }
    showModal.value = false
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Failed to save activity'
  } finally {
    isLoading.value = false
  }
}

const handleDelete = async (id: string) => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    await deleteItem(id)
    props.day.items = props.day.items.filter((item: any) => item.id !== id)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Failed to delete activity'
  } finally {
    isLoading.value = false
  }
}

const handleEdit = (item: any) => {
  editingItem.value = item
  showModal.value = true
}

const handleCloseModal = () => {
  showModal.value = false
  editingItem.value = null
}

const handleCloseRouteDetails = () => {
  showRouteDetails.value = false
}
</script>

<template>
  <div class="mb-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
    <div class="mb-6 flex items-center justify-between gap-5">
      <div class="flex min-w-0 items-center gap-4">
        <div
          class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-green-600 text-xl font-bold leading-none text-white shadow-sm"
        >
          {{ day.day_number }}
        </div>

        <div class="min-w-0">
          <h2 class="text-lg font-bold leading-none text-gray-900">Day {{ day.day_number }}</h2>
          <p class="mt-1 truncate text-sm leading-5 text-gray-400">
            {{
              day.title || (day.items[0]?.title ? `Arrival in ${day.items[0].title}` : 'Trip day')
            }}
          </p>
        </div>
      </div>

      <div class="flex shrink-0 items-center gap-3">
        <span class="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-600">
          {{ day.items.length }} stops
        </span>

        <button
          v-if="isEditing"
          class="rounded-full bg-blue-600 px-4 py-1.5 text-sm font-semibold text-white transition duration-200 ease-in-out hover:bg-blue-700 disabled:opacity-50"
          :disabled="isLoading"
          @click="showModal = true"
        >
          {{ isLoading ? 'Loading...' : 'Add Activity' }}
        </button>
      </div>
    </div>

    <div
      v-if="errorMessage"
      class="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
    >
      {{ errorMessage }}
    </div>

    <section v-if="day.items.length" class="mb-6 rounded-xl border border-sky-100 bg-sky-50/70 p-4">
      <div class="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-[11px] font-bold uppercase tracking-wide text-sky-600">Route Intel</p>
          <h3 class="mt-1 text-base font-bold text-gray-900">{{ routeIntel.pacing }} day pacing</h3>
        </div>

        <div class="flex flex-wrap gap-2 text-xs font-semibold text-gray-700">
          <span class="rounded-full bg-white px-3 py-1 shadow-sm">
            {{ routeIntel.movementLabel }}
          </span>
          <span class="rounded-full bg-white px-3 py-1 shadow-sm">
            {{ routeIntel.transport }}
          </span>
        </div>
      </div>

      <div class="grid gap-3 md:grid-cols-2">
        <div class="rounded-lg bg-white/80 px-3 py-2">
          <p class="text-xs font-bold text-gray-500">Suggestion</p>
          <p class="mt-1 text-sm font-medium leading-5 text-gray-800">
            {{ routeIntel.recommendation }}
          </p>
        </div>

        <div class="rounded-lg bg-white/80 px-3 py-2">
          <p class="text-xs font-bold text-gray-500">Watch</p>
          <p class="mt-1 text-sm font-medium leading-5 text-gray-800">
            {{ routeIntel.warning }}
          </p>
        </div>
      </div>

      <div class="mt-4 rounded-xl border border-sky-100 bg-white p-3 shadow-sm">
        <div class="mb-3 flex items-center justify-between gap-3">
          <div>
            <p class="text-xs font-bold text-gray-500">Route preview</p>
            <p class="mt-0.5 text-sm font-semibold text-gray-900">
              {{ routeStops.length }} stops in planned order
            </p>
          </div>

          <button
            type="button"
            class="shrink-0 rounded-full bg-sky-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-sky-700"
            @click="showRouteDetails = true"
          >
            View Route
          </button>
        </div>

        <div class="overflow-x-auto pb-1">
          <div class="flex min-w-max items-center">
            <template v-for="stop in routeStops" :key="stop.id">
              <div class="flex w-36 shrink-0 flex-col items-center text-center">
                <div
                  class="flex h-9 w-9 items-center justify-center rounded-full border-4 border-white bg-sky-600 text-sm font-bold text-white shadow"
                >
                  {{ stop.stopNumber }}
                </div>
                <p class="mt-2 max-w-32 truncate text-sm font-bold text-gray-900">
                  {{ stop.title }}
                </p>
                <p class="mt-0.5 text-xs capitalize text-gray-500">{{ stop.time }}</p>
              </div>

              <div
                v-if="!stop.isLast"
                class="mx-1 h-px w-14 shrink-0 border-t-2 border-dashed border-sky-300"
              ></div>
            </template>
          </div>
        </div>
      </div>
    </section>

    <div class="relative">
      <div class="absolute bottom-0 left-5 top-0 w-px -translate-x-1/2 bg-gray-300"></div>

      <template v-for="(item, index) in day.items" :key="item.id">
        <ActivityCard
          :item="item"
          :disabled="isLoading"
          :is-editing="isEditing"
          @delete="handleDelete"
          @edit="handleEdit"
        />

        <div
          v-if="routeLinks[index]"
          class="-mt-2 mb-4 ml-14 rounded-lg border border-dashed border-sky-200 bg-white px-3 py-2 text-sm"
        >
          <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <p class="font-bold text-sky-700">{{ routeLinks[index].gapLabel }}</p>
            <p class="text-xs font-semibold text-gray-500">Route Intel</p>
          </div>
          <p class="mt-1 text-xs leading-5 text-gray-500">
            {{ routeLinks[index].note }}
          </p>
        </div>
      </template>
    </div>

    <AddActivityModal
      v-if="showModal && isEditing"
      :item="editingItem"
      :loading="isLoading"
      @close="handleCloseModal"
      @add="handleAdd"
    />

    <Teleport to="body">
      <div
        v-if="showRouteDetails"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 py-6"
        @click.self="handleCloseRouteDetails"
      >
        <section
          class="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl"
        >
          <div class="mb-5 flex items-start justify-between gap-4">
            <div>
              <p class="text-[11px] font-bold uppercase tracking-wide text-sky-600">Route Intel</p>
              <h2 class="mt-1 text-xl font-bold text-gray-900">Day {{ day.day_number }} Route</h2>
              <p class="mt-1 text-sm text-gray-500">
                {{ routeIntel.pacing }} pacing with {{ routeIntel.transport.toLowerCase() }}
              </p>
            </div>

            <button
              type="button"
              class="rounded-full bg-gray-100 px-3 py-1.5 text-sm font-bold text-gray-600 transition hover:bg-gray-200"
              @click="handleCloseRouteDetails"
            >
              Close
            </button>
          </div>

          <div class="mb-5 grid gap-3 sm:grid-cols-3">
            <div class="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
              <p class="text-xs font-bold text-gray-500">Stops</p>
              <p class="mt-1 text-lg font-bold text-gray-900">{{ routeStops.length }}</p>
            </div>
            <div class="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
              <p class="text-xs font-bold text-gray-500">Movement</p>
              <p class="mt-1 text-lg font-bold text-gray-900">{{ routeIntel.movementLabel }}</p>
            </div>
            <div class="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
              <p class="text-xs font-bold text-gray-500">Transport</p>
              <p class="mt-1 text-lg font-bold text-gray-900">{{ routeIntel.transport }}</p>
            </div>
          </div>

          <div class="mb-5 overflow-hidden rounded-2xl border border-sky-100 bg-sky-50">
            <div class="border-b border-sky-100 bg-white px-4 py-3">
              <p class="text-sm font-bold text-gray-900">Route flow</p>
              <p class="mt-0.5 text-xs font-medium text-gray-500">
                Planned stop order with timing checks between activities
              </p>
            </div>

            <div class="p-4">
              <div class="overflow-x-auto pb-1">
                <div class="flex min-w-max items-center">
                  <template v-for="stop in routeStops" :key="stop.id">
                    <div class="flex w-40 shrink-0 flex-col items-center text-center">
                      <div
                        class="flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-sky-600 text-sm font-bold text-white shadow-md"
                      >
                        {{ stop.stopNumber }}
                      </div>
                      <p class="mt-2 max-w-36 truncate text-sm font-bold text-gray-900">
                        {{ stop.title }}
                      </p>
                      <p class="mt-0.5 text-xs capitalize text-gray-500">
                        {{ stop.time }} · {{ stop.category }}
                      </p>
                    </div>

                    <div
                      v-if="!stop.isLast"
                      class="mx-2 flex w-28 shrink-0 flex-col items-center gap-1"
                    >
                      <div class="h-px w-full border-t-2 border-dashed border-sky-300"></div>
                      <span
                        class="rounded-full bg-white px-2 py-0.5 text-[11px] font-bold text-sky-700 shadow-sm"
                      >
                        {{ routeLinks[stop.stopNumber - 1]?.gapLabel || 'Next stop' }}
                      </span>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>

          <div class="rounded-2xl border border-gray-100 bg-white p-4">
            <p class="mb-4 text-sm font-bold text-gray-900">Stop details</p>

            <div class="relative space-y-4">
              <div class="absolute bottom-5 left-5 top-5 w-px bg-sky-100"></div>

              <div v-for="stop in routeStops" :key="stop.id" class="relative flex gap-3">
                <div
                  class="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-600 text-sm font-bold text-white shadow"
                >
                  {{ stop.stopNumber }}
                </div>

                <div class="min-w-0 flex-1 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                  <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div class="min-w-0">
                      <h3 class="truncate text-base font-bold text-gray-900">{{ stop.title }}</h3>
                      <p class="mt-1 text-sm capitalize text-gray-500">
                        {{ stop.time }} · {{ stop.category }}
                      </p>
                    </div>

                    <span class="rounded-full bg-white px-3 py-1 text-xs font-bold text-gray-600">
                      Stop {{ stop.stopNumber }}
                    </span>
                  </div>

                  <div
                    v-if="routeLinks[stop.stopNumber - 1]"
                    class="mt-3 rounded-lg border border-dashed border-sky-200 bg-white px-3 py-2"
                  >
                    <p class="text-sm font-bold text-sky-700">
                      {{ routeLinks[stop.stopNumber - 1].gapLabel }}
                    </p>
                    <p class="mt-1 text-sm text-gray-600">
                      {{ routeLinks[stop.stopNumber - 1].note }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Teleport>
  </div>
</template>
