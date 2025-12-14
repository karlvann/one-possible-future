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

      <div class="mx-auto max-w-4xl box md:grid md:grid-cols-5 gap-4 border-2 border-grey-med-light rounded-xl p-4 md:p-8 lg:p-10 prose">
        <div class="col-span-3" v-html="data.content"></div>
        <div class="bg-purple col-span-2 mt-4 md:mt-0 rounded-lg p-4 md:p-6 md:max-w-md">
          <div v-html="data.highlight"></div>
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

<style>
.box h2, 
.box h3, 
.box h4,
.box p {
  margin-top: 0!important;
}
.box p:last-child {
  margin-bottom: 0!important;
}
</style>