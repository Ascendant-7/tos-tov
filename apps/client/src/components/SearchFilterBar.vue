<template>
  <div class="search-filter-bar">
    <!-- Search Row -->
    <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
      <!-- Search Input -->
      <div class="relative flex-1">
        <svg class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <input
          :value="search"
          @input="handleInput"
          type="text"
          :placeholder="searchPlaceholder"
          class="w-full py-3 pl-11 pr-4 rounded-2xl border border-weather-border bg-white text-[14px] text-slate-700 outline-none transition-all duration-250 focus:border-sidebar-active focus:shadow-[0_0_0_4px_rgba(42,90,66,0.08)] placeholder:text-slate-400"
        />
      </div>

      <!-- Slot for extra controls (filters button, view toggles, etc.) -->
      <slot name="controls" />
    </div>

    <!-- Filter Tabs -->
    <div class="flex gap-2 mt-4 flex-wrap" v-if="tabs.length > 0">
      <button
        v-for="tab in tabs"
        :key="tab"
        @click="$emit('update:activeTab', tab)"
        :class="[
          'px-4 py-1.5 rounded-full text-[13px] font-medium border cursor-pointer transition-all duration-200',
          activeTab === tab
            ? 'bg-sidebar-active text-white border-sidebar-active shadow-[0_2px_8px_rgba(42,90,66,0.2)]'
            : 'bg-white text-slate-500 border-weather-border hover:border-slate-300 hover:text-slate-700'
        ]"
      >
        {{ tab }}
      </button>
    </div>

    <!-- Results count + accent bar -->
    <div v-if="resultCount !== undefined" class="mt-4">
      <div class="h-1 rounded-full bg-sidebar-active/20 overflow-hidden mb-3">
        <div
          class="h-full bg-sidebar-active rounded-full transition-all duration-500 ease-out"
          :style="{ width: resultBarWidth }"
        ></div>
      </div>
      <p class="text-[13px] text-slate-500 m-0">
        <span class="font-bold text-sidebar-active">{{ resultCount }}</span> destinations found
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  search: string
  activeTab: string
  tabs: string[]
  searchPlaceholder?: string
  resultCount?: number
  totalCount?: number
}>(), {
  searchPlaceholder: 'Search destinations...',
})

const emit = defineEmits<{
  'update:search': [value: string]
  'update:activeTab': [value: string]
}>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:search', target.value)
}

const resultBarWidth = computed(() => {
  if (props.totalCount === undefined || props.totalCount === 0) return '100%'
  const pct = ((props.resultCount ?? 0) / props.totalCount) * 100
  return `${Math.max(pct, 5)}%`
})
</script>
