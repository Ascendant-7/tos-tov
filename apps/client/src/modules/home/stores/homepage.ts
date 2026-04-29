import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { DESTINATIONS } from '@/modules/home/data/destinations'

export const useHomepageStore = defineStore('homepage', () => {
  // --- Search ---
  const searchQuery = ref('')

  // --- Tabs ---
  const activeTab = ref('All')
  const tabs = ref(['All', 'Beach', 'Temple', 'Nature', 'City', 'Adventure'])

  // --- Weather ---
  const weatherData = ref([
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

  // --- Destinations (Trending from shared data) ---
  const allDestinations = DESTINATIONS
  const destinations = computed(
    () =>
      allDestinations
        .filter((d) => d.badge === 'Trending')
        .map((d) => ({
          name: d.name,
          location: d.location,
          rating: d.rating,
          tags: d.tags,
          category: d.category,
          image: d.image,
        }))
        .slice(0, 6), // Show top 6 trending
  )

  const filteredDestinations = computed(() => {
    const q = searchQuery.value.toLowerCase().trim()
    let results = destinations.value
    if (activeTab.value !== 'All') {
      results = results.filter(
        (d) => d.category === activeTab.value || d.tags.includes(activeTab.value),
      )
    }
    if (q) {
      results = results.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.location.toLowerCase().includes(q) ||
          d.tags.some((t) => t.toLowerCase().includes(q)),
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
  const hiddenGems = ref([
    {
      name: 'Koh Kong',
      province: 'Koh Kong',
      description:
        "Cambodia's eco-adventure capital, Koh Kong boasts pristine rainforests, waterfalls, and mangrove estuaries teeming with wildlife.",
      image: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=300&q=75',
    },
    {
      name: 'Kampot',
      province: 'Kampot',
      description:
        'Charming riverside town famous for Kampot pepper, French colonial architecture, and tranquil sunset cruises.',
      image: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=300&q=75',
    },
    {
      name: 'Banlung',
      province: 'Ratanakiri',
      description:
        "Gateway to volcanic crater lakes, indigenous villages, and lush jungle treks in Cambodia's wild northeast.",
      image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=300&q=75',
    },
    {
      name: 'Kep',
      province: 'Kep',
      description:
        'A sleepy seaside town known for its famous crab market, abandoned French villas, and views of Rabbit Island.',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&q=75',
    },
  ])

  const filteredHiddenGems = computed(() => {
    const q = searchQuery.value.toLowerCase().trim()
    if (!q) return hiddenGems.value
    return hiddenGems.value.filter(
      (g) =>
        g.name.toLowerCase().includes(q) ||
        g.province.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q),
    )
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
    const q = searchQuery.value.toLowerCase().trim()
    if (!q) return upcomingEvents.value
    return upcomingEvents.value.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q),
    )
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
    const q = searchQuery.value.toLowerCase().trim()
    if (!q) return travelTips.value
    return travelTips.value.filter(
      (t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q),
    )
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
  }
})
