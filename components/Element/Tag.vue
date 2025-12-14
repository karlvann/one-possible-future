<template>
  <span 
  v-if="tag"
  class="text-grey-dark inline-block font-bold text-sm pl-4 pr-4 pt-2 pb-2 tracking-tight w-fit -rotate-2"
  :style="tagStyle"
  >
    {{ tag }}
  </span>
</template>

<script setup>
const props = defineProps({
  tag: {
    type: String,
    required: false,
    default: null
  },
  color: {
    type: String,
    required: false,
    default: '#DD8B11'
  }
})

const tagStyle = computed(() => {
  return {
    backgroundImage: `url(${useCdn('e77ba6ec-02c5-4892-9310-2291e1ac1987', 'brush-stroke-blue.svg')})`,
    backgroundSize: `100% 100%`,
    backgroundRepeat: `no-repeat`,
    backgroundPosition: `center center`,
    '--emColor': props.color
  }
})
</script>