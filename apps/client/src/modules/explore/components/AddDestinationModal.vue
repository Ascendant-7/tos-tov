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
            class="relative w-full max-w-[620px] max-h-[90vh] bg-white rounded-3xl shadow-[0_24px_64px_rgba(0,0,0,0.18)] overflow-hidden flex flex-col"
          >
            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-5 border-b border-weather-border shrink-0">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-sidebar-active/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-sidebar-active"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <div>
                  <h2 class="text-[16px] font-bold text-slate-800 m-0">Add Destination</h2>
                  <p class="text-[12px] text-slate-400 m-0">Share a new place with KhmerWander</p>
                </div>
              </div>
              <button
                @click="close"
                class="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200 border-none cursor-pointer bg-transparent"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>

            <!-- Form body (scrollable) -->
            <div class="overflow-y-auto flex-1 px-6 py-5 space-y-5 custom-scrollbar">

              <!-- Success Banner -->
              <Transition name="fade">
                <div v-if="successMessage" class="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                  <div class="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  </div>
                  <p class="text-[13px] font-medium text-emerald-700 m-0">{{ successMessage }}</p>
                </div>
              </Transition>

              <!-- Error Banner -->
              <Transition name="fade">
                <div v-if="submitError" class="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl">
                  <div class="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-500 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                  </div>
                  <p class="text-[13px] font-medium text-red-600 m-0">{{ submitError }}</p>
                </div>
              </Transition>

              <!-- Row 1: Name -->
              <div class="field-group">
                <label class="field-label">
                  Destination Name <span class="text-red-400">*</span>
                </label>
                <input
                  v-model="form.name"
                  type="text"
                  placeholder="e.g. Angkor Wat"
                  class="field-input"
                  :class="{ 'field-input--error': errors.name }"
                />
                <p v-if="errors.name" class="field-error">{{ errors.name }}</p>
              </div>

              <!-- Row 2: Province + City -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="field-group">
                  <label class="field-label">Province <span class="text-red-400">*</span></label>
                  <select
                    v-model="form.province"
                    class="field-input"
                    :class="{ 'field-input--error': errors.province }"
                  >
                    <option value="" disabled>Select province</option>
                    <option v-for="p in PROVINCES" :key="p" :value="p">{{ p }}</option>
                  </select>
                  <p v-if="errors.province" class="field-error">{{ errors.province }}</p>
                </div>
                <div class="field-group">
                  <label class="field-label">City / Locality</label>
                  <input
                    v-model="form.location_name"
                    type="text"
                    placeholder="e.g. Siem Reap City"
                    class="field-input"
                  />
                </div>
              </div>

              <!-- Row 3: Category -->
              <div class="field-group">
                <label class="field-label">Category <span class="text-red-400">*</span></label>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="cat in CATEGORIES"
                    :key="cat"
                    type="button"
                    @click="form.category = cat"
                    :class="[
                      'px-3.5 py-1.5 rounded-full text-[12px] font-medium border cursor-pointer transition-all duration-200',
                      form.category === cat
                        ? 'bg-sidebar-active text-white border-sidebar-active shadow-[0_2px_8px_rgba(42,90,66,0.2)]'
                        : 'bg-white text-slate-500 border-weather-border hover:border-slate-300 hover:text-slate-700'
                    ]"
                  >
                    {{ cat }}
                  </button>
                </div>
                <p v-if="errors.category" class="field-error mt-1">{{ errors.category }}</p>
              </div>

              <!-- Row 4: Description -->
              <div class="field-group">
                <label class="field-label">Description</label>
                <textarea
                  v-model="form.description"
                  rows="3"
                  placeholder="Describe this destination..."
                  class="field-input resize-none"
                ></textarea>
              </div>

              <!-- Row 5: Image URL -->
              <div class="field-group">
                <label class="field-label">Cover Image URL</label>
                <input
                  v-model="form.cover_image_url"
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  class="field-input"
                  :class="{ 'field-input--error': errors.cover_image_url }"
                />
                <p v-if="errors.cover_image_url" class="field-error">{{ errors.cover_image_url }}</p>
                <!-- Preview -->
                <div v-if="form.cover_image_url && !errors.cover_image_url" class="mt-2 h-24 rounded-xl overflow-hidden border border-weather-border">
                  <img
                    :src="form.cover_image_url"
                    alt="Preview"
                    class="w-full h-full object-cover"
                    @error="errors.cover_image_url = 'Could not load this image URL'"
                  />
                </div>
              </div>

              <!-- Row 6: Duration -->
              <div class="field-group">
                <label class="field-label">Duration (days)</label>
                <div class="grid grid-cols-2 gap-3">
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-400 font-medium pointer-events-none">Min</span>
                    <input
                      v-model.number="form.duration_min"
                      type="number"
                      min="1"
                      placeholder="1"
                      class="field-input pl-10"
                    />
                  </div>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-400 font-medium pointer-events-none">Max</span>
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
              <div class="field-group">
                <label class="field-label">Budget per day (USD)</label>
                <div class="grid grid-cols-2 gap-3">
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-slate-400 font-medium pointer-events-none">$</span>
                    <input
                      v-model.number="form.budget_min"
                      type="number"
                      min="0"
                      placeholder="20"
                      class="field-input pl-7"
                    />
                  </div>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-slate-400 font-medium pointer-events-none">$</span>
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

            </div>

            <!-- Footer -->
            <div class="px-6 py-4 border-t border-weather-border flex items-center justify-end gap-3 shrink-0 bg-white">
              <button
                @click="close"
                type="button"
                class="px-5 py-2.5 rounded-xl text-[13px] font-medium text-slate-600 bg-white border border-weather-border hover:border-slate-300 hover:text-slate-800 transition-all duration-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                @click="submit"
                type="button"
                :disabled="isSubmitting"
                class="px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white bg-sidebar-active border-none cursor-pointer transition-all duration-200 hover:shadow-[0_4px_14px_rgba(42,90,66,0.3)] hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 flex items-center gap-2"
              >
                <svg
                  v-if="isSubmitting"
                  class="animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
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
import { createDestination, type CreateDestinationPayload } from '@/modules/explore/services/destinationsApi'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void
  (e: 'created'): void
}>()

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = ['Beach', 'Temple', 'Waterfall', 'Mountain', 'City', 'Nature', 'Adventure', 'Lake']

