<template>
  <div>
    <FadeIn
    class="mx-auto max-w-2xl lg:text-center"
    >
      <div class="mb-2 md:mb-4" v-if="data.pretitle">
        <span class="rounded-full mr-2 sm:mr-0 mb-2 sm:mb-0 bg-[#8293fa] px-2 py-0 text-xs inline-block font-semibold leading-6 text-white no-underline">
          {{ data.pretitle }}
        </span>
      </div>
      <h2 class="text-section-title">{{ data.title }}</h2>
      <p class="text-subtitle">{{ data.subtitle }}</p>
    </FadeIn>
    <div 
    class="mx-auto max-w-2xl lg:max-w-4xl"
    :class="data.usps.length % 2 === 1 ? 'lg:max-w-xl mt-8 sm:mt-10 lg:mt-12' : 'lg:max-w-4xl mt-16 sm:mt-20 lg:mt-24' "
    >
      <FadeIn
      class="grid grid-cols-1 gap-x-8 gap-y-10"
      :class="data.usps.length % 2 === 1 ? '' : 'lg:max-w-none lg:grid-cols-2 lg:gap-y-16' "
      >
        <div
        v-for="(usp, index) in data.usps" :key="'usp-'+index"
        class="relative"
        :class="usp.image || usp.icon ? 'pl-16' : ''"
        >
          <div class="text-base font-semibold leading-7 text-grey-dark">
            <div v-if="usp.image || usp.icon" class="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg">
              <img 
              v-if="usp.image"
              :src="useCdn(usp.image.url)+'?width=200'" 
              :width="usp.image.width" 
              :height="usp.image.height" 
              :alt="usp.image.alternativeText ? usp.image.alternativeText : 'USP icon' "
              loading="lazy"
              >
              <Icon v-else-if="usp.icon" :name="usp.icon" color="#586CEB" class="w-8 h-8" />
            </div>
            <h3>{{ usp.title }}</h3>
          </div>
          
          <div
          v-if="usp.subtitle"
          v-interpolation
          v-html="usp.subtitle"
          class="mt-2 text-base leading-7 text-gray-600">
          </div>

          <div 
          v-if="usp.url"
          class="mt-4"
          >
            <ElementButton 
            :url="usp.url" 
            type="link"
            :arrow="true"
            >
              Learn more
            </ElementButton>
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

<style lang="scss">
p.mt-2.text-base {
  a {
    text-decoration: underline !important;
  } 
}
</style>