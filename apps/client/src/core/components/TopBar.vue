<template>
  <header
    class="flex items-center justify-between px-4 sm:px-8 py-3 sm:py-4 bg-cream border-b border-weather-border/60 animate-slide-down sticky top-0 z-20 gap-3"
  >
    <!-- Left: Hamburger + Title -->
    <div class="flex items-center gap-3 shrink-0">
      <!-- Mobile hamburger -->
      <button
        @click="$emit('toggle-sidebar')"
        class="lg:hidden w-9 h-9 rounded-lg bg-white border border-weather-border flex items-center justify-center text-slate-600 cursor-pointer transition-all duration-200 hover:bg-cream-dark"
        aria-label="Toggle menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="4" x2="20" y1="12" y2="12" />
          <line x1="4" x2="20" y1="6" y2="6" />
          <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
      </button>
      <!-- <h2 class="text-base sm:text-lg font-semibold text-slate-800 m-0 whitespace-nowrap">
        {{ pageTitle }}
      </h2> -->
    </div>

    <!-- Right Section -->
    <div class="flex items-center gap-2 sm:gap-4">
      <!-- Search Bar (hidden on small screens) -->
      <div class="relative hidden sm:block" ref="searchContainerRef">
        <svg
          class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          v-model="searchQuery"
          @focus="showDropdown = true"
          type="text"
          placeholder="Search destinations & users..."
          class="w-[180px] md:w-[300px] py-2 pl-9 pr-9 rounded-xl border border-weather-border bg-white text-sm text-slate-600 outline-none transition-all duration-200 focus:border-sidebar-active focus:shadow-[0_0_0_3px_rgba(42,90,66,0.08)] placeholder:text-slate-400"
        />
        <!-- Clear button -->
        <button
          v-if="searchQuery"
          @click="clearSearch"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-200 cursor-pointer border-none bg-transparent p-1"
          aria-label="Clear search"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <!-- Search Dropdown -->
        <Transition name="dropdown">
          <div
            v-if="showDropdown && searchQuery.trim().length > 0"
            class="search-dropdown"
          >
            <!-- Loading -->
            <div v-if="isSearching" class="search-loading">
              <div class="search-spinner"></div>
              <span>Searching...</span>
            </div>

            <template v-else>
              <!-- Destinations Section -->
              <div v-if="matchedDestinations.length > 0" class="search-section">
                <div class="search-section-header">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>Destinations</span>
                  <span class="search-count">{{ matchedDestinations.length }}</span>
                </div>
                <router-link
                  v-for="dest in matchedDestinations"
                  :key="'d-' + (dest.id || dest.name)"
                  :to="dest.id ? `/explore/${dest.id}` : '/explore'"
                  class="search-result-item"
                  @click="closeDropdown"
                >
                  <div class="search-result-image">
                    <img
                      v-if="dest.cover_image_url || dest.image"
                      :src="dest.cover_image_url || dest.image"
                      :alt="dest.name"
                    />
                    <div v-else class="search-result-image-placeholder">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                  </div>
                  <div class="search-result-info">
                    <span class="search-result-name">{{ dest.name }}</span>
                    <span class="search-result-meta">
                      {{ dest.location_name || dest.location || dest.province }}
                      <span v-if="dest.rating" class="search-result-rating">
                        ⭐ {{ dest.rating }}
                      </span>
                    </span>
                  </div>
                  <span v-if="dest.badge" :class="['search-badge', dest.badge === 'Trending' ? 'badge-trending' : 'badge-gem']">
                    {{ dest.badge }}
                  </span>
                </router-link>
              </div>

              <!-- Users Section -->
              <div v-if="matchedUsers.length > 0" class="search-section">
                <div class="search-section-header">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span>Users</span>
                  <span class="search-count">{{ matchedUsers.length }}</span>
                </div>
                <div
                  v-for="user in matchedUsers"
                  :key="'u-' + user.id"
                  class="search-result-item"
                  @click="closeDropdown"
                >
                  <div class="search-result-avatar" :style="{ background: getAvatarColor(user.first_name || user.email || '') }">
                    {{ getUserInitials(user) }}
                  </div>
                  <div class="search-result-info">
                    <span class="search-result-name">{{ getUserDisplayName(user) }}</span>
                    <span class="search-result-meta">{{ user.email || 'No email' }}</span>
                  </div>
                </div>
              </div>

              <!-- No Results -->
              <div v-if="matchedDestinations.length === 0 && matchedUsers.length === 0" class="search-empty">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-slate-300">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                <span>No results for "{{ searchQuery }}"</span>
              </div>
            </template>
          </div>
        </Transition>
      </div>

      <!-- Mobile search button (visible on small screens only) -->
      <button
        class="sm:hidden w-9 h-9 rounded-xl bg-white border border-weather-border flex items-center justify-center text-slate-500 cursor-pointer transition-all duration-200 hover:bg-cream-dark"
        aria-label="Search"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </button>

      <!-- Notification Bell -->
      <button
        class="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white border border-weather-border flex items-center justify-center text-slate-500 cursor-pointer transition-all duration-200 hover:bg-cream-dark hover:text-slate-700 hover:border-slate-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
        <span
          class="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-2 h-2 bg-red-500 rounded-full"
        ></span>
      </button>

      <!-- Login/Logout Button -->
      <router-link
        v-if="!isAuthed"
        to="/login?force=1"
        class="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-sky-700 to-cyan-500 text-white text-sm font-semibold shadow-[0_10px_20px_rgba(14,116,144,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_24px_rgba(14,116,144,0.35)]"
      >
        <span>Login</span>
      </router-link>
      <button
        v-else
        type="button"
        @click="logout"
        class="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-sky-700 to-cyan-500 text-white text-sm font-semibold shadow-[0_10px_20px_rgba(14,116,144,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_24px_rgba(14,116,144,0.35)]"
      >
        <span>Logout</span>
      </button>

      <!-- User Avatar -->
      <div
        class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-accent-gold flex items-center justify-center text-white text-xs sm:text-sm font-bold cursor-pointer transition-transform duration-200 hover:scale-105 shadow-[0_2px_8px_rgba(200,169,81,0.3)]"
      >
        YO
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, onBeforeUnmount, ref, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useHomepageStore } from '../../modules/home/stores/homepage'
import { useExploreStore } from '../../modules/explore/store/explore'
import { supabase } from '../../services/supabase'
import { searchProfiles, type ProfileSearchResult } from '../../modules/explore/services/profilesApi'

