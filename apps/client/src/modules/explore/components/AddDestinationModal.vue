<template>
  <!-- Backdrop -->
  <Teleport to="body">
    <Transition name="modal-backdrop">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        @click.self="close"
      >
        <!-- Overlay -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

        <!-- Modal Panel -->
        <Transition name="modal-panel">
          <div
            v-if="modelValue"
            class="relative w-full max-w-[620px] max-h-[90vh] bg-white rounded-3xl shadow-[0_25px_50px_rgba(0,0,0,0.25),0_10px_25px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col"
          >
            <!-- Header with Gradient -->
            <div
              class="relative px-6 py-6 shrink-0 bg-gradient-to-br from-sidebar-active/95 to-sidebar-active overflow-hidden"
            >
              <!-- Animated background elements -->
              <div class="absolute inset-0 opacity-[0.03]">
                <div
                  class="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"
                ></div>
                <div
                  class="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4"
                ></div>
              </div>

              <div class="relative flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <div
                    class="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center ring-1 ring-white/30 animate-bounce-slow"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div>
                    <h2 class="text-[22px] font-bold text-white m-0">Add Destination</h2>
                    <p class="text-[14px] text-white/80 m-0">
                      Share an amazing place with travelers
                    </p>
                  </div>
                </div>
                <button
                  @click="close"
                  class="w-10 h-10 rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 border-none cursor-pointer bg-transparent backdrop-blur-sm ring-1 ring-white/20"
                  aria-label="Close"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Form body (scrollable) -->
            <div class="overflow-y-auto flex-1 px-6 py-6 space-y-5 custom-scrollbar">
              <!-- Success Banner -->
              <Transition name="slide-down">
                <div
                  v-if="successMessage"
                  class="flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-50 to-emerald-100/50 border border-emerald-300 rounded-2xl shadow-lg animate-success"
                >
                  <div
                    class="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-md"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="3"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </div>
                  <p class="text-[15px] font-semibold text-emerald-700 m-0">{{ successMessage }}</p>
                </div>
              </Transition>

              <!-- Error Banner -->
              <Transition name="slide-down">
                <div
                  v-if="submitError"
                  class="flex items-center gap-3 p-4 bg-gradient-to-r from-red-50 to-red-100/50 border border-red-300 rounded-2xl shadow-lg animate-shake"
                >
                  <div
                    class="w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center text-white shrink-0 shadow-md"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" x2="12" y1="8" y2="12" />
                      <line x1="12" x2="12.01" y1="16" y2="16" />
                    </svg>
                  </div>
                  <p class="text-[15px] font-semibold text-red-700 m-0">{{ submitError }}</p>
                </div>
              </Transition>

              <!-- Row 1: Name -->
              <div class="field-group field-animate-1">
                <label class="field-label">
                  <span class="inline-flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
                      />
                    </svg>
                    Destination Name <span class="text-red-400">*</span>
                  </span>
                </label>
                <input
                  v-model="form.name"
                  type="text"
                  placeholder="e.g. Angkor Wat"
                  class="field-input"
                  :class="{ 'field-input--error': errors.name }"
                  @input="
                    form.name.trim() &&
                    errors.name &&
                    delete (errors as Record<string, unknown>)['name']
                  "
                />
                <p v-if="errors.name" class="field-error">{{ errors.name }}</p>
              </div>

              <!-- Row 2: Province + City -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 field-animate-2">
                <div class="field-group">
                  <label class="field-label">
                    <span class="inline-flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path
                          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z"
                        />
                      </svg>
                      Province <span class="text-red-400">*</span>
                    </span>
                  </label>
                  <select
                    v-model="form.province"
                    class="field-input"
                    :class="{ 'field-input--error': errors.province }"
                    @change="
                      form.province &&
                      errors.province &&
                      delete (errors as Record<string, unknown>)['province']
                    "
                  >
                    <option value="" disabled>Select province</option>
                    <option v-for="p in PROVINCES" :key="p" :value="p">{{ p }}</option>
                  </select>
                  <p v-if="errors.province" class="field-error">{{ errors.province }}</p>
                </div>
                <div class="field-group">
                  <label class="field-label">
                    <span class="inline-flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path
                          d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"
                        />
                      </svg>
                      City
                    </span>
                  </label>
                  <input
                    v-model="form.location_name"
                    type="text"
                    placeholder="e.g. Siem Reap City"
                    class="field-input"
                  />
                </div>
              </div>

              <!-- Row 3: Category -->
              <div class="field-group field-animate-3">
                <label class="field-label">
                  <span class="inline-flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11z"
                      />
                    </svg>
                    Category <span class="text-red-400">*</span>
                  </span>
                </label>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="(cat, idx) in CATEGORIES"
                    :key="cat"
                    type="button"
                    @click="
                      () => {
                        form.category = cat
                        if (errors.category) delete (errors as Record<string, unknown>)['category']
                      }
                    "
                    :style="{ transitionDelay: `${idx * 30}ms` }"
                    :class="[
                      'px-4 py-2 rounded-full text-[14px] font-semibold border cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95',
                      form.category === cat
                        ? 'bg-gradient-to-r from-sidebar-active to-sidebar-active/90 text-white border-sidebar-active shadow-[0_4px_12px_rgba(42,90,66,0.3)]'
                        : 'bg-white text-slate-600 border-weather-border hover:border-sidebar-active/50 hover:text-sidebar-active hover:shadow-md',
                    ]"
                  >
                    {{ cat }}
                  </button>
                </div>
                <p v-if="errors.category" class="field-error mt-1">{{ errors.category }}</p>
              </div>

              <!-- Row 4: Description -->
              <div class="field-group field-animate-4">
                <label class="field-label">
                  <span class="inline-flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M3 13h2v8H3zm4-8h2v16H7zm4-2h2v18h-2z" />
                    </svg>
                    Description
                  </span>
                </label>
                <textarea
                  v-model="form.description"
                  rows="3"
                  placeholder="Describe this amazing destination..."
                  class="field-input resize-none"
                ></textarea>
              </div>

              <!-- Row 5: Image URL -->
              <div class="field-group field-animate-5">
                <label class="field-label">
                  <span class="inline-flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path
                        d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"
                      />
                    </svg>
                    Cover Image
                  </span>
                </label>

                <!-- Tab Toggle: URL vs Upload -->
                <div class="flex gap-2 mb-3">
                  <button
                    type="button"
                    @click="imageInputMode = 'url'"
                    :class="[
                      'flex-1 py-2 px-3 rounded-xl text-[13px] font-semibold transition-all duration-200 border-2',
                      imageInputMode === 'url'
                        ? 'bg-sidebar-active text-white border-sidebar-active shadow-md'
                        : 'bg-white text-slate-600 border-weather-border hover:border-sidebar-active/30',
                    ]"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="inline mr-2 mb-0.5"
                    >
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                    URL
                  </button>
                  <button
                    type="button"
                    @click="imageInputMode = 'upload'"
                    :class="[
                      'flex-1 py-2 px-3 rounded-xl text-[13px] font-semibold transition-all duration-200 border-2',
                      imageInputMode === 'upload'
                        ? 'bg-sidebar-active text-white border-sidebar-active shadow-md'
                        : 'bg-white text-slate-600 border-weather-border hover:border-sidebar-active/30',
                    ]"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="inline mr-2 mb-0.5"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    Upload
                  </button>
                </div>

                <!-- URL Input Mode -->
                <Transition name="fade" mode="out-in">
                  <div v-if="imageInputMode === 'url'" key="url-mode">
                    <input
                      v-model="form.cover_image_url"
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      class="field-input"
                      :class="{ 'field-input--error': errors.cover_image_url }"
                      @input="
                        form.cover_image_url &&
                        errors.cover_image_url &&
                        delete (errors as Record<string, unknown>)['cover_image_url']
                      "
                    />
                    <p v-if="errors.cover_image_url" class="field-error">
                      {{ errors.cover_image_url }}
                    </p>
                  </div>
                </Transition>

                <!-- File Upload Mode -->
                <Transition name="fade" mode="out-in">
                  <div v-if="imageInputMode === 'upload'" key="upload-mode">
                    <input
                      ref="fileInput"
                      type="file"
                      accept="image/*"
                      class="hidden"
                      @change="handleFileUpload"
                    />
                    <button
                      type="button"
                      @click="fileInput?.click()"
                      @dragover.prevent="isDragging = true"
                      @dragleave.prevent="isDragging = false"
                      @drop.prevent="handleDrop"
                      :class="[
                        'w-full py-4 px-4 rounded-xl border-2 border-dashed transition-all duration-200 text-[14px] font-semibold cursor-pointer flex flex-col items-center gap-2',
                        isDragging
                          ? 'border-sidebar-active bg-sidebar-active/15'
                          : 'border-sidebar-active/30 bg-sidebar-active/5 hover:bg-sidebar-active/10 hover:border-sidebar-active/50',
                      ]"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        :class="isDragging ? 'text-sidebar-active' : 'text-slate-600'"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      <span :class="isDragging ? 'text-sidebar-active' : 'text-slate-600'"
                        >Click to select or drag & drop</span
                      >
                    </button>
                    <p
                      v-if="selectedFileName"
                      class="text-[13px] text-sidebar-active font-semibold mt-2 flex items-center gap-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                      </svg>
                      {{ selectedFileName }}
                    </p>
                  </div>
                </Transition>

                <!-- Preview -->
                <Transition name="image-fade">
                  <div
                    v-if="form.cover_image_url && !errors.cover_image_url"
                    class="mt-3 h-28 rounded-2xl overflow-hidden border-2 border-sidebar-active/20 shadow-md hover:shadow-lg transition-shadow"
                  >
                    <img
                      :src="form.cover_image_url"
                      alt="Preview"
                      class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      @error="handleImageError"
                    />
                  </div>
                </Transition>
              </div>

              <!-- Row 6: Duration -->
              <div class="field-group field-animate-6">
                <label class="field-label">
                  <span class="inline-flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path
                        d="M11.99 5V1h-1v4H7.58H7v1h3.99v3.05H7.58H7v1h3.99v3.05H7.58H7v1h3.99V19h1v-4h3.41h.01v-1h-3.41v-3.05h3.41h.01v-1h-3.41V9h3.41v-1h-3.41V5h3.41V4h-3.41z"
                      />
                    </svg>
                    Duration (days)
                  </span>
                </label>
                <div class="grid grid-cols-2 gap-3">
                  <div class="relative">
                    <span
                      class="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] font-semibold text-sidebar-active/60"
                      >Min</span
                    >
                    <input
                      v-model.number="form.duration_min"
                      type="number"
                      min="1"
                      placeholder="1"
                      class="field-input pl-10"
                    />
                  </div>
                  <div class="relative">
                    <span
                      class="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] font-semibold text-sidebar-active/60"
                      >Max</span
                    >
                    <input
                      v-model.number="form.duration_max"
                      type="number"
                      min="1"
                      placeholder="3"
                      class="field-input pl-10"
                    />
                  </div>
                </div>
              </div>

              <!-- Row 7: Budget -->
              <div class="field-group field-animate-7">
                <label class="field-label">
                  <span class="inline-flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-13c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z"
                      />
                    </svg>
                    Budget per day (USD)
                  </span>
                </label>
                <div class="grid grid-cols-2 gap-3">
                  <div class="relative">
                    <span
                      class="absolute left-3 top-1/2 -translate-y-1/2 text-[14px] font-semibold text-sidebar-active/60"
                      >$</span
                    >
                    <input
                      v-model.number="form.budget_min"
                      type="number"
                      min="0"
                      placeholder="20"
                      class="field-input pl-7"
                    />
                  </div>
                  <div class="relative">
                    <span
                      class="absolute left-3 top-1/2 -translate-y-1/2 text-[14px] font-semibold text-sidebar-active/60"
                      >$</span
                    >
                    <input
                      v-model.number="form.budget_max"
                      type="number"
                      min="0"
                      placeholder="80"
                      class="field-input pl-7"
                    />
                  </div>
                </div>
              </div>

              <!-- Row 8: Hidden Gem -->
              <div class="field-group field-animate-8">
                <label class="flex items-center gap-3 cursor-pointer p-4 rounded-xl border-2 border-slate-100 hover:border-sidebar-active/30 bg-slate-50/50 transition-all duration-200">
                  <div class="relative flex items-center">
                    <input 
                      type="checkbox" 
                      v-model="form.is_hidden_gem"
                      class="peer sr-only"
                    />
                    <div class="w-6 h-6 rounded border-2 border-slate-300 peer-checked:bg-sidebar-active peer-checked:border-sidebar-active transition-all duration-200 flex items-center justify-center">
                      <svg 
                        class="w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200 scale-50 peer-checked:scale-100" 
                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-[15px] font-semibold text-slate-700">Mark as Hidden Gem</span>
                    <span class="text-[13px] text-slate-500">Check this if it's a lesser-known destination that's off the beaten path</span>
                  </div>
                </label>
              </div>
            </div>

            <!-- Footer -->
            <div
              class="px-6 py-4 border-t border-weather-border flex items-center justify-end gap-3 shrink-0 bg-gradient-to-r from-slate-50 to-white"
            >
              <button
                @click="close"
                type="button"
                class="px-6 py-3 rounded-xl text-[14px] font-semibold text-slate-700 bg-white border-2 border-slate-200 hover:border-slate-300 hover:text-slate-900 hover:bg-slate-50 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
              >
                Cancel
              </button>
              <button
                @click="submit"
                type="button"
                :disabled="isSubmitting"
                class="px-6 py-3 rounded-xl text-[14px] font-bold text-white bg-gradient-to-r from-sidebar-active to-sidebar-active/90 border-none cursor-pointer transition-all duration-200 hover:shadow-[0_8px_20px_rgba(42,90,66,0.35)] hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none flex items-center gap-2 shadow-lg"
              >
                <svg
                  v-if="isSubmitting"
                  class="animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
                {{ isSubmitting ? 'Saving...' : 'Add Destination' }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import {
  createDestination,
  type CreateDestinationPayload,
} from '@/modules/explore/services/destinationsApi'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void
  (e: 'created'): void
}>()

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  'Beach',
  'Temple',
  'Waterfall',
  'Mountain',
  'City',
  'Nature',
  'Adventure',
  'Lake',
]

