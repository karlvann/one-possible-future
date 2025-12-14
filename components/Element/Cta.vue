<template>
  <div class="md:-mx-[80px] xl:-mx-[120px] md:my-8 p-6 rounded-[10px] relative text-center sm:pt-8 sm:pb-9 sm:my-12 md:flex md:gap-8 md:text-left md:items-center bg-[#f7e6f6]">
    <div class="md:flex-1">
      <h5 class="font-heading text-[1.35rem] font-bold max-w-[90%] mx-auto mt-1 mb-2 md:mt-0 md:ml-0">
        {{ data.title }}
      </h5>
      <p class="mb-0 !text-base">
        {{ data.subtitle }}
      </p>
    </div>
    <NuxtLink
    class="block mt-4 md:mt-0 btn btn-pink text-white btn-hover"
    :to="`${data.link}`" 
    >
      {{ data.link_text }}
    </NuxtLink>
  </div>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})
</script>