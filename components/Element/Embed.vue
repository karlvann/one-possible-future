<template>
  <div class="my-8 rounded-[10px] relative md:flex md:gap-8 md:items-center md:mt-8 md:mb-3">
    <div class="md:flex-1">
      <div
      class="embed overflow-hidden rounded-lg"
      style="position:relative;"
      :style="data.width && data.height ? `padding-bottom: ${(data.height / data.width) * 100}%` : 'padding-bottom: 56.25%'"
      v-html="data.embed"
      >
      </div>
      <p v-if="data.caption" class="mt-4 text-sm text-gray-600">
        {{ data.caption }}
      </p>
    </div>
  </div>  

</template>

<script setup>
defineProps({
  data: {
    type: Object,
    required: true
  }
})
</script>