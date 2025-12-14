<template>
  <Section :id="data?.anchor_id || null">
    
    <div
    v-if="data.title || data.pretitle || data.subtitle"
    class="max-w-[480px] mx-auto text-center">
      <ElementPretitle
      v-if="data.pretitle"
      :text="data.pretitle" 
      :color="data.color" 
      size="large"
      />
      <h2
      v-if="data.title"
      class="text-2xl md:text-2xl lg:text-3xl font-bold mt-4">
        {{ data.title }}
      </h2>
      <p v-if="data.subtitle" class="text-base mt-2 lg:mt-4">{{ data.subtitle }}</p>
    </div>

    <ProductReviewHorizontal
    v-if="data.widget === 'horizontal' && data.product"
    :product="data?.product"
    />

    <ProductReviewReviews
    v-else-if="data.widget === 'full' && data.product"
    :product="data?.product"
    />

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
</script>