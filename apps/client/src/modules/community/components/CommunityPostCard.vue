<template>
  <article
    class="bg-white rounded-2xl border border-weather-border overflow-hidden hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300"
  >
    <!-- Post Header -->
    <div class="p-4 sm:p-5 flex items-center justify-between border-b border-weather-border/50">
      <div class="flex items-center gap-3 min-w-0">
        <div
          class="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 text-white flex items-center justify-center font-bold text-sm shrink-0"
        >
          {{ post.userInitials }}
        </div>
        <div class="min-w-0">
          <h3 class="text-[13px] sm:text-[14px] font-semibold text-slate-800 m-0">
            <span v-for="(part, index) in highlightParts(post.userName)" :key="`${part.text}-${index}`"
              :class="part.match ? highlightClass : ''">{{ part.text }}</span>
          </h3>
          <div class="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1 text-[11px] text-slate-500 sm:text-[12px]">
            <span class="flex min-w-0 items-center gap-1.5">
              <FontAwesomeIcon :icon="faLocationDot" class="h-3 w-3 shrink-0" />
              <span class="truncate">
                <router-link
                  v-if="post.destinationId"
                  :to="`/explore/${post.destinationId}`"
                  class="hover:underline text-sidebar-active font-semibold"
                >
                  <span v-for="(part, index) in highlightParts(post.location)" :key="`${part.text}-${index}`"
                    :class="part.match ? highlightClass : ''">{{ part.text }}</span>
                </router-link>
                <span v-else>
                  <span v-for="(part, index) in highlightParts(post.location)" :key="`${part.text}-${index}`"
                    :class="part.match ? highlightClass : ''">{{ part.text }}</span>
                </span>
              </span>
            </span>
            <span v-if="post.tripId" class="flex min-w-0 items-center gap-1">
              <span class="text-slate-400">•</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 text-accent-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
              </svg>
              <router-link :to="`/trips/${post.tripId}`" class="hover:underline text-accent-gold font-semibold truncate max-w-[120px]">
                {{ post.tripTitle || 'Trip' }}
              </router-link>
            </span>
            <span class="text-slate-400">•</span>
            <span class="text-slate-400">{{ post.timeAgo }}</span>
            <span class="text-slate-400">•</span>
            <span
              class="inline-flex items-center gap-1 rounded-full bg-cream px-2 py-0.5 text-[10px] font-semibold text-slate-600">
              <FontAwesomeIcon :icon="visibilityIcon" class="h-2.5 w-2.5" />
              {{ visibilityLabel }}
            </span>
          </div>
        </div>
      </div>
      <div v-if="canDelete" class="relative shrink-0">
        <button class="p-2 hover:bg-cream rounded-lg transition-colors cursor-pointer border-none bg-transparent"
          aria-label="Post options" @click="showMenu = !showMenu">
          <FontAwesomeIcon :icon="faEllipsis" class="h-4 w-4 text-slate-400" />
        </button>

        <div v-if="showMenu"
          class="absolute right-0 top-full z-20 mt-1 min-w-40 overflow-hidden rounded-lg border border-weather-border bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
          <div class="border-b border-weather-border/70 px-3 py-2">
            <p class="m-0 mb-1 text-[11px] font-semibold text-slate-500">Privacy</p>
            <div class="grid gap-1">
              <button v-for="option in visibilityOptions" :key="option.value"
                class="flex w-full items-center gap-2 rounded-md border-none px-2 py-1.5 text-left text-[12px] font-semibold transition-colors"
                :class="post.visibility === option.value
                  ? 'bg-sidebar-active/10 text-sidebar-active'
                  : 'bg-white text-slate-600 hover:bg-cream'"
                @click="handlePrivacyUpdate(option.value)">
                <FontAwesomeIcon :icon="option.icon" class="h-3.5 w-3.5" />
                {{ option.label }}
              </button>
            </div>
          </div>
          <button
            class="flex w-full items-center gap-2 border-none bg-white px-3 py-2 text-left text-[12px] font-semibold text-red-500 hover:bg-red-50"
            @click="handleDelete">
            <FontAwesomeIcon :icon="faTrash" class="h-3.5 w-3.5" />
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Post Media Gallery -->
    <div class="relative w-full bg-cream-dark overflow-hidden">
      <video v-if="currentMedia?.type === 'video'" :src="currentMedia.url"
        class="w-full aspect-square sm:aspect-video object-cover bg-black"
        controls
        playsinline />
      <img v-else :src="currentMedia?.url" :alt="post.title"
        class="w-full aspect-square sm:aspect-video object-cover transition-transform duration-500 group-hover:scale-105" />
      
      <!-- Navigation Arrows -->
      <div v-if="post.media.length > 1" class="pointer-events-none absolute inset-0 flex items-center justify-between px-2">
        <button @click.stop="currentMediaIndex = currentMediaIndex > 0 ? currentMediaIndex - 1 : post.media.length - 1"
          class="pointer-events-auto rounded-full bg-black/40 p-2 text-white transition-all hover:bg-black/60">
          <FontAwesomeIcon :icon="faChevronLeft" class="h-4 w-4" />
        </button>
        <button @click.stop="currentMediaIndex = currentMediaIndex < post.media.length - 1 ? currentMediaIndex + 1 : 0"
          class="pointer-events-auto ml-auto rounded-full bg-black/40 p-2 text-white transition-all hover:bg-black/60">
          <FontAwesomeIcon :icon="faChevronRight" class="h-4 w-4" />
        </button>
      </div>
      <!-- Image Counter & Visited Badge -->
      <div class="absolute top-3 sm:top-4 right-3 sm:right-4 flex flex-col gap-2 items-end">
        <div v-if="post.media.length > 1"
          class="bg-black/40 backdrop-blur-sm text-white text-[10px] sm:text-[11px] font-semibold px-3 py-1.5 rounded-full">
          {{ currentMediaIndex + 1 }} / {{ post.media.length }}
        </div>
        <div
          class="bg-slate-800/70 backdrop-blur-sm text-white text-[10px] sm:text-[11px] font-semibold px-3 py-1.5 rounded-full"
        >
          <FontAwesomeIcon :icon="faCircleCheck" class="mr-1 h-3 w-3" />
          Visited
        </div>
      </div>

      <!-- Thumbnail Gallery -->
      <div v-if="post.media.length > 1" class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 flex gap-2 overflow-x-auto">
        <button v-for="(media, index) in post.media" :key="media.url"
          @click="currentMediaIndex = index"
          class="flex-shrink-0 rounded-md border-2 overflow-hidden transition-all"
          :class="currentMediaIndex === index ? 'border-white ring-2 ring-white' : 'border-white/40 hover:border-white/70'">
          <video v-if="media.type === 'video'" :src="media.url" class="h-12 w-12 object-cover" muted />
          <img v-else :src="media.url" :alt="`Media ${index + 1}`" class="h-12 w-12 object-cover" />
        </button>
      </div>
    </div>

    <!-- Post Content -->
    <div class="p-4 sm:p-5">
      <div v-if="post.sharedPost"
        class="mb-3 rounded-lg border border-weather-border bg-cream/60 px-3 py-2 text-[12px] text-slate-600">
        <p class="m-0 font-semibold text-slate-700">
          Shared from
          <span v-for="(part, index) in highlightParts(post.sharedPost.userName)" :key="`${part.text}-${index}`"
            :class="part.match ? highlightClass : ''">{{ part.text }}</span>
        </p>
        <p v-if="post.sharedPost.title || post.sharedPost.description" class="m-0 mt-1 line-clamp-2 leading-relaxed">
          <span v-for="(part, index) in highlightParts(sharedPostPreview)" :key="`${part.text}-${index}`"
            :class="part.match ? highlightClass : ''">{{ part.text }}</span>
        </p>
      </div>

      <h4 v-if="post.title" class="text-[14px] sm:text-[15px] font-bold text-slate-800 m-0 mb-2">
        <span v-for="(part, index) in highlightParts(post.title)" :key="`${part.text}-${index}`"
          :class="part.match ? highlightClass : ''">{{ part.text }}</span>
      </h4>
      <p class="text-[12px] sm:text-[13px] text-slate-700 m-0 mb-3 leading-relaxed">
        <span v-for="(part, index) in highlightParts(post.description)" :key="`${part.text}-${index}`"
          :class="part.match ? highlightClass : ''">{{ part.text }}</span>
      </p>

      <!-- Hashtags -->
      <div class="flex flex-wrap gap-2 mb-4">
        <span v-for="tag in post.hashtags" :key="tag"
          class="text-[11px] sm:text-[12px] text-sidebar-active font-medium">
          <span v-for="(part, index) in highlightParts(tag)" :key="`${part.text}-${index}`"
            :class="part.match ? highlightClass : ''">{{ part.text }}</span>
        </span>
      </div>

      <div v-if="post.comments.length > 0 || expanded" class="mb-4 space-y-3">
        <div v-if="post.comments.length > 0" class="space-y-2">
          <div v-for="comment in visibleComments" :key="comment.id" class="flex gap-2.5">
            <div
              class="w-7 h-7 rounded-full bg-slate-700 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
              {{ comment.userInitials }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-[12px] text-slate-700 m-0 leading-relaxed">
                <span class="font-semibold text-slate-800">{{ comment.userName }}</span>
                <span> </span>
                <span v-for="(part, index) in highlightParts(comment.text)" :key="`${part.text}-${index}`"
                  :class="part.match ? highlightClass : ''">{{ part.text }}</span>
              </p>
            </div>
          </div>
        </div>

        <div v-else class="py-1 text-[13px] text-slate-400">
          Be the first to comment.
        </div>

        <div v-if="expanded" class="flex items-center gap-2.5">
          <div
            class="w-7 h-7 rounded-full bg-cream-dark text-sidebar-active flex items-center justify-center text-[10px] font-bold shrink-0">
            YO
          </div>
          <input :value="commentDraft" type="text" placeholder="Add a comment..."
            class="flex-1 px-3 py-2.5 border border-weather-border rounded-full text-[13px] text-slate-800 placeholder:text-slate-400 outline-none focus:border-sidebar-active focus:ring-1 focus:ring-sidebar-active/20"
            @input="$emit('update:comment-draft', ($event.target as HTMLInputElement).value)"
            @keydown.enter.prevent="$emit('submit-comment')" />
          <button @click="$emit('submit-comment')"
            class="px-4 py-2.5 rounded-full bg-sidebar-active text-white font-semibold text-[12px] cursor-pointer hover:bg-sidebar-active/90 transition-all duration-200 border-none">
            Reply
          </button>
        </div>
      </div>

      <!-- Interactions Bar -->
      <div
        class="flex items-center justify-between text-[12px] sm:text-[13px] text-slate-500 mb-4 pb-4 border-b border-weather-border/50"
      >
        <div class="flex items-center gap-4">
          <span class="flex items-center gap-1">
            <FontAwesomeIcon :icon="faHeart" class="h-3.5 w-3.5 text-red-500" />
            {{ formatNumber(post.likes) }}
          </span>
          <span class="flex items-center gap-1">
            <FontAwesomeIcon :icon="faCommentDots" class="h-3.5 w-3.5" />
            {{ post.comments.length }}
          </span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center justify-between gap-2">
        <button
          @click="$emit('like')"
          :class="[
            'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[12px] sm:text-[13px] font-medium cursor-pointer transition-all duration-200 border-none',
            post.liked
              ? 'text-red-500 bg-red-50 hover:bg-red-100'
              : 'text-slate-600 bg-cream hover:bg-cream-dark',
          ]"
        >
          <FontAwesomeIcon
            :icon="faHeart"
            class="h-4 w-4"
            :class="post.liked ? 'text-red-500' : ''"
          />
          Like
        </button>

        <button
          @click="$emit('comment')"
          :class="[
            'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[12px] sm:text-[13px] font-medium cursor-pointer transition-all duration-200 border-none',
            expanded
              ? 'text-sidebar-active bg-sidebar-active/10 hover:bg-sidebar-active/15'
              : 'text-slate-600 bg-cream hover:bg-cream-dark',
          ]"
        >
          <FontAwesomeIcon :icon="faCommentDots" class="h-4 w-4" />
          Comment
        </button>

        <button
          @click="$emit('share')"
          class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[12px] sm:text-[13px] font-medium text-slate-600 bg-cream hover:bg-cream-dark cursor-pointer transition-all duration-200 border-none"
        >
          <FontAwesomeIcon :icon="faShareNodes" class="h-4 w-4" />
          Share
        </button>

        <button @click="$emit('bookmark')" :class="[
          'flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-[12px] sm:text-[13px] font-semibold cursor-pointer transition-all duration-200 border-none',
          post.bookmarked
            ? 'text-white bg-sidebar-active hover:bg-sidebar-active/90 shadow-[0_2px_8px_rgba(42,90,66,0.2)]'
            : 'text-slate-600 bg-cream hover:bg-cream-dark'
        ]" :title="post.bookmarked ? 'Saved' : 'Save post'">
          <FontAwesomeIcon :icon="faBookmark" class="h-4 w-4" :class="post.bookmarked ? 'text-white' : ''" />
          <span class="hidden sm:inline">{{ post.bookmarked ? 'Saved' : 'Save' }}</span>
        </button>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faBookmark, faCircleCheck, faCommentDots, faEllipsis, faHeart, faLocationDot, faShareNodes, faChevronLeft, faChevronRight, faTrash, faGlobe, faLock, faUserGroup } from '@fortawesome/free-solid-svg-icons'
