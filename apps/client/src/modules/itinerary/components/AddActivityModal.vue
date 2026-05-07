<script setup lang="ts">
import { ref, watch, computed } from 'vue'

const props = defineProps<{
  item?: any
  loading?: boolean
}>()

const emit = defineEmits(['close', 'add'])

const name = ref('')
const hours = ref('')
const minutes = ref('00')
const ampm = ref('AM')
const category = ref('activity')
const durationHours = ref('0')
const durationMinutes = ref('00')
const cost = ref('')
const hourOptions = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
const minuteOptions = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55']
const durationHourOptions = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
const durationMinuteOptions = ['00', '15', '30', '45']

const parseTime = (timeStr: string) => {
  if (!timeStr) return { hours: '', minutes: '00', ampm: 'AM' }
  
  const match = timeStr.match(/(\d{1,2}):?(\d{2})?\s*(AM|PM)?/i)
  if (!match) return { hours: '', minutes: '00', ampm: 'AM' }

  const rawHour = parseInt(match[1] ?? '0', 10)
  const m = match[2] ? parseInt(match[2], 10).toString().padStart(2, '0') : '00'
  const meridiem = (match[3] ?? (rawHour >= 12 ? 'PM' : 'AM')).toUpperCase()

  let normalizedHour = rawHour
  if (normalizedHour === 0) normalizedHour = 12
  if (normalizedHour > 12) normalizedHour -= 12

  return { hours: normalizedHour.toString().padStart(2, '0'), minutes: m, ampm: meridiem }
}

const formattedTime = computed(() => {
  if (!hours.value) return ''
  const h = hours.value.padStart(2, '0')
  const m = minutes.value || '00'
  return `${h}:${m}`
})

const displayTime = computed(() => {
  if (!formattedTime.value) return ''
  return `${formattedTime.value} ${ampm.value}`
})

const parseDuration = (durationStr: string) => {
  if (!durationStr) return { hours: '0', minutes: '00' }

  const hourMatch = durationStr.match(/(\d+)\s*(h|hr|hour)/i)
  const minuteMatch = durationStr.match(/(\d+)\s*(m|min|minute)/i)

  if (hourMatch || minuteMatch) {
    const parsedHours = hourMatch ? hourMatch[1] ?? '0' : '0'
    const parsedMinutesRaw = minuteMatch ? minuteMatch[1] ?? '0' : '0'
    const parsedMinutes = ['00', '15', '30', '45'].includes(parsedMinutesRaw)
      ? parsedMinutesRaw
      : '00'
    return { hours: parsedHours, minutes: parsedMinutes }
  }

  return { hours: '0', minutes: '00' }
}

const formattedDuration = computed(() => {
  const h = parseInt(durationHours.value || '0', 10)
  const m = parseInt(durationMinutes.value || '0', 10)

  if (h === 0 && m === 0) return ''
  if (h > 0 && m === 0) return `${h} ${h === 1 ? 'hour' : 'hours'}`
  if (h === 0 && m > 0) return `${m} min`
  return `${h} ${h === 1 ? 'hour' : 'hours'} ${m} min`
})

watch(() => props.item, (val) => {
  if (val) {
    name.value = val.title || ''
    const parsed = parseTime(val.time ?? '')
    hours.value = parsed.hours
    minutes.value = parsed.minutes
    ampm.value = parsed.ampm
    category.value = val.category
    const parsedDuration = parseDuration(val.duration ?? '')
    durationHours.value = parsedDuration.hours
    durationMinutes.value = parsedDuration.minutes
    cost.value = val.cost || ''
  } else {
    name.value = ''
    hours.value = ''
    minutes.value = '00'
    ampm.value = 'AM'
    category.value = 'activity'
    durationHours.value = '0'
    durationMinutes.value = '00'
    cost.value = ''
  }
}, { immediate: true })

