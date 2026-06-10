<script setup lang="ts">
import { faUserGroup, faUsers } from '@fortawesome/free-solid-svg-icons';
import { useFriendStore } from '../store/friend';
import { avatarClass, fullName, initials } from './Friend-ui';

const friendStore = useFriendStore();
</script>

<template>
  <div class="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
    <div class="mb-4 flex items-center justify-between">
      <div class="flex items-center gap-2 text-sm font-bold text-emerald-950">
        <font-awesome-icon :icon="faUserGroup" />
        <span>My Friends</span>
      </div>

      <span class="text-xs text-stone-500">
        {{ friendStore.friends.length }} friends
      </span>
    </div>

    <div v-if="friendStore.friends.length === 0" class="text-sm text-stone-500">
      You have no friends yet.
    </div>

    <div
      v-for="(friend, index) in friendStore.friends"
      :key="friend.friendshipId"
      class="mb-3 flex items-center justify-between rounded-xl bg-stone-50 px-4 py-3 last:mb-0"
    >
      <div class="flex items-center gap-3">
        <div
          class="flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white"
          :class="avatarClass(index)"
        >
          {{ initials(friend.profile) }}
        </div>

        <div>
          <p class="text-sm font-bold text-slate-900">
            {{ fullName(friend.profile) }}
          </p>
          <p class="text-xs text-stone-500">Friend</p>
        </div>
      </div>

      <div class="flex gap-2">
        <button
          class="rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-800 transition hover:bg-emerald-100"
        >
          <font-awesome-icon :icon="faUsers" />
          Invite
        </button>

        <button
          class="rounded-full bg-stone-100 px-4 py-2 text-xs font-bold text-stone-600 transition hover:bg-stone-200 disabled:opacity-50"
          :disabled="friendStore.isActionLoading(`remove:${friend.friendshipId}`)"
          @click="friendStore.removeFriend(friend.friendshipId)"
        >
          Unfriend
        </button>
      </div>
    </div>
  </div>
</template>
