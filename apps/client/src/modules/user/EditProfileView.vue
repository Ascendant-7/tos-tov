<template>
  <div class="min-h-screen px-6 md:px-8 py-8 bg-[radial-gradient(circle_at_20%_10%,#f7f2ea_0%,#f9f7f3_40%,#f4f1ec_100%)] text-[#1a1a1a]">
    <header class="flex items-center justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-semibold text-[#2b2b2b]">Edit Profile</h1>
        <p class="text-sm text-gray-500">Update your public information</p>
      </div>

      <div class="flex items-center gap-3">
        <button
          type="button"
          class="px-5 py-2 rounded-full bg-white border border-[#efe9df] text-sm font-semibold hover:shadow-sm transition"
          @click="cancel"
        >
          Cancel
        </button>
        <button
          type="button"
          class="px-6 py-2 rounded-full bg-[#0f4f3f] text-white text-sm font-semibold hover:-translate-y-0.5 hover:shadow-lg transition shadow-md disabled:opacity-60 disabled:hover:translate-y-0"
          :disabled="saving || loading"
          @click="save"
        >
          {{ saving ? 'Saving...' : 'Save' }}
        </button>
      </div>
    </header>

    <div
      v-if="errorMessage"
      class="mb-6 bg-red-100 text-red-700 border border-red-300 rounded-xl px-4 py-3 text-sm flex justify-between items-center"
    >
      <span>{{ errorMessage }}</span>
      <button @click="load" class="underline font-semibold ml-4">Retry</button>
    </div>

    <section class="bg-white rounded-2xl shadow-lg border border-[#efe9df] overflow-hidden">
      <div class="p-6">
        <div v-if="loading" class="py-10 text-center text-gray-500">
          Loading profile...
        </div>

        <form v-else class="grid gap-5" @submit.prevent>
          <div class="grid md:grid-cols-2 gap-4">
            <label class="grid gap-2">
              <span class="text-sm font-semibold text-[#2b2b2b]">First name</span>
              <input
                v-model.trim="form.first_name"
                type="text"
                class="px-4 py-3 rounded-xl border border-[#efe9df] bg-[#fcfaf7] outline-none focus:ring-2 focus:ring-[#0f4f3f]/20"
                placeholder="First name"
              />
            </label>

            <label class="grid gap-2">
              <span class="text-sm font-semibold text-[#2b2b2b]">Last name</span>
              <input
                v-model.trim="form.last_name"
                type="text"
                class="px-4 py-3 rounded-xl border border-[#efe9df] bg-[#fcfaf7] outline-none focus:ring-2 focus:ring-[#0f4f3f]/20"
                placeholder="Last name"
              />
            </label>
          </div>

          <label class="grid gap-2">
            <span class="text-sm font-semibold text-[#2b2b2b]">Avatar URL</span>
            <input
              v-model.trim="form.avatar_url"
              type="url"
              class="px-4 py-3 rounded-xl border border-[#efe9df] bg-[#fcfaf7] outline-none focus:ring-2 focus:ring-[#0f4f3f]/20"
              placeholder="https://..."
            />
            <span class="text-xs text-gray-500">Optional. Use a public image URL.</span>
          </label>

          <label class="grid gap-2">
            <span class="text-sm font-semibold text-[#2b2b2b]">Bio</span>
            <textarea
              v-model.trim="form.bio"
              rows="4"
              class="px-4 py-3 rounded-xl border border-[#efe9df] bg-[#fcfaf7] outline-none focus:ring-2 focus:ring-[#0f4f3f]/20 resize-none"
              placeholder="Tell people a little about you..."
            />
          </label>

          <p v-if="successMessage" class="text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
            {{ successMessage }}
          </p>
        </form>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/core/services/supabase'
import { API_BASE_URL } from '../itinerary/services/api'

type ProfileUpdatePayload = {
  first_name?: string
  last_name?: string
  avatar_url?: string
  bio?: string
}

const router = useRouter()

const loading = ref(false)
const saving = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const userId = ref<string | null>(null)
const token = ref<string | null>(null)

const form = reactive<Required<ProfileUpdatePayload>>({
  first_name: '',
  last_name: '',
  avatar_url: '',
  bio: '',
})

const cancel = () => {
  router.push('/profile')
}

const load = async () => {
  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError) throw sessionError
    if (!session?.user) throw new Error('User not authenticated')

    userId.value = session.user.id
    token.value = session.access_token

    const res = await fetch(`${API_BASE_URL}/profiles/${userId.value}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.value}`,
      },
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || `Failed to load profile (${res.status})`)
    }

    const profile = (await res.json()) as {
      first_name?: string | null
      last_name?: string | null
      avatar_url?: string | null
      bio?: string | null
    }

    form.first_name = profile.first_name || ''
    form.last_name = profile.last_name || ''
    form.avatar_url = profile.avatar_url || ''
    form.bio = profile.bio || ''
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to load profile'
    errorMessage.value = message
  } finally {
    loading.value = false
  }
}

const save = async () => {
  if (!userId.value || !token.value) {
    errorMessage.value = 'User not authenticated'
    return
  }

  saving.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const payload: ProfileUpdatePayload = {
      first_name: form.first_name,
      last_name: form.last_name,
      avatar_url: form.avatar_url || undefined,
      bio: form.bio,
    }

    const res = await fetch(`${API_BASE_URL}/profiles/${userId.value}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.value}`,
      },
      body: JSON.stringify(payload),
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      throw new Error(data.message || `Failed to save profile (${res.status})`)
    }

    successMessage.value = 'Profile updated successfully'

    setTimeout(() => {
      router.push('/profile')
    }, 600)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to save profile'
    errorMessage.value = message
  } finally {
    saving.value = false
  }
}

onMounted(load)
</script>
