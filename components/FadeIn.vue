<template>
  <div 
  ref="elementRef"
  :style="{
    opacity: isVisible ? 1 : 0.01,
    transform: isVisible ? 'translateY(0)' : `translateY(${slideVal}px)`,
    transition: 'opacity 0.5s cubic-bezier(0.25, 0.8, 0.5, 1), transform 0.5s cubic-bezier(0.25, 0.8, 0.5, 1)',
    transitionDelay: `${delay}ms`
  }"
  >
    <slot />
  </div>
</template>

<script setup>
const props = defineProps({
  slide: {
    type: String,
    required: false,
    default: 'up'
  },
  delay: {
    type: String,
    required: false,
    default: '200'
  },
})

const isVisible = ref(false)

const slideVal = computed(() => {
  return props.slide === 'down' ? -30 : 30
})

const elementRef = ref(null)

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        isVisible.value = true
      }
    })
  }, { threshold: 0 })

  observer.observe(elementRef.value);
})
</script>