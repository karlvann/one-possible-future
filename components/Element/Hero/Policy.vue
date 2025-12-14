<template>
  <div class="bg-[#f9f8f6]">

      <div class="py-12 lg:pt-20 lg:pb-0 lg:gap-12 xl:gap-16">
        <FadeIn>
          <div class="px-4 sm:px-8  max-w-[800px] lg:max-w-[1100px] mx-auto">
            <div class="max-w-[800px]">
              <h1 
              id="main-title" 
              :class="[
                data.title.length > 58 ? 
                'text-2xl leading-[1.25] sm:text-3xl sm:leading-[1.2] md:text-4xl md:leading-[1.17] font-bold tracking-tight text-grey-dark lora' :
                'text-3xl leading-[1.25] sm:text-4xl sm:leading-[1.2] md:text-5xl md:leading-[1.12] font-bold tracking-tight text-grey-dark lora'
              ]">
                {{ data.title }}
              </h1>
              <div 
              v-if="data.subtitle" 
              class="text-subtitle font-semibold" 
              v-interpolation 
              v-html="data.subtitle">
              </div>
            </div>
          </div>
        </FadeIn>
      </div>

  </div>

</template>

<script setup>
const props = defineProps({
  data: {
    type: Object,
    required: true,
  }
})
</script>