const PROVINCES = [
  'Banteay Meanchey',
  'Battambang',
  'Kampong Cham',
  'Kampong Chhnang',
  'Kampong Speu',
  'Kampong Thom',
  'Kampot',
  'Kandal',
  'Koh Kong',
  'Kratié',
  'Mondulkiri',
  'Oddar Meanchey',
  'Pailin',
  'Phnom Penh',
  'Preah Sihanouk',
  'Preah Vihear',
  'Prey Veng',
  'Pursat',
  'Ratanakiri',
  'Siem Reap',
  'Stung Treng',
  'Svay Rieng',
  'Takéo',
  'Tboung Khmum',
]

// ─── Form state ──────────────────────────────────────────────────────────────

const defaultForm = (): CreateDestinationPayload => ({
  name: '',
  description: '',
  province: '',
  location_name: '',
  category: '',
  cover_image_url: '',
  duration_min: undefined,
  duration_max: undefined,
  budget_min: undefined,
  budget_max: undefined,
  is_hidden_gem: false,
})

const form = reactive<CreateDestinationPayload>(defaultForm())
const errors = reactive<
  Partial<Record<keyof CreateDestinationPayload | 'cover_image_url', string>>
>({})
const isSubmitting = ref(false)
const submitError = ref<string | null>(null)
const successMessage = ref<string | null>(null)
const imageInputMode = ref<'url' | 'upload'>('url')
const selectedFileName = ref<string>('')
const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)

