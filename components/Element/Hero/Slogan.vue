<template>
  <div
  class="py-12 md:py-16 lg:py-24 w-full flex flex-col justify-center text-center relative"
  :style="bgImg ? { backgroundImage: `url(${bgImg})`, backgroundSize: 'cover', backgroundPosition: 'center' } : ''"
  >
    <div class="text-center leading-[1.25] sm:leading-[1.2] md:leading-[1.12]">
      
      <div
      class="flex flex-col items-center tracking-tight"
      :class="[tags ? 'mb-4 md:mb-6' : 'mb-0']"
      >
        <div aria-hidden="true" class="inline-flex flex-col items-center text-center gap-y-1">
          <div
          v-for="line in lines"
          class="text-white inline-block font-bold -skew-5 -mb-2 -ml-10 -mr-10 text-[22px] sm:text-3xl md:text-4xl lg:text-5xl p-[9px_25px_16px] md:p-[10px_28px_18px] xl:p-[12px_32px_21px] w-fit"
          v-html="line"
          :style="spanBlack"
          >
          </div>
        </div>
      </div>

      <div
      v-if="tags"
      class="flex flex-col items-center tracking-tight">
        <span
        v-for="(tag, index) in tags"
        class="text-grey-dark inline-block font-bold text-sm md:text-base p-[7px_20px_12px] md:p-[9px_25px_12px] tracking-tight w-fit -rotate-2"
        :style="[
          spanBlue,
          index === 0 ? { 'transform': 'translate(calc(9/10 * 100%  * -1), calc(6/10 * 100%)) rotate(-2deg)' } : '',
          index === 1 ? { 'transform': 'rotate(-2deg)' } : '',
          index === 2 ? { 'transform': 'translate(calc(9/10 * 100%), calc(6/10 * 100% * -1)) rotate(-2deg)' } : '',
        ]"
        >
          {{ tag }}
        </span>
      </div>

      <Container class="mb-[50px]" v-if="h1 || data.cta">
        <h1 
        v-if="h1 && h1.length > 5"
        class="font-bold text-lg text-white leading-6.5 my-6 md:my-12">
          {{ h1 }}
        </h1>

        <div v-if="data?.cta.length" class="flex gap-x-4 justify-center">
          <NuxtLink
          v-for="cta in data.cta"
          :to="cta.cta_id.url || '/mattresses'"
          class="btn"
          :class="`bg-[${data.color || '#97D7ED'}]`"
          >
            {{ cta.cta_id.title || 'Shop Now' }} <Icon name="ic:baseline-arrow-forward" class="w-5 h-5 inline-block relative top-1" />
          </NuxtLink>
        </div>
      </Container>

    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  errorPage: {
    type: Boolean,
    required: false,
    default: false
  }
})

let bgImg = useCdn('f2289d35-5d04-40f7-9ed8-60fde5e37d84', 'mattress.png')
if (props.data?.image?.filename_download) {
  bgImg = useCdn(props.data.image.id, props.data.image.filename_download)
}
if (props.errorPage) {
  bgImg = null
}

const title = props.data?.title_styled
const h1 = props.data?.title

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

const spanBlue = computed(() => {
  return {
    backgroundImage: `url(${useCdn('e77ba6ec-02c5-4892-9310-2291e1ac1987', 'brush-stroke-blue.svg')})`,
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