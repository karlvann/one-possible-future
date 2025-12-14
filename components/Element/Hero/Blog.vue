<template>
  <div>
    <div class="relative overflow-hidden">
      <div class="pt-8 sm:pt-16">

        <Container class="prose">
          <div class="md:grid md:grid-cols-12 lg:grid-cols-12 xl:grid-cols-12 gap-8 relative">
            <div class="md:col-start-3 md:col-span-8 lg:col-start-3 lg:col-span-8 xl:col-span-6 xl:col-start-4  relative">
              
              <time 
              v-if="data.date" 
              :datetime="data.date" 
              class="text-grey-medium mb-2 block">
                {{ useFormattedDate(data.date) }}
              </time>
              
              <h1>{{ data.title }}</h1>
              
              <div class="blog-subtitle" v-interpolation v-html="data.subtitle"></div>

              <ImageResponsive
              classes="rounded-lg"
              :data="data?.image"
              :xs="12"
              :sm="12"
              :md="8"
              :lg="8"
              :xl="6"
              />

            </div>
          </div>
        </Container>

      </div>
    </div>

  </div>
</template>

<script setup>
defineProps({
  data: {
    type: Object,
    required: true,
  }
})
</script>