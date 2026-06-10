<template>
  <aside
    :class="[
      'h-screen flex flex-col bg-sidebar-dark py-6 box-border font-sans transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] select-none z-40',
      isOpen ? 'w-[260px] px-4' : 'w-[72px] px-2',
      'max-lg:fixed max-lg:top-0 max-lg:left-0 max-lg:h-full max-lg:w-[260px] max-lg:px-4',
      mobileOpen ? 'max-lg:translate-x-0' : 'max-lg:-translate-x-full',
    ]"
  >
    <!-- Navigation Menu -->
    <nav class="flex flex-col gap-1 flex-1">
      <!-- Logo Section -->
      <div class="flex justify-center mb-2 px-2 overflow-hidden animate-fade-in">
        <img :src="logoImg" alt="TravelMate Logo" class="w-30 h-30 transition-all duration-300" />
      </div>
      <router-link
        v-for="(item, index) in navItems"
        :key="item.to"
        :to="item.to"
        v-slot="{ isActive }"
        custom
      >
        <a
          :href="item.to"
          @click.prevent="navigate(item.to)"
          :class="[
            'group flex items-center gap-3.5 py-2.5 rounded-xl no-underline font-medium text-[14px] transition-all duration-200 relative overflow-hidden',
            isOpen || isMobile ? 'px-3.5' : 'px-0 justify-center',
            isActive
              ? 'bg-sidebar-active text-white'
              : 'text-white/65 hover:bg-sidebar-hover hover:text-white/90',
          ]"
          :style="{ animationDelay: `${index * 0.04}s` }"
          class="animate-slide-in-left"
        >
          <div
            v-if="isActive"
            class="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-accent-gold rounded-r-full transition-all duration-300"
          ></div>
          <component
            :is="item.icon"
            :class="[
              'w-[18px] h-[18px] transition-all duration-200 shrink-0',
              isActive ? 'text-accent-gold' : 'text-white/50 group-hover:text-white/80',
            ]"
          />
          <span
            :class="[
              'transition-all duration-300 overflow-hidden whitespace-nowrap',
              isOpen || isMobile ? 'opacity-100 max-w-[200px]' : 'opacity-0 max-w-0',
            ]"
            >{{ item.label }}</span
          >
        </a>
      </router-link>
    </nav>

    <!-- Bottom Section -->
    <div class="flex flex-col gap-1 pt-4 border-t border-white/10">
      <a
        v-for="item in bottomItems"
        :key="item.label"
        href="#"
        @click.prevent="handleBottomItemClick(item)"
        :class="[
          'group flex items-center gap-3.5 py-2.5 rounded-xl no-underline font-medium text-[14px] transition-all duration-200 text-white/65 hover:bg-sidebar-hover hover:text-white/90',
          isOpen || isMobile ? 'px-3.5' : 'px-0 justify-center',
        ]"
      >
        <component
          :is="item.icon"
          class="w-[18px] h-[18px] transition-all duration-200 shrink-0 text-white/50 group-hover:text-white/80"
        />
        <span
          :class="[
            'transition-all duration-300 overflow-hidden whitespace-nowrap',
            isOpen || isMobile ? 'opacity-100 max-w-[200px]' : 'opacity-0 max-w-0',
          ]"
          >{{ item.label }}</span
        >
      </a>
      <!-- Collapse (desktop only) -->
      <button
        @click="isOpen = !isOpen"
        :class="[
          'group items-center gap-3.5 py-2.5 rounded-xl font-medium text-[14px] text-white/65 cursor-pointer transition-all duration-200 bg-transparent border-none hover:bg-sidebar-hover hover:text-white/90 w-full hidden lg:flex',
          isOpen ? 'px-3.5' : 'px-0 justify-center',
        ]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          :class="[
            'w-[18px] h-[18px] transition-all duration-300 text-white/50 group-hover:text-white/80',
            !isOpen && 'rotate-180',
          ]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
        <span
          :class="[
            'transition-all duration-300 overflow-hidden whitespace-nowrap',
            isOpen ? 'opacity-100 max-w-[200px]' : 'opacity-0 max-w-0',
          ]"
          >Collapse</span
        >
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, h, type FunctionalComponent, computed } from 'vue'
import { useRouter } from 'vue-router'
import logoImg from '/images/Logo8.png'
import { useCommunityStore } from '@/modules/community/store/community';

const props = defineProps<{ mobileOpen: boolean }>()
const emit = defineEmits<{ 'close-mobile': [] }>()
const router = useRouter()
const communityStore = useCommunityStore()

const isOpen = ref(true)

const isMobile = computed(() => props.mobileOpen)

function navigate(to: string) {
  router.push(to)
  emit('close-mobile')
}

function handleBottomItemClick(item: { label: string }) {
  if (item.label === 'Create Post') {
    router.push('/community')
    communityStore.showCreatePostModal = true
  }
}

const DashboardIcon: FunctionalComponent = () =>
  h(
    'svg',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      class: 'w-[18px] h-[18px]',
    },
    [
      h('path', { d: 'm3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' }),
      h('polyline', { points: '9 22 9 12 15 12 15 22' }),
    ],
  )

const ExploreIcon: FunctionalComponent = () =>
  h(
    'svg',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      class: 'w-[18px] h-[18px]',
    },
    [
      h('circle', { cx: '12', cy: '12', r: '10' }),
      h('polygon', { points: '16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76' }),
    ],
  )

const SocialIcon: FunctionalComponent = () =>
  h(
    'svg',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      class: 'w-[18px] h-[18px]',
    },
    [
      h('path', { d: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' }),
      h('circle', { cx: '9', cy: '7', r: '4' }),
      h('path', { d: 'M22 21v-2a4 4 0 0 0-3-3.87' }),
      h('path', { d: 'M16 3.13a4 4 0 0 1 0 7.75' }),
    ],
  )

const CommunityIcon: FunctionalComponent = () =>
  h(
    'svg',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      class: 'w-[18px] h-[18px]',
    },
    [h('path', { d: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' })],
  )

const ProfileIcon: FunctionalComponent = () =>
  h(
    'svg',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      class: 'w-[18px] h-[18px]',
    },
    [
      h('path', { d: 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2' }),
      h('circle', { cx: '12', cy: '7', r: '4' }),
    ],
  )

const SavedIcon: FunctionalComponent = () =>
  h(
    'svg',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      class: 'w-[18px] h-[18px]',
    },
    [h('path', { d: 'm19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z' })],
  )

const CreatePostIcon: FunctionalComponent = () =>
  h(
    'svg',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      class: 'w-[18px] h-[18px]',
    },
    [
      h('path', { d: 'M12 20h9' }),
      h('path', {
        d: 'M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z',
      }),
    ],
  )

const navItems = [
  { to: '/home', label: 'Home', icon: DashboardIcon },
  { to: '/explore', label: 'Explore', icon: ExploreIcon },
  { to: '/trips', label: 'My Trips', icon: SavedIcon },
  { to: '/social', label: 'Social Travel', icon: SocialIcon },
  { to: '/route-intel', label: 'Route Intel', icon: ExploreIcon },
  { to: '/community', label: 'Community', icon: CommunityIcon },
  { to: '/profile', label: 'Profile', icon: ProfileIcon },
]

const bottomItems = [
  { label: 'Saved Trips', icon: SavedIcon },
  { label: 'Create Post', icon: CreatePostIcon },
]
</script>
