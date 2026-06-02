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
            {{ post.userName }}
          </h3>
          <p class="text-[11px] sm:text-[12px] text-slate-500 m-0 flex items-center gap-1.5">
            <FontAwesomeIcon :icon="faLocationDot" class="h-3 w-3" />
            <span>{{ post.location }}</span>
            <span class="text-slate-400">{{ post.timeAgo }}</span>
          </p>
        </div>
      </div>
      <button
        class="p-2 hover:bg-cream rounded-lg transition-colors cursor-pointer border-none bg-transparent shrink-0"
        aria-label="More options"
      >
        <FontAwesomeIcon :icon="faEllipsis" class="h-4 w-4 text-slate-400" />
      </button>
    </div>

    <!-- Post Images Gallery -->
    <div class="relative w-full bg-cream-dark overflow-hidden">
      <img
        :src="post.images[currentImageIndex]"
        :alt="post.title"
        class="w-full aspect-square sm:aspect-video object-cover transition-transform duration-500 group-hover:scale-105"
      />

      <!-- Navigation Arrows -->
      <div
        v-if="post.images.length > 1"
        class="absolute inset-0 flex items-center justify-between px-2"
      >
        <button
          @click.stop="
            currentImageIndex =
              currentImageIndex > 0 ? currentImageIndex - 1 : post.images.length - 1
          "
          class="rounded-full bg-black/40 p-2 text-white transition-all hover:bg-black/60"
        >
          <FontAwesomeIcon :icon="faChevronLeft" class="h-4 w-4" />
        </button>
        <button
          @click.stop="
            currentImageIndex =
              currentImageIndex < post.images.length - 1 ? currentImageIndex + 1 : 0
          "
          class="ml-auto rounded-full bg-black/40 p-2 text-white transition-all hover:bg-black/60"
        >
          <FontAwesomeIcon :icon="faChevronRight" class="h-4 w-4" />
        </button>
      </div>

      <!-- Image Counter & Visited Badge -->
      <div class="absolute top-3 sm:top-4 right-3 sm:right-4 flex flex-col gap-2 items-end">
        <div
          v-if="post.images.length > 1"
          class="bg-black/40 backdrop-blur-sm text-white text-[10px] sm:text-[11px] font-semibold px-3 py-1.5 rounded-full"
        >
          {{ currentImageIndex + 1 }} / {{ post.images.length }}
        </div>
        <div
          class="bg-slate-800/70 backdrop-blur-sm text-white text-[10px] sm:text-[11px] font-semibold px-3 py-1.5 rounded-full"
        >
          <FontAwesomeIcon :icon="faCircleCheck" class="mr-1 h-3 w-3" />
          Visited
        </div>
      </div>

      <!-- Thumbnail Gallery -->
      <div
        v-if="post.images.length > 1"
        class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 flex gap-2 overflow-x-auto"
      >
        <button
          v-for="(image, index) in post.images"
          :key="index"
          @click="currentImageIndex = index"
          class="flex-shrink-0 rounded-md border-2 overflow-hidden transition-all"
          :class="
            currentImageIndex === index
              ? 'border-white ring-2 ring-white'
              : 'border-white/40 hover:border-white/70'
          "
        >
          <img :src="image" :alt="`Image ${index + 1}`" class="h-12 w-12 object-cover" />
        </button>
      </div>
    </div>

    <!-- Post Content -->
    <div class="p-4 sm:p-5">
      <h4 class="text-[14px] sm:text-[15px] font-bold text-slate-800 m-0 mb-2">{{ post.title }}</h4>
      <p class="text-[12px] sm:text-[13px] text-slate-700 m-0 mb-3 leading-relaxed">
        {{ post.description }}
      </p>

      <!-- Hashtags -->
      <div class="flex flex-wrap gap-2 mb-4">
        <span
          v-for="tag in post.hashtags"
          :key="tag"
          class="text-[11px] sm:text-[12px] text-sidebar-active font-medium"
        >
          {{ tag }}
        </span>
      </div>

      <!-- Comment Preview -->
      <div v-if="post.comments.length > 0 && !expanded" class="mb-4 space-y-2">
        <div
          v-for="comment in post.comments.slice(0, 2)"
          :key="comment.id"
          class="flex gap-3 rounded-xl bg-cream/70 px-3 py-2"
        >
          <div
            class="w-7 h-7 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 text-white flex items-center justify-center text-[10px] font-bold shrink-0"
          >
            {{ comment.userInitials }}
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-[11px] sm:text-[12px] font-semibold text-slate-800 m-0 leading-tight">
              {{ comment.userName }}
            </p>
            <p
              class="text-[11px] sm:text-[12px] text-slate-600 m-0 mt-0.5 leading-relaxed line-clamp-2"
            >
              {{ comment.text }}
            </p>
          </div>
        </div>
      </div>

      <!-- Expanded Comments -->
      <div
        v-if="expanded"
        class="mb-4 rounded-2xl border border-weather-border bg-white p-4 sm:p-5 shadow-[0_6px_20px_rgba(0,0,0,0.04)]"
      >
        <div v-if="post.comments.length > 0" class="space-y-3">
          <div v-for="comment in post.comments" :key="comment.id" class="flex gap-3">
            <div
              class="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 text-white flex items-center justify-center text-xs font-bold shrink-0"
            >
              {{ comment.userInitials }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-[12px] sm:text-[13px] font-semibold text-slate-800 m-0">
                {{ comment.userName }}
              </p>
              <p class="text-[11px] sm:text-[12px] text-slate-600 m-0 mt-0.5 leading-relaxed">
                {{ comment.text }}
              </p>
            </div>
          </div>
        </div>

        <div v-else class="py-2 text-center text-[13px] text-slate-400">
          Be the first to comment.
        </div>

        <div class="mt-4 pt-4 border-t border-weather-border flex items-center gap-3">
          <div
            class="w-8 h-8 rounded-full bg-cream-dark text-sidebar-active flex items-center justify-center text-[11px] font-bold shrink-0"
          >
            YO
          </div>
          <input
            :value="commentDraft"
            type="text"
            placeholder="Add a comment..."
            class="flex-1 px-4 py-3 border border-weather-border rounded-xl text-[13px] sm:text-[14px] text-slate-800 placeholder:text-slate-400 outline-none focus:border-sidebar-active focus:ring-1 focus:ring-sidebar-active/20"
            @input="$emit('update:comment-draft', ($event.target as HTMLInputElement).value)"
            @keydown.enter.prevent="$emit('submit-comment')"
          />
          <button
            @click="$emit('submit-comment')"
            class="px-4 py-3 rounded-xl bg-sidebar-active text-white font-semibold text-[13px] sm:text-[14px] cursor-pointer hover:bg-sidebar-active/90 transition-all duration-200 border-none"
          >
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

        <button
          @click="$emit('bookmark')"
          :class="[
            'flex items-center justify-center py-2.5 px-3 rounded-lg text-[12px] sm:text-[13px] font-medium cursor-pointer transition-all duration-200 border-none',
            post.bookmarked
              ? 'text-sidebar-active bg-sidebar-active/10 hover:bg-sidebar-active/20'
              : 'text-slate-600 bg-cream hover:bg-cream-dark',
          ]"
          title="Bookmark"
        >
          <FontAwesomeIcon
            :icon="faBookmark"
            class="h-4 w-4"
            :class="post.bookmarked ? 'text-sidebar-active' : ''"
          />
        </button>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faBookmark,
  faCircleCheck,
  faCommentDots,
  faEllipsis,
  faHeart,
  faLocationDot,
  faShareNodes,
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons'
import type { Post } from '../store/community'

defineProps<{
  post: Post
  expanded?: boolean
  commentDraft?: string
}>()

defineEmits<{
  like: []
  comment: []
  share: []
  bookmark: []
  'update:comment-draft': [value: string]
  'submit-comment': []
}>()

const currentImageIndex = ref(0)

const formatNumber = (num: number): string => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
  }
  return num.toString()
}
</script>
