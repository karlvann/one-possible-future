<template>
  <Section class="bg-grey" :id="data?.anchor_id || null">
    <Container>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12 items-center text-white">
        <div>
          <div class="flex flex-col gap-4 md:gap-6 items-center">
            <div aria-hidden="true" class="tracking-tight md:w-full inline-flex flex-col text-center md:text-left relative mb-4">
              <span
              v-for="line in lines"
              class="text-white inline-block font-bold -skew-5 -mb-2 text-center md:text-left text-3xl md:text-4xl lg:text-5xl pl-10 pr-10 pt-2 pb-5 w-fit"
              v-html="line"
              :style="spanStyle"
              >
              </span>
            </div>
            <h2 class="w-full text-xl md:text-2xl lg:text-3xl font-bold mt-2">
              {{ data.title }}
            </h2>
            <p class="text-base w-full">
              {{ data.subtitle }}
            </p>

            <div
            v-if="data?.cta"
            class="w-full"
            >
              <NuxtLink 
              :to="data?.cta.url" 
              class="btn"
              :class="`bg-[${data.color}]`"
              >
                {{ data?.cta.title }} <Icon name="ic:baseline-arrow-forward" class="w-5 h-5 inline-block relative top-1" />
              </NuxtLink>
            </div>

          </div>
        </div>
        <div>
          <div
          v-if="data?.image"
          :style="[ dotStyle, { backgroundImage: `url(${useCdn(data.image.id, data.image.filename_download, 600, 600)})` } ]"
          class="w-[100%] h-auto lg:w-[70%] xl:w-[60%] px-16 aspect-square bg-no-repeat bg-contain bg-center mx-auto flex-shrink-0 mt-6 md:mt-0">
          </div>
          <div
          v-if="taglines"
          class="w-full text-center -mt-6">
            <div class="w-[300px] mx-auto">
              <span
              v-for="line in taglines"
              class="text-white inline-block font-bold text-base pl-4 pr-3.5 pt-1.5 pb-2 -rotate-2 tracking-tight w-fit -translate-x-1/6 translate-y-1/8"
              :style="spanStyle"
              > 
                {{ line }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Container>
  </Section>
</template>

<script setup>
import dot from '~/assets/images/brush-splotch.svg'

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

const spanStyle = computed(() => {
  return {
    backgroundImage: `url(${useCdn('1cff1f31-6612-4613-859d-9cce2b16ee0b', 'brush-stroke-black.svg')})`,
    backgroundSize: `100% 100%`,
    backgroundRepeat: `no-repeat`,
    backgroundPosition: `center center`,
    '--emColor': props.data?.color
  }
})

const dotStyle = computed(() => {
  return {
    maskImage: `url(${dot})`,
    WebkitMaskImage: `url(${dot})`,
    maskSize: '100% 100%',
    WebkitMaskSize: '100% 100%',
    maskRepeat: 'no-repeat',
    WebkitMaskRepeat: 'no-repeat'
  }
})

const lines = computed(() => {
  if (!props.data.title_styled) return null
  return props.data.title_styled
  .split(/(<span[^>]*>.*?<\/span>|<em[^>]*>.*?<\/em>)/g)
  .filter(line => line.trim() !== '')
  .map(line => {
    if (line.startsWith('<span')) {
      return line.replace(/<\/?span[^>]*>/g, '').trim()
    }
    return line.trim()
  })
})

const taglines = computed(() => {
  if (!props.data.tagline) return null
  return props.data.tagline
  .split(/(<span[^>]*>.*?<\/span>|<em[^>]*>.*?<\/em>)/g)
  .filter(line => line.trim() !== '')
  .map(line => {
    if (line.startsWith('<span')) {
      return line.replace(/<\/?span[^>]*>/g, '').trim()
    }
    return line.trim()
  })
})
</script>