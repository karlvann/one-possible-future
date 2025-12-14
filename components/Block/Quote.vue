<template>
  <Section 
  :id="data.anchor_id || null" 
  :style="`--section-color: ${data.color ? data.color : '#97D7ED'}`"
  >
    <Container>
      <div class="scroll-mt-24 max-w-5xl mx-auto text-center md:my-8 p-2 md:p6 rounded-[10px] relative text-center sm:pt-8 sm:pb-9 sm:my-12">

        <h2 
        v-if="data.title"
        class="text-xl md:text-3xl lg:text-4xl font-bold mb-6 lg:mb-12"
        >{{ data.title }}</h2>

        <blockquote class="text-base lg:text-lg quote" v-interpolation v-html="data.quote">
        </blockquote>

        <div v-if="data.author" class="mt-8 flex items-center justify-center gap-x-4">
          <div v-if="data.avatar" class="w-12 h-12 rounded-full overflow-hidden">
            <img :src="useCdn(data.avatar.id, data.avatar.filename_download)" :alt="data.author" class="w-full h-full object-cover" />
          </div>
          <div class="text-sm font-semibold text-gray-900">
            – {{ data.author }}
          </div>
        </div>

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

<style lang="scss">
.quote {
  p {
    position: relative;
    &::before {
      content: "“";
      font-size: 3rem;
      line-height: 0;
      vertical-align: top;
      margin-right: 0.25rem;
      font-family: 'Permanent Marker', cursive;
      color: var(--section-color);
      position: relative;
      left: -1rem;
      top: 0rem;
    }
    &::after {
      content: "”";
      font-size: 3rem;
      line-height: 0;
      vertical-align: bottom;
      margin-left: 0.25rem;
      font-family: 'Permanent Marker', cursive;
      color: var(--section-color);
      position: relative;
      right: -1rem;
      bottom: -1rem;
    }
  }
}
</style>