<script setup lang="ts">
import { onMounted } from 'vue';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import { useFriendStore } from '../store/friend';
import FriendTabs from '../components/FriendTabs.vue';
import FriendSearchBar from '../components/FriendSearchBar.vue';
import FriendRequestSection from '../components/FriendRequestSection.vue';
import PendingRequestSection from '../components/PendingRequestSection.vue';
import MyFriendsSection from '../components/MyFriendsSection.vue';
import SuggestedTravelersSection from '../components/SuggestedTravelersSection.vue';

const friendStore = useFriendStore();

onMounted(async () => {
  friendStore.syncCurrentUser();
  await friendStore.fetchOverview();
});
</script>

<template>
  <main class="min-h-screen bg-[#faf8f4] px-6 py-6 text-slate-900">
    <section class="mx-auto max-w-3xl space-y-5">
      <FriendTabs />

      <FriendSearchBar />

      <p
        v-if="friendStore.error"
        class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      >
        {{ friendStore.error }}
      </p>

      <section
        v-if="friendStore.loading"
        class="rounded-2xl border border-stone-200 bg-white p-8 text-center text-sm text-stone-500"
      >
        <font-awesome-icon :icon="faSpinner" class="mr-2 animate-spin" />
        Loading friends...
      </section>

      <section v-else-if="friendStore.activeTab === 'friends'" class="space-y-5">
        <FriendRequestSection />
        <PendingRequestSection />
        <MyFriendsSection />
        <SuggestedTravelersSection />
      </section>

      <section
        v-else-if="friendStore.activeTab === 'myTrip'"
        class="rounded-2xl border border-stone-200 bg-white p-8 text-center"
      >
        <p class="text-sm font-semibold text-slate-900">My Trip</p>
        <p class="mt-1 text-sm text-stone-500">
          Trip invitations can be connected later.
        </p>
      </section>

      <section
        v-else
        class="rounded-2xl border border-stone-200 bg-white p-8 text-center"
      >
        <p class="text-sm font-semibold text-slate-900">Public Trips</p>
        <p class="mt-1 text-sm text-stone-500">
          Public trip discovery can be connected later.
        </p>
      </section>
    </section>
  </main>
</template>
