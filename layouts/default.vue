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
    <Footer v-if="!hideChrome" />
    <Cart v-if="!hideChrome" />
    <LoadingModal v-if="checkoutPage" />
  </div>
</template>

<script setup>
const route = useRoute()
const checkoutPage = computed(() => route.path.includes('/checkout'))

// Raw mode: SSR-compatible detection
// Get request event at setup time (required for SSR)
const event = import.meta.server ? useRequestEvent() : null
const serverUrl = event?.node?.req?.url || ''
const isRawFromServer = serverUrl.includes('raw=true')

const rawMode = computed(() => {
  // Server-side: use pre-computed value from request event
  if (import.meta.server) {
    return isRawFromServer
  }
  // Client-side: use route query
  return route.query.raw === 'true'
})

const hideChrome = computed(() => checkoutPage.value || rawMode.value)
const settingsStore = useSettingsStore()
const { banner } = storeToRefs(settingsStore)
</script>