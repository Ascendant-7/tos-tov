<script setup lang="ts">
import { faBell, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useFriendStore } from '../store/friend';
import { avatarClass, fullName, initials } from './Friend-ui';

const friendStore = useFriendStore();
</script>

<template>
  <div class="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
    <div class="mb-4 flex items-center gap-2 text-sm font-bold text-emerald-950">
      <font-awesome-icon :icon="faBell" />
      <span>Friend Requests</span>

      <span class="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-800">
        {{ friendStore.incomingRequests.length }}
      </span>
    </div>

    <div
      v-if="friendStore.incomingRequests.length === 0"
      class="text-sm text-stone-500"
    >
      No incoming friend requests.
    </div>

    <div
      v-for="(request, index) in friendStore.incomingRequests"
      :key="request.id"
      class="mb-3 flex items-center justify-between rounded-xl bg-stone-50 px-4 py-3 last:mb-0"
    >
      <div class="flex items-center gap-3">
        <div
          class="flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white"
          :class="avatarClass(index + 1)"
        >
          {{ initials(request.requester) }}
        </div>

        <div>
          <p class="text-sm font-bold text-slate-900">
            {{ fullName(request.requester) }}
          </p>
          <p class="text-xs text-stone-500">Send you friend request</p>
        </div>
      </div>

      <div class="flex gap-2">
        <button
          class="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-700 text-white transition hover:bg-emerald-800 disabled:opacity-50"
          :disabled="friendStore.isActionLoading(`accept:${request.id}`)"
          @click="friendStore.acceptRequest(request.id)"
        >
          <font-awesome-icon :icon="faCheck" />
        </button>

        <button
          class="flex h-9 w-9 items-center justify-center rounded-full bg-stone-200 text-stone-600 transition hover:bg-stone-300 disabled:opacity-50"
          :disabled="friendStore.isActionLoading(`reject:${request.id}`)"
          @click="friendStore.rejectRequest(request.id)"
        >
          <font-awesome-icon :icon="faTimes" />
        </button>
      </div>
    </div>
  </div>
</template>
