<template>
  <main class="flex-1 h-screen overflow-y-auto bg-cream box-border font-sans custom-scrollbar">
    <div class="py-5 px-4 sm:py-6 sm:px-6 md:py-8 md:px-8 max-w-[1100px] mx-auto">

      <!-- Search & Filter Bar -->
      <section class="animate-fade-in-up">
        <SearchFilterBar
          :search="searchQuery"
          @update:search="searchQuery = $event"
          :active-tab="activeTab"
          @update:active-tab="activeTab = $event"
          :tabs="tabs"
          search-placeholder="Search destinations..."
          :result-count="filteredDestinations.length"
          :total-count="destinations.length"
        >
          <template #controls>
            <div class="flex items-center gap-2 shrink-0">
              <!-- Filters Button -->
              <button
                @click="showFilters = !showFilters"
                :class="[
                  'flex items-center gap-2 px-4 py-3 rounded-2xl border text-[13px] font-medium cursor-pointer transition-all duration-200',
                  showFilters
                    ? 'bg-sidebar-active text-white border-sidebar-active'
                    : 'bg-white text-slate-600 border-weather-border hover:border-slate-300 hover:text-slate-700'
                ]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/></svg>
                Filters
              </button>

              <!-- View Toggle -->
              <div class="flex rounded-xl border border-weather-border overflow-hidden">
                <button
                  @click="viewMode = 'grid'"
                  :class="[
                    'p-2.5 cursor-pointer transition-all duration-200 border-none',
                    viewMode === 'grid'
                      ? 'bg-sidebar-active text-white'
                      : 'bg-white text-slate-400 hover:text-slate-600'
                  ]"
                  aria-label="Grid view"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
                </button>
                <button
                  @click="viewMode = 'list'"
                  :class="[
                    'p-2.5 cursor-pointer transition-all duration-200 border-none border-l border-weather-border',
                    viewMode === 'list'
                      ? 'bg-sidebar-active text-white'
                      : 'bg-white text-slate-400 hover:text-slate-600'
                  ]"
                  aria-label="List view"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="7" x="3" y="3" rx="1"/><rect width="18" height="7" x="3" y="14" rx="1"/></svg>
                </button>
              </div>
            </div>
          </template>
        </SearchFilterBar>
      </section>

      <!-- Province Filter Pills -->
      <section v-if="showFilters" class="mt-4 p-5 bg-white rounded-2xl border border-weather-border shadow-sm animate-fade-in-up">
        <!-- Trending Toggle -->
        <div class="mb-5">
          <p class="text-[12px] font-bold text-slate-500 uppercase tracking-wide mb-3">Badge</p>
          <div class="flex gap-2 flex-wrap">
            <button
              @click="exploreStore.setTrendingFilter(!exploreStore.showTrendingOnly)"
              :class="[
                'px-4 py-1.5 rounded-full text-[13px] font-medium border cursor-pointer transition-all duration-200 flex items-center gap-2',
                exploreStore.showTrendingOnly
                  ? 'bg-sidebar-active text-white border-sidebar-active shadow-[0_2px_8px_rgba(42,90,66,0.2)]'
                  : 'bg-white text-slate-500 border-weather-border hover:border-slate-300 hover:text-slate-700'
              ]"
            >
              <span class="text-base"></span>
              Trending
            </button>
          </div>
        </div>

        <!-- Province Filter -->
        <div class="mb-4">
          <p class="text-[12px] font-bold text-slate-500 uppercase tracking-wide mb-3">Province</p>
          <div class="flex gap-2 flex-wrap">
            <button
              v-for="province in provinces"
              :key="province"
              @click="selectedProvince = province"
              :class="[
                'px-4 py-1.5 rounded-full text-[13px] font-medium border cursor-pointer transition-all duration-200',
                selectedProvince === province
                  ? 'bg-sidebar-active text-white border-sidebar-active shadow-[0_2px_8px_rgba(42,90,66,0.2)]'
                  : 'bg-white text-slate-500 border-weather-border hover:border-slate-300 hover:text-slate-700'
              ]"
            >
              {{ province === 'All' ? 'All Provinces' : province }}
            </button>
          </div>
        </div>
      </section>

      <!-- Destination Cards Grid -->
      <section class="mt-6 sm:mt-8 mb-8 sm:mb-10">
        <div
          :class="[
            'grid gap-5 sm:gap-6',
            viewMode === 'grid'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1'
          ]"
        >
          <TransitionGroup name="card-filter">
            <DestinationCard
              v-for="(dest, i) in filteredDestinations"
              :key="dest.name"
              :destination="dest"
              :index="i"
              :class="viewMode === 'list' ? 'list-card-layout' : ''"
            />
          </TransitionGroup>
        </div>

        <!-- Empty State -->
        <div v-if="filteredDestinations.length === 0" class="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
          <div class="w-20 h-20 rounded-2xl bg-cream-dark flex items-center justify-center text-4xl mb-5 shadow-inner">🔍</div>
          <p class="text-[16px] font-semibold text-slate-600 m-0 mb-2">No destinations found</p>
          <p class="text-[13px] text-slate-400 m-0 mb-5 max-w-[300px]">Try adjusting your search query or changing the category filter</p>
          <button
            @click="clearFilters"
            class="px-5 py-2 rounded-xl bg-sidebar-active text-white text-[13px] font-medium border-none cursor-pointer transition-all duration-200 hover:shadow-[0_4px_12px_rgba(42,90,66,0.25)] hover:-translate-y-0.5"
          >
            Clear all filters
          </button>
        </div>
      </section>

    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useExploreStore } from '../stores/explore'
import SearchFilterBar from '../components/SearchFilterBar.vue'
import DestinationCard from '../components/DestinationCard.vue'

const route = useRoute()
const exploreStore = useExploreStore()
const {
  searchQuery,
  activeTab,
  viewMode,
  tabs,
  destinations,
  filteredDestinations,
  selectedProvince,
  provinces,
} = storeToRefs(exploreStore)

const showFilters = ref(false)

onMounted(() => {
  // Check if we should show trending only
  if (route.query.filter === 'trending') {
    exploreStore.setTrendingFilter(true)
  }
})

function clearFilters() {
  searchQuery.value = ''
  activeTab.value = 'All'
  selectedProvince.value = 'All'
  exploreStore.setTrendingFilter(false)
}
</script>

<style scoped>
/* List view layout override for DestinationCard */
.list-card-layout {
  display: flex !important;
  flex-direction: row !important;
}

.list-card-layout :deep(.relative.h-\[220px\]),
.list-card-layout :deep(.relative.h-\[240px\]) {
  width: 280px;
  min-width: 280px;
  height: auto;
  min-height: 200px;
}

@media (max-width: 640px) {
  .list-card-layout {
    flex-direction: column !important;
  }

  .list-card-layout :deep(.relative) {
    width: 100% !important;
    min-width: unset !important;
  }
}
</style>