import type { Post, PostVisibility } from '../store/community'

const props = defineProps<{
  post: Post
  expanded?: boolean
  commentDraft?: string
  canDelete?: boolean
  searchQuery?: string
}>()

const currentMediaIndex = ref(0)
const showMenu = ref(false)
type VisibilityOption = {
  value: PostVisibility
  label: string
  icon: typeof faGlobe
}

const visibilityOptions: [VisibilityOption, VisibilityOption, VisibilityOption] = [
  { value: 'public', label: 'Public', icon: faGlobe },
  { value: 'friends', label: 'Friends', icon: faUserGroup },
  { value: 'private', label: 'Private', icon: faLock },
] 

const currentMedia = computed(() => props.post.media[currentMediaIndex.value] ?? props.post.media[0])
const visibilityOption = computed(() =>
  visibilityOptions.find((option) => option.value === props.post.visibility) ?? visibilityOptions[0],
)
const visibilityIcon = computed(() => visibilityOption.value.icon)
const visibilityLabel = computed(() => visibilityOption.value.label)
const highlightClass =
  'rounded bg-amber-200/80 px-0.5 font-semibold text-slate-900 ring-1 ring-amber-300/60'
const sharedPostPreview = computed(() => {
  if (!props.post.sharedPost) {
    return ''
  }

  return props.post.sharedPost.title || props.post.sharedPost.description
})

