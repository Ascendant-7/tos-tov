<template>
  <div class="py-5 px-4 sm:py-6 sm:px-6 md:py-8 md:px-8 max-w-[900px] mx-auto">
    <!-- Header -->
    <section class="mb-6 sm:mb-8 animate-fade-in-up">
      <h1 class="text-[24px] sm:text-[28px] font-bold text-slate-800 m-0">Community</h1>
    </section>

    <!-- Stories Section -->
    <section class="mb-6 sm:mb-8 animate-fade-in-up delay-1">
      <div
        class="flex gap-3 sm:gap-4 overflow-x-auto pb-3 -mx-4 px-4 sm:-mx-6 sm:px-6 md:-mx-8 md:px-8 snap-x snap-mandatory scrollbar-hide">
        <!-- Your Story -->
        <div class="flex-shrink-0 w-[72px] sm:w-[80px] snap-start">
          <button @click="emit('create-post')"
            class="w-full aspect-square rounded-2xl border-2 border-dashed border-sidebar-active bg-white flex flex-col items-center justify-center cursor-pointer hover:bg-cream-light transition-all duration-200 group">
            <FontAwesomeIcon :icon="faPlus"
              class="h-6 w-6 text-sidebar-active group-hover:scale-110 transition-transform" />
            <p class="text-[10px] sm:text-[11px] font-semibold text-slate-600 mt-1 text-center">Your Story</p>
          </button>
        </div>

        <!-- Story Circles -->
        <div v-for="(user, i) in communityStore.communityUsers" :key="user.id"
          class="flex-shrink-0 w-[72px] sm:w-[80px] snap-start animate-scale-in"
          :style="{ animationDelay: `${0.1 + i * 0.05}s` }">
          <button
            class="w-full aspect-square rounded-2xl bg-gradient-to-br from-sidebar-active/10 to-accent-gold-light/10 border-2 border-sidebar-active/20 flex items-center justify-center cursor-pointer hover:border-sidebar-active/50 transition-all duration-200 group relative overflow-hidden">
            <div
              class="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-600 to-slate-700 text-white font-bold text-lg">
              {{ user.initials }}
            </div>
            <div v-if="user.hasStory"
              class="absolute inset-0 border-2 border-accent-gold rounded-2xl pointer-events-none"></div>
          </button>
          <p class="text-[10px] sm:text-[11px] text-slate-600 text-center mt-1.5 truncate">{{ user.name.split(' ')[0] }}
          </p>
        </div>
      </div>
    </section>

    <!-- Trending Hashtags -->
    <section class="mb-6 sm:mb-8 animate-fade-in-up delay-2">
      <div class="flex items-center gap-2 mb-3 sm:mb-4">
        <FontAwesomeIcon :icon="faArrowTrendUp" class="h-4 w-4 text-sidebar-active" />
        <h2 class="text-[13px] sm:text-[14px] font-bold text-slate-800 m-0">Trending</h2>
      </div>
      <div class="flex gap-2 flex-wrap">
        <button v-for="tag in communityStore.trendingTags" :key="tag" @click="communityStore.setSelectedTag(tag)"
          :class="[
            'px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[12px] sm:text-[13px] font-medium border transition-all duration-200',
            communityStore.selectedTag === tag
              ? 'bg-sidebar-active text-white border-sidebar-active'
              : 'bg-white text-sidebar-active border-sidebar-active/30 hover:border-sidebar-active'
          ]">
          {{ tag }}
        </button>
      </div>
    </section>

    <!-- Filter Tabs -->
    <section class="mb-6 sm:mb-8 animate-fade-in-up delay-3">
      <div class="flex gap-2 sm:gap-3">
        <button v-for="tab in communityStore.filterTabs" :key="tab" @click="communityStore.setActiveFilter(tab)" :class="[
          'px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-[12px] sm:text-[13px] font-semibold border cursor-pointer transition-all duration-200',
          communityStore.activeFilter === tab
            ? 'bg-sidebar-active text-white border-sidebar-active shadow-[0_2px_8px_rgba(42,90,66,0.2)]'
            : 'bg-white text-slate-600 border-weather-border hover:border-slate-300 hover:text-slate-800'
        ]">
          {{ tab }}
        </button>
      </div>
    </section>

    <!-- Posts Feed -->
    <section class="animate-fade-in-up delay-4">
      <div v-if="communityStore.feedbackMessage" :class="[
        'mb-4 rounded-xl border px-4 py-3 text-[13px] font-medium',
        feedbackClass
      ]">
        {{ communityStore.feedbackMessage }}
      </div>

      <div v-if="communityStore.isLoading" class="flex flex-col items-center justify-center py-12 text-center">
        <p class="m-0 text-[14px] font-semibold text-slate-600">Loading posts...</p>
      </div>

      <div v-else-if="communityStore.filteredPosts.length > 0" class="space-y-4 sm:space-y-6">
        <div v-for="(post, i) in communityStore.filteredPosts" :key="post.id">
          <CommunityPostCard :post="post" :expanded="activeCommentPostId === post.id"
            :comment-draft="activeCommentPostId === post.id ? commentDraft : ''"
            :can-delete="post.userId === communityStore.currentUserId"
            @like="communityStore.toggleLike(post.id)" @bookmark="communityStore.toggleBookmark(post.id)"
            @share="emit('share-post', post)" @comment="emit('toggle-comments', post)"
            @delete="emit('request-delete', post)"
            @update-privacy="communityStore.updatePostVisibility(post.id, $event)"
            @update:comment-draft="emit('update:new-comment', $event)" @submit-comment="emit('submit-comment')"
            :style="{ animationDelay: `${0.1 + i * 0.05}s` }" class="animate-fade-in-up" />
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
        <div class="w-16 h-16 rounded-2xl bg-cream-dark flex items-center justify-center text-3xl mb-4">📝</div>
        <p class="text-[14px] font-semibold text-slate-600 m-0 mb-1">No posts yet</p>
        <p class="text-[12px] text-slate-400 m-0">Be the first to share your Cambodia experience!</p>
      </div>
    </section>

    <!-- Share CTA -->
    <section class="mt-8 sm:mt-12 mb-8 sm:mb-12 animate-fade-in-up delay-5">
      <button @click="emit('create-post')"
        class="w-full py-4 px-5 rounded-2xl border-2 border-dashed border-sidebar-active text-sidebar-active font-semibold text-[13px] sm:text-[14px] cursor-pointer hover:bg-sidebar-active hover:text-white transition-all duration-200 flex items-center justify-center gap-2">
        <FontAwesomeIcon :icon="faCamera" class="h-4 w-4" />
        Share Your Cambodia Experience
      </button>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faArrowTrendUp, faCamera, faPlus } from '@fortawesome/free-solid-svg-icons'
import { useCommunityStore } from '../store/community'
import CommunityPostCard from '../components/CommunityPostCard.vue'
import type { Post } from '../store/community'

const communityStore = useCommunityStore()

const props = defineProps<{
  activeCommentPostId: string | null
  newComment: string
}>()

const emit = defineEmits<{
  'create-post': []
  'share-post': [post: Post]
  'toggle-comments': [post: Post]
  'request-delete': [post: Post]
  'update:new-comment': [value: string]
  'submit-comment': []
}>()

const commentDraft = computed(() => props.newComment)
const feedbackClass = computed(() => {
  const classes = {
    success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    info: 'border-sky-200 bg-sky-50 text-sky-700',
    warning: 'border-amber-200 bg-amber-50 text-amber-800',
    error: 'border-red-200 bg-red-50 text-red-700',
  }

  return classes[communityStore.feedbackType]
})

onMounted(() => {
  void communityStore.loadCommunity()
})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
