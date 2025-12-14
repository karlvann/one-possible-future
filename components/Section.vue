<template>
  <section :class="classes">
    <slot />
  </section>
</template>

<script setup>
const props = defineProps({
  margins: {
    type: String,
    default: 'default'
  },
  rounded: {
    type: Boolean,
    default: false
  },
  background: {
    type: String,
    default: 'transparent'
  }
})

const classes = computed(() => {
  let classString = ''
  if (props.margins === 'reset-top') {
    classString += ' pb-12 md:pb-16 lg:pb-20 pt-0'
  } else if (props.background !== '#e5e7eb') {
    classString += ' py-12 md:py-16 lg:py-20'
  } else {
    classString += ' py-12 md:py-16 lg:py-20'
  }
  return classString
})

</script>