// Reset form when modal opens
watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      Object.assign(form, defaultForm())
      Object.keys(errors).forEach((k) => delete (errors as Record<string, unknown>)[k])
      submitError.value = null
      successMessage.value = null
      imageInputMode.value = 'url'
      selectedFileName.value = ''
    }
  },
)

// Real-time error clearing as user types
watch(
  () => form.name,
  (newVal) => {
    if (newVal.trim() && errors.name) {
      delete (errors as Record<string, unknown>)['name']
    }
  },
)

watch(
  () => form.province,
  (newVal) => {
    if (newVal && errors.province) {
      delete (errors as Record<string, unknown>)['province']
    }
  },
)

watch(
  () => form.category,
  (newVal) => {
    if (newVal && errors.category) {
      delete (errors as Record<string, unknown>)['category']
    }
  },
)

watch(
  () => form.cover_image_url,
  (newVal) => {
    if (newVal && errors.cover_image_url) {
      delete (errors as Record<string, unknown>)['cover_image_url']
    }
  },
)

// ─── Validation ───────────────────────────────────────────────────────────────

function validate(): boolean {
  Object.keys(errors).forEach((k) => delete (errors as Record<string, unknown>)[k])

  if (!form.name.trim()) errors.name = 'Name is required'
  if (!form.province) errors.province = 'Province is required'
  if (!form.category) errors.category = 'Please select a category'

  if (form.cover_image_url && imageInputMode.value === 'url') {
    // Only validate URL format when user is entering a URL
    try {
      new URL(form.cover_image_url)
    } catch {
      errors.cover_image_url = 'Must be a valid URL'
    }
  }
  // For uploaded files (base64), we don't validate the format since it's already handled

  return Object.keys(errors).length === 0
}

