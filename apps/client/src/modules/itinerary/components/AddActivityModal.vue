<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  item?: any
}>()

const emit = defineEmits(['close', 'add'])

const name = ref('')
const time = ref('')
const category = ref('activity')
const duration = ref('')
const price = ref('')

watch(() => props.item, (val) => {
  if (val) {
    name.value = val.destination.name
    time.value = val.time
    category.value = val.category
    duration.value = val.duration || ''
    price.value = val.price || ''
  } else {
    name.value = ''
    time.value = ''
    category.value = 'activity'
    duration.value = ''
    price.value = ''
  }
}, { immediate: true })

const handleSubmit = () => {
  if (!name.value || !time.value) return

  emit('add', {
    ...props.item,
    id: props.item?.id || Date.now().toString(),
    destination: { name: name.value },
    time: time.value,
    category: category.value,
    duration: duration.value,
    price: price.value,
    notes: props.item?.notes || '',
    position: props.item?.position || Date.now()
  })

  emit('close')
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4">
    <div class="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
      <div class="border-b border-gray-100 px-6 py-5">
        <h2 class="text-xl font-bold leading-6 text-gray-900">
          {{ item ? 'Edit Activity' : 'Add Activity' }}
        </h2>
        <p class="mt-1 text-sm text-gray-400">
          {{ item ? 'Update this stop in your itinerary.' : 'Add a new stop to your itinerary.' }}
        </p>
      </div>

      <div class="space-y-4 px-6 py-5">
        <label class="block">
          <span class="mb-1.5 block text-sm font-semibold text-gray-700">Place name</span>
          <input
            v-model="name"
            placeholder="Angkor Wat"
            class="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition duration-200 ease-in-out placeholder:text-gray-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          />
        </label>

        <div class="grid grid-cols-2 gap-3">
          <label class="block">
            <span class="mb-1.5 block text-sm font-semibold text-gray-700">Time</span>
            <input
              v-model="time"
              type="text"
              inputmode="numeric"
              placeholder="09:00"
              class="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition duration-200 ease-in-out placeholder:text-gray-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            />
          </label>

          <label class="block">
            <span class="mb-1.5 block text-sm font-semibold text-gray-700">Category</span>
            <select
              v-model="category"
              class="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition duration-200 ease-in-out focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            >
              <option value="activity">Activity</option>
              <option value="attraction">Attraction</option>
              <option value="food">Food</option>
              <option value="rest">Rest</option>
              <option value="hotel">Hotel</option>
            </select>
          </label>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <label class="block">
            <span class="mb-1.5 block text-sm font-semibold text-gray-700">Duration</span>
            <input
              v-model="duration"
              placeholder="h"
              class="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition duration-200 ease-in-out placeholder:text-gray-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            />
          </label>

          <label class="block">
            <span class="mb-1.5 block text-sm font-semibold text-gray-700">Price</span>
            <input
              v-model="price"
              placeholder="$"
              class="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition duration-200 ease-in-out placeholder:text-gray-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            />
          </label>
        </div>
      </div>

      <div class="flex justify-end gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4">
        <button
          class="rounded-full px-4 py-2 text-sm font-semibold text-gray-500 transition duration-200 ease-in-out hover:bg-gray-100 hover:text-gray-700"
          @click="$emit('close')"
        >
          Cancel
        </button>
        <button
          class="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition duration-200 ease-in-out hover:bg-blue-700 hover:shadow-md"
          @click="handleSubmit"
        >
          {{ item ? 'Save Changes' : 'Add Activity' }}
        </button>
      </div>
    </div>
  </div>
</template>
