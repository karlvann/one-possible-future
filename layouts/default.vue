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
// On client: use route.query
// On server: parse the request URL directly
const rawMode = computed(() => {
  if (import.meta.client) {
    return route.query.raw === 'true'
  }
  // Server-side: check the request URL directly
  const event = useRequestEvent()
  const url = event?.node?.req?.url || ''
  return url.includes('raw=true')
})

const hideChrome = computed(() => checkoutPage.value || rawMode.value)
const settingsStore = useSettingsStore()
const { banner } = storeToRefs(settingsStore)
</script>