// ─── File Upload ──────────────────────────────────────────────────────────────

function handleFileUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) return

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    errors.cover_image_url = 'Image must be less than 5MB'
    return
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    errors.cover_image_url = 'Please select a valid image file'
    return
  }

  selectedFileName.value = file.name
  delete (errors as Record<string, unknown>)['cover_image_url']

  // Convert to base64
  const reader = new FileReader()
  reader.onload = (e) => {
    form.cover_image_url = e.target?.result as string
    delete (errors as Record<string, unknown>)['cover_image_url']
  }
  reader.onerror = () => {
    errors.cover_image_url = 'Failed to read image file'
  }
  reader.readAsDataURL(file)
}

function handleImageError() {
  if (imageInputMode.value === 'url') {
    errors.cover_image_url = 'Could not load this image'
  }
}

function handleDrop(event: DragEvent) {
  isDragging.value = false
  const file = event.dataTransfer?.files?.[0]
  if (file) {
    // Create a synthetic change event
    const dataTransfer = new DataTransfer()
    dataTransfer.items.add(file)
    if (fileInput.value) {
      fileInput.value.files = dataTransfer.files
      const syntheticEvent = new Event('change', { bubbles: true })
      Object.defineProperty(syntheticEvent, 'target', {
        writable: false,
        value: fileInput.value,
      })
      handleFileUpload(syntheticEvent)
    }
  }
}

