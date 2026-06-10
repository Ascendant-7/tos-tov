import { fetchWeather } from '../services/weatherApi'
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useExploreStore } from '@/modules/explore/store/explore'

export const useHomepageStore = defineStore('homepage', () => {
  // --- Search ---
  const searchQuery = ref('')

  // --- Tabs ---
  const activeTab = ref('All')
  const tabs = ref(['All', 'Beach', 'Temple', 'Nature', 'City', 'Adventure'])

  interface WeatherCard {
    city: string
    temp: number
    condition: string
    icon: string
    bgClass: string
  }

  const weatherData = ref<WeatherCard[]>([
    { city: 'Siem Reap', temp: 32, condition: 'Sunny', icon: '☀️', bgClass: 'bg-amber-50' },
    {
      city: 'Phnom Penh',
      temp: 31,
      condition: 'Partly Cloudy',
      icon: '⛅',
      bgClass: 'bg-slate-50',
    },
    { city: 'Koh Rong', temp: 29, condition: 'Humid', icon: '🌊', bgClass: 'bg-blue-50' },
    { city: 'Kampot', temp: 28, condition: 'Breezy', icon: '🍃', bgClass: 'bg-green-50' },
  ])

  async function loadWeather() {
    try {
      const data = await fetchWeather()

      weatherData.value = data.map((item) => ({
        city: item.city,
        temp: Math.round(item.temperature),
        condition: getCondition(item.weatherCode),
        icon: getIcon(item.weatherCode),
        bgClass: getBgClass(item.weatherCode),
      }))
    } catch (error) {
      console.error('Failed to load weather:', error)
    }
  }
  function getCondition(code: number) {
    if (code <= 1) return 'Sunny'
    if (code <= 3) return 'Partly Cloudy'
    if (code <= 50) return 'Cloudy'
    if (code <= 70) return 'Rainy'
    return 'Stormy'
  }

  function getIcon(code: number) {
    if (code <= 1) return '☀️'
    if (code <= 3) return '⛅'
    if (code <= 50) return '☁️'
    if (code <= 70) return '🌧️'
    return '⛈️'
  }

  function getBgClass(code: number) {
    if (code <= 1) return 'bg-amber-50'
    if (code <= 3) return 'bg-slate-50'
    if (code <= 50) return 'bg-blue-50'
    if (code <= 70) return 'bg-cyan-50'
    return 'bg-red-50'
  }
  // --- Destinations (Top-rated from the explore store / backend API) ---
  const exploreStore = useExploreStore()

  /**
   * Top 6 destinations. Prioritizes newest destinations if they exist,
   * otherwise falls back to highest-rated destinations.
   * Data comes from the explore store which fetches from /destinations.
   */
  const destinations = computed(() =>
    [...exploreStore.destinations]
      .sort((a, b) => {
        // Sort by created_at descending if available
        if (a.created_at && b.created_at) {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        }
        if (a.created_at) return -1
        if (b.created_at) return 1

        // Fallback to sorting by rating descending
        return (Number(b.rating) || 0) - (Number(a.rating) || 0)
      })
      .slice(0, 6),
  )

  const filteredDestinations = computed(() => {
    let results = destinations.value
    if (activeTab.value !== 'All') {
      results = results.filter(
        (d) =>
          d.category === activeTab.value ||
          (d.tags ?? []).some((t) => t.toLowerCase() === activeTab.value.toLowerCase()),
      )
    }
    return results
  })

  // --- Ongoing Trips ---
  const ongoingTrips = ref([
    {
      title: 'Phnom Penh → Koh Kong → Koh Rong',
      duration: '7-day itinerary',
      progress: 65,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=75',
    },
    { title: 'Siem Reap Temple Circuit', duration: '4-day itinerary', progress: 30, image: '' },
  ])

  // --- Hidden Gems ---
  const hiddenGems = computed(() => {
    return exploreStore.destinations.filter(d => d.is_hidden_gem)
  })

  const filteredHiddenGems = computed(() => {
    return hiddenGems.value
  })

  // --- Upcoming Events ---
  const upcomingEvents = ref([
    {
      title: 'Khmer New Year Festival',
      month: 'APR',
      day: '14',
      location: 'Nationwide',
      description:
        'Celebrate the traditional Cambodian New Year with water splashing, temple visits, and cultural performances.',
      image: 'https://images.unsplash.com/photo-1533669955142-6a73332af4db?w=400&q=75',
    },
    {
      title: 'Angkor Wat Marathon',
      month: 'DEC',
      day: '01',
      location: 'Siem Reap',
      description:
        "Run through the ancient temple complex in one of Asia's most scenic marathon routes.",
      image: '',
    },
    {
      title: 'Water Festival (Bon Om Touk)',
      month: 'NOV',
      day: '14',
      location: 'Phnom Penh',
      description:
        'Spectacular boat races on the Tonle Sap River with fireworks, concerts, and river parades.',
      image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400&q=75',
    },
  ])

  const filteredUpcomingEvents = computed(() => {
    return upcomingEvents.value
  })

  // --- Travel Tips ---
  const travelTips = ref([
    {
      icon: '💵',
      title: 'Currency & Payment',
      description:
        'US Dollars are widely accepted alongside Cambodian Riel. ATMs are available in major cities, but carry cash for rural areas.',
      bgClass: 'bg-green-50',
    },
    {
      icon: '🌡️',
      title: 'Best Time to Visit',
      description:
        'November to April (dry season) is ideal. Expect hot days and cool evenings. Rainy season (May-Oct) offers lush landscapes and fewer crowds.',
      bgClass: 'bg-amber-50',
    },
    {
      icon: '🛺',
      title: 'Getting Around',
      description:
        'Tuk-tuks are the most popular transport. Use ride-hailing apps like PassApp or Grab in Phnom Penh and Siem Reap.',
      bgClass: 'bg-blue-50',
    },
    {
      icon: '🏛️',
      title: 'Temple Etiquette',
      description:
        'Dress modestly when visiting temples — cover shoulders and knees. Remove shoes before entering shrine areas.',
      bgClass: 'bg-purple-50',
    },
    {
      icon: '🍜',
      title: 'Must-Try Foods',
      description:
        "Don't miss Fish Amok, Lok Lak, Nom Banh Chok (Khmer noodles), and fresh Kampot pepper crab at the coast.",
      bgClass: 'bg-red-50',
    },
    {
      icon: '📱',
      title: 'Stay Connected',
      description:
        'Pick up a local SIM card (Smart or Cellcard) at the airport for affordable data. WiFi is widely available in cities.',
      bgClass: 'bg-cyan-50',
    },
  ])

  const filteredTravelTips = computed(() => {
    return travelTips.value
  })

  return {
    searchQuery,
    activeTab,
    tabs,
    weatherData,
    destinations,
    filteredDestinations,
    ongoingTrips,
    hiddenGems,
    filteredHiddenGems,
    upcomingEvents,
    filteredUpcomingEvents,
    travelTips,
    filteredTravelTips,
    loadWeather,
  }
})
