<template>
  <div
  v-if="props.data?.width && props.data?.height"
  class="r-img"
  :style="`aspect-ratio: ${props.data.width}/${props.data.height}; background-color: ${background};`"
  >
    <img 
    :src="`${useCdn(props.data.id, props.data.filename_download)}`"
    :srcset="srcsetImgs"
    :sizes="imgSizes"
    :class="addClasses" 
    :alt="props.data.description" 
    :width="data.width" 
    :height="data.height" 
    :loading="loadingType" 
    :fetchpriority="fetchPriority"
    :style="imgShape"
    decoding="async"
    >
  </div>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  classes: {
    type: String,
    required: false,
    default: null
  },
  background: {
    type: String,
    required: false,
    default: 'transparent'
  },
  xs: { 
    type: Number,
    required: false,
    default: 12
  },
  sm: {
    type: Number,
    required: false,
    default: 12
  },
  md: { 
    type: Number,
    required: false,
    default: 12
  },
  lg: { 
    type: Number,
    required: false,
    default: 12
  },
  xl: {
    type: Number,
    required: false,
    default: 12
  },
  shape: {
    type: String,
    required: false,
    default: ''
  },
  lazy: {
    type: Boolean,
    required: false,
    default: false
  },
  priority: {
    type: String,
    required: false,
    default: 'low'
  }
})

const addClasses = computed(() => {
  if (props.classes) return props.classes + ' r-img'
  return 'r-img'
})

const imgAlt = computed(() => {
  if (props.data.description) return props.data.description
  return 'Ausbeds Mattresses - visit our showrooms or shop online'
})

const loadingType = computed(() => {
  if (props.lazy) return 'lazy'
  return 'eager'
})

const fetchPriority = computed(() => {
  if (props.priority == 'high') return 'high'
  return 'auto'
})

const imgShape = computed(() => {
  if (props.shape === 'circle') return 'border-radius: 50%;'
  return ''
})

const srcsetImgs = computed(() => {
  const imgSizesArr = [100, 200, 412, 728, 992, 1200, 1400, 1600, 2000, 2800]
  let srcSets = ''
  imgSizesArr.forEach(size => {
    const imgWidth = size - 30
    if (props.shape === 'circle' || props.shape === 'square') {
      srcSets += `${useCdn(props.data.id, props.data.filename_download)}?aspect_ratio=1:1&width=${imgWidth} ${size}w, `
    } else {
      srcSets += `${useCdn(props.data.id, props.data.filename_download)}?width=${imgWidth} ${size}w, `
    }
  })
  return srcSets.slice(0, -2)
})

const imgSizes = computed(() => {
  let sizesStr = ''
  const imgSizeProps = [
    [props.xs, 412], 
    [props.sm, 640],
    [props.md, 980],
    [props.lg, 1200],
    [props.xl, 1440]
  ]
  imgSizeProps.forEach((sizeArr, index) => {
    if (index === 4) {
      sizesStr += `${Math.round(sizeArr[1] / 12 * sizeArr[0] / sizeArr[1] * 100)}vw`
    } else {
      sizesStr += `(max-width: ${sizeArr[1]}px) ${Math.round(sizeArr[1] / 12 * sizeArr[0] / sizeArr[1] * 100)}vw, `
    }
  })
  return sizesStr
})
</script>

<style lang="scss">
.r-img { display: inline-block; }
</style>