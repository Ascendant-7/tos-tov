<template>
  <main class="flex-1 h-screen overflow-y-auto bg-cream box-border font-sans custom-scrollbar">
    <CommunityView :active-comment-post-id="activeCommentPostId" :new-comment="newComment"
      @create-post="showCreatePostModal = true" @share-post="requestSharePost" @toggle-comments="toggleComments"
      @request-delete="requestDeletePost" @update:new-comment="newComment = $event" @submit-comment="addComment" />

    <div
      v-if="showCreatePostModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    >
      <div class="w-full max-w-[500px] max-h-[85vh] overflow-y-auto rounded-2xl bg-white shadow-2xl flex flex-col relative">
        <!-- Modal Header -->
        <div
          class="sticky top-0 z-20 flex items-center justify-between border-b border-weather-border bg-white px-5 py-4 sm:px-6"
        >
          <button
            class="cursor-pointer border-none bg-transparent text-[13px] font-semibold text-slate-500 transition-colors hover:text-slate-700 sm:text-[14px]"
            @click="closeCreatePostModal"
          >
            Cancel
          </button>
          <h3 class="m-0 text-[15px] font-bold text-slate-800 sm:text-[16px]">
            Create Post
          </h3>
          <button
            class="cursor-pointer border-none bg-transparent text-[13px] font-bold text-sidebar-active transition-colors hover:text-sidebar-active/80 disabled:cursor-not-allowed disabled:opacity-40 sm:text-[14px]"
            :disabled="communityStore.isSubmitting || !newPostText.trim()"
            @click="createPost"
          >
            {{ communityStore.isSubmitting ? 'Posting...' : 'Share' }}
          </button>
        </div>

        <!-- User Profile Block -->
        <div class="flex items-center gap-3 px-5 pt-4 sm:px-6">
          <div class="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden">
            <img v-if="currentUserAvatarUrl" :src="currentUserAvatarUrl" alt="Your Avatar" class="w-full h-full object-cover" />
            <span v-else>{{ currentUserInitials }}</span>
          </div>
          <div>
            <h4 class="m-0 text-[14px] font-bold text-slate-800 leading-tight">
              {{ currentUserDisplayName }}
            </h4>
            <p class="m-0 text-[11px] text-slate-400 font-medium leading-tight mt-0.5">
              Sharing to Community
            </p>
          </div>
        </div>

        <div class="space-y-4 p-5 sm:p-6">
          <!-- Link to Trip or Destination -->
          <div class="space-y-2">
            <label class="text-[12px] font-semibold text-slate-700">Link to Trip or Destination <span class="font-normal text-slate-450">(optional)</span></label>
            
            <!-- Selected state: Destination -->
            <div v-if="selectedDestination"
              class="flex items-center justify-between gap-3 rounded-xl border border-weather-border bg-cream/60 px-4 py-3">
              <div class="flex items-center gap-3 min-w-0">
                <img :src="selectedDestination.coverImageUrl || fallbackDestinationImage" class="h-8 w-8 rounded-lg object-cover flex-shrink-0" />
                <div class="min-w-0">
                  <p class="m-0 truncate text-[13px] font-semibold text-slate-800">{{ selectedDestination.name }}</p>
                  <p class="m-0 truncate text-[12px] text-slate-500">
                    {{ [selectedDestination.province, selectedDestination.locationName].filter(Boolean).join(' - ') }}
                  </p>
                </div>
              </div>
              <button class="text-[12px] font-semibold text-sidebar-active border-none bg-transparent cursor-pointer" @click="clearSelectedDestination">
                Clear
              </button>
            </div>

            <!-- Selected state: Trip -->
            <div v-else-if="selectedTrip"
              class="flex items-center justify-between gap-3 rounded-xl border border-weather-border bg-cream/60 px-4 py-3">
              <div class="flex items-center gap-3 min-w-0">
                <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-active/10 text-sidebar-active flex-shrink-0">
                  <FontAwesomeIcon :icon="faRoute" class="h-4 w-4" />
                </div>
                <div class="min-w-0">
                  <p class="m-0 truncate text-[13px] font-semibold text-slate-800">{{ selectedTrip.title }}</p>
                  <p class="m-0 truncate text-[12px] text-slate-500">Linked Trip</p>
                </div>
              </div>
              <button class="text-[12px] font-semibold text-sidebar-active border-none bg-transparent cursor-pointer" @click="selectedTrip = null">
                Clear
              </button>
            </div>

            <!-- Non-selected Trigger -->
            <div v-else class="relative">
              <button
                type="button"
                class="flex w-full items-center justify-between rounded-xl border border-weather-border bg-white px-4 py-3 text-left text-[13px] text-slate-500 outline-none cursor-pointer hover:bg-cream/20"
                @click="toggleLinkDropdown"
              >
                <span>Add trip or destination...</span>
                <FontAwesomeIcon :icon="faChevronDown" class="h-4 w-4 text-slate-400 transition-transform" :class="{ 'rotate-180': showLinkDropdown }" />
              </button>

              <!-- Dropdown popup panel -->
              <div v-if="showLinkDropdown" 
                class="absolute z-30 mt-2 max-h-[320px] w-full overflow-hidden rounded-2xl border border-weather-border bg-white p-4 shadow-[0_8px_32px_rgba(0,0,0,0.12)] flex flex-col gap-3">
                
                <!-- Toggle switcher tabs -->
                <div class="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1">
                  <button
                    type="button"
                    class="flex items-center justify-center gap-2 py-1.5 text-[12px] font-bold rounded-lg border-none cursor-pointer transition-all"
                    :class="activeLinkTab === 'destinations' ? 'bg-white text-slate-800 shadow-sm' : 'bg-transparent text-slate-500 hover:text-slate-700'"
                    @click="activeLinkTab = 'destinations'"
                  >
                    <FontAwesomeIcon :icon="faCompass" class="h-3.5 w-3.5" />
                    Destinations
                  </button>
                  <button
                    type="button"
                    class="flex items-center justify-center gap-2 py-1.5 text-[12px] font-bold rounded-lg border-none cursor-pointer transition-all"
                    :class="activeLinkTab === 'trips' ? 'bg-white text-slate-800 shadow-sm' : 'bg-transparent text-slate-500 hover:text-slate-700'"
                    @click="activeLinkTab = 'trips'"
                  >
                    <FontAwesomeIcon :icon="faRoute" class="h-3.5 w-3.5" />
                    My Trips
                  </button>
                </div>

                <!-- Query Search Bar -->
                <div class="relative">
                  <FontAwesomeIcon :icon="faMagnifyingGlass" class="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <input
                    v-model="linkSearchQuery"
                    type="text"
                    :placeholder="activeLinkTab === 'destinations' ? 'Search destinations...' : 'Search trips...'"
                    class="w-full rounded-xl border border-weather-border py-2.5 pl-9 pr-4 text-[13px] text-slate-800 outline-none focus:border-sidebar-active focus:ring-1 focus:ring-sidebar-active/20"
                  />
                </div>

                <!-- Options List -->
                <div class="overflow-y-auto flex-1 space-y-1 custom-scrollbar pr-0.5">
                  <!-- Destination List -->
                  <template v-if="activeLinkTab === 'destinations'">
                    <button
                      v-for="destination in filteredDestinations"
                      :key="destination.id"
                      type="button"
                      class="flex w-full items-center justify-between border-none bg-white p-2 rounded-xl text-left transition-colors hover:bg-cream cursor-pointer"
                      @click="selectDestination(destination)"
                    >
                      <div class="flex items-center gap-3 min-w-0">
                        <img :src="destination.coverImageUrl || fallbackDestinationImage" :alt="destination.name" class="h-10 w-10 rounded-lg object-cover flex-shrink-0" />
                        <div class="min-w-0">
                          <span class="block truncate text-[13px] font-semibold text-slate-800">{{ destination.name }}</span>
                          <span class="block truncate text-[12px] text-slate-500">
                            {{ [destination.province, destination.locationName].filter(Boolean).join(' - ') || 'Cambodia' }}
                          </span>
                        </div>
                      </div>
                      <div class="flex items-center gap-1 text-[12px] font-bold text-amber-500">
                        <span>★</span>
                        <span>{{ getDestinationRating(destination.name) }}</span>
                      </div>
                    </button>
                    <div v-if="communityStore.isSearchingDestinations" class="py-4 text-center text-[12px] text-slate-500">
                      Searching...
                    </div>
                    <div v-else-if="filteredDestinations.length === 0" class="py-4 text-center text-[12px] text-slate-500">
                      No destinations found.
                    </div>
                  </template>

                  <!-- Trips List -->
                  <template v-else>
                    <button
                      v-for="trip in filteredTrips"
                      :key="trip.id"
                      type="button"
                      class="flex w-full items-center gap-3 border-none bg-white p-2 rounded-xl text-left transition-colors hover:bg-cream cursor-pointer"
                      @click="selectTrip(trip)"
                    >
                      <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-active/10 text-sidebar-active flex-shrink-0">
                        <FontAwesomeIcon :icon="faRoute" class="h-4 w-4" />
                      </div>
                      <div class="min-w-0">
                        <span class="block truncate text-[13px] font-semibold text-slate-800">{{ trip.title }}</span>
                        <span class="block truncate text-[12px] text-slate-500">My Trip</span>
                      </div>
                    </button>
                    <div v-if="filteredTrips.length === 0" class="py-4 text-center text-[12px] text-slate-500">
                      No trips found.
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <label class="space-y-2">
              <span class="text-[12px] font-semibold text-slate-700">Trip status</span>
              <select v-model="visitStatus"
                class="w-full rounded-xl border border-weather-border bg-white px-4 py-3 text-[13px] text-slate-800 outline-none focus:border-sidebar-active focus:ring-1 focus:ring-sidebar-active/20">
                <option value="visited">Visited</option>
                <option value="want_to_go">Want to go</option>
              </select>
            </label>

            <label class="space-y-2">
              <span class="text-[12px] font-semibold text-slate-700">Visibility</span>
              <select v-model="visibility"
                class="w-full rounded-xl border border-weather-border bg-white px-4 py-3 text-[13px] text-slate-800 outline-none focus:border-sidebar-active focus:ring-1 focus:ring-sidebar-active/20">
                <option value="public">Public</option>
                <option value="friends">Friends</option>
                <option value="private">Private</option>
              </select>
            </label>
          </div>

          <label class="space-y-2">
            <span class="text-[12px] font-semibold text-slate-700">Title <span class="font-normal text-slate-400">(optional)</span></span>
            <input v-model="newPostTitle" type="text" maxlength="120"
              placeholder="Add a short title..."
              class="w-full rounded-xl border border-weather-border px-4 py-3 text-[13px] text-slate-800 outline-none focus:border-sidebar-active focus:ring-1 focus:ring-sidebar-active/20 sm:text-[14px]" />
          </label>

          <label class="space-y-2">
            <span class="text-[12px] font-semibold text-slate-700">Caption</span>
            <textarea v-model="newPostText"
            placeholder="Write a caption... #AngkorWat #Adventure"
            class="h-24 w-full resize-none rounded-xl border border-weather-border p-4 text-[13px] text-slate-800 outline-none focus:border-sidebar-active focus:ring-1 focus:ring-sidebar-active/20 sm:text-[14px]" />
          </label>

          <div
            class="space-y-3 rounded-xl border border-dashed border-weather-border bg-cream/60 p-4"
          >
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-2 text-slate-700">
                <FontAwesomeIcon :icon="faImage" class="h-4 w-4" />
                <span class="text-[13px] font-semibold sm:text-[14px]">Upload media</span>
                <span v-if="selectedMedia.length > 0" class="text-[12px] text-slate-500">({{ selectedMedia.length
                }})</span>
              </div>
              <button v-if="selectedMedia.length > 0"
                class="text-[12px] font-medium text-slate-500 transition-colors hover:text-red-500 bg-transparent border-none cursor-pointer"
                @click="clearAllMedia">
                Clear All
              </button>
            </div>

            <label
              class="flex cursor-pointer items-center justify-center rounded-xl border border-weather-border bg-white px-4 py-3 text-[13px] font-medium text-slate-600 transition-colors hover:bg-cream sm:text-[14px]">
              <input ref="fileInputRef" type="file" multiple accept="image/*,video/mp4,video/webm" class="hidden"
                @change="handleMediaUpload" />
              <span class="flex items-center gap-2">
                <FontAwesomeIcon :icon="faArrowUpFromBracket" class="h-4 w-4" />
                Choose media
              </span>
            </label>

            <div v-if="selectedMedia.length > 0" class="space-y-2">
              <div class="relative overflow-hidden rounded-xl border border-weather-border bg-white group">
                <video v-if="selectedMedia[currentMediaIndex]?.type === 'video'"
                  :src="selectedMedia[currentMediaIndex]?.url"
                  class="h-48 w-full object-cover"
                  controls
                  muted />
                <img v-else :src="selectedMedia[currentMediaIndex]?.url" alt="Selected upload preview"
                  class="h-48 w-full object-cover" />
                <div v-if="selectedMedia.length > 1" class="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
                  <button v-if="currentMediaIndex > 0" @click.stop="currentMediaIndex--"
                    class="pointer-events-auto rounded-full bg-black/40 p-2 text-white transition-all hover:bg-black/60 border-none">
                    <FontAwesomeIcon :icon="faChevronLeft" class="h-4 w-4" />
                  </button>
                  <button v-if="currentMediaIndex < selectedMedia.length - 1" @click.stop="currentMediaIndex++"
                    class="pointer-events-auto ml-auto rounded-full bg-black/40 p-2 text-white transition-all hover:bg-black/60 border-none">
                    <FontAwesomeIcon :icon="faChevronRight" class="h-4 w-4" />
                  </button>
                </div>
                <div v-if="selectedMedia.length > 1"
                  class="absolute bottom-2 left-1/2 -translate-x-1/2 text-[12px] font-medium text-white bg-black/40 px-3 py-1 rounded-full">
                  {{ currentMediaIndex + 1 }} / {{ selectedMedia.length }}
                </div>
                <button @click.stop="removeMedia(currentMediaIndex)"
                  class="absolute top-2 right-2 rounded-full bg-red-500 text-white p-2 transition-all hover:bg-red-600 shadow-lg border-none cursor-pointer">
                  <FontAwesomeIcon :icon="faXmark" class="h-5 w-5" />
                </button>
              </div>

              <div class="flex gap-2 overflow-x-auto pb-2">
                <div v-for="(media, index) in selectedMedia" :key="media.url"
                  class="relative flex-shrink-0 rounded-lg border-2 overflow-hidden cursor-pointer transition-all"
                  :class="currentMediaIndex === index ? 'border-sidebar-active ring-2 ring-sidebar-active/30' : 'border-weather-border hover:border-slate-400'"
                  @click="currentMediaIndex = index">
                  <video v-if="media.type === 'video'" :src="media.url" class="h-20 w-20 object-cover" muted />
                  <img v-else :src="media.url" :alt="`Thumbnail ${index + 1}`" class="h-20 w-20 object-cover" />
                  <span v-if="media.type === 'video'"
                    class="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    Video
                  </span>
                  <button @click.stop="removeMedia(index)"
                    class="absolute top-1 right-1 rounded-full bg-red-500 text-white p-1 transition-all hover:bg-red-600 shadow-md border-none cursor-pointer">
                    <FontAwesomeIcon :icon="faXmark" class="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>    <div v-if="postPendingDelete" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div class="w-full max-w-[420px] rounded-2xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
        <div class="border-b border-weather-border px-5 py-4">
          <h3 class="m-0 text-[16px] font-bold text-slate-800">Delete post?</h3>
        </div>

        <div class="space-y-4 px-5 py-4">
          <p class="m-0 text-[13px] leading-relaxed text-slate-600">
            This post and its media/comments will be removed. This cannot be undone.
          </p>

          <div class="flex justify-end gap-3">
            <button
              class="rounded-xl border border-weather-border px-4 py-2.5 text-[13px] font-semibold text-slate-650 transition-colors hover:bg-cream"
              @click="postPendingDelete = null">
              Cancel
            </button>
            <button
              class="rounded-xl border-none bg-red-500 px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-red-600"
              @click="confirmDeletePost">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>    <!-- Share Post Modal -->
    <div v-if="showShareModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div class="w-full max-w-[460px] rounded-2xl bg-white shadow-2xl flex flex-col overflow-hidden animate-scale-in">
        <!-- Modal Header -->
        <div class="flex items-center justify-between border-b border-weather-border px-5 py-4">
          <h3 class="m-0 text-[15px] font-bold text-slate-800">{{ shareStep === 'select' ? 'Share Post' : 'Share to Feed' }}</h3>
          <button
            class="cursor-pointer rounded-lg border-none bg-transparent p-1 transition-colors hover:bg-cream"
            @click="showShareModal = false"
          >
            <FontAwesomeIcon :icon="faXmark" class="h-4 w-4 text-slate-500" />
          </button>
        </div>

        <!-- Step 1: Selection Menu -->
        <div v-if="shareStep === 'select'" class="p-5 space-y-3">
          <!-- Share to Feed Option -->
          <button
            class="w-full flex items-center justify-between gap-4 rounded-xl border border-weather-border bg-white p-4 text-left transition-all hover:bg-cream/40 hover:shadow-sm cursor-pointer"
            @click="shareStep = 'composer'"
          >
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <FontAwesomeIcon :icon="faShareNodes" class="h-5 w-5" />
              </div>
              <div>
                <h4 class="m-0 text-[13px] sm:text-[14px] font-bold text-slate-800">Share to Feed</h4>
                <p class="m-0 text-[11px] text-slate-400 font-medium mt-0.5">Share this post to your community feed</p>
              </div>
            </div>
            <FontAwesomeIcon :icon="faChevronRight" class="h-3.5 w-3.5 text-slate-400" />
          </button>

          <!-- Copy Link Option -->
          <button
            class="w-full flex items-center justify-between gap-4 rounded-xl border border-weather-border bg-white p-4 text-left transition-all hover:bg-cream/40 hover:shadow-sm cursor-pointer"
            @click="copyShareLink"
          >
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <FontAwesomeIcon :icon="faLink" class="h-5 w-5" />
              </div>
              <div>
                <h4 class="m-0 text-[13px] sm:text-[14px] font-bold text-slate-800">Copy Link</h4>
                <p class="m-0 text-[11px] text-slate-400 font-medium mt-0.5">Copy post link to clipboard</p>
              </div>
            </div>
            <div v-if="linkCopied" class="flex items-center gap-1.5 text-emerald-600 font-semibold text-[12px]">
              <FontAwesomeIcon :icon="faCheck" class="h-3.5 w-3.5" />
            </div>
            <FontAwesomeIcon v-else :icon="faChevronRight" class="h-3.5 w-3.5 text-slate-400" />
          </button>

          <!-- Share on Social Option -->
          <div class="relative">
            <button
              class="w-full flex items-center justify-between gap-4 rounded-xl border border-weather-border bg-white p-4 text-left transition-all hover:bg-cream/40 hover:shadow-sm cursor-pointer"
              @click="toggleSocialMenu"
            >
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <FontAwesomeIcon :icon="faShareNodes" class="h-5 w-5" />
                </div>
                <div>
                  <h4 class="m-0 text-[13px] sm:text-[14px] font-bold text-slate-800">Share on Social</h4>
                  <p class="m-0 text-[11px] text-slate-400 font-medium mt-0.5">Facebook, Instagram, Twitter</p>
                </div>
              </div>
              <FontAwesomeIcon :icon="faChevronRight" class="h-3.5 w-3.5 text-slate-400 transition-transform" :class="{ 'rotate-90': showSocialMenu }" />
            </button>

            <!-- Social Menu Subpanel -->
            <div v-if="showSocialMenu" class="mt-2 grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <button
                v-for="platform in socialPlatforms"
                :key="platform.name"
                class="flex flex-col items-center justify-center p-2 rounded-lg bg-white border border-slate-200 hover:bg-cream/30 hover:border-slate-300 transition-all cursor-pointer text-slate-700"
                @click="shareOnSocial(platform.name)"
              >
                <span class="text-[18px] mb-1">{{ platform.icon }}</span>
                <span class="text-[10px] font-bold">{{ platform.name }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Step 2: Feed Composer -->
        <div v-else-if="shareStep === 'composer'" class="flex flex-col overflow-hidden">
          <div class="p-5 space-y-4">
            <!-- Textarea for Caption -->
            <div class="space-y-1.5">
              <div class="flex justify-between items-center">
                <label class="text-[12px] font-semibold text-slate-700">Caption <span class="font-normal text-slate-400">(optional)</span></label>
                <button
                  class="text-[11px] font-bold text-sidebar-active hover:underline border-none bg-transparent cursor-pointer"
                  @click="shareStep = 'select'"
                >
                  &larr; Back
                </button>
              </div>
              <textarea
                v-model="shareCaption"
                placeholder="What's on your mind about this post?..."
                class="h-20 w-full resize-none rounded-xl border border-weather-border p-3 text-[13px] text-slate-800 outline-none focus:border-sidebar-active focus:ring-1 focus:ring-sidebar-active/20"
              />
            </div>

            <!-- Preview of original post -->
            <div v-if="postToShare" class="rounded-xl border border-slate-200 bg-slate-50/50 p-3 flex gap-3 min-w-0">
              <div class="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                {{ postToShare.userInitials }}
              </div>
              <div class="min-w-0 flex-1">
                <span class="block text-[12px] font-bold text-slate-800 truncate">{{ postToShare.userName }}</span>
                <span v-if="postToShare.title" class="block text-[12px] font-semibold text-slate-700 truncate mt-0.5">{{ postToShare.title }}</span>
                <p class="m-0 text-[11px] text-slate-500 truncate mt-0.5">{{ postToShare.description }}</p>
              </div>
            </div>
          </div>

          <!-- Footer Actions -->
          <div class="flex justify-end gap-3 border-t border-weather-border px-5 py-3.5 bg-slate-50">
            <button
              class="rounded-xl border border-weather-border bg-white px-4 py-2 text-[12px] font-semibold text-slate-650 transition-colors hover:bg-cream cursor-pointer"
              @click="shareStep = 'select'"
            >
              Cancel
            </button>
            <button
              class="rounded-xl border-none bg-sidebar-active px-4 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-sidebar-active/90 cursor-pointer"
              @click="confirmSharePost"
            >
              Share Now
            </button>
          </div>
        </div>

        <!-- Footer Info -->
        <div v-if="postToShare" class="border-t border-weather-border px-5 py-3.5 bg-slate-50 text-center text-[11px] font-semibold text-slate-500">
          This post has been shared <span class="text-sidebar-active font-bold">{{ postToShare.shares }}</span> times
        </div>
      </div>
    </div>
  </main>
</template>
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faArrowUpFromBracket, faImage, faXmark, faChevronLeft, faChevronRight, faLocationDot, faChevronDown, faCompass, faRoute, faMagnifyingGlass, faLink, faCheck, faShareNodes } from '@fortawesome/free-solid-svg-icons'
import { useCommunityStore } from '@/modules/community/store/community'
import { getTrips, type Trip } from '@/modules/itinerary/services/itinerary.service'
import CommunityView from '@/modules/community/pages/CommunityView.vue'
import type { DestinationOption, Post } from '@/modules/community/store/community'

