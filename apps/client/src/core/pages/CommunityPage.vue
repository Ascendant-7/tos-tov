<template>
  <main class="flex-1 h-screen overflow-y-auto bg-cream box-border font-sans custom-scrollbar">
    <CommunityView :active-comment-post-id="activeCommentPostId" :new-comment="newComment"
      @create-post="showCreatePostModal = true" @share-post="sharePost" @toggle-comments="toggleComments"
      @request-delete="requestDeletePost" @update:new-comment="newComment = $event" @submit-comment="addComment" />

    <div v-if="showCreatePostModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div class="w-full max-w-[500px] max-h-[80vh] overflow-y-auto rounded-2xl bg-white">
        <div class="sticky top-0 flex items-center justify-between border-b border-weather-border bg-white p-5 sm:p-6">
          <h3 class="m-0 text-[16px] font-bold text-slate-800 sm:text-[18px]">Share Your Experience</h3>
          <button aria-label="Close modal"
            class="cursor-pointer rounded-lg border-none bg-transparent p-1 transition-colors hover:bg-cream"
            @click="closeCreatePostModal">
            <FontAwesomeIcon :icon="faXmark" class="h-5 w-5 text-slate-700" />
          </button>
        </div>

        <div class="space-y-4 p-5 sm:p-6">
          <div class="space-y-2">
            <label class="text-[12px] font-semibold text-slate-700">Destination</label>
            <div v-if="selectedDestination"
              class="flex items-center justify-between gap-3 rounded-xl border border-weather-border bg-cream/60 px-4 py-3">
              <div class="min-w-0">
                <p class="m-0 truncate text-[13px] font-semibold text-slate-800">{{ selectedDestination.name }}</p>
                <p class="m-0 truncate text-[12px] text-slate-500">
                  {{ [selectedDestination.province, selectedDestination.locationName].filter(Boolean).join(' - ') }}
                </p>
              </div>
              <button class="text-[12px] font-semibold text-sidebar-active" @click="clearSelectedDestination">
                Change
              </button>
            </div>

            <div v-else class="relative">
              <div class="relative">
                <FontAwesomeIcon :icon="faLocationDot"
                  class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input v-model="destinationQuery" type="search" placeholder="Search destination..."
                  class="w-full rounded-xl border border-weather-border py-3 pl-10 pr-4 text-[13px] text-slate-800 outline-none focus:border-sidebar-active focus:ring-1 focus:ring-sidebar-active/20 sm:text-[14px]"
                  @focus="isDestinationSearchFocused = true"
                  @blur="hideDestinationDropdown" />
              </div>

              <div v-if="showDestinationDropdown"
                class="absolute z-10 mt-2 max-h-56 w-full overflow-y-auto rounded-xl border border-weather-border bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
                <button v-for="destination in communityStore.destinationResults" :key="destination.id"
                  class="flex w-full items-center gap-3 border-none bg-white px-4 py-3 text-left transition-colors hover:bg-cream"
                  @click="selectDestination(destination)">
                  <img :src="destination.coverImageUrl || fallbackDestinationImage" :alt="destination.name"
                    class="h-10 w-10 rounded-lg object-cover" />
                  <span class="min-w-0">
                    <span class="block truncate text-[13px] font-semibold text-slate-800">{{ destination.name }}</span>
                    <span class="block truncate text-[12px] text-slate-500">
                      {{ [destination.province, destination.locationName].filter(Boolean).join(' - ') || 'Cambodia' }}
                    </span>
                  </span>
                </button>

                <div v-if="communityStore.isSearchingDestinations" class="px-4 py-3 text-[12px] text-slate-500">
                  Searching...
                </div>
                <div v-else-if="communityStore.destinationResults.length === 0"
                  class="px-4 py-3 text-[12px] text-slate-500">
                  No destinations found.
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <label class="space-y-2">
              <span class="text-[12px] font-semibold text-slate-700">Trip status</span>
              <select v-model="visitStatus"
                class="w-full rounded-xl border border-weather-border bg-white px-4 py-3 text-[13px] text-slate-800 outline-none focus:border-sidebar-active focus:ring-1 focus:ring-sidebar-active/20">
                <option value="visited">Visited</option>
                <option value="want_to_go">Want to go</option>
              </select>
            </label>

            <label class="space-y-2">
              <span class="text-[12px] font-semibold text-slate-700">Visibility</span>
              <select v-model="visibility"
                class="w-full rounded-xl border border-weather-border bg-white px-4 py-3 text-[13px] text-slate-800 outline-none focus:border-sidebar-active focus:ring-1 focus:ring-sidebar-active/20">
                <option value="public">Public</option>
                <option value="friends">Friends</option>
                <option value="private">Private</option>
              </select>
            </label>
          </div>

          <label class="space-y-2">
            <span class="text-[12px] font-semibold text-slate-700">Title <span class="font-normal text-slate-400">(optional)</span></span>
            <input v-model="newPostTitle" type="text" maxlength="120"
              placeholder="Add a short title..."
              class="w-full rounded-xl border border-weather-border px-4 py-3 text-[13px] text-slate-800 outline-none focus:border-sidebar-active focus:ring-1 focus:ring-sidebar-active/20 sm:text-[14px]" />
          </label>

          <label class="space-y-2">
            <span class="text-[12px] font-semibold text-slate-700">Caption</span>
            <textarea v-model="newPostText"
            placeholder="Write a caption... #AngkorWat #Adventure"
            class="h-24 w-full resize-none rounded-xl border border-weather-border p-4 text-[13px] text-slate-800 outline-none focus:border-sidebar-active focus:ring-1 focus:ring-sidebar-active/20 sm:text-[14px]" />
          </label>

          <div class="space-y-3 rounded-xl border border-dashed border-weather-border bg-cream/60 p-4">
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-2 text-slate-700">
                <FontAwesomeIcon :icon="faImage" class="h-4 w-4" />
                <span class="text-[13px] font-semibold sm:text-[14px]">Upload media</span>
                <span v-if="selectedMedia.length > 0" class="text-[12px] text-slate-500">({{ selectedMedia.length
                }})</span>
              </div>
              <button v-if="selectedMedia.length > 0"
                class="text-[12px] font-medium text-slate-500 transition-colors hover:text-red-500"
                @click="clearAllMedia">
                Clear All
              </button>
            </div>

            <label
              class="flex cursor-pointer items-center justify-center rounded-xl border border-weather-border bg-white px-4 py-3 text-[13px] font-medium text-slate-600 transition-colors hover:bg-cream sm:text-[14px]">
              <input ref="fileInputRef" type="file" multiple accept="image/*,video/mp4,video/webm" class="hidden"
                @change="handleMediaUpload" />
              <span class="flex items-center gap-2">
                <FontAwesomeIcon :icon="faArrowUpFromBracket" class="h-4 w-4" />
                Choose media
              </span>
            </label>

            <div v-if="selectedMedia.length > 0" class="space-y-2">
              <div class="relative overflow-hidden rounded-xl border border-weather-border bg-white group">
                <video v-if="selectedMedia[currentMediaIndex]?.type === 'video'"
                  :src="selectedMedia[currentMediaIndex]?.url"
                  class="h-48 w-full object-cover"
                  controls
                  muted />
                <img v-else :src="selectedMedia[currentMediaIndex]?.url" alt="Selected upload preview"
                  class="h-48 w-full object-cover" />
                <div v-if="selectedMedia.length > 1" class="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
                  <button v-if="currentMediaIndex > 0" @click.stop="currentMediaIndex--"
                    class="pointer-events-auto rounded-full bg-black/40 p-2 text-white transition-all hover:bg-black/60">
                    <FontAwesomeIcon :icon="faChevronLeft" class="h-4 w-4" />
                  </button>
                  <button v-if="currentMediaIndex < selectedMedia.length - 1" @click.stop="currentMediaIndex++"
                    class="pointer-events-auto ml-auto rounded-full bg-black/40 p-2 text-white transition-all hover:bg-black/60">
                    <FontAwesomeIcon :icon="faChevronRight" class="h-4 w-4" />
                  </button>
                </div>
                <div v-if="selectedMedia.length > 1"
                  class="absolute bottom-2 left-1/2 -translate-x-1/2 text-[12px] font-medium text-white bg-black/40 px-3 py-1 rounded-full">
                  {{ currentMediaIndex + 1 }} / {{ selectedMedia.length }}
                </div>
                <button @click.stop="removeMedia(currentMediaIndex)"
                  class="absolute top-2 right-2 rounded-full bg-red-500 text-white p-2 transition-all hover:bg-red-600 shadow-lg">
                  <FontAwesomeIcon :icon="faXmark" class="h-5 w-5" />
                </button>
              </div>

              <div class="flex gap-2 overflow-x-auto pb-2">
                <div v-for="(media, index) in selectedMedia" :key="media.url"
                  class="relative flex-shrink-0 rounded-lg border-2 overflow-hidden cursor-pointer transition-all"
                  :class="currentMediaIndex === index ? 'border-sidebar-active ring-2 ring-sidebar-active/30' : 'border-weather-border hover:border-slate-400'"
                  @click="currentMediaIndex = index">
                  <video v-if="media.type === 'video'" :src="media.url" class="h-20 w-20 object-cover" muted />
                  <img v-else :src="media.url" :alt="`Thumbnail ${index + 1}`" class="h-20 w-20 object-cover" />
                  <span v-if="media.type === 'video'"
                    class="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    Video
                  </span>
                  <button @click.stop="removeMedia(index)"
                    class="absolute top-1 right-1 rounded-full bg-red-500 text-white p-1 transition-all hover:bg-red-600 shadow-md">
                    <FontAwesomeIcon :icon="faXmark" class="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="flex gap-3">
            <button
              class="flex-1 rounded-xl border border-weather-border px-4 py-2.5 text-[13px] font-semibold text-slate-600 transition-all duration-200 hover:bg-cream sm:text-[14px]"
              @click="closeCreatePostModal">
              Cancel
            </button>
            <button
              class="flex-1 rounded-xl border-none bg-sidebar-active px-4 py-2.5 text-[13px] font-semibold text-white transition-all duration-200 hover:bg-sidebar-active/90 disabled:cursor-not-allowed disabled:opacity-60 sm:text-[14px]"
              :disabled="communityStore.isSubmitting"
              @click="createPost">
              {{ communityStore.isSubmitting ? 'Posting...' : 'Post' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="postPendingDelete" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div class="w-full max-w-[420px] rounded-2xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
        <div class="border-b border-weather-border px-5 py-4">
          <h3 class="m-0 text-[16px] font-bold text-slate-800">Delete post?</h3>
        </div>

        <div class="space-y-4 px-5 py-4">
          <p class="m-0 text-[13px] leading-relaxed text-slate-600">
            This post and its media/comments will be removed. This cannot be undone.
          </p>

          <div class="flex justify-end gap-3">
            <button
              class="rounded-xl border border-weather-border px-4 py-2.5 text-[13px] font-semibold text-slate-600 transition-colors hover:bg-cream"
              @click="postPendingDelete = null">
              Cancel
            </button>
            <button
              class="rounded-xl border-none bg-red-500 px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-red-600"
              @click="confirmDeletePost">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faArrowUpFromBracket, faImage, faXmark, faChevronLeft, faChevronRight, faLocationDot } from '@fortawesome/free-solid-svg-icons'
import { useCommunityStore } from '@/modules/community/store/community'
import CommunityView from '@/modules/community/pages/CommunityView.vue'
import type { DestinationOption, Post } from '@/modules/community/store/community'

const communityStore = useCommunityStore()

type SelectedMedia = {
  url: string
  type: 'image' | 'video'
}

const showCreatePostModal = ref(false)
const activeCommentPostId = ref<string | null>(null)
const newPostTitle = ref('')
const newPostText = ref('')
const selectedMedia = ref<SelectedMedia[]>([])
const selectedFiles = ref<File[]>([])
const currentMediaIndex = ref(0)
const fileInputRef = ref<HTMLInputElement | null>(null)
const newComment = ref('')
const postPendingDelete = ref<Post | null>(null)
const destinationQuery = ref('')
const selectedDestination = ref<DestinationOption | null>(null)
const isDestinationSearchFocused = ref(false)
const visitStatus = ref<'visited' | 'want_to_go'>('visited')
const visibility = ref<'public' | 'friends' | 'private'>('public')
const fallbackDestinationImage =
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=120&h=120&fit=crop'
const showDestinationDropdown = computed(() => {
  return isDestinationSearchFocused.value && destinationQuery.value.trim().length >= 2
})

let destinationSearchTimer: ReturnType<typeof window.setTimeout> | null = null

const handleMediaUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  const files = input.files

  if (!files || files.length === 0) {
    return
  }

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const isSupportedMedia = file?.type.startsWith('image/') || ['video/mp4', 'video/webm'].includes(file?.type ?? '')

    if (file && isSupportedMedia) {
      const objectUrl = URL.createObjectURL(file)
      selectedFiles.value.push(file)
      selectedMedia.value.push({
        url: objectUrl,
        type: file.type.startsWith('video/') ? 'video' : 'image',
      })
    }
  }

  currentMediaIndex.value = selectedMedia.value.length - 1
}