// ─── Submit ───────────────────────────────────────────────────────────────────

async function submit() {
  if (!validate()) return

  isSubmitting.value = true
  submitError.value = null
  successMessage.value = null

  try {
    // Strip empty optional strings so the backend doesn't receive ""
    const payload: CreateDestinationPayload = {
      name: form.name.trim(),
      province: form.province,
      category: form.category,
      ...(form.description?.trim() && { description: form.description.trim() }),
      ...(form.location_name?.trim() && { location_name: form.location_name.trim() }),
      ...(form.cover_image_url?.trim() && { cover_image_url: form.cover_image_url.trim() }),
      ...(form.duration_min != null && { duration_min: form.duration_min }),
      ...(form.duration_max != null && { duration_max: form.duration_max }),
      ...(form.budget_min != null && { budget_min: form.budget_min }),
      ...(form.budget_max != null && { budget_max: form.budget_max }),
    }

    await createDestination(payload)
    successMessage.value = `"${payload.name}" was added successfully! 🎉`
    emit('created')

    // Close modal immediately after success
    setTimeout(() => close(), 300)
  } catch (err) {
    submitError.value = err instanceof Error ? err.message : 'Something went wrong'
  } finally {
    isSubmitting.value = false
  }
}

function close() {
  emit('update:modelValue', false)
}
</script>