const communityStore = useCommunityStore()

type SelectedMedia = {
  url: string
  type: 'image' | 'video'
}

const showCreatePostModal = computed({
  get: () => communityStore.showCreatePostModal,
  set: (val) => {
    communityStore.showCreatePostModal = val
  },
})

const userTrips = ref<Trip[]>([])
const selectedTrip = ref<Trip | null>(null)
const selectedDestination = ref<DestinationOption | null>(null)

// Share Post Modal State
const showShareModal = ref(false)
const postToShare = ref<Post | null>(null)
const shareCaption = ref('')
const shareStep = ref<'select' | 'composer'>('select')
const linkCopied = ref(false)
const showSocialMenu = ref(false)

const socialPlatforms = [
  { name: 'Facebook', icon: '👥' },
  { name: 'Twitter', icon: '🐦' },
  { name: 'Instagram', icon: '📸' }
]

const toggleSocialMenu = () => {
  showSocialMenu.value = !showSocialMenu.value
}

const copyShareLink = async () => {
  if (!postToShare.value) return

  const postUrl = `${window.location.origin}/community?post=${postToShare.value.postId}`

  try {
    await navigator.clipboard.writeText(postUrl)
    linkCopied.value = true
    communityStore.showFeedback('Link copied to clipboard!', 'success')
    setTimeout(() => {
      linkCopied.value = false
    }, 2000)
  } catch {
    communityStore.showError('Failed to copy link.')
  }
}

