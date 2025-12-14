<template>
  <div class="md:-mx-[80px] text-center xl:-mx-[120px] md:my-8 p-6 rounded-[10px] relative text-center sm:pt-8 sm:pb-9 sm:my-12">
    <em class="font-heading text-[1.5rem] leading-[1.8rem] sm:text-[2.2rem] sm:leading-[2.4rem] md:text-[3.2rem] md:leading-[3.6rem] xl:text-[4rem] xl:leading-[4.5rem] font-bold mx-auto mt-1 mb-2 md:mt-0 md:ml-0 text-center">
      {{ data.quote }}
    </em>
    <div class="mt-8 text-[1.4rem] leading-[1.8rem] md:text-[1.7rem] md:leading-[1.7rem]">
      <strong>–{{ data.author }}</strong>
    </div>
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