const visibleComments = computed(() => {
  return props.expanded ? props.post.comments : props.post.comments.slice(0, 2)
})

const emit = defineEmits<{
  like: []
  comment: []
  share: []
  bookmark: []
  delete: []
  'update-privacy': [visibility: PostVisibility]
  'update:comment-draft': [value: string]
  'submit-comment': []
}>()

const handleDelete = () => {
  showMenu.value = false
  emit('delete')
}

const handlePrivacyUpdate = (visibility: PostVisibility) => {
  showMenu.value = false

  if (visibility !== props.post.visibility) {
    emit('update-privacy', visibility)
  }
}

type HighlightPart = {
  text: string
  match: boolean
}

const highlightParts = (value: string): HighlightPart[] => {
  const query = props.searchQuery?.trim()

  if (!query) {
    return [{ text: value, match: false }]
  }

  const lowerValue = value.toLowerCase()
  const lowerQuery = query.toLowerCase()
  const parts: HighlightPart[] = []
  let cursor = 0
  let matchIndex = lowerValue.indexOf(lowerQuery)

  while (matchIndex >= 0) {
    if (matchIndex > cursor) {
      parts.push({ text: value.slice(cursor, matchIndex), match: false })
    }

    const matchEnd = matchIndex + query.length
    parts.push({ text: value.slice(matchIndex, matchEnd), match: true })
    cursor = matchEnd
    matchIndex = lowerValue.indexOf(lowerQuery, cursor)
  }

  if (cursor < value.length) {
    parts.push({ text: value.slice(cursor), match: false })
  }

  return parts.length > 0 ? parts : [{ text: value, match: false }]
}

const formatNumber = (num: number): string => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
  }
  return num.toString()
}
</script>