const shareOnSocial = (platform: string) => {
  if (!postToShare.value) return

  const postUrl = `${window.location.origin}/community?post=${postToShare.value.postId}`
  let url = ''

  if (platform === 'Facebook') {
    url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`
  } else if (platform === 'Twitter') {
    url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent('Check out this post on Tos-Tov!')}`
  } else if (platform === 'Instagram') {
    copyShareLink()
    communityStore.showFeedback('Instagram: Link copied! Paste it in your story or bio.', 'info')
    showSocialMenu.value = false
    return
  }

  if (url) {
    window.open(url, '_blank', 'width=600,height=400')
  }
  showSocialMenu.value = false
}

const requestSharePost = (post: Post) => {
  postToShare.value = post
  shareCaption.value = ''
  shareStep.value = 'select'
  linkCopied.value = false
  showSocialMenu.value = false
  showShareModal.value = true
}

const confirmSharePost = async () => {
  if (!postToShare.value) return

  try {
    await communityStore.sharePost(postToShare.value.postId, shareCaption.value.trim() || undefined)
    showShareModal.value = false
    postToShare.value = null
    shareCaption.value = ''
  } catch {
    // The store owns the user-facing error message.
  }
}

const fetchUserTrips = async () => {
  try {
    userTrips.value = await getTrips()
  } catch {
    userTrips.value = []
  }
}

