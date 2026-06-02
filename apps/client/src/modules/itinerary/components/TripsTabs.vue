<script setup lang="ts">
export type TripsTab = 'saved' | 'planner' | 'shared'

defineProps<{
  activeTab: TripsTab
  tabs: { id: TripsTab; label: string }[]
}>()

const emit = defineEmits<{
  select: [tab: TripsTab]
}>()
</script>

<template>
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
        @click="emit('select', tab.id)"
      >
        {{ tab.label }}
      </button>
    </div>
  </div>
</template>