const removeMedia = (index: number) => {
  if (selectedMedia.value[index]) {
    URL.revokeObjectURL(selectedMedia.value[index].url)
  }

  selectedMedia.value.splice(index, 1)
  selectedFiles.value.splice(index, 1)

  if (currentMediaIndex.value >= selectedMedia.value.length && selectedMedia.value.length > 0) {
    currentMediaIndex.value = selectedMedia.value.length - 1
  }

  if (selectedMedia.value.length === 0) {
    currentMediaIndex.value = 0
    if (fileInputRef.value) {
      fileInputRef.value.value = ''
    }
  }
}

const clearAllMedia = () => {
  selectedMedia.value.forEach((media) => {
    URL.revokeObjectURL(media.url)
  })

  selectedMedia.value = []
  selectedFiles.value = []
  currentMediaIndex.value = 0

  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

const closeCreatePostModal = () => {
  clearAllMedia()
  resetPostForm()
  showCreatePostModal.value = false
}

const resetPostForm = () => {
  newPostText.value = ''
  newPostTitle.value = ''
  destinationQuery.value = ''
  selectedDestination.value = null
  visitStatus.value = 'visited'
  visibility.value = 'public'
  communityStore.destinationResults = []
}

const selectDestination = (destination: DestinationOption) => {
  selectedDestination.value = destination
  destinationQuery.value = ''
  communityStore.destinationResults = []
}

const clearSelectedDestination = () => {
  selectedDestination.value = null
}

const hideDestinationDropdown = () => {
  window.setTimeout(() => {
    isDestinationSearchFocused.value = false
  }, 150)
}

const toggleComments = (post: Post) => {
  activeCommentPostId.value = activeCommentPostId.value === post.id ? null : post.id
  newComment.value = ''
}

const sharePost = (post: Post) => {
  if (navigator.share) {
    navigator.share({
      title: post.title,
      text: post.description,
      url: window.location.href,
    })
  }
}

const requestDeletePost = (post: Post) => {
  postPendingDelete.value = post
}

const confirmDeletePost = async () => {
  if (!postPendingDelete.value) {
    return
  }

  const postId = postPendingDelete.value.id
  postPendingDelete.value = null

  await communityStore.deletePost(postId)
}

const createPost = async () => {
  if (newPostText.value.trim()) {
    const hashtags = newPostText.value
      .split(' ')
      .filter((tag) => tag.startsWith('#'))
      .slice(0, 5)

    try {
      await communityStore.addPost(
        {
          content: newPostText.value,
          title: newPostTitle.value.trim() || undefined,
          hashtags,
          destinationId: selectedDestination.value?.id,
          destinationName: selectedDestination.value?.name,
          province: selectedDestination.value?.province,
          isVisited: visitStatus.value === 'visited',
          visibility: visibility.value,
        },
        selectedFiles.value,
      )
      closeCreatePostModal()
    } catch {
      // The store owns the user-facing error message.
    }
  }
}

const addComment = async () => {
  if (newComment.value.trim() && activeCommentPostId.value) {
    try {
      await communityStore.addComment(activeCommentPostId.value, newComment.value)
      newComment.value = ''
    } catch {
      // The store owns the user-facing error message.
    }
  }
}

watch(destinationQuery, (query) => {
  if (destinationSearchTimer) {
    window.clearTimeout(destinationSearchTimer)
  }

  destinationSearchTimer = window.setTimeout(() => {
    void communityStore.searchDestinations(query)
  }, 250)
})
</script>
