import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { ExploreDestination } from '@/components/DestinationCard.vue'
import { DESTINATIONS } from '@/modules/home/data/destinations'

export const useExploreStore = defineStore('explore', () => {
  // --- Search & Filter ---
  const searchQuery = ref('')
  const activeTab = ref('All')
  const selectedProvince = ref('All')
  const viewMode = ref<'grid' | 'list'>('grid')
  const showTrendingOnly = ref(false)
  const tabs = ref([
    'All',
    'Beach',
    'Temple',
    'Waterfall',
    'Mountain',
    'City',
    'Nature',
    'Adventure',
    'Lake',
  ])

  // --- Destinations ---
  const destinations = ref<ExploreDestination[]>(DESTINATIONS)

  // --- Provinces (derived from data) ---
  const provinces = computed(() => {
    const unique = [...new Set(destinations.value.map((d) => d.province))]
    return ['All', ...unique.sort()]
  })

  const filteredDestinations = computed(() => {
    const q = searchQuery.value.toLowerCase().trim()
    let results = destinations.value

    // Trending filter
    if (showTrendingOnly.value) {
      results = results.filter((d) => d.badge === 'Trending')
    }

    // Province filter
    if (selectedProvince.value !== 'All') {
      results = results.filter((d) => d.province === selectedProvince.value)
    }

    // Category filter
    if (activeTab.value !== 'All') {
      results = results.filter(
        (d) =>
          d.category === activeTab.value ||
          d.tags.some((t) => t.toLowerCase() === activeTab.value.toLowerCase()),
      )
    }

    // Search filter
    if (q) {
      results = results.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.location.toLowerCase().includes(q) ||
          d.province.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q) ||
          d.tags.some((t) => t.toLowerCase().includes(q)),
      )
    }

    return results
  })

  // --- Methods ---
  const setTrendingFilter = (value: boolean) => {
    showTrendingOnly.value = value
  }

  return {
    searchQuery,
    activeTab,
    selectedProvince,
    viewMode,
    tabs,
    showTrendingOnly,
    provinces,
    destinations,
    filteredDestinations,
    setTrendingFilter,
  }
})
