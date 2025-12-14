<template>
  <Section
  :id="data.anchor_id || null"
  class="relative"
  :style="{ 
    '--section-color': data.color ? data.color : '#FFE5A8',
    '--section-color-dark': data.color ? useColors(data.color).dark : '#DD8B11'
  }"
  >
    <div class="absolute inset-0 bg-yellow -z-10 top-[60%]"></div>

    <Container>

      <div class="max-w-[480px] mx-auto text-center mb-12 md:mb-16 lg:mb-20">
        <ElementPretitle
        v-if="data.pretitle"
        :text="data.pretitle" 
        :color="data.color" 
        size="large" />
        <h2 class="text-xl md:text-3xl lg:text-4xl font-bold mb-2 lg:mb-4 mt-4">
          {{ data.title }}
        </h2>
        <p v-if="data.subtitle" class="text-base">
          {{ data.subtitle }}
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 gap-y-12 lg:gap-x-6 auto-rows-fr">
        <div 
        v-for="(review, index) in data.reviews"
        class="ring-1 ring-grey-med-light rounded-xl shadow bg-white relative flex flex-col gap-5 p-4 sm:p-6 lg:p-8 text-center h-full"
        >

          <div class="">
            <Icon name="ic:round-star-rate" class="w-8 h-8 inline-block text-yellow-dark" />
            <Icon name="ic:round-star-rate" class="w-8 h-8 inline-block text-yellow-dark" />
            <Icon name="ic:round-star-rate" class="w-8 h-8 inline-block text-yellow-dark" />
            <Icon name="ic:round-star-rate" class="w-8 h-8 inline-block text-yellow-dark" />
            <Icon name="ic:round-star-rate" class="w-8 h-8 inline-block text-yellow-dark" />
          </div>

          <h3 class="font-bold text-grey-dark text-[22px]">
            {{ review.review_id.title }}
          </h3>
          
          <div class="font-regular flex-grow text-sm leading-6.5 text-text-primary"> 
            {{ review.review_id.subtitle.trim() }}

            <div v-if="review.review_id.name">
              <br><strong>– {{ review.review_id.name }}</strong>
            </div>
          </div>
          
          <NuxtLink
          v-if="review.review_id.link"
          :to="review.review_id.link"
          class="underline mt-auto"
          :style="{ color: darkColor }"
          >
            {{ review.review_id.link_text || 'Learn More' }} <Icon name="ic:baseline-arrow-forward" class="w-5 h-5 inline-block relative top-1" />
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

const darkColor = computed(() => {
  const color = useColors(props.data.color)
  return color?.dark
})
</script>

<style scoped>

</style>