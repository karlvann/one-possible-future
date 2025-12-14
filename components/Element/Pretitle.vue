<template>
  <div 
  class="relative inline-block font-marker w-fit inline-block -skew-3 text-xl pl-2.5 pr-2 -ml-2.5 -mr-2 -my-1.5"
  :style="[
    tagStyle, 
    { 
      color: darkColor,
      fontSize: size === 'large' ? '1.6rem' : size === 'small' ? '1.3rem' : '1rem',
    }
  ]"
  >
    <span 
    class="absolute z-0 inline-block -bottom-[3px] left-0 w-full h-3.5"
    :class="color === 'purple' ? 'bg-purple' : 'bg-blue'"
    :style="[tagStyle, { backgroundColor: lightColor }]"
    >
    </span>
    <span class="relative z-1">
      {{ text }}
    </span>
  </div>
</template>

<script setup>
import maskImg from '~/assets/images/brush-stroke.svg'
const props = defineProps({
  text: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: false,
    default: '#97D7ED'
  },
  size: {
    type: String,
    default: ''
  }
})

const darkColor = computed(() => {
  const color = useColors(props.color)
  return color?.dark
})

const lightColor = computed(() => {
  const color = useColors(props.color)
  return color?.default
})

const tagStyle = computed(() => {
  return {
    maskImage: `url(${maskImg})`,
    WebkitMaskImage: `url(${maskImg})`,
    maskSize: '100% 100%',
    WebkitMaskSize: '100% 100%',
    maskRepeat: 'no-repeat',
    WebkitMaskRepeat: 'no-repeat'
  }
})
</script>