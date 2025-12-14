<template>
  <div 
  class="md:max-w-[960px] lg:max-w-[1300px] xl:max-w-[1400px] sm:px-8"
  :class="type === 'reviews' ? 'px-0 -mx-[8px] sm:mx-auto' : 'mx-auto px-4'"
  >
    <slot />
  </div>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'default'
  }
})
</script>