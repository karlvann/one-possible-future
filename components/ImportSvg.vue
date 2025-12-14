<template>
  <component :is="svgComponent" v-bind="$attrs" />
</template>

<script setup>
import { defineAsyncComponent } from "vue"
const props = defineProps({
  name: {
    type: String,
    required: true,
  }
})

const svgComponent = computed(() => {
  return defineAsyncComponent(() => import(`@/assets/icons/duotone/${props.name}.svg`))
})
</script>