watch(showCreatePostModal, async (newVal) => {
  if (newVal) {
    await fetchUserTrips()
    void communityStore.searchDestinations('')
  }
})

// Unified Link Dropdown State
const showLinkDropdown = ref(false)
const activeLinkTab = ref<'destinations' | 'trips'>('destinations')
const linkSearchQuery = ref('')

const toggleLinkDropdown = () => {
  showLinkDropdown.value = !showLinkDropdown.value
}

const selectTrip = (trip: Trip) => {
  selectedTrip.value = trip
  selectedDestination.value = null
  showLinkDropdown.value = false
  linkSearchQuery.value = ''
}

const selectDestination = (destination: DestinationOption) => {
  selectedDestination.value = destination
  selectedTrip.value = null
  showLinkDropdown.value = false
  linkSearchQuery.value = ''
}

const clearSelectedDestination = () => {
  selectedDestination.value = null
}

const getDestinationRating = (name: string) => {
  if (name.includes('Angkor')) return '4.9'
  if (name.includes('Rong')) return '4.7'
  if (name.includes('Phnom')) return '4.5'
  if (name.includes('Kampot')) return '4.6'
  if (name.includes('Siem')) return '4.8'
  let sum = 0
  for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i)
  return (4.0 + (sum % 10) / 10).toFixed(1)
}

