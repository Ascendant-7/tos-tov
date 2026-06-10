<script setup lang="ts">
import { computed } from 'vue';
import { faPlus, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { useFriendStore } from '../store/friend';
import { avatarClass, fullName, initials } from './Friend-ui';

const friendStore = useFriendStore();

const travelersToShow = computed(() => friendStore.travelersToShow);
</script>

<template>
  <div class="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
    <div class="mb-4">
      <div class="flex items-center gap-2 text-sm font-bold text-slate-900">
        <font-awesome-icon :icon="faUserPlus" class="text-amber-500" />
        <span>
          {{ friendStore.searchQuery ? 'Search Results' : 'Suggested Travelers' }}
        </span>
      </div>

      <p class="mt-1 text-xs text-stone-500">
        People who travel to similar destinations
      </p>
    </div>

    <div v-if="travelersToShow.length === 0" class="text-sm text-stone-500">
      No travelers found.
    </div>

    <div
      v-for="(traveler, index) in travelersToShow"
      :key="traveler.id"
      class="mb-3 flex items-center justify-between rounded-xl bg-stone-50 px-4 py-3 last:mb-0"
    >
      <div class="flex items-center gap-3">
        <div
          class="flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white"
          :class="avatarClass(index + 3)"
        >
          {{ initials(traveler) }}
        </div>

        <div>
          <p class="text-sm font-bold text-slate-900">
            {{ fullName(traveler) }}
          </p>

          <p class="text-xs text-stone-500">Traveler</p>
        </div>
      </div>

      <button
        v-if="
          traveler.relationshipStatus === 'none' ||
          !traveler.relationshipStatus
        "
        class="rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-800 transition hover:bg-emerald-100 disabled:opacity-50"
        :disabled="friendStore.isActionLoading(`send:${traveler.id}`)"
        @click="friendStore.sendFriendRequest(traveler.id)"
      >
        <font-awesome-icon :icon="faPlus" />
        Add
      </button>

      <span
        v-else-if="traveler.relationshipStatus === 'pending'"
        class="rounded-full bg-stone-200 px-4 py-2 text-xs font-semibold text-stone-600"
      >
        Pending
      </span>

      <span
        v-else-if="traveler.relationshipStatus === 'accepted'"
        class="rounded-full bg-emerald-100 px-4 py-2 text-xs font-semibold text-emerald-700"
      >
        Friend
      </span>

      <span
        v-else
        class="rounded-full bg-stone-200 px-4 py-2 text-xs font-semibold text-stone-600 capitalize"
      >
        {{ traveler.relationshipStatus }}
      </span>
    </div>
  </div>
</template>
