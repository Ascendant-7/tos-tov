import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { ExploreDestination } from '@/modules/explore/components/DestinationCard.vue'
import {
  fetchDestinations,
  type DestinationApiResponse,
} from '@/modules/explore/services/destinationsApi'

// ─── Mapping helper ──────────────────────────────────────────────────────────

/**
 * Map a raw API response object to the normalized ExploreDestination shape.
 */
function mapDestination(raw: DestinationApiResponse): ExploreDestination {
  return {
    id: raw.id,
    created_at: raw.created_at,
    name: raw.name,
    description: raw.description,
    province: raw.province,
    location_name: raw.location_name,
    latitude: raw.latitude == null ? null : Number(raw.latitude),
    longitude: raw.longitude == null ? null : Number(raw.longitude),
    category: raw.category,
    cover_image_url: raw.cover_image_url,
    duration_min: raw.duration_min,
    duration_max: raw.duration_max,
    budget_min: raw.budget_min,
    budget_max: raw.budget_max,
    rating: raw.rating,
    badge: raw.badge,
    tags: raw.tags ?? [],
  }
}

// ─── Store ───────────────────────────────────────────────────────────────────

export const useExploreStore = defineStore('explore', () => {
  // --- Loading state ---
  const isLoading = ref(false)
  const error = ref<string | null>(null)

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
  const destinations = ref<ExploreDestination[]>([])

  // --- Provinces (derived from fetched data) ---
  const provinces = computed(() => {
    const unique = [...new Set(destinations.value.map((d) => d.province))]
    return ['All', ...unique.sort()]
  })

  // --- Filtered destinations ---
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
          (d.tags ?? []).some((t) => t.toLowerCase() === activeTab.value.toLowerCase()),
      )
    }

    // Search filter
    if (q) {
      results = results.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          (d.location_name ?? '').toLowerCase().includes(q) ||
          d.province.toLowerCase().includes(q) ||
          (d.description ?? '').toLowerCase().includes(q) ||
          (d.tags ?? []).some((t) => t.toLowerCase().includes(q)),
      )
    }

    return results
  })

  // --- Actions ---

  async function loadDestinations() {
    isLoading.value = true
    error.value = null
    try {
      const raw = await fetchDestinations()
      destinations.value = raw.map(mapDestination)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load destinations'
      // console.error('[ExploreStore] loadDestinations error:', err)
    } finally {
      isLoading.value = false
    }
  }

  const setTrendingFilter = (value: boolean) => {
    showTrendingOnly.value = value
  }

  return {
    // state
    isLoading,
    error,
    searchQuery,
    activeTab,
    selectedProvince,
    viewMode,
    tabs,
    showTrendingOnly,
    // computed
    provinces,
    destinations,
    filteredDestinations,
    // actions
    loadDestinations,
    setTrendingFilter,
  }
})