defineEmits<{ 'toggle-sidebar': [] }>()

const route = useRoute()
const router = useRouter()
const homepageStore = useHomepageStore()
const exploreStore = useExploreStore()
const { searchQuery } = storeToRefs(homepageStore)

const isAuthed = ref(false)

let authUnsubscribe: (() => void) | null = null
const showDropdown = ref(false)
const isSearching = ref(false)
const matchedUsers = ref<ProfileSearchResult[]>([])
const searchContainerRef = ref<HTMLDivElement | null>(null)

let debounceTimer: ReturnType<typeof setTimeout> | null = null

const pageTitles: Record<string, string> = {
  home: 'Dashboard',
  explore: 'Explore',
  'trip-planner': 'Trip Planner',
  'my-trips': 'My Trips',
  'shared-trips': 'Shared Trips',
  'trip-itinerary': 'Itinerary',
  social: 'Social Travel',
  community: 'Community',
  profile: 'Profile',
}

onMounted(async () => {
  const { data } = await supabase.auth.getSession()
  isAuthed.value = !!data.session

  const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
    isAuthed.value = !!session
  })

  authUnsubscribe = () => {
    authListener.subscription.unsubscribe()
  }
})

onUnmounted(() => {
  authUnsubscribe?.()
  authUnsubscribe = null
})

async function logout() {
  await supabase.auth.signOut()
  await router.push('/login?force=1')
}
// Filter destinations from explore store
const matchedDestinations = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  if (!q) return []
  return exploreStore.destinations
    .filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        (d.location_name ?? '').toLowerCase().includes(q) ||
        d.province.toLowerCase().includes(q) ||
        (d.description ?? '').toLowerCase().includes(q) ||
        (d.tags ?? []).some((t) => t.toLowerCase().includes(q)),
    )
    .slice(0, 5)
})

// Debounced user search
watch(searchQuery, (val) => {
  if (debounceTimer) clearTimeout(debounceTimer)
  const q = val.trim()
  if (!q) {
    matchedUsers.value = []
    return
  }
  isSearching.value = true
  debounceTimer = setTimeout(async () => {
    try {
      matchedUsers.value = await searchProfiles(q)
    } catch {
      matchedUsers.value = []
    } finally {
      isSearching.value = false
    }
  }, 350)
})

