<template>
  <Section :id="data?.anchor_id || null">
    <Container class="relative">

      <div class="items-start justify-center md:flex-row md:flex md:gap-10">
        <div class="flex flex-col gap-8 pr-2 md:w-[470px] md:sticky md:top-[150px]">
          
        <div class="flex flex-col items-center mb-8">
          <div aria-hidden="true" class="inline-flex tracking-tight flex-col relative xl:-left-4 mb-4 px-8">
            <span
            v-for="line in lines"
            class="text-white inline-block font-bold -skew-5 -mb-2 -ml-10 -mr-10 text-3xl md:text-4xl lg:text-5xl pl-10 pr-10 pt-2 pb-5 w-fit"
            v-html="line"
            :style="spanStyle"
            >
            </span>
          </div>
          <h2 class="text-xl md:text-2xl lg:text-3xl font-bold mt-8 mb-2 lg:mb-4">
            {{ data.title }}
          </h2>
          <p class="text-base">{{ data.subtitle }}</p>
        </div>

        </div>
        <div class="flex flex-wrap gap-5 items-center flex-col flex-1 items-stretch">
          <div 
          v-for="usp in data.usps"
          class="ring-1 ring-grey-med-light rounded-xl bg-white relative flex flex-col gap-5 p-4 sm:p-6 lg:p-8 items-left text-left">
            <div class="flex flex-col gap-3 items-left text-left">

              <ElementPretitle
              v-if="usp.usp_id.pretitle"
              :text="usp.usp_id.pretitle"
              color="#97D7ED"
              size="small"
              />

              <p class="font-bold text-grey-dark text-[22px]">
                {{ usp.usp_id.title }}
              </p>
            </div>
            <p class="font-regular text-base leading-6.5 text-text-primary"> 
              {{ usp.usp_id.subtitle }}
            </p>
            <NuxtLink
            v-if="usp.usp_id.link"
            :to="usp.usp_id.link"
            class="underline text-blue-dark">
              {{ usp.usp_id.link_text || 'Learn More' }} <Icon name="ic:baseline-arrow-forward" class="w-5 h-5 inline-block relative top-1" />
            </NuxtLink>
          </div>
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

const title = props.data.title_styled

const lines = computed(() => {
  return title
  .split(/(<span[^>]*>.*?<\/span>|<em[^>]*>.*?<\/em>)/g)
  .filter(line => line.trim() !== '')
  .map(line => {
    if (line.startsWith('<span')) {
      return line.replace(/<\/?span[^>]*>/g, '').trim()
    }
    return line.trim()
  })
})

const spanStyle = computed(() => {
  return {
    backgroundImage: `url(${useCdn('1cff1f31-6612-4613-859d-9cce2b16ee0b', 'brush-stroke-black.svg')})`,
    backgroundSize: `100% 100%`,
    backgroundRepeat: `no-repeat`,
    backgroundPosition: `center center`,
    '--emColor': props.data.color || '#97D7ED'
  }
})
</script>