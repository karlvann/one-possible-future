<template>
  <Section :id="data.anchor_id || null">

    <Container>
      <FadeIn class="mx-auto max-w-2xl lg:text-center">
        <div class="mb-2 md:mb-4" v-if="data.pretitle">
          <span class="rounded-full mr-2 sm:mr-0 mb-2 sm:mb-0 bg-[#8293fa] px-2 py-0 text-xs inline-block font-semibold leading-6 text-white no-underline">
            {{ data.pretitle }}
          </span>
        </div>
        <h2 class="text-section-title">{{ data.title }}</h2>
        <p class="text-subtitle">{{ data.subtitle }}</p>
      </FadeIn>

      <FadeIn class="mt-20 text-center">
        <div class="md:grid md:gap-12 md:grid-cols-3">
          <div 
          v-for="card in data.cards" 
          class="h-full"
          :class="[
            card.image ? 'mt-16 md:mt-6' : 'mt-8 md:mt-0',
          ]" 
          >
            <div class="flow-root rounded-lg bg-gray-50 px-6 pb-8 h-full">
              <div 
              :class="[
                card.image ? '-mt-6' : 'mt-4',
              ]"
              >
                <div class="flex justify-center">
                  <img 
                  v-if="card.image"
                  class="max-w-[140px]"
                  loading="lazy"
                  :src="useCdn(card.image.url)+'?width=280'" 
                  :width="card.image.width" 
                  :height="card.image.height" 
                  :alt="card.image.alternativeText ? card.image.alternativeText : 'Use case illustration' "
                  >
                </div>
                <p class="mt-4 text-xl font-semibold text-grey-dark">{{ card.title }}</p>
                <p class="mt-6 text-base leading-7 text-gray-600">{{ card.content }}</p>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>
    </Container>

  </Section>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Object,
    required: true,
  }
})
</script>
