<template>
  <FadeIn>
    <figure class="prose">
      <div class="embed" v-html="data.iframe"></div>
      <figcaption v-if="data.caption" class="mt-4 text-xs text-gray-500" v-interpolation v-html="data.caption">
      </figcaption>
    </figure>
  </FadeIn>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Object,
    required: true,
  }
})
</script>