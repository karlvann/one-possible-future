<template>
  <div class="focus:outline-[0px]" ref="refocus" tabindex="-1">
    <Header v-if="!hideChrome" />
    <main
    :class="[
      checkoutPage ? 'bg-gray-50 min-h-[calc(100vh-114px)]' : '',
      !hideChrome && !banner ? 'pt-[57px] md:pt-[97px] lg:pt-[114px]' : '',
      !hideChrome && banner ? 'pt-[93px] md:pt-[133px] lg:pt-[150px]' : '',
    ]"
    >
      <slot />
    </main>
    <div v-if="!hideChrome" class="dev-toggle-bar">
      <DevModeToggle />
    </div>
    <Footer v-if="!hideChrome" />
    <Cart v-if="!hideChrome" />
    <LoadingModal v-if="checkoutPage" />
  </div>
</template>

<script setup>
const route = useRoute()
const checkoutPage = computed(() => route.path.includes('/checkout'))

// Raw mode: SSR-compatible detection using useRequestURL
// This works reliably on both client and server (Vercel compatible)
const requestURL = useRequestURL()
const rawMode = computed(() => {
  // Check URL search params (works on both client and server)
  return requestURL.searchParams.get('raw') === 'true'
})

const hideChrome = computed(() => checkoutPage.value || rawMode.value)
const settingsStore = useSettingsStore()
const { banner } = storeToRefs(settingsStore)
</script>

<style scoped>
.dev-toggle-bar {
  display: flex;
  justify-content: flex-end;
  padding: 16px 20px;
  background: #f3f4f6;
  border-top: 1px solid #e5e7eb;
}
</style>