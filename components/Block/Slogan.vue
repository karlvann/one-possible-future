<template>
  <Section class="bg-grey-medium" v-if="title"  :id="data.anchor_id || null">
    <Container>
      <div class="flex justify-center">
        <div aria-hidden="true" class="inline-flex flex-col items-center text-center">
          <span
          v-for="line in lines"
          class="text-white inline-block font-bold -skew-5 -mb-2 -ml-10 -mr-10 text-2xl sm:text-3xl md:text-4xl lg:text-5xl pl-10 pr-10 pt-2 pb-5 w-fit"
          v-html="line"
          :style="spanStyle"
          >
          </span>
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
  },
  sectionIndex: {
    type: Number,
    default: 0
  }
})

const title = props?.data?.title_styled

const lines = computed(() => {
  if (!title) return []
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


const spanStyle = computed(() => {
  return {
    backgroundImage: `url(${useCdn('1cff1f31-6612-4613-859d-9cce2b16ee0b', 'brush-stroke-black.svg')})`,
    backgroundSize: `100% 100%`,
    backgroundRepeat: `no-repeat`,
    backgroundPosition: `center center`,
    '--emColor': props.data.color || '#97D7ED'
  }
})
</script>