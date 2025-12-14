<template>
  <FadeIn class="relative overflow-hidden py-8 mb-4 lg:mb-8">
    <div>
      <div v-if="data.images" class="product-images">
        <template v-for="(image, index) in data.images">
          <ImageResponsive
          v-if="index == 0"
          :data="image.directus_files_id"
          :xs="6"
          :sm="6"
          :md="4"
          :lg="4"
          :xl="4"
          classes="rounded-xl"
          />
        </template>
      </div>
      <div v-if="data.url" class="prose">
        <NuxtLink 
        :to="data.url"
        target="_blank" 
        :rel="!data.url.includes('ausbeds.com.au') ? 'nofollow noopener' : ''" 
        style="text-decoration: none;"
        >
          <h2>{{ data.title }} <Icon name="gridicons:external" style="position: relative; top: -7px;left: 0px;width: 15px;height: 15px;" /></h2>
        </NuxtLink>
      </div>
      <template v-else>
        <h2>{{ data.title }}</h2>
      </template>
    </div>
    <div class="prose relative" v-interpolation v-html="useSanitize(data.content)"></div>    
  </FadeIn>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Object,
    required: true,
  }
})
</script>