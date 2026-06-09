<script setup lang="ts">
import { useFriendStore } from '../store/friend';

const friendStore = useFriendStore();
</script>

<template>
  <div class="grid grid-cols-3 rounded-2xl bg-stone-100 p-1">
    <button
      class="rounded-xl px-4 py-3 text-sm font-medium transition"
      :class="
        friendStore.activeTab === 'myTrip'
          ? 'bg-white text-emerald-950 shadow'
          : 'text-stone-600 hover:bg-white/60'
      "
      @click="friendStore.setTab('myTrip')"
    >
      My Trip
    </button>

    <button
      class="relative rounded-xl px-4 py-3 text-sm font-medium transition"
      :class="
        friendStore.activeTab === 'friends'
          ? 'bg-white text-emerald-950 shadow'
          : 'text-stone-600 hover:bg-white/60'
      "
      @click="friendStore.setTab('friends')"
    >
      Friends

      <span
        v-if="friendStore.incomingRequests.length > 0"
        class="absolute -top-1 right-4 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-700 text-xs text-white"
      >
        {{ friendStore.incomingRequests.length }}
      </span>
    </button>

    <button
      class="rounded-xl px-4 py-3 text-sm font-medium transition"
      :class="
        friendStore.activeTab === 'publicTrips'
          ? 'bg-white text-emerald-950 shadow'
          : 'text-stone-600 hover:bg-white/60'
      "
      @click="friendStore.setTab('publicTrips')"
    >
      Public Trips
    </button>
  </div>
</template>