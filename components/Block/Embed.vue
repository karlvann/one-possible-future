<template>
  <Section :id="data?.anchor_id || null">
    <Container>
      
      <div class="max-w-5xl mx-auto">
        <div
        v-if="data.title || data.pretitle || data.subtitle"
        class="max-w-[480px] mx-auto text-center mb-4 md:mb-6 lg:mb-8">
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
        class="embed overflow-hidden rounded-lg relative"
        :style="data.width && data.height ? `padding-bottom: ${(data.height / data.width) * 100}%` : 'padding-bottom: 56.25%'"
        v-if="!isVideoLoaded"
        >
          <div class="absolute top-0 left-0 w-full h-full" @click="loadVideo">
            <ImageResponsive 
            v-if="data?.thumbnail" 
            :data="data.thumbnail"
            classes="w-full h-full object-cover rounded-lg"
            class="w-full h-full object-cover rounded-lg"
            :xs="12"
            :sm="12"
            :md="10"
            :lg="8"
            :xl="8"
            :lazy="true"
            />
            <button
            :aria-label="data.video_id"
            class="absolute shadow-lg cursor-pointer top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[70px] h-[70px] rounded-full transition-colors duration-200 flex items-center justify-center"
            :class="`bg-[${data.color ? data.color : '#6366F1'}]`"
            >
              <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              class="w-10 h-10 text-grey fill-current"
              style="margin-left: 2px;"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
        </div>

        <div
        v-else
        class="embed overflow-hidden rounded-lg"
        style="position:relative;"
        :style="data.width && data.height ? `padding-bottom: ${(data.height / data.width) * 100}%` : 'padding-bottom: 56.25%'"
        v-html="autoplayEmbed(data.embed)"
        >
        </div>
        <div v-if="data.caption" class="mt-4 text-sm" v-html="data.caption"></div>
      </div>

      <div 
      v-if="data?.cta"
      class="mt-12 text-center">
        <NuxtLink
        :to="data?.cta.url"
        :style="{ backgroundColor: useColors(data.color).dark }"
        class="btn text-white"
        >
          {{ data?.cta.title }} <Icon name="ic:baseline-arrow-forward" class="w-5 h-5 inline-block relative top-1" />
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

const isVideoLoaded = ref(false)

const loadVideo = () => {
  isVideoLoaded.value = true
  umTrackEvent('video_click', {
    videoId: props.data.video_id || ''
  })
}

const autoplayEmbed = (embedCode) => {
  if (!embedCode) return ''
  let parser = new DOMParser()
  let doc = parser.parseFromString(embedCode, 'text/html')
  let iframe = doc.querySelector('iframe')
  if (iframe) {
    let src = iframe.getAttribute('src')
    if (src.includes('?')) {
      src += '&autoplay=1'
    } else {
      src += '?autoplay=1'
    }
    iframe.setAttribute('src', src)
    return iframe.outerHTML
  }
  return embedCode
}

</script>