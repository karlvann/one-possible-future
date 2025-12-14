<template>
  <FadeIn v-if="hasImage">
    <figure :class="'blog-img--'+ratio">
      <ImageResponsive
      v-if="data?.image"
      :data="data?.image"
      :xs="12"
      :sm="12"
      :md="10"
      :lg="12"
      :xl="12"
      classes="rounded"
      />
      <figcaption v-if="data.caption" class="mt-4 text-xs text-gray-500" v-interpolation v-html="data.caption">
      </figcaption>
    </figure>
  </FadeIn>
</template>

<script setup>
const ratio = ref('landscape')
const props = defineProps({
  data: {
    type: Object,
    required: true,
  }
})

const hasImage = computed(() => {
  return props.data?.image?.id && props.data?.image?.filename_download
})

if (props.data?.image.width === props.data?.image.height) {
  ratio.value = 'square'
} else if (props.data?.image.width < props.data?.image.height) {
  ratio.value = 'portrait'
}
</script>