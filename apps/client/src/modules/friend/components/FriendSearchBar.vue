<script setup lang="ts">
import { faMagnifyingGlass, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useFriendStore } from '../store/friend';

const friendStore = useFriendStore();
</script>

<template>
  <div class="relative">
    <font-awesome-icon
      :icon="faMagnifyingGlass"
      class="absolute left-4 top-3.5 text-sm text-stone-400"
    />

    <input
      :value="friendStore.searchQuery"
      type="text"
      placeholder="Search for travelers..."
      class="w-full rounded-2xl border border-stone-200 bg-stone-100 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-emerald-900 focus:bg-white"
      @input="
        friendStore.searchTravelers(
          ($event.target as HTMLInputElement).value,
        )
      "
    />

    <font-awesome-icon
      v-if="friendStore.searching"
      :icon="faSpinner"
      class="absolute right-4 top-3.5 animate-spin text-sm text-stone-400"
    />
  </div>
</template>