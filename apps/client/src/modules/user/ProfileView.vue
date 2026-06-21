<template>
  <div
    class="min-h-screen px-4 md:px-12 py-10 bg-[radial-gradient(circle_at_20%_10%,#f7f2ea_0%,#f9f7f3_40%,#f4f1ec_100%)] text-[#1a1a1a] selection:bg-[#0f4f3f]/10"
  >
    <!-- Hidden File Input -->
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="handleAvatarUpload"
    />

    <!-- Error -->
    <div
      v-if="errorMessage"
      class="max-w-5xl mx-auto mb-8 bg-red-50/80 backdrop-blur-sm text-red-700 border border-red-100 rounded-2xl px-6 py-4 text-sm flex justify-between items-center animate-fade-in shadow-sm"
    >
      <div class="flex items-center gap-3">
        <span class="text-lg">⚠️</span>
        <span class="font-medium">{{ errorMessage }}</span>
      </div>
      <button @click="fetchProfileData" class="px-4 py-1.5 bg-red-600 text-white rounded-full text-xs font-bold hover:bg-red-700 transition-colors shadow-sm">
        Retry
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading && !profile" class="flex flex-col items-center justify-center py-32 animate-fade-in">
      <div class="relative w-12 h-12">
        <div class="absolute inset-0 rounded-full border-4 border-[#0f4f3f]/10"></div>
        <div class="absolute inset-0 rounded-full border-4 border-t-[#0f4f3f] animate-spin"></div>
      </div>
      <p class="mt-6 text-[#8b857e] font-medium tracking-wide animate-pulse uppercase text-[10px]">Synchronizing Profile</p>
    </div>

    <!-- PROFILE CARD -->
    <template v-else-if="profile">
      <div class="max-w-5xl mx-auto space-y-10">
        <section
          class="bg-white/70 backdrop-blur-md rounded-[2.5rem] overflow-hidden shadow-2xl shadow-[#0f4f3f]/5 border border-white/50 animate-scale-in relative group"
        >
          <!-- Cover -->
          <div class="relative h-56 md:h-64 overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 z-10"></div>
            <img
              src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1400"
              class="w-full h-full object-cover scale-100 group-hover:scale-105 transition duration-[2s] ease-out opacity-90"
            />
            <button
              class="absolute right-6 bottom-6 w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 text-white grid place-items-center hover:bg-white/40 transition-all duration-300 z-20 group/cam"
              @click="triggerAvatarUpload"
            >
              <span class="group-hover/cam:scale-110 transition-transform">📷</span>
            </button>
          </div>

          <!-- Body -->
          <div class="px-8 pb-8 pt-0 relative">
            <div class="flex flex-col md:flex-row md:items-end gap-6 -mt-16 md:-mt-20 relative z-20">
              <!-- Avatar -->
              <div
                class="relative w-32 h-32 md:w-40 md:h-40 rounded-[2rem] overflow-hidden bg-[#0f4f3f] text-white grid place-items-center font-bold shadow-2xl border-[6px] border-white mx-auto md:mx-0 group/avatar cursor-pointer"
                @click="triggerAvatarUpload"
              >
                <div v-if="uploadingAvatar" class="absolute inset-0 bg-black/40 backdrop-blur-sm z-30 grid place-items-center">
                  <div class="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                </div>

                <img v-if="profile.avatar_url" :src="profile.avatar_url" class="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                <template v-else>
                  <span class="text-4xl tracking-tighter">{{ initials }}</span>
                </template>

                <!-- Hover Overlay -->
                <div class="absolute inset-0 bg-black/0 group-hover/avatar:bg-black/20 transition-all duration-500 grid place-items-center opacity-0 group-hover/avatar:opacity-100">
                  <span class="text-white text-xs font-bold uppercase tracking-widest bg-[#0f4f3f]/80 px-3 py-1.5 rounded-full backdrop-blur-md">Change</span>
                </div>

                <span
                  class="absolute bottom-3 right-3 w-5 h-5 bg-green-500 border-4 border-white rounded-full shadow-lg z-20"
                ></span>
              </div>

              <!-- Info -->
              <div class="flex-1 text-center md:text-left pb-2">
                <h2 class="text-3xl md:text-4xl font-bold tracking-tight text-[#1a1a1a] mb-1">
                  {{ displayName }}
                </h2>
                <p class="text-[#8b857e] font-medium flex items-center justify-center md:justify-start gap-2">
                  <span class="w-1.5 h-1.5 rounded-full bg-[#0f4f3f]/30"></span>
                  {{ emailText }}
                </p>
              </div>

              <!-- Button -->
              <div class="pb-2">
                <button
                  class="px-8 py-3 rounded-2xl bg-[#0f4f3f] text-white text-sm font-bold hover:bg-[#0d4537] hover:-translate-y-1 hover:shadow-xl hover:shadow-[#0f4f3f]/20 active:translate-y-0 transition-all duration-300 shadow-lg shadow-[#0f4f3f]/10"
                  @click="$router.push('/profile/edit')"
                >
                  Edit Profile
                </button>
              </div>
            </div>

            <!-- Bio & Stats Grid -->
            <div class="grid lg:grid-cols-[1fr_auto] gap-12 mt-12 items-start">
              <div class="space-y-4">
                <h3 class="text-[10px] uppercase tracking-[0.2em] font-bold text-[#0f4f3f]">Biography</h3>
                <p class="text-base text-gray-600 leading-relaxed max-w-2xl font-medium">
                  {{ profile.bio || 'Traveling enthusiast exploring the world\'s hidden gems and creating unforgettable memories along the way.' }}
                </p>
              </div>

              <!-- Stats -->
              <div class="flex gap-4 md:gap-8">
                <div class="group/stat">
                  <strong class="block text-3xl font-bold text-[#1a1a1a] group-hover:text-[#0f4f3f] transition-colors tracking-tighter">{{ stats.tripsCount }}</strong>
                  <span class="text-[10px] font-bold text-[#8b857e] uppercase tracking-widest">Trips</span>
                </div>
                <div class="w-px h-10 bg-[#f0ebe1] self-center"></div>
                <div class="group/stat">
                  <strong class="block text-3xl font-bold text-[#1a1a1a] group-hover:text-[#0f4f3f] transition-colors tracking-tighter">{{ stats.placesCount }}</strong>
                  <span class="text-[10px] font-bold text-[#8b857e] uppercase tracking-widest">Places</span>
                </div>
                <div class="w-px h-10 bg-[#f0ebe1] self-center"></div>
                <div class="group/stat">
                  <strong class="block text-3xl font-bold text-[#1a1a1a] group-hover:text-[#0f4f3f] transition-colors tracking-tighter">{{ stats.countriesCount || '1' }}</strong>
                  <span class="text-[10px] font-bold text-[#8b857e] uppercase tracking-widest">Countries</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- NAVIGATION -->
        <div class="space-y-8">
          <!-- TABS -->
          <div class="flex items-center justify-between border-b border-[#0f4f3f]/5 pb-0.5">
            <div class="flex gap-8">
              <button
                v-for="tab in ['trips', 'saved', 'history']"
                :key="tab"
                class="pb-4 text-sm font-bold uppercase tracking-[0.15em] transition-all relative group"
                :class="activeTab === tab ? 'text-[#0f4f3f]' : 'text-[#8b857e] hover:text-[#1a1a1a]'"
                @click="activeTab = tab"
              >
                {{ tab === 'trips' ? 'My Journeys' : tab }}
                <span
                  class="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0f4f3f] transition-all duration-500 rounded-full"
                  :class="activeTab === tab ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0 group-hover:opacity-30 group-hover:scale-x-50'"
                ></span>
              </button>
            </div>
          </div>

          <!-- CONTENT -->
          <div class="min-h-[400px]">
            <!-- MY TRIPS -->
            <transition name="fade-slide" mode="out-in">
              <section v-if="activeTab === 'trips'" :key="'trips'" class="grid gap-6">
                <div v-if="trips.length === 0" class="py-32 text-center bg-white/40 backdrop-blur-sm rounded-[2rem] border-2 border-dashed border-[#efe9df] text-[#8b857e] animate-fade-in">
                  <div class="text-5xl mb-6 grayscale opacity-50">🧭</div>
                  <h3 class="text-xl font-bold text-[#1a1a1a] mb-2">No adventures logged</h3>
                  <p class="font-medium max-w-xs mx-auto mb-8">Ready to start your next chapter? Let's map out your first trip.</p>
                  <router-link to="/trips" class="px-8 py-3 bg-[#0f4f3f] text-white rounded-2xl text-xs font-bold hover:shadow-xl hover:shadow-[#0f4f3f]/20 transition-all uppercase tracking-widest">
                    Create New Trip
                  </router-link>
                </div>

                <!-- Card -->
                <div
                  v-for="(trip, index) in trips"
                  :key="trip.id"
                  @click="$router.push(`/trips/${trip.id}`)"
                  class="group cursor-pointer grid md:grid-cols-[240px_1fr_auto] gap-0 bg-white border border-white/50 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-[#0f4f3f]/5 hover:-translate-y-1.5 transition-all duration-500 animate-slide-up"
                  :style="{ animationDelay: `${(index + 1) * 80}ms` }"
                >
                  <div class="h-48 md:h-full overflow-hidden relative">
                    <div class="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-500 z-10"></div>
                    <img
                      :src="getTripImage(trip)"
                      class="w-full h-full object-cover group-hover:scale-110 transition duration-[1.5s] ease-out"
                    />
                  </div>

                  <div class="p-8 flex flex-col justify-center gap-3">
                    <div class="flex items-center gap-3">
                      <span class="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border" :class="trip.visibility === 'public' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500 border-gray-100'">
                        {{ trip.visibility || 'private' }}
                      </span>
                      <span class="text-[10px] font-bold text-[#8b857e] flex items-center gap-1.5">
                        <span class="w-1 h-1 rounded-full bg-[#8b857e]/40"></span>
                        {{ formatDate(trip.created_at) }}
                      </span>
                    </div>
                    <h3 class="text-2xl font-bold text-[#1a1a1a] group-hover:text-[#0f4f3f] transition-colors tracking-tight leading-tight">{{ trip.title }}</h3>
                    <p v-if="trip.description" class="text-sm text-gray-500 line-clamp-2 leading-relaxed font-medium pr-8">
                      {{ trip.description }}
                    </p>
                  </div>

                  <div class="hidden md:flex items-center px-8">
                    <div class="w-12 h-12 rounded-2xl bg-[#fcfaf7] border border-[#f0ebe1] flex items-center justify-center group-hover:bg-[#0f4f3f] group-hover:text-white group-hover:border-[#0f4f3f] transition-all duration-300 shadow-sm">
                      <span class="text-xl group-hover:translate-x-0.5 transition-transform duration-300">→</span>
                    </div>
                  </div>
                </div>
              </section>

              <!-- SAVED TRIPS -->
              <SaveTrip v-else-if="activeTab === 'saved'" :key="'saved'" />

              <!-- HISTORY TRIPS -->
              <HistoryTrip v-else-if="activeTab === 'history'" :key="'history'" />
            </transition>
          </div>
        </div>
      </div>
    </template>

    <!-- Empty State / No Profile -->
    <div v-else-if="!loading && !errorMessage" class="py-32 text-center max-w-lg mx-auto animate-fade-in">
      <div class="w-24 h-24 bg-white rounded-[2.5rem] shadow-xl shadow-[#0f4f3f]/5 border border-white mx-auto grid place-items-center text-4xl mb-8">👤</div>
      <h3 class="text-2xl font-bold text-[#1a1a1a] mb-3 tracking-tight">Profile lost in transit</h3>
      <p class="text-gray-500 font-medium leading-relaxed mb-10">We couldn't retrieve your explorer data. Please try refreshing your connection.</p>
      <button @click="fetchProfileData" class="px-10 py-4 bg-[#0f4f3f] text-white rounded-2xl font-bold hover:shadow-2xl hover:shadow-[#0f4f3f]/20 hover:-translate-y-1 transition-all uppercase tracking-widest text-xs">
        Reconnect Profile
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/core/services/supabase'
import { getTrips, type Trip } from '../itinerary/services/itinerary.service'
import { API_BASE_URL } from '../itinerary/services/api'
import SaveTrip from './SaveTrip.vue'
import HistoryTrip from './HistoryTrip.vue'

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
const uploadingAvatar = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const profile = ref<ProfileEntity | null>(null)
const trips = ref<Trip[]>([])
const stats = ref({
  tripsCount: 0,
  placesCount: 0,
  countriesCount: 0,
  distanceKm: 0
})
const errorMessage = ref('')
const activeTab = ref('trips')

