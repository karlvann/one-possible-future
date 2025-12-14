<template>
  <FadeIn 
  delay="200"
  class="cat-filter hide-scrollbar mt-8 md:mt-16 hidden lg:block"
  >
    <Container class="flex gap-x-2">
      <NuxtLink 
      to="/mattress-guide" 
      class="rounded-lg mr-2 sm:mr-0 mb-2 !leading-[2] sm:mb-0 bg-transparent border-grey-med-light border px-3 py-0 text-sm md:text-base inline-block font-semibold leading-6 text-black no-underline"
      :class=" { '!bg-blue !border-blue': route.fullPath === '/mattress-guide' }"
      >
        All
      </NuxtLink>
      <NuxtLink 
      v-for="(cat, index) in categories"
      :to="`/mattress-guide/${cat.slug}`"
      class="rounded-lg mr-2 sm:mr-0 mb-2 !leading-[2] sm:mb-0 bg-transparent border-grey-med-light border px-3 py-0 text-sm md:text-base inline-block font-semibold leading-6 text-black no-underline" 
      :class=" { '!bg-blue !border-blue': route.params.slug == cat.slug }"
      >
        {{cat.title}}
      </NuxtLink>
    </Container>
  </FadeIn>
</template>

<script setup>
const route = useRoute()
const props = defineProps({
  categories: {
    type: Array,
    required: true
  }
})
</script>