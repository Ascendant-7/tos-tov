<script setup lang="ts">
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { useFriendStore } from '../store/friend';
import { avatarClass, fullName, initials } from './Friend-ui';

const friendStore = useFriendStore();
</script>

<template>
  <div class="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
    <div class="mb-4 flex items-center gap-2 text-sm font-bold text-slate-900">
      <font-awesome-icon :icon="faClock" />
      <span>Pending Sent Requests</span>
    </div>

    <div
      v-if="friendStore.outgoingRequests.length === 0"
      class="text-sm text-stone-500"
    >
      No pending sent requests.
    </div>

    <div
      v-for="(request, index) in friendStore.outgoingRequests"
      :key="request.id"
      class="mb-3 flex items-center justify-between rounded-xl bg-stone-50 px-4 py-3 last:mb-0"
    >
      <div class="flex items-center gap-3">
        <div
          class="flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white"
          :class="avatarClass(index + 2)"
        >
          {{ initials(request.receiver) }}
        </div>

        <div>
          <p class="text-sm font-bold text-slate-900">
            {{ fullName(request.receiver) }}
          </p>
          <p class="text-xs text-stone-500">Request sent</p>
        </div>
      </div>

      <button
        class="rounded-full bg-stone-200 px-4 py-2 text-xs font-semibold text-stone-600 transition hover:bg-stone-300 disabled:opacity-50"
        :disabled="friendStore.isActionLoading(`cancel:${request.id}`)"
        @click="friendStore.cancelRequest(request.id)"
      >
        Cancel
      </button>
    </div>
  </div>
</template>
