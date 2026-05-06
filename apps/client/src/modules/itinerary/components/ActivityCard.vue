<script setup lang="ts">
import { computed } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faCamera,
  faCircle,
  faClock,
  faDollarSign,
  faHotel,
  faMugSaucer,
  faPenToSquare,
  faTrashCan,
  faUtensils,
} from '@fortawesome/free-solid-svg-icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'

const props = defineProps<{
  item: any
  disabled?: boolean
}>()

const emit = defineEmits(['delete', 'edit'])

const categoryIcon = computed(() => {
  const icons: Record<string, IconDefinition> = {
    attraction: faCamera,
    food: faUtensils,
    rest: faMugSaucer,
    hotel: faHotel,
  }

  return icons[props.item.category] || faCircle
})

const displayTime = computed(() => {
  const time = props.item.time
  if (!time) return '—'
  
  // Parse either HH:MM AM/PM or HH:MM.
  const match = time.match(/(\d{1,2}):(\d{2})(?:\s*(AM|PM))?/i)
  if (!match) return time

  if (match[3]) {
    const hour = parseInt(match[1] ?? '0', 10)
    const normalizedHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    return `${normalizedHour}:${match[2]} ${match[3].toUpperCase()}`
  }
  
  let hours = parseInt(match[1] ?? '0', 10)
  const minutes = match[2]
  const ampm = hours >= 12 ? 'PM' : 'AM'
  
  if (hours > 12) hours -= 12
  if (hours === 0) hours = 12
  
  return `${hours}:${minutes} ${ampm}`
})
</script>

<template>
  <div class="relative mb-4 flex items-start gap-3 last:mb-0">
    <div
      class="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 text-base shadow-sm"
      :class="{
        'border-orange-300 bg-orange-100 text-orange-600': item.category === 'food',
        'border-green-300 bg-green-100 text-green-600': item.category === 'attraction',
        'border-blue-300 bg-blue-100 text-blue-600': item.category === 'rest',
        'border-purple-300 bg-purple-100 text-purple-600': item.category === 'hotel',
        'border-gray-300 bg-gray-100 text-gray-500': !['food', 'attraction', 'rest', 'hotel'].includes(item.category)
      }"
    >
      <FontAwesomeIcon :icon="categoryIcon" class="h-5 w-5 leading-none" />
    </div>

    <div
      class="group relative flex-1 overflow-hidden rounded-lg border border-gray-200 bg-white transition-all duration-200 hover:border-gray-300 hover:shadow-md"
    >
      <div class="flex items-stretch">
        <div class="flex-1 px-4 py-3">
          <div class="flex items-baseline gap-3 mb-1">
            <span class="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md">
              {{ displayTime }}
            </span>

            <span
              class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold capitalize"
              :class="{
                'bg-orange-100 text-orange-700': item.category === 'food',
                'bg-green-100 text-green-700': item.category === 'attraction',
                'bg-blue-100 text-blue-700': item.category === 'rest',
                'bg-purple-100 text-purple-700': item.category === 'hotel'
              }"
            >
              {{ item.category || 'activity' }}
            </span>
          </div>

          <h3 class="truncate text-sm font-bold text-gray-900 mb-2">
            {{ item.title }}
          </h3>

          <div v-if="item.duration || item.cost" class="flex items-center gap-3 text-xs text-gray-600">
            <span v-if="item.duration" class="inline-flex items-center gap-1 px-2 py-1 bg-gray-50 rounded">
              <FontAwesomeIcon :icon="faClock" class="h-3 w-3" />
              <span>{{ item.duration }}</span>
            </span>
            <span v-if="item.cost" class="inline-flex items-center gap-1 px-2 py-1 bg-gray-50 rounded">
              <FontAwesomeIcon :icon="faDollarSign" class="h-3 w-3" />
              <span>{{ item.cost }}</span>
            </span>
          </div>
        </div>

        <div class="flex items-center gap-1 px-3 bg-gray-50 border-l border-gray-200">
          <button
            class="p-1.5 rounded-lg text-gray-400 transition-all duration-200 hover:bg-blue-100 hover:text-blue-600 active:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
            :title="disabled ? 'Working...' : 'Edit'"
            :disabled="disabled"
            @click="emit('edit', item)"
          >
            <FontAwesomeIcon :icon="faPenToSquare" class="h-4 w-4" />
          </button>

          <button
            class="p-1.5 rounded-lg text-gray-400 transition-all duration-200 hover:bg-red-100 hover:text-red-600 active:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
            :title="disabled ? 'Working...' : 'Delete'"
            :disabled="disabled"
            @click="emit('delete', item.id)"
          >
            <FontAwesomeIcon :icon="faTrashCan" class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
