<template>

  <FadeIn 
  class="relative py-8 md:py-10 lg:py-12"
  >
    <div 
    class="prose relative"
    :class="[ 
      data?.type === 'highlight' ? 'bg-grey-light p-4 rounded-lg' : '',
      center ? 'mx-auto' : ''
    ]"
    v-interpolation 
    v-html="useSanitize(data.content)"
    ></div>
  </FadeIn>

</template>

<script setup>
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
  center: {
    type: Boolean,
    default: false,
  }
})
</script>