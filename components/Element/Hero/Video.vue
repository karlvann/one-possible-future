<template>
  <Section v-if="data" class="pt-12 pb-12 lg:pt-16 lg:pb-20">
    <Container>
      <div class="lg:flex lg:gap-12 xl:gap-16">
        <FadeIn class="text-center lg:text-left mx-auto md:max-w-[75%] lg:w-[50%] lg:mx-0 lg:flex-shrink-0 sm:mt-0 lg:flex lg:items-center"> 
          <div>
            <div
            v-if="lines"
            class="flex flex-col items-center lg:items-start tracking-tight"
            :class="[tags ? 'mb-4 md:mb-6' : 'mb-0']"
            >
              <div 
              aria-hidden="true"
              class="inline-flex flex-col items-center text-center lg:items-start lg:text-left gap-y-1 px-8 md:gap-y-0"
              >
                <div
                v-for="line in lines"
                class="text-white inline-block font-bold -skew-5 -mb-2 -ml-10 -mr-10 text-[18px] sm:text-2xl md:text-3xl lg:text-3xl p-[9px_25px_16px] md:p-[10px_28px_18px] xl:p-[12px_32px_21px] w-fit"
                v-html="line"
                :style="spanBlack"
                >
                </div>
              </div>
            </div>
            <h1
            v-if="!lines"
            id="main-title" 
            :class="[
              data.title.length > 58 ? 
              'text-2xl leading-[1.25] sm:text-3xl sm:leading-[1.2] md:text-4xl md:leading-[1.17] font-bold tracking-tight text-gray-900 lora' :
              'text-3xl leading-[1.25] sm:text-4xl sm:leading-[1.2] md:text-5xl md:leading-[1.12] font-bold tracking-tight text-gray-900 lora'
            ]">
              {{ data.title }}
            </h1>
            <h1 
            v-else
            id="main-title"
            class="text-base md:text-lg font-bold mt-8 lg:mt-12"
            >
              {{ data.title }}
            </h1>
            
            <div 
            v-if="data.subtitle" 
            class="text-subtitle lg:max-w-[85%] mt-2" 
            v-interpolation 
            v-html="data.subtitle">
            </div>
            
            <div 
            v-if="data.cta?.length > 0"
            class="mt-4 lg:mt-8 flex items-center gap-x-2 sm:gap-x-4 lg:gap-x-4 justify-center lg:justify-start">
              <NuxtLink
              v-for="(cta, index) in data.cta"
              :to="cta.cta_id.url"
              class="btn"
              :class="`bg-[${data.color || '#000000'}]`"
              >
                {{ cta.cta_id.title }} <Icon name="ic:baseline-arrow-forward" class="w-5 h-5 inline-block relative top-1" />
              </NuxtLink>

            </div>
          </div>
        </FadeIn>
        <FadeIn 
        delay="200"
        class="mx-auto mt-8 flex md:mt-16 w-full lg:mt-0 md:px-8 lg:px-0 lg:w-[50%]"
        >
          <div
          v-if="!isVideoLoaded"
          class="embed overflow-hidden rounded-lg relative"
          :style="data.width && data.height ? `padding-bottom: ${(data.height / data.width) * 100}%` : 'padding-bottom: 56.25%'"
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
        </FadeIn>
      </div>

    </Container>
  </Section>
</template>

<script setup>
const route = useRoute()
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
    videoId: 'hero-' + route.fullPath
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

const title = props.data.title_styled || null

const lines = computed(() => {
  if (!title) return null
  return title
  .split(/(<span[^>]*>.*?<\/span>|<em[^>]*>.*?<\/em>)/g)
  .filter(line => line.trim() !== '')
  .map(line => {
    if (line.startsWith('<span')) {
      return line.replace(/<\/?span[^>]*>/g, '').trim()
    }
    return line.trim()
  })
})

const tags = props.data.tags || false

const spanBlack = computed(() => {
  return {
    backgroundImage: `url(${useCdn('1cff1f31-6612-4613-859d-9cce2b16ee0b', 'brush-stroke-black.svg')})`,
    backgroundSize: `100% 100%`,
    backgroundRepeat: `no-repeat`,
    backgroundPosition: `center center`,
    '--emColor': props.data.color
  }
})

</script>

<style lang="scss">
em {
  padding-left: 0.4rem;
  padding-right: 0.8rem;
  color: var(--emColor);
}

.-skew-5 {
  transform: skewX(calc(5deg * -1));
  transform: skewY(calc(5deg * -1));
}
</style>