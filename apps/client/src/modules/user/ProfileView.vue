<template>
  <div
    class="min-h-screen px-6 md:px-8 py-8 bg-[radial-gradient(circle_at_20%_10%,#f7f2ea_0%,#f9f7f3_40%,#f4f1ec_100%)] text-[#1a1a1a]"
  >
    <!-- TOPBAR -->
    <header
      class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 animate-fade-in"
    >
      <h1 class="text-2xl font-semibold text-[#2b2b2b]">My Profile</h1>

      <div class="flex items-center gap-3 w-full md:w-auto">
        <!-- Search -->
        <div
          class="flex items-center gap-2 px-4 py-2 rounded-full bg-[#efeae1] text-sm text-[#8b857e] w-full md:w-[260px]"
        >
          <span>🔍</span>
          <input
            type="text"
            placeholder="Search trips..."
            class="bg-transparent outline-none w-full text-[#5a554f]"
          />
        </div>

        <!-- Notification -->
        <button
          class="relative w-9 h-9 rounded-full bg-[#f4f0e9] border border-[#e3ddd3] grid place-items-center hover:scale-105 transition"
        >
          🔔
          <span class="absolute top-1 right-1 w-2 h-2 bg-[#f26b5e] rounded-full"></span>
        </button>

        <!-- Avatar -->
        <div
          v-if="profile?.avatar_url"
          class="w-9 h-9 rounded-full overflow-hidden border border-[#e3ddd3]"
        >
          <img :src="profile.avatar_url" class="w-full h-full object-cover" />
        </div>
        <div
          v-else
          class="w-9 h-9 rounded-full bg-[#0f4f3f] text-white grid place-items-center font-semibold"
        >
          {{ initials }}
        </div>
      </div>
    </header>

    <!-- Error -->
    <div
      v-if="errorMessage"
      class="mb-6 bg-red-100 text-red-700 border border-red-300 rounded-xl px-4 py-3 text-sm flex justify-between items-center"
    >
      <span>{{ errorMessage }}</span>
      <button @click="fetchProfileData" class="underline font-semibold ml-4">Retry</button>
    </div>

    <!-- Loading -->
    <div v-if="loading && !profile" class="flex flex-col items-center justify-center py-24">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0f4f3f]"></div>
      <p class="mt-4 text-[#8b857e] animate-pulse">Loading your profile...</p>
    </div>

    <!-- PROFILE CARD -->
    <template v-else-if="profile">
      <section
        class="bg-white rounded-2xl overflow-hidden shadow-lg border border-[#efe9df] animate-scale-in"
      >
        <!-- Cover -->
        <div class="relative h-40 overflow-hidden bg-gradient-to-r from-[#0f4f3f] to-[#1a6b5a]">
          <img
            src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1400"
            class="w-full h-full object-cover scale-105 hover:scale-110 transition duration-700 opacity-60"
          />
          <button
            class="absolute right-4 bottom-3 w-8 h-8 rounded-lg bg-white/90 border grid place-items-center hover:scale-110 transition"
          >
            📷
          </button>
        </div>

        <!-- Body -->
        <div class="p-6">
          <div class="grid md:grid-cols-[auto_1fr_auto] gap-6 items-center text-center md:text-left">
            <!-- Avatar -->
            <div
              class="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden bg-[#0f4f3f] text-white grid place-items-center font-bold shadow-md -mt-16 md:-mt-20 border-4 border-white z-10"
            >
              <img v-if="profile.avatar_url" :src="profile.avatar_url" class="w-full h-full object-cover" />
              <template v-else>
                <span class="text-2xl">{{ initials }}</span>
              </template>
              <span
                class="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full z-10"
              ></span>
            </div>

            <!-- Info -->
            <div>
              <h2 class="text-xl font-bold">{{ displayName }}</h2>
              <p class="text-sm text-gray-500">{{ emailText }}</p>
              <p class="text-sm text-gray-600 mt-2 max-w-2xl">
                {{ profile.bio || 'Hello! I am a travel enthusiast exploring the beauty of the world.' }}
              </p>
            </div>

            <!-- Button -->
            <button
              class="px-6 py-2 rounded-full bg-[#0f4f3f] text-white text-sm font-semibold hover:-translate-y-1 hover:shadow-lg transition shadow-md"
              @click="$router.push('/profile/edit')"
            >
              Edit Profile
            </button>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mt-8 pt-6 border-t border-[#f0ebe1]">
            <div class="bg-[#fcfaf7] p-3 rounded-xl hover:shadow-sm transition border border-transparent hover:border-[#eee5d8]">
              <strong class="block text-xl font-bold text-[#0f4f3f]">{{ stats.tripsCount }}</strong>
              <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">Trips</span>
            </div>
            <div class="bg-[#fcfaf7] p-3 rounded-xl hover:shadow-sm transition border border-transparent hover:border-[#eee5d8]">
              <strong class="block text-xl font-bold text-[#0f4f3f]">{{ stats.placesCount }}</strong>
              <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">Places</span>
            </div>
            <div class="bg-[#fcfaf7] p-3 rounded-xl hover:shadow-sm transition border border-transparent hover:border-[#eee5d8]">
              <strong class="block text-xl font-bold text-[#0f4f3f]">{{ stats.countriesCount || '1' }}</strong>
              <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">Countries</span>
            </div>
            <div class="bg-[#fcfaf7] p-3 rounded-xl hover:shadow-sm transition border border-transparent hover:border-[#eee5d8]">
              <strong class="block text-xl font-bold text-[#0f4f3f]">{{ stats.distanceKm || '0' }}</strong>
              <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">Km</span>
            </div>
          </div>
        </div>
      </section>

      <!-- TABS -->
      <div
        class="flex gap-2 p-1.5 bg-[#f1ebe2] rounded-full w-fit mt-8 overflow-x-auto animate-slide-up"
      >
        <button class="px-5 py-2 rounded-full bg-white shadow-sm text-sm font-medium">My Trips</button>
        <button class="px-5 py-2 rounded-full text-sm text-gray-500 font-medium hover:bg-white/60 transition">
          Saved
        </button>
        <button class="px-5 py-2 rounded-full text-sm text-gray-500 font-medium hover:bg-white/60 transition">
          Reviews
        </button>
      </div>

      <!-- TRIPS -->
      <section class="grid gap-4 mt-6 mb-12">
        <div v-if="trips.length === 0" class="py-16 text-center bg-white rounded-2xl border border-dashed border-[#dcd1c0] text-gray-500">
          <div class="text-4xl mb-4">🗺️</div>
          <p class="font-medium">No trips planned yet.</p>
          <router-link to="/trips" class="text-[#0f4f3f] font-semibold hover:underline mt-2 inline-block">
            Start planning your first trip
          </router-link>
        </div>

        <!-- Card -->
        <div
          v-for="(trip, index) in trips"
          :key="trip.id"
          @click="$router.push(`/trips/${trip.id}`)"
          class="group cursor-pointer grid md:grid-cols-[auto_1fr_auto] gap-5 items-center p-4 bg-white border border-[#efe9df] rounded-2xl shadow-sm animate-slide-up hover:shadow-xl hover:border-[#0f4f3f]/20 hover:-translate-y-1 transition-all duration-300"
          :style="{ animationDelay: `${(index + 1) * 80}ms` }"
        >
          <div class="w-full md:w-24 h-40 md:h-24 overflow-hidden rounded-xl bg-[#f8f4ee]">
            <img
              :src="getTripImage(trip)"
              class="w-full h-full object-cover group-hover:scale-110 transition duration-500"
            />
          </div>

          <div class="flex flex-col gap-1">
            <div class="flex items-center gap-2">
              <h3 class="text-base font-bold text-[#2b2b2b] group-hover:text-[#0f4f3f] transition">{{ trip.title }}</h3>
              <span class="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider" :class="trip.visibility === 'public' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-600'">
                {{ trip.visibility || 'private' }}
              </span>
            </div>
            <p v-if="trip.description" class="text-sm text-gray-500 line-clamp-2">
              {{ trip.description }}
            </p>
            <div class="flex items-center gap-3 mt-2">
              <span class="text-xs text-[#8b857e] flex items-center gap-1">
                📅 {{ formatDate(trip.created_at) }}
              </span>
            </div>
          </div>

          <div class="flex md:flex-col gap-2">
            <button class="w-10 h-10 rounded-xl border border-[#efe9df] bg-[#fcfaf7] flex items-center justify-center hover:bg-[#0f4f3f] hover:text-white transition shadow-sm">
              <span class="text-lg">➔</span>
            </button>
          </div>
        </div>
      </section>
    </template>

    <!-- Empty State / No Profile -->
    <div v-else-if="!loading && !errorMessage" class="py-24 text-center bg-white rounded-2xl border border-[#efe9df]">
      <div class="text-4xl mb-4">👤</div>
      <h3 class="text-lg font-semibold">Profile not found</h3>
      <p class="text-gray-500 mt-2">We couldn't load your profile information.</p>
      <button @click="fetchProfileData" class="mt-6 px-6 py-2 bg-[#0f4f3f] text-white rounded-full font-semibold">
        Try Again
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { supabase } from '../../services/supabase'
import { getTrips, type Trip } from '../itinerary/services/itinerary.service'
import { API_BASE_URL } from '../itinerary/services/api'

interface ProfileEntity {
  id: string
  email: string
  first_name: string
  last_name: string
  avatar_url?: string
  bio?: string
  created_at: string
}

const loading = ref(false)
const profile = ref<ProfileEntity | null>(null)
const trips = ref<Trip[]>([])
const stats = ref({
  tripsCount: 0,
  placesCount: 0,
  countriesCount: 0,
  distanceKm: 0
})
const errorMessage = ref('')

const fetchProfileData = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    // 1. Get current session from Supabase
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError) throw sessionError

    if (!session?.user) {
      errorMessage.value = 'User not authenticated'
      loading.value = false
      return
    }

    const userId = session.user.id
    const token = session.access_token

    // 2. Fetch profile, trips and stats
    // We handle them with individual await or Promise.allSettled to be more resilient
    const [profileRes, tripsData, statsRes] = await Promise.allSettled([
      fetch(`${API_BASE_URL}/profiles/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }),
      getTrips(),
      fetch(`${API_BASE_URL}/profiles/stats/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
    ])

    // Handle Profile Result
    if (profileRes.status === 'fulfilled') {
      const res = profileRes.value
      if (res.ok) {
        profile.value = await res.json()
      } else {
        const err = await res.json().catch(() => ({}))
        errorMessage.value = err.message || `Failed to fetch profile (${res.status})`
      }
    } else {
      errorMessage.value = 'Failed to connect to the profile service'
    }

    // Handle Trips Result
    if (tripsData.status === 'fulfilled') {
      trips.value = tripsData.value
    }

    // Handle Stats Result
    if (statsRes.status === 'fulfilled' && statsRes.value.ok) {
      stats.value = await statsRes.value.json()
    }

    // Fallback if profile is null but we have session
    if (!profile.value && session?.user) {
      const meta = session.user.user_metadata || {}
      profile.value = {
        id: session.user.id,
        email: session.user.email || '',
        first_name: meta.first_name ,
        last_name: meta.last_name ,
        avatar_url: meta.avatar_url,
        bio: '',
        created_at: session.user.created_at
      }
    }

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Something went wrong while fetching profile'
    errorMessage.value = message
  } finally {
    loading.value = false
  }
}

onMounted(fetchProfileData)

const displayName = computed(() => {
  if (!profile.value) return 'Traveler'
  const full = `${profile.value.first_name} ${profile.value.last_name}`.trim()
  return full || profile.value.email.split('@')[0] 
})

const emailText = computed(() => {
  return profile.value?.email || 'Email not set'
})

const initials = computed(() => {
  const first = profile.value?.first_name?.[0] || 'T'
  const last = profile.value?.last_name?.[0] || 'R'
  return `${first}${last}`.toUpperCase()
})

const getTripImage = (trip: Trip) => {
  // Use a variety of images based on the trip ID so they look "different"
  // In a real app, this would come from the trip or its first destination
  const images = [
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=400',
    'https://images.unsplash.com/photo-1472396961693-142e6e269027?q=80&w=400',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=400',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=400',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=400'
  ]
  const index = Math.abs(trip.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % images.length
  return images[index]
}

const formatDate = (dateString?: string) => {
  if (!dateString) return 'No date'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.6s ease-out;
}

.animate-scale-in {
  animation: scaleIn 0.5s ease-out;
}

.animate-slide-up {
  animation: slideUp 0.6s ease-out both;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.line-clamp-2 {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