const PROVINCES = [
  'Banteay Meanchey', 'Battambang', 'Kampong Cham', 'Kampong Chhnang',
  'Kampong Speu', 'Kampong Thom', 'Kampot', 'Kandal', 'Koh Kong',
  'Kratié', 'Mondulkiri', 'Oddar Meanchey', 'Pailin', 'Phnom Penh',
  'Preah Sihanouk', 'Preah Vihear', 'Prey Veng', 'Pursat', 'Ratanakiri',
  'Siem Reap', 'Stung Treng', 'Svay Rieng', 'Takéo', 'Tboung Khmum',
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
})

const form = reactive<CreateDestinationPayload>(defaultForm())
const errors = reactive<Partial<Record<keyof CreateDestinationPayload | 'cover_image_url', string>>>({})
const isSubmitting = ref(false)
const submitError = ref<string | null>(null)
const successMessage = ref<string | null>(null)

// Reset form when modal opens
watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      Object.assign(form, defaultForm())
      Object.keys(errors).forEach((k) => delete (errors as Record<string, unknown>)[k])
      submitError.value = null
      successMessage.value = null
    }
  },
)

// ─── Validation ───────────────────────────────────────────────────────────────

function validate(): boolean {
  Object.keys(errors).forEach((k) => delete (errors as Record<string, unknown>)[k])

  if (!form.name.trim()) errors.name = 'Name is required'
  if (!form.province) errors.province = 'Province is required'
  if (!form.category) errors.category = 'Please select a category'

  if (form.cover_image_url) {
    try {
      new URL(form.cover_image_url)
    } catch {
      errors.cover_image_url = 'Must be a valid URL'
    }
  }

  return Object.keys(errors).length === 0
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

    // Auto-close after 1.5s
    setTimeout(() => close(), 1500)
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
  gap: 6px;
}

.field-label {
  font-size: 12px;
  font-weight: 600;
  color: #475569; /* slate-600 */
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.field-input {
  width: 100%;
  padding: 10px 14px;
  border-radius: 12px;
  border: 1.5px solid #e2e8f0;
  font-size: 13px;
  color: #1e293b;
  background: #fff;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
  appearance: none;
}

.field-input:focus {
  border-color: #2a5a42;
  box-shadow: 0 0 0 3px rgba(42, 90, 66, 0.08);
}

.field-input--error {
  border-color: #f87171 !important;
}

.field-error {
  font-size: 11px;
  color: #ef4444;
  margin: 0;
}

/* ─── Animations ────────────────────────────────────────────────────────────── */
.modal-backdrop-enter-active,
.modal-backdrop-leave-active {
  transition: opacity 0.25s ease;
}
.modal-backdrop-enter-from,
.modal-backdrop-leave-to {
  opacity: 0;
}

.modal-panel-enter-active {
  transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.modal-panel-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.modal-panel-enter-from,
.modal-panel-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(8px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
