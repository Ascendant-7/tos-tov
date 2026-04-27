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
</script>

<template>
  <div class="relative mb-5 flex items-start gap-4 last:mb-0">
    <div
      class="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-gray-300 text-sm shadow-sm"
      :class="{
        'border-orange-200 bg-orange-50 text-orange-600': item.category === 'food',
        'border-green-200 bg-green-50 text-green-600': item.category === 'attraction',
        'border-blue-200 bg-blue-50 text-blue-600': item.category === 'rest',
        'border-purple-200 bg-purple-50 text-purple-600': item.category === 'hotel',
        'border-gray-200 bg-gray-50 text-gray-500': !['food', 'attraction', 'rest', 'hotel'].includes(item.category)
      }"
    >
      <FontAwesomeIcon :icon="categoryIcon" class="h-4 w-4 leading-none" />
    </div>

    <div
      class="group relative flex-1 rounded-xl border border-gray-200 bg-white p-5 pr-16 shadow-sm transition duration-200 ease-in-out hover:border-gray-300 hover:shadow-lg"
    >
      <div class="flex items-start justify-between gap-5">
        <div class="min-w-0 flex-1 space-y-2">
          <div class="mb-2 flex flex-wrap items-center gap-2.5">
            <span class="text-sm font-semibold leading-none text-gray-500">
              {{ item.time }}
            </span>

            <span
              class="rounded-full px-2.5 py-1 text-xs font-semibold capitalize leading-none"
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

          <h3 class="truncate text-base font-bold leading-6 text-gray-900">
            {{ item.destination.name }}
          </h3>

          <div
            v-if="item.duration || item.price"
            class="mt-2 flex items-center gap-4 text-sm leading-5 text-gray-500"
          >
            <span v-if="item.duration" class="inline-flex items-center gap-1.5 leading-5">
              <FontAwesomeIcon :icon="faClock" class="h-3.5 w-3.5 shrink-0" />
              {{ item.duration }}
            </span>
            <span v-if="item.price" class="inline-flex items-center gap-1.5 leading-5">
              <FontAwesomeIcon :icon="faDollarSign" class="h-3.5 w-3.5 shrink-0" />
              {{ item.price }} 
            </span>
          </div>
        </div>
      </div>

      <div
        class="absolute right-5 top-1/2 flex -translate-y-1/2 items-center gap-1.5 opacity-0 transition duration-200 ease-in-out group-hover:opacity-100 group-focus-within:opacity-100"
      >
        <button
          class="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition duration-200 ease-in-out hover:bg-blue-50 hover:text-blue-500 focus:bg-blue-50 focus:text-blue-500 focus:outline-none"
          aria-label="Edit activity"
          @click="emit('edit', item)"
        >
          <FontAwesomeIcon :icon="faPenToSquare" class="h-3.5 w-3.5" />
        </button>

        <button
          class="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition duration-200 ease-in-out hover:bg-red-50 hover:text-red-500 focus:bg-red-50 focus:text-red-500 focus:outline-none"
          aria-label="Delete activity"
          @click="emit('delete', item.id)"
        >
          <FontAwesomeIcon :icon="faTrashCan" class="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  </div>
</template>