const handleSubmit = () => {
  if (!name.value || !hours.value || !minutes.value) return

  emit('add', {
    ...props.item,
    id: props.item?.id || Date.now().toString(),
    title: name.value,
    time: displayTime.value,
    category: category.value,
    duration: formattedDuration.value || null,
    cost: cost.value || null,
    notes: props.item?.notes || '',
    position: props.item?.position ?? 0
  })
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
    <div class="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-xl">
      <div class="border-b border-gray-100 px-6 py-6">
        <h2 class="text-lg font-bold text-gray-900">
          {{ item ? 'Edit Activity' : 'Add Activity' }}
        </h2>
        <p class="mt-1 text-sm text-gray-500">
          {{ item ? 'Update this stop in your itinerary.' : 'Add a new stop to your itinerary.' }}
        </p>
      </div>

      <div class="space-y-4 px-6 py-6">
        <div class="space-y-2">
          <label class="block text-sm font-semibold text-gray-700">
            Place name <span class="text-red-500">*</span>
          </label>
          <input
            v-model="name"
            :disabled="loading"
            placeholder="e.g., Angkor Wat"
            class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50 disabled:opacity-60"
          />
        </div>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700">
              Time <span class="text-red-500">*</span>
            </label>
            <div class="grid grid-cols-3 gap-2">
              <div>
                <select
                  v-model="hours"
                  :disabled="loading"
                  class="w-full rounded-lg border border-gray-200 bg-white px-2 py-2.5 text-sm text-center text-gray-900 outline-none transition duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50 disabled:opacity-60"
                >
                  <option value="">HH</option>
                  <option v-for="hour in hourOptions" :key="hour" :value="hour">{{ hour }}</option>
                </select>
                <p class="text-xs text-gray-500 mt-1 text-center">Hours</p>
              </div>
              <div>
                <select
                  v-model="minutes"
                  :disabled="loading"
                  class="w-full rounded-lg border border-gray-200 bg-white px-2 py-2.5 text-sm text-center text-gray-900 outline-none transition duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50 disabled:opacity-60"
                >
                  <option v-for="minute in minuteOptions" :key="minute" :value="minute">{{ minute }}</option>
                </select>
                <p class="text-xs text-gray-500 mt-1 text-center">Minutes</p>
              </div>
              <div>
                <select
                  v-model="ampm"
                  :disabled="loading"
                  class="w-full rounded-lg border border-gray-200 bg-white px-2 py-2.5 text-sm font-semibold text-center text-gray-900 outline-none transition duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50 disabled:opacity-60"
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
                <p class="text-xs text-gray-500 mt-1 text-center">Period</p>
              </div>
            </div>
            <p class="text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-1.5 rounded">
              {{ displayTime || 'Select time' }}
            </p>
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700">Category</label>
            <select
              v-model="category"
              :disabled="loading"
              class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50 disabled:opacity-60"
            >
              <option value="activity">Activity</option>
              <option value="attraction">Attraction</option>
              <option value="food">Food</option>
              <option value="rest">Rest</option>
              <option value="hotel">Hotel</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700">Duration</label>
            <div class="grid grid-cols-2 gap-2">
              <div>
                <select
                  v-model="durationHours"
                  :disabled="loading"
                  class="w-full rounded-lg border border-gray-200 bg-white px-2 py-2.5 text-sm text-center text-gray-900 outline-none transition duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50 disabled:opacity-60"
                >
                  <option v-for="hour in durationHourOptions" :key="hour" :value="hour">{{ hour }}</option>
                </select>
                <p class="text-xs text-gray-500 mt-1 text-center">Hours</p>
              </div>
              <div>
                <select
                  v-model="durationMinutes"
                  :disabled="loading"
                  class="w-full rounded-lg border border-gray-200 bg-white px-2 py-2.5 text-sm text-center text-gray-900 outline-none transition duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50 disabled:opacity-60"
                >
                  <option v-for="minute in durationMinuteOptions" :key="minute" :value="minute">{{ minute }}</option>
                </select>
                <p class="text-xs text-gray-500 mt-1 text-center">Minutes</p>
              </div>
            </div>
            <p class="text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-1.5 rounded">
              {{ formattedDuration || 'No duration' }}
            </p>
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700">Price</label>
            <input
              v-model="cost"
              :disabled="loading"
              placeholder="e.g., $50"
              class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50 disabled:opacity-60"
            />
          </div>
        </div>
      </div>

      <div class="flex justify-end gap-2 border-t border-gray-100 bg-gray-50 px-6 py-4">
        <button
          class="px-4 py-2 text-sm font-semibold text-gray-700 transition duration-200 hover:bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="loading"
          @click="$emit('close')"
        >
          Cancel
        </button>
        <button
          class="px-4 py-2 text-sm font-semibold text-white bg-blue-600 transition duration-200 hover:bg-blue-700 active:bg-blue-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          :disabled="!name || !hours || loading"
          @click="handleSubmit"
        >
          <span>{{ loading ? 'Saving...' : item ? 'Save Changes' : 'Add Activity' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
