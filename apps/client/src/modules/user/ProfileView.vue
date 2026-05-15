<template>
  <div class="min-h-screen px-6 md:px-8 py-8 bg-[radial-gradient(circle_at_20%_10%,#f7f2ea_0%,#f9f7f3_40%,#f4f1ec_100%)] text-[#1a1a1a]">

    <!-- TOPBAR -->
    <header class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 animate-fade-in">
      <h1 class="text-2xl font-semibold text-[#2b2b2b]">My Profile</h1>

      <div class="flex items-center gap-3 w-full md:w-auto">
        <!-- Search -->
        <div class="flex items-center gap-2 px-4 py-2 rounded-full bg-[#efeae1] text-sm text-[#8b857e] w-full md:w-[260px]">
          <span>🔍</span>
          <input
            type="text"
            placeholder="Search destinations..."
            class="bg-transparent outline-none w-full text-[#5a554f]"
          />
        </div>

        <!-- Notification -->
        <button class="relative w-9 h-9 rounded-full bg-[#f4f0e9] border border-[#e3ddd3] grid place-items-center hover:scale-105 transition">
          🔔
          <span class="absolute top-1 right-1 w-2 h-2 bg-[#f26b5e] rounded-full"></span>
        </button>

        <!-- Avatar -->
        <div class="w-9 h-9 rounded-full bg-[#0f4f3f] text-white grid place-items-center font-semibold">
          {{ initials }}
        </div>
      </div>
    </header>

    <!-- PROFILE CARD -->
    <section class="bg-white rounded-2xl overflow-hidden shadow-lg border border-[#efe9df] animate-scale-in">

      <!-- Cover -->
      <div class="relative h-40 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1400"
          class="w-full h-full object-cover scale-105 hover:scale-110 transition duration-700"
        />
        <button class="absolute right-4 bottom-3 w-8 h-8 rounded-lg bg-white/90 border grid place-items-center hover:scale-110 transition">
          📷
        </button>
      </div>

      <!-- Body -->
      <div class="p-6">
        <div class="grid md:grid-cols-[auto_1fr_auto] gap-4 items-center text-center md:text-left">

          <!-- Avatar -->
          <div class="relative w-16 h-16 rounded-xl bg-[#0f4f3f] text-white grid place-items-center font-bold hover:scale-105 transition">
            {{ initials }}
            <span class="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          </div>

          <!-- Info -->
          <div>
            <h2 class="text-lg font-semibold">{{ displayName }}</h2>
            <p class="text-xs text-gray-500">{{ emailText }}</p>
            <p class="text-sm text-gray-600 mt-1">
              Passionate explorer, street food lover, and adventure seeker.
            </p>
          </div>

          <!-- Button -->
          <button class="px-4 py-2 rounded-full bg-[#f8f4ee] border text-sm font-semibold hover:-translate-y-1 hover:shadow-md transition">
            Edit Profile
          </button>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mt-6 pt-4 border-t">
          <div class="hover:scale-105 transition">
            <strong class="block text-lg">7</strong>
            <span class="text-xs text-gray-500">Trips</span>
          </div>
          <div class="hover:scale-105 transition">
            <strong class="block text-lg">12</strong>
            <span class="text-xs text-gray-500">Places</span>
          </div>
          <div class="hover:scale-105 transition">
            <strong class="block text-lg">3</strong>
            <span class="text-xs text-gray-500">Countries</span>
          </div>
          <div class="hover:scale-105 transition">
            <strong class="block text-lg">4.2k</strong>
            <span class="text-xs text-gray-500">Km</span>
          </div>
        </div>
      </div>
    </section>

    <!-- TABS -->
    <div class="flex gap-2 p-2 bg-[#f1ebe2] rounded-full w-fit mt-6 overflow-x-auto animate-slide-up delay-1">
      <button class="px-4 py-2 rounded-full bg-white shadow text-sm">Trips</button>
      <button class="px-4 py-2 rounded-full text-sm text-gray-500 hover:bg-white/60 transition">Saved</button>
      <button class="px-4 py-2 rounded-full text-sm text-gray-500 hover:bg-white/60 transition">History</button>
      <button class="px-4 py-2 rounded-full text-sm text-gray-500 hover:bg-white/60 transition">Achievements</button>
    </div>

    <!-- TRIPS -->
    <section class="grid gap-4 mt-4">

      <!-- Card 1 -->
      <div class="grid md:grid-cols-[auto_1fr_auto] gap-4 items-center p-4 bg-white border rounded-xl shadow-sm animate-slide-up delay-2 hover:shadow-md hover:-translate-y-1 transition">
        <img
          src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=400"
          class="w-full md:w-16 h-32 md:h-16 object-cover rounded-xl"
        />
        <div>
          <h3 class="text-sm font-semibold">Phnom Penh → Koh Rong</h3>
          <div class="flex gap-2 text-xs text-gray-500 mt-1">
            <span>7 days</span>
            <span class="px-2 py-0.5 rounded-full bg-blue-100 text-blue-600">Planned</span>
          </div>
        </div>
        <button class="w-8 h-8 rounded-lg border bg-[#f8f4ee] hover:scale-110 transition">⋮</button>
      </div>

      <!-- Card 2 -->
      <div class="grid md:grid-cols-[auto_1fr_auto] gap-4 items-center p-4 bg-white border rounded-xl shadow-sm animate-slide-up delay-3 hover:shadow-md hover:-translate-y-1 transition">
        <img
          src="https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=400"
          class="w-full md:w-16 h-32 md:h-16 object-cover rounded-xl"
        />
        <div>
          <h3 class="text-sm font-semibold">Siem Reap Temple Circuit</h3>
          <div class="flex gap-2 text-xs text-gray-500 mt-1">
            <span>4 days</span>
            <span class="px-2 py-0.5 rounded-full bg-green-100 text-green-600">Completed</span>
          </div>
        </div>
        <button class="w-8 h-8 rounded-lg border bg-[#f8f4ee] hover:scale-110 transition">⋮</button>
      </div>

    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

type StoredProfile = {
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
};

type StoredUser = {
  email?: string | null;
};

const profile = ref<StoredProfile | null>(null);
const user = ref<StoredUser | null>(null);

const loadStoredProfile = () => {
  const rawProfile = localStorage.getItem("profile");
  const rawUser = localStorage.getItem("user");

  profile.value = rawProfile ? JSON.parse(rawProfile) : null;
  user.value = rawUser ? JSON.parse(rawUser) : null;
};

loadStoredProfile();

const displayName = computed(() => {
  const firstName = profile.value?.first_name?.trim();
  const lastName = profile.value?.last_name?.trim();

  if (firstName || lastName) {
    return [firstName, lastName].filter(Boolean).join(" ");
  }

  return "Traveler";
});

const emailText = computed(() => {
  return profile.value?.email || user.value?.email || "Email not set";
});

const initials = computed(() => {
  const parts = displayName.value.split(" ").filter(Boolean);
  const first = parts[0]?.[0] || "T";
  const second = parts[1]?.[0] || "R";

  return `${first}${second}`.toUpperCase();
});
</script>

<style scoped>
/* ANIMATIONS */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.6s ease forwards;
}

.animate-scale-in {
  animation: scaleIn 0.6s ease forwards;
}

.animate-slide-up {
  animation: slideUp 0.6s ease forwards;
}

/* delays */
.delay-1 { animation-delay: 0.1s; }
.delay-2 { animation-delay: 0.2s; }
.delay-3 { animation-delay: 0.3s; }
.delay-4 { animation-delay: 0.4s; }
</style>
