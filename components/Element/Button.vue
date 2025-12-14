<template>
  <NuxtLink :to="url" class="btn btn-grey btn-hover" :target="target">
    <slot /> <span v-if="arrow">→</span>
  </NuxtLink>
</template>

<script setup>
defineProps({
  url: {
    type: String,
    required: true,
  },
  arrow: {
    type: Boolean,
    default: false
  },
  target: {
    type: String,
    default: '_self'
  }
})
</script>