// Clear search and reset filters when navigating to explore page
watch(
  () => route.name,
  (newRouteName) => {
    if (newRouteName === 'explore') {
      searchQuery.value = ''
      exploreStore.setTrendingFilter(false)
    }
  },
)

// Close dropdown on outside click
function handleClickOutside(e: MouseEvent) {
  if (searchContainerRef.value && !searchContainerRef.value.contains(e.target as Node)) {
    showDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

function clearSearch() {
  searchQuery.value = ''
  matchedUsers.value = []
  showDropdown.value = false
}

function closeDropdown() {
  showDropdown.value = false
}

// User helpers
function getUserDisplayName(user: ProfileSearchResult) {
  const first = user.first_name?.trim()
  const last = user.last_name?.trim()
  if (first || last) return [first, last].filter(Boolean).join(' ')
  return user.email || 'Unknown User'
}

function getUserInitials(user: ProfileSearchResult) {
  const name = getUserDisplayName(user)
  const parts = name.split(' ').filter(Boolean)
  const a = parts[0]?.[0] || '?'
  const b = parts[1]?.[0] || ''
  return `${a}${b}`.toUpperCase()
}

function getAvatarColor(seed: string) {
  const colors = [
    'linear-gradient(135deg, #0f4f3f 0%, #1a7a5a 100%)',
    'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
    'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
    'linear-gradient(135deg, #b45309 0%, #f59e0b 100%)',
    'linear-gradient(135deg, #be123c 0%, #f43f5e 100%)',
    'linear-gradient(135deg, #0e7490 0%, #22d3ee 100%)',
  ]
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}
</script>

<style scoped>
/* ── Search Dropdown ────────────────────────────────────── */
.search-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  min-width: 340px;
  max-height: 420px;
  overflow-y: auto;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.12),
    0 4px 16px rgba(0, 0, 0, 0.06);
  z-index: 50;
  padding: 6px;
}

.search-dropdown::-webkit-scrollbar {
  width: 5px;
}

.search-dropdown::-webkit-scrollbar-track {
  background: transparent;
}

.search-dropdown::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 10px;
}

/* ── Section ─────────────────────────────────────────────── */
.search-section {
  padding: 4px 0;
}

.search-section + .search-section {
  border-top: 1px solid #f1f5f9;
  margin-top: 4px;
  padding-top: 8px;
}

.search-section-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px 8px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #94a3b8;
}

.search-count {
  margin-left: auto;
  background: #f1f5f9;
  color: #64748b;
  font-size: 10px;
  padding: 1px 7px;
  border-radius: 99px;
  font-weight: 700;
}

/* ── Result Items ────────────────────────────────────────── */
.search-result-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.15s ease;
  text-decoration: none;
  color: inherit;
}

.search-result-item:hover {
  background: #f8fafc;
}

.search-result-image {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  overflow: hidden;
  flex-shrink: 0;
}

.search-result-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.search-result-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
  color: #94a3b8;
}

.search-result-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: white;
  font-size: 13px;
  font-weight: 700;
}

.search-result-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.search-result-name {
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.search-result-meta {
  font-size: 11px;
  color: #94a3b8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  gap: 6px;
}

.search-result-rating {
  font-size: 11px;
  color: #f59e0b;
  font-weight: 600;
}

/* ── Badges ──────────────────────────────────────────────── */
.search-badge {
  font-size: 10px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 99px;
  white-space: nowrap;
  flex-shrink: 0;
}

.badge-trending {
  background: #ecfdf5;
  color: #059669;
}

.badge-gem {
  background: #f5f3ff;
  color: #7c3aed;
}

/* ── Loading ─────────────────────────────────────────────── */
.search-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 24px 16px;
  color: #94a3b8;
  font-size: 13px;
}

.search-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid #e2e8f0;
  border-top-color: #0f4f3f;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ── Empty State ─────────────────────────────────────────── */
.search-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 28px 16px;
  color: #94a3b8;
  font-size: 13px;
}

/* ── Transition ──────────────────────────────────────────── */
.dropdown-enter-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.dropdown-leave-active {
  transition: all 0.15s ease-in;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-8px) scale(0.97);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}
</style>
