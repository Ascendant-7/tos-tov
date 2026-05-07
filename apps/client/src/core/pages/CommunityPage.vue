<template>
  <main class="flex-1 h-screen overflow-y-auto bg-cream box-border font-sans custom-scrollbar">
    <CommunityView :active-comment-post-id="activeCommentPostId" :new-comment="newComment"
      @create-post="showCreatePostModal = true" @share-post="sharePost" @toggle-comments="toggleComments"
      @update:new-comment="newComment = $event" @submit-comment="addComment" />

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
          <textarea v-model="newPostText"
            placeholder="Share your Cambodia travel experience, tips, memories, hashtags... #AngkorWat #Adventure"
            class="h-24 w-full resize-none rounded-xl border border-weather-border p-4 text-[13px] text-slate-800 outline-none focus:border-sidebar-active focus:ring-1 focus:ring-sidebar-active/20 sm:text-[14px]" />

          <div class="space-y-3 rounded-xl border border-dashed border-weather-border bg-cream/60 p-4">
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-2 text-slate-700">
                <FontAwesomeIcon :icon="faImage" class="h-4 w-4" />
                <span class="text-[13px] font-semibold sm:text-[14px]">Upload photos</span>
                <span v-if="selectedImages.length > 0" class="text-[12px] text-slate-500">({{ selectedImages.length
                }})</span>
              </div>
              <button v-if="selectedImages.length > 0"
                class="text-[12px] font-medium text-slate-500 transition-colors hover:text-red-500"
                @click="clearAllImages">
                Clear All
              </button>
            </div>

            <label
              class="flex cursor-pointer items-center justify-center rounded-xl border border-weather-border bg-white px-4 py-3 text-[13px] font-medium text-slate-600 transition-colors hover:bg-cream sm:text-[14px]">
              <input ref="fileInputRef" type="file" multiple accept="image/*" class="hidden"
                @change="handleImageUpload" />
              <span class="flex items-center gap-2">
                <FontAwesomeIcon :icon="faArrowUpFromBracket" class="h-4 w-4" />
                Choose images
              </span>
            </label>

            <div v-if="selectedImages.length > 0" class="space-y-2">
              <div class="relative overflow-hidden rounded-xl border border-weather-border bg-white group">
                <img :src="selectedImages[currentImageIndex]" alt="Selected upload preview"
                  class="h-48 w-full object-cover" />
                <div v-if="selectedImages.length > 1" class="absolute inset-0 flex items-center justify-between px-2">
                  <button v-if="currentImageIndex > 0" @click.stop="currentImageIndex--"
                    class="rounded-full bg-black/40 p-2 text-white transition-all hover:bg-black/60">
                    <FontAwesomeIcon :icon="faChevronLeft" class="h-4 w-4" />
                  </button>
                  <button v-if="currentImageIndex < selectedImages.length - 1" @click.stop="currentImageIndex++"
                    class="ml-auto rounded-full bg-black/40 p-2 text-white transition-all hover:bg-black/60">
                    <FontAwesomeIcon :icon="faChevronRight" class="h-4 w-4" />
                  </button>
                </div>
                <div v-if="selectedImages.length > 1"
                  class="absolute bottom-2 left-1/2 -translate-x-1/2 text-[12px] font-medium text-white bg-black/40 px-3 py-1 rounded-full">
                  {{ currentImageIndex + 1 }} / {{ selectedImages.length }}
                </div>
                <button @click.stop="removeImage(currentImageIndex)"
                  class="absolute top-2 right-2 rounded-full bg-red-500 text-white p-2 transition-all hover:bg-red-600 shadow-lg">
                  <FontAwesomeIcon :icon="faXmark" class="h-5 w-5" />
                </button>
              </div>

              <div class="flex gap-2 overflow-x-auto pb-2">
                <div v-for="(image, index) in selectedImages" :key="index"
                  class="relative flex-shrink-0 rounded-lg border-2 overflow-hidden cursor-pointer transition-all"
                  :class="currentImageIndex === index ? 'border-sidebar-active ring-2 ring-sidebar-active/30' : 'border-weather-border hover:border-slate-400'"
                  @click="currentImageIndex = index">
                  <img :src="image" :alt="`Thumbnail ${index + 1}`" class="h-20 w-20 object-cover" />
                  <button @click.stop="removeImage(index)"
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
              class="flex-1 rounded-xl border-none bg-sidebar-active px-4 py-2.5 text-[13px] font-semibold text-white transition-all duration-200 hover:bg-sidebar-active/90 sm:text-[14px]"
              @click="createPost">
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faArrowUpFromBracket, faImage, faXmark, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { useCommunityStore } from '@/modules/community/store/community'
import CommunityView from '@/modules/community/pages/CommunityView.vue'
import type { Post } from '@/modules/community/store/community'

const communityStore = useCommunityStore()

const showCreatePostModal = ref(false)
const activeCommentPostId = ref<string | null>(null)
const newPostText = ref('')
const selectedImages = ref<string[]>([])
const currentImageIndex = ref(0)
const fileInputRef = ref<HTMLInputElement | null>(null)
const newComment = ref('')

const handleImageUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  const files = input.files

  if (!files || files.length === 0) {
    return
  }

  // Process each selected file
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    if (file) {
      const objectUrl = URL.createObjectURL(file)
      selectedImages.value.push(objectUrl)
    }
  }

  currentImageIndex.value = selectedImages.value.length - 1
}

const removeImage = (index: number) => {
  if (selectedImages.value[index]) {
    URL.revokeObjectURL(selectedImages.value[index])
  }

  selectedImages.value.splice(index, 1)

  if (currentImageIndex.value >= selectedImages.value.length && selectedImages.value.length > 0) {
    currentImageIndex.value = selectedImages.value.length - 1
  }

  if (selectedImages.value.length === 0) {
    currentImageIndex.value = 0
    if (fileInputRef.value) {
      fileInputRef.value.value = ''
    }
  }
}

const clearAllImages = () => {
  selectedImages.value.forEach((image) => {
    URL.revokeObjectURL(image)
  })

  selectedImages.value = []
  currentImageIndex.value = 0

  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

const closeCreatePostModal = () => {
  clearAllImages()
  showCreatePostModal.value = false
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

const createPost = () => {
  if (newPostText.value.trim()) {
    const hashtags = newPostText.value
      .split(' ')
      .filter((tag) => tag.startsWith('#'))
      .slice(0, 5)

    communityStore.addPost(newPostText.value, hashtags, selectedImages.value.length > 0 ? selectedImages.value : undefined)
    newPostText.value = ''
    closeCreatePostModal()
  }
}

const addComment = () => {
  if (newComment.value.trim() && activeCommentPostId.value) {
    communityStore.addComment(activeCommentPostId.value, newComment.value)
    newComment.value = ''
  }
}
</script>