const fetchProfileData = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) throw sessionError
    if (!session?.user) {
      errorMessage.value = 'User not authenticated'
      loading.value = false
      return
    }

    const userId = session.user.id
    const token = session.access_token

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

    if (profileRes.status === 'fulfilled') {
      const res = profileRes.value
      if (res.ok) {
        profile.value = await res.json()
      } else {
        const err = await res.json().catch(() => ({}))
        errorMessage.value = err.message || `Failed to fetch profile (${res.status})`
      }
    }

    if (tripsData.status === 'fulfilled') {
      trips.value = tripsData.value
    }

    if (statsRes.status === 'fulfilled' && statsRes.value.ok) {
      stats.value = await statsRes.value.json()
    }

    if (!profile.value && session?.user) {
      const meta = session.user.user_metadata || {}
      profile.value = {
        id: session.user.id,
        email: session.user.email || '',
        first_name: meta.first_name,
        last_name: meta.last_name,
        avatar_url: meta.avatar_url,
        bio: '',
        created_at: session.user.created_at
      }
    }
  } catch (err: unknown) {
    errorMessage.value = err instanceof Error ? err.message : 'Something went wrong while fetching profile'
  } finally {
    loading.value = false
  }
}

const triggerAvatarUpload = () => {
  fileInput.value?.click()
}

const handleAvatarUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  uploadingAvatar.value = true
  errorMessage.value = ''

  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error('Not authenticated')

    const fileExt = file.name.split('.').pop()
    const filePath = `${session.user.id}/${Math.random()}.${fileExt}`

    // 1. Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type
      })

    if (uploadError) {
      console.error('[Storage Upload Error]', uploadError)
      throw new Error(`Upload failed: ${uploadError.message}`)
    }

    // 2. Get Public URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath)

    // 3. Update Profile via API
    const res = await fetch(`${API_BASE_URL}/profiles/${session.user.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({ avatar_url: publicUrl })
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      console.error('[API Update Error]', err)
      throw new Error(err.message || 'Failed to update profile image in database')
    }

    // 4. Success - Refresh local data
    await fetchProfileData()
  } catch (err: unknown) {
    errorMessage.value = err instanceof Error ? err.message : 'Upload failed'
  } finally {
    uploadingAvatar.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}

onMounted(fetchProfileData)

const displayName = computed(() => {
  if (!profile.value) return 'Traveler'
  const full = `${profile.value.first_name} ${profile.value.last_name}`.trim()
  return full || profile.value.email.split('@')[0]
})

const emailText = computed(() => profile.value?.email || 'Email not set')

const initials = computed(() => {
  const first = profile.value?.first_name?.[0] || 'T'
  const last = profile.value?.last_name?.[0] || 'R'
  return `${first}${last}`.toUpperCase()
})

const getTripImage = (trip: Trip) => {
  const images = [
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=600',
    'https://images.unsplash.com/photo-1472396961693-142e6e269027?q=80&w=600',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=600',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=600',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=600'
  ]
  const index = Math.abs(trip.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % images.length
  return images[index]
}

const formatDate = (dateString?: string) => {
  if (!dateString) return 'No date'
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.8s ease-out both;
}

.animate-scale-in {
  animation: scaleIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.animate-slide-up {
  animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.98) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