<style scoped>
/* ─── Field helpers ─────────────────────────────────────────────────────────── */
.field-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-label {
  font-size: 13px;
  font-weight: 700;
  color: #64748b; /* slate-500 */
  text-transform: uppercase;
  letter-spacing: 0.08em;
  display: flex;
  align-items: center;
}

.field-input {
  width: 100%;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1.5px solid #e2e8f0;
  font-size: 14px;
  color: #1e293b;
  background: #fff;
  outline: none;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-sizing: border-box;
  appearance: none;
  position: relative;
}

.field-input:hover {
  border-color: #cbd5e1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.field-input:focus {
  border-color: #2a5a42;
  box-shadow: 0 0 0 4px rgba(42, 90, 66, 0.1);
  transform: translateY(-1px);
}

.field-input::placeholder {
  color: #cbd5e1;
}

.field-input--error {
  border-color: #f87171 !important;
  background-color: #fef2f2;
}

.field-input--error:focus {
  box-shadow: 0 0 0 4px rgba(248, 113, 113, 0.1) !important;
}

.field-error {
  font-size: 12px;
  color: #dc2626;
  margin: 0;
  font-weight: 600;
  animation: shake 0.3s ease-in-out;
}

/* ─── Field Animations ──────────────────────────────────────────────────────── */
.field-animate-1 {
  animation: slideInUp 0.5s ease-out 0.1s both;
}
.field-animate-2 {
  animation: slideInUp 0.5s ease-out 0.2s both;
}
.field-animate-3 {
  animation: slideInUp 0.5s ease-out 0.3s both;
}
.field-animate-4 {
  animation: slideInUp 0.5s ease-out 0.4s both;
}
.field-animate-5 {
  animation: slideInUp 0.5s ease-out 0.5s both;
}
.field-animate-6 {
  animation: slideInUp 0.5s ease-out 0.6s both;
}
.field-animate-7 {
  animation: slideInUp 0.5s ease-out 0.7s both;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}

@keyframes success-pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.animate-success {
  animation: success-pulse 0.5s ease-out;
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}

.animate-bounce-slow {
  animation: bounce-slow 2s ease-in-out infinite;
}

@keyframes bounce-slow {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

/* ─── Modal Animations ──────────────────────────────────────────────────────── */
.modal-backdrop-enter-active,
.modal-backdrop-leave-active {
  transition: opacity 0.3s ease;
}
.modal-backdrop-enter-from,
.modal-backdrop-leave-to {
  opacity: 0;
}

.modal-panel-enter-active {
  transition:
    opacity 0.3s ease,
    transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.modal-panel-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.3s ease;
}
.modal-panel-enter-from,
.modal-panel-leave-to {
  opacity: 0;
  transform: scale(0.92) translateY(20px);
}

/* ─── Banner Animations ─────────────────────────────────────────────────────── */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.image-fade-enter-active,
.image-fade-leave-active {
  transition:
    opacity 0.4s ease,
    transform 0.4s ease;
}
.image-fade-enter-from,
.image-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ─── Custom scrollbar ───────────────────────────────────────────────────────── */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
