<template>
  <FadeIn class="grid grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:grid-cols-2 lg:items-start">
    <div 
    class="px-6 lg:px-0 lg:pr-4 lg:pt-4"
    :class="sectionIndex && sectionIndex % 2 === 1 ? 'lg:order-1' : '' "
    >
      <div class="mx-auto max-w-2xl lg:mx-0 lg:max-w-lg">
        <div class="mb-2 md:mb-4" v-if="data.pretitle">
          <span class="rounded-full mr-2 sm:mr-0 mb-2 sm:mb-0 bg-[#8293fa] px-2 py-0 text-xs inline-block font-semibold leading-6 text-white no-underline">
            {{ data.pretitle }}
          </span>
        </div>
        <h2 class="mt-2 text-3xl font-bold tracking-tight text-grey-dark sm:text-4xl">
          {{ data.title }}
        </h2>
        <p class="text-subtitle">{{ data.subtitle }}</p>
        <div class="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
          <div v-for="(usp, index) in data.usps" :key="'usp-'+index" class="relative pl-9">
            <div class="inline font-semibold text-grey-dark">
              <img 
              v-if="usp.image"
              class="absolute left-1 top-1 h-5 w-5 text-[#5a6ded]"
              :src="useCdn(usp.image.url)+'?width=200'" 
              :width="usp.image.width" 
              :height="usp.image.height" 
              :alt="usp.image.alternativeText ? usp.image.alternativeText : 'USP icon' "
              loading="lazy"
              >
              {{ usp.title }}
            </div>
            {{ ' ' }}
            <div class="inline">{{ usp.subtitle }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="sm:px-6 lg:px-0">
      <div 
      class="mx-auto max-w-2xl sm:mx-0 sm:max-w-none"
      :class="sectionIndex && sectionIndex % 2 === 1 ? 'lg:pr-10' : 'lg:pl-10' "
      >
        <ImageResponsive
        v-if="data?.image"
        classes="rounded-xl ring-1 ring-white/10"
        :data="data?.image"
        :xs="12"
        :sm="6"
        :md="4"
        :lg="4"
        :xl="4"
        />
      </div>
    </div>
  </FadeIn>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
  sectionIndex: {
    type: Number,
    default: 0
  }
})
</script>