<template>
  <Section
  :id="data.anchor_id || null"
  class="relative"
  :style="{ 
    '--section-color': data.color,
    '--section-color-dark': useColors(data.color).dark
  }"
  >
    <div 
    v-if="data.color"
    class="absolute inset-0 -z-10 top-1/2" :style="`background-color: ${data.color ? data.color : '#D6C5F7'}`"></div>

    <Container>
      <div class="max-w-[480px] mx-auto text-center mb-12 md:mb-16 lg:mb-20"> 
        <ElementPretitle 
        v-if="data.pretitle"
        :text="data.pretitle" 
        :color="data.color ? data.color : '#D6C5F7'" 
        size="large"
        />
        <h2 class="text-xl md:text-3xl lg:text-4xl font-bold mb-2 lg:mb-4 mt-4">
          {{ data.title }}
        </h2>
        <p v-if="data.subtitle" class="text-base">
          {{ data.subtitle }}
        </p>
      </div>

      <div 
      class="grid grid-cols-1 lg:grid-cols-3 gap-6 gap-y-6 lg:gap-x-6 auto-rows-fr"
      :class="[
        data.steps && data.steps.length ? `lg:grid-cols-${data.steps.length}` : '',
        data.steps.length % 2 === 0 ? `md:grid-cols-${data.steps.length/2}` : ''
      ]"
      >
        <div 
        v-for="(step, index) in data.steps"
        class="ring-1 ring-grey-med-light rounded-xl shadow bg-white relative flex flex-col gap-5 px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8 text-center h-full"
        :class="[
          step.step_id?.image ? 'pt-12 sm:pt-20 lg:pt-24' : '', 
          step.step_id?.step_text ? 'pt-12 lg:pt-16' : '',
          !step.step_id?.image && !step.step_id?.step_text ? 'pt-4 sm:pt-6 lg:pt-8' : ''
        ]"
        >
          <span
          v-if="step.step_id.step_text"
          class="text-white font-bold -mb-3 text-2xl pl-6 pr-6 pt-2 pb-4 absolute -top-6 left-1/2 -translate-x-1/2"
          :style="maskStyle">
            {{ step.step_id.step_text ? step.step_id.step_text : `Step ${index + 1}` }}
          </span>

          <div
          v-if="step.step_id?.image"
          :style="[ dotStyle, { backgroundImage: `url(${useCdn(step.step_id.image.id, step.step_id.image.filename_download)})` } ]"
          class="w-36 h-36 bg-no-repeat bg-contain bg-center mx-auto flex-shrink-0">

          </div>

          <h3 class="font-bold text-grey-dark text-[22px]">
            {{ step.step_id.title }}
          </h3>
          
          <div class="font-regular flex-grow text-base leading-6.5 text-text-primary"> 
            {{ step.step_id.subtitle }}
          </div>
          
          <NuxtLink
          v-if="step.step_id.link"
          :to="step.step_id.link"
          class="underline mt-auto"
          :style="{ color: useColors(data.color).dark }"
          >
            {{ step.step_id.link_text || 'Learn More' }} <Icon name="ic:baseline-arrow-forward" class="w-5 h-5 inline-block relative top-1" />
          </NuxtLink>
        </div>
      </div>

      <div 
      v-if="data?.cta"
      class="mt-12 text-center">
        <NuxtLink
        :to="data?.cta.url"
        :style="{ backgroundColor: useColors(data.color).dark }"
        class="btn text-white"
        >
          {{ data?.cta.title }} <Icon name="ic:baseline-arrow-forward" class="w-5 h-5 inline-block relative top-1" />
        </NuxtLink>
      </div>

    </Container>
  </Section>
</template>

<script setup>
import dot from '~/assets/images/brush-splotch.svg'
const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  sectionIndex: {
    type: Number,
    default: 0
  }
})

const dotStyle = computed(() => {
  return {
    maskImage: `url(${dot})`,
    WebkitMaskImage: `url(${dot})`,
    maskSize: '100% 100%',
    WebkitMaskSize: '100% 100%',
    maskRepeat: 'no-repeat',
    WebkitMaskRepeat: 'no-repeat'
  }
})

const maskStyle = computed(() => {
  return {
    backgroundImage: `url(${useCdn('1cff1f31-6612-4613-859d-9cce2b16ee0b', 'brush-stroke-black.svg')})`,
    backgroundSize: `100% 100%`,
    backgroundRepeat: `no-repeat`,
    backgroundPosition: `center center`,
  }
})

</script>