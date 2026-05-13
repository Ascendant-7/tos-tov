<script setup lang="ts">
import { ref } from 'vue'
import ActivityCard from './ActivityCard.vue'
import AddActivityModal from './AddActivityModal.vue'
import { createItem, updateItem, deleteItem } from '../services/itineraryService'

const props = defineProps<{
  day: any
}>()

const showModal = ref(false)
const editingItem = ref<any>(null)
const isLoading = ref(false)
const errorMessage = ref('')

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
            {{ day.title || (day.items[0]?.title ? `Arrival in ${day.items[0].title}` : 'Trip day') }}
          </p>
        </div>
      </div>

      <div class="flex shrink-0 items-center gap-3">
        <span class="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-600">
          {{ day.items.length }} stops
        </span>

        <button
          class="rounded-full bg-blue-600 px-4 py-1.5 text-sm font-semibold text-white transition duration-200 ease-in-out hover:bg-blue-700 disabled:opacity-50"
          :disabled="isLoading"
          @click="showModal = true"
        >
          {{ isLoading ? 'Loading...' : 'Add Activity' }}
        </button>
      </div>
    </div>

    <div v-if="errorMessage" class="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
      {{ errorMessage }}
    </div>

    <div class="relative">
      <div class="absolute bottom-0 left-5 top-0 w-px -translate-x-1/2 bg-gray-300"></div>

      <ActivityCard
        v-for="item in day.items"
        :key="item.id"
        :item="item"
        :disabled="isLoading"
        @delete="handleDelete"
        @edit="handleEdit"
      />
    </div>

    <AddActivityModal
      v-if="showModal"
      :item="editingItem"
      :loading="isLoading"
      @close="showModal = false; editingItem = null"
      @add="handleAdd"
    />
  </div>
</template>
