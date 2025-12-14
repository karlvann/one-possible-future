<template>
  <TransitionRoot as="template" :show="isLoading">
    <Dialog as="div" class="relative z-10">
      <TransitionChild 
      as="template" 
      enter="ease-out duration-300" 
      enter-from="opacity-0" 
      enter-to="opacity-100" 
      leave="ease-in duration-200" 
      leave-from="opacity-100" 
      leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-[rgba(0,0,0,0.7)] transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto max-w-[250px] mx-auto">
        <div class="flex min-h-full justify-center p-4 text-center items-center text-center">
          <TransitionChild 
          as="template" 
          enter="ease-out duration-300" 
          enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" 
          enter-to="opacity-100 translate-y-0 sm:scale-100" 
          leave="ease-in duration-200" 
          leave-from="opacity-100 translate-y-0 sm:scale-100" 
          leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel class="relative transform overflow-hidden rounded-lg bg-[#f9f8f6] text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
              <div class="bg-white px-3 py-6 sm:px-6 sm:py-6 lg:px-8 lg:py-10 text-center flex flex-col items-center">
                <svg class="animate-spin h-12 w-12 mb-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="#E5E7EB" stroke-width="2"/>
                  <path d="M12 2 C17.523 2 22 6.477 22 12" stroke="#000000" stroke-width="2" stroke-linecap="round"/>
                </svg>
                Processing...
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
const settingsStore = useSettingsStore()
const { loadingModal } = storeToRefs(settingsStore)
const isLoading = computed(() => loadingModal.value)
</script>