const filteredTrips = computed(() => {
  const q = linkSearchQuery.value.trim().toLowerCase()
  if (!q) return userTrips.value
  return userTrips.value.filter((trip) => trip.title.toLowerCase().includes(q))
})

const filteredDestinations = computed(() => {
  return communityStore.destinationResults
})


// Current user profile computed details
const currentUserDisplayName = computed(() => {
  if (!communityStore.currentUserProfile) return 'You'
  const profile = communityStore.currentUserProfile
  const full = `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
  return full || profile.email?.split('@')[0] || 'You'
})

const currentUserInitials = computed(() => {
  if (!communityStore.currentUserProfile) return 'YO'
  const profile = communityStore.currentUserProfile
  const first = profile.first_name?.[0] || ''
  const last = profile.last_name?.[0] || ''
  const initial = `${first}${last}`.toUpperCase()
  return initial || profile.email?.[0]?.toUpperCase() || 'YO'
})

const currentUserAvatarUrl = computed(() => {
  return communityStore.currentUserProfile?.avatar_url || null
})

const activeCommentPostId = ref<string | null>(null)
const activeCommentTargetPostId = ref<string | null>(null)
const newPostTitle = ref('')
const newPostText = ref('')
const selectedMedia = ref<SelectedMedia[]>([])
const selectedFiles = ref<File[]>([])
const currentMediaIndex = ref(0)
const fileInputRef = ref<HTMLInputElement | null>(null)
const newComment = ref('')
const postPendingDelete = ref<Post | null>(null)
const visitStatus = ref<'visited' | 'want_to_go'>('visited')
const visibility = ref<'public' | 'friends' | 'private'>('public')
const fallbackDestinationImage =
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=120&h=120&fit=crop'

let destinationSearchTimer: ReturnType<typeof window.setTimeout> | null = null

const handleMediaUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  const files = input.files

  if (!files || files.length === 0) {
    return
  }

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const isSupportedMedia = file?.type.startsWith('image/') || ['video/mp4', 'video/webm'].includes(file?.type ?? '')

    if (file && isSupportedMedia) {
      const objectUrl = URL.createObjectURL(file)
      selectedFiles.value.push(file)
      selectedMedia.value.push({
        url: objectUrl,
        type: file.type.startsWith('video/') ? 'video' : 'image',
      })
    }
  }

  currentMediaIndex.value = selectedMedia.value.length - 1

  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

const removeMedia = (index: number) => {
  const media = selectedMedia.value[index]

  if (media) {
    URL.revokeObjectURL(media.url)
  }

  selectedMedia.value.splice(index, 1)
  selectedFiles.value.splice(index, 1)

  if (currentMediaIndex.value >= selectedMedia.value.length) {
    currentMediaIndex.value = Math.max(0, selectedMedia.value.length - 1)
  }
}

const clearAllMedia = () => {
  selectedMedia.value.forEach((media) => {
    URL.revokeObjectURL(media.url)
  })

  selectedMedia.value = []
  selectedFiles.value = []
  currentMediaIndex.value = 0

  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

const closeCreatePostModal = () => {
  clearAllMedia()
  resetPostForm()
  showCreatePostModal.value = false
}

const resetPostForm = () => {
  newPostText.value = ''
  newPostTitle.value = ''
  linkSearchQuery.value = ''
  selectedDestination.value = null
  selectedTrip.value = null
  visitStatus.value = 'visited'
  visibility.value = 'public'
  showLinkDropdown.value = false
  activeLinkTab.value = 'destinations'
  communityStore.destinationResults = []
}

const toggleComments = (post: Post) => {
  const isClosing = activeCommentPostId.value === post.id
  activeCommentPostId.value = isClosing ? null : post.id
  activeCommentTargetPostId.value = isClosing ? null : post.postId
  newComment.value = ''
}


const requestDeletePost = (post: Post) => {
  postPendingDelete.value = post
}

const confirmDeletePost = async () => {
  if (!postPendingDelete.value) {
    return
  }

  const postId = postPendingDelete.value.id
  postPendingDelete.value = null

  await communityStore.deletePost(postId)
}

const createPost = async () => {
  if (newPostText.value.trim()) {
    const hashtags = newPostText.value
      .split(' ')
      .filter((tag) => tag.startsWith('#'))
      .slice(0, 5)

    try {
      await communityStore.addPost(
        {
          content: newPostText.value,
          title: newPostTitle.value.trim() || undefined,
          hashtags,
          destinationId: selectedDestination.value?.id,
          destinationName: selectedDestination.value?.name,
          province: selectedDestination.value?.province,
          isVisited: visitStatus.value === 'visited',
          visibility: visibility.value,
          tripId: selectedTrip.value?.id,
        },
        selectedFiles.value,
      )
      closeCreatePostModal()
    } catch {
      // The store owns the user-facing error message.
    }
  }
}

const addComment = async () => {
  if (newComment.value.trim() && activeCommentTargetPostId.value) {
    try {
      await communityStore.addComment(activeCommentTargetPostId.value, newComment.value)
      newComment.value = ''
    } catch {
      // The store owns the user-facing error message.
    }
  }
}

watch(linkSearchQuery, (query) => {
  if (activeLinkTab.value === 'destinations') {
    if (destinationSearchTimer) {
      window.clearTimeout(destinationSearchTimer)
    }

    destinationSearchTimer = window.setTimeout(() => {
      void communityStore.searchDestinations(query)
    }, 250)
  }
})

watch(activeLinkTab, (tab) => {
  linkSearchQuery.value = ''
  if (tab === 'destinations') {
    void communityStore.searchDestinations('')
  }
})
</script>
