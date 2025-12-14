<template>
  <Section :id="data?.anchor_id || null">

    <Container>
      <div class="max-w-[480px] mx-auto text-center mb-4 md:mb-6 lg:mb-8">
        <ElementPretitle
        v-if="data.pretitle"
        :text="data.pretitle" 
        :color="data.color ? data.color : '#D6C5F7'" 
        size="large"
        />
        <h2 v-if="data.title" class="text-2xl md:text-2xl lg:text-3xl font-bold mt-4 mb-2 lg:mb-4">
          {{ data.title }}
        </h2>
        <p v-if="data.subtitle" class="text-base">{{ data.subtitle }}</p>
      </div>

      <div
      v-if="data.content"
      class="max-w-3xl mx-auto prose prose--dark" v-html="data.content">
      </div>

      <div
      v-if="data.cta"
      class="text-center mt-8 lg:mt-12"
      >
        <NuxtLink
        :to="data.cta.url"
        class="btn text-white"
        :class="data.color ? `bg-[${useColors(data.color).dark}]` : ''"
        >
          {{ data.cta.title }}
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
  }
})
</script>