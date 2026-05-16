<template>
  <div v-if="showLayout" class="flex h-screen w-screen overflow-hidden bg-cream">
    <!-- Mobile overlay backdrop -->
    <div
      v-if="isMobileSidebarOpen"
      class="fixed inset-0 bg-black/40 z-30 lg:hidden transition-opacity duration-300"
      @click="isMobileSidebarOpen = false"
    ></div>

    <SideBar
      :mobile-open="isMobileSidebarOpen"
      @close-mobile="isMobileSidebarOpen = false"
    />
    <div class="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <TopBar @toggle-sidebar="isMobileSidebarOpen = !isMobileSidebarOpen" />
      <main class="min-h-0 flex-1 overflow-y-auto bg-cream custom-scrollbar">
        <router-view />
      </main>
    </div>
  </div>
  <div v-else class="min-h-screen w-screen overflow-y-auto bg-cream custom-scrollbar">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import SideBar from './core/components/SideBar.vue';
import TopBar from './core/components/TopBar.vue';

const route = useRoute()
const isMobileSidebarOpen = ref(false)

const showLayout = computed(() => {
  return route.meta.showLayout !== false
})
</script>
