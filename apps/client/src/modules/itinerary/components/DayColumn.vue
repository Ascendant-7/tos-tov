<script setup lang="ts">
import { ref } from 'vue'
import ActivityCard from './ActivityCard.vue'
import AddActivityModal from './AddActivityModal.vue'

const props = defineProps<{
  day: any
}>()

const showModal = ref(false)
const editingItem = ref<any>(null)
const handleAdd = (item: any) => {
  if (editingItem.value) {
    const index = props.day.items.findIndex((i: any) => i.id === item.id)
    props.day.items[index] = item
    editingItem.value = null
  } else {
    props.day.items.push(item)
  }
}

const handleDelete = (id: string) => {
  props.day.items = props.day.items.filter((item: any) => item.id !== id)
}

const handleEdit = (item: any) => {
  editingItem.value = item
  showModal.value = true
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
          <h2 class="text-lg font-bold leading-none text-gray-900">
            Day {{ day.day_number }}
          </h2>
          <p class="mt-1 truncate text-sm leading-5 text-gray-400">
            {{ day.title || (day.items[0]?.destination?.name ? `Arrival in ${day.items[0].destination.name}` : 'Trip day') }}
          </p>
        </div>
      </div>

      <div class="flex shrink-0 items-center gap-3">
        <span class="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-600">
          {{ day.items.length }} stops
        </span>

        <button
          class="rounded-full bg-blue-600 px-4 py-1.5 text-sm font-semibold text-white transition duration-200 ease-in-out hover:bg-blue-700"
          @click="showModal = true"
        >
          Add Activity
        </button>
      </div>
    </div>

    <div class="relative">
      <div class="absolute bottom-0 left-5 top-0 w-px -translate-x-1/2 bg-gray-300"></div>

      <ActivityCard
        v-for="item in day.items"
        :key="item.id"
        :item="item"
        @delete="handleDelete"
        @edit="handleEdit"
      />
    </div>

    <AddActivityModal
      v-if="showModal"
      :item="editingItem"
      @close="showModal = false; editingItem = null"
      @add="handleAdd"
    />
  </div>
</template>
