<template>
  <div class="focus:outline-[0px]" ref="refocus" tabindex="-1">
    <Header v-if="!checkoutPage" />
    <main 
    :class="[
      checkoutPage ? 'bg-gray-50 min-h-[calc(100vh-114px)]' : '',
      !checkoutPage && !banner ? 'pt-[57px] md:pt-[97px] lg:pt-[114px]' : '',
      !checkoutPage && banner ? 'pt-[93px] md:pt-[133px] lg:pt-[150px]' : '',
    ]"
    >
      <slot />
    </main>
    <Footer v-if="!checkoutPage" />
    <Cart />
    <LoadingModal v-if="checkoutPage" />
  </div>
</template>

<script setup>
const route = useRoute()
const checkoutPage = computed(() => route.path.includes('/checkout'))
const settingsStore = useSettingsStore()
const { banner } = storeToRefs(settingsStore)
</script>