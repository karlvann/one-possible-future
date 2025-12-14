<template>
  <Section :id="data?.anchor_id || null">
    <Container>
      <div :class="size">
        <ImageResponsive 
        v-if="data.image?.filename_download" 
        :data="data.image"
        class="w-full h-auto object-cover rounded-md"
        />
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

const size = computed(() => {
  return props.data.width === 'full' ? 'w-[100%]' : 'md:mx-auto md:w-[50%]'
})
</script>