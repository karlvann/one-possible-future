<template>
  <Section :id="data.anchor_id || null">

    <!-- SINGLE-IMAGE FEATURE BLOCK -->
    <Container v-if="data.image?.filename_download">

      <div class="max-w-[480px] mx-auto text-center mb-8 md:mb-12 lg:mb-16">
        <ElementPretitle
        v-if="data.pretitle"
        :text="data.pretitle" 
        color="#B4F8CC" 
        size="large"
        />
        <h2 class="text-2xl md:text-2xl lg:text-3xl font-bold mt-4 mb-2 lg:mb-4">
          {{ data.title }}
        </h2>
        <p class="text-base">{{ data.subtitle }}</p>
      </div>

      <div class="md:w-[75%] md:mx-auto lg:w-[50%] mb-8 md:mb-12 lg:mb-16">
        <ImageResponsive 
        v-if="data?.image" 
        :data="data.image"
        classes="w-full h-auto rounded-lg"
        :xs="12"
        :sm="12"
        :md="8"
        :lg="6"
        :xl="6"
        :lazy="true"
        />
      </div>

      <div class="md:w-[75%] md:mx-auto lg:w-[50%]">
        <div v-for="(feature, index) in data.features" class="mb-8 md:mb-12 lg:mb-16">
          <h3 class="text-xl sm:text-2xl md:text-2xl font-bold my-2 md:mt-0 md:mb-4">
            {{ feature.feature_id.title }}
          </h3>
          <p class="text-base sm:text-lg mb-2 md:mb-4 font-medium text-grey-medium">
            {{ feature.feature_id.subtitle }}
          </p>
          <div class="text-sm sm:text-base leading-6.5 text-grey-medium" v-html="feature.feature_id.content"></div>
        </div>
      </div>

    </Container>

    <!-- MULTI-IMAGE FEATURE BLOCK -->
    <Container v-else>

      <div class="max-w-[480px] mx-auto text-center mb-8 md:mb-12 lg:mb-16">
        <ElementPretitle
        v-if="data.pretitle"
        :text="data.pretitle" 
        color="#B4F8CC" 
        size="large"
        />
        <h2 class="text-2xl md:text-2xl lg:text-3xl font-bold mt-4 mb-2 lg:mb-4">
          {{ data.title }}
        </h2>
        <p class="text-base">{{ data.subtitle }}</p>
      </div>

      <div 
      v-for="(feature, index) in data.features"
      class="md:flex gap-8 items-center mb-8 sm:mb-12 md:mb-16 lg:mb-20"
      :class="index % 2 === 1 ? 'md:flex-row-reverse' : ''"
      >
        <div class="md:w-1/2">
          <img
          v-if="feature.feature_id?.image?.id"
          loading="lazy"
          :src="useCdn(feature.feature_id.image.id, feature.feature_id.image.filename_download)"
          :alt="feature.feature_id.image.description || feature.feature_id.title"
          :width="feature.feature_id.image.width" 
          :height="feature.feature_id.image.height" 
          class="w-full h-auto rounded-lg"
          />
        </div>
        <div class="md:w-1/2"
        :class="index % 2 === 1 ? 'md:pr-8' : 'md:pl-8'"
        >
          <h3 class="text-xl sm:text-2xl md:text-3xl font-bold my-2 md:mt-0 md:mb-4">
            {{ feature.feature_id.title }}
          </h3>
          <p class="text-base sm:text-lg mb-2 md:mb-4 font-medium text-grey-medium">
            {{ feature.feature_id.subtitle }}
          </p>
          <div class="text-sm sm:text-base leading-6.5 text-grey-medium" v-html="feature.feature_id.content"></div>
        </div>
      </div>

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
