import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../../../services/supabase'
import { API_BASE_URL } from '../../itinerary/services/api'

export interface ProfileEntity {
  id: string
  email: string
  first_name: string
  last_name: string
  avatar_url?: string
  bio?: string
  created_at: string
}

export const useUserStore = defineStore('user', () => {
  const profile = ref<ProfileEntity | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchProfile = async () => {
    loading.value = true
    error.value = null

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError) throw sessionError
      if (!session?.user) {
        profile.value = null
        return
      }

      const userId = session.user.id
      const token = session.access_token

      const res = await fetch(`${API_BASE_URL}/profiles/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      if (res.ok) {
        profile.value = await res.json()
      } else {
        const err = await res.json().catch(() => ({}))
        // If profile doesn't exist in DB, fallback to session metadata
        if (res.status === 404) {
          const meta = session.user.user_metadata || {}
          profile.value = {
            id: session.user.id,
            email: session.user.email || '',
            first_name: meta.first_name || '',
            last_name: meta.last_name || '',
            avatar_url: meta.avatar_url,
            bio: '',
            created_at: session.user.created_at
          }
        } else {
          error.value = err.message || `Failed to fetch profile (${res.status})`
        }
      }
    } catch (err: any) {
      error.value = err.message || 'Something went wrong while fetching profile'
      console.error('Error fetching profile:', err)
    } finally {
      loading.value = false
    }
  }

  const displayName = computed(() => {
    if (!profile.value) return 'Traveler'
    const full = `${profile.value.first_name || ''} ${profile.value.last_name || ''}`.trim()
    return full || profile.value.email.split('@')[0]
  })

  const initials = computed(() => {
    if (!profile.value) return 'TR'
    const first = profile.value.first_name?.[0] || profile.value.email?.[0] || 'T'
    const last = profile.value.last_name?.[0] || ''
    return `${first}${last}`.toUpperCase()
  })

  const avatarUrl = computed(() => profile.value?.avatar_url)
  const isAuthenticated = computed(() => !!profile.value)

  return {
    profile,
    loading,
    error,
    fetchProfile,
    displayName,
    initials,
    avatarUrl,
    isAuthenticated
  }
})
