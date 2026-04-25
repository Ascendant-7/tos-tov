<template>
  <div class="flex w-screen h-screen overflow-hidden bg-cream">
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
    <div class="flex-1 flex flex-col overflow-hidden min-w-0">
      <TopBar @toggle-sidebar="isMobileSidebarOpen = !isMobileSidebarOpen" />
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SideBar from './components/SideBar.vue';
import TopBar from './components/TopBar.vue';

const isMobileSidebarOpen = ref(false)
</script>
