<template>
  <ul class="skip-links">
    <li>
      <NuxtLink :to="`${currentUrl}#content`" ref="skipLink" class="skip-link" aria-label="Skip to main content">Skip to main content</NuxtLink>
    </li>
  </ul>
</template>

<script setup>
const route = useRoute()
const currentUrl = ref('')
const skipLink = ref()
watch(route, (newRoute) => {
  currentUrl.value = newRoute.fullPath
})
</script>