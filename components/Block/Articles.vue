<template>
  <Section :id="data.anchor_id || null">
    
    <FadeIn>
      
      <Container>
        <div class="lg:flex ">
          <div class="lg:w-[50%]">
            <h2 class="text-section-title">{{ data.title }}</h2>
            <div 
            v-if="data.subtitle"
            class="text-base mt-4" 
            v-interpolation 
            v-html="data.subtitle"
            ></div>
          </div>
          <div class="hidden lg:block lg:w-[50%]">
            <div class="flex justify-end h-full items-end pb-3">
              <button 
              @click="prev()" 
              class="bg-[#8293f8] border-2 border-[#5a6ded] rounded w-12 h-8 flex items-center justify-center text-white"
              role="button"
              aria-label="Previous item"
              >
                <Icon name="heroicons:arrow-left-20-solid" class="w-8 h-6" />
              </button>
              <button 
              @click="next()" 
              class="ml-4 bg-[#8293f8] border-2 border-[#5a6ded] rounded w-12 h-8 flex items-center justify-center text-white"
              role="button"
              aria-label="Next item"
              >
                <Icon name="heroicons:arrow-right-20-solid" class="w-8 h-6" />
              </button>
            </div>
          </div>
        </div>
      </Container>

      <!-- <ClientOnly>
        <swiper
        :free-mode="free"
        :slides-per-view="perView"
        :space-between="between"
        :slides-offset-before="offsetLeft"
        :slides-offset-after="30"
        :navigation="true"
        :modules="[Navigation]"
        class="mt-4 md:mt-8"
        >
          <swiper-slide v-for="(item, index) in data.articles">
            <NuxtLink
            :to="`/guides/${item.article_id.slug}`"
            class="flow-root rounded-xl h-full relative flex flex-col justify-between flex-1 group"
            >
              <ImageResponsive
              v-if="item.article_id.image"
              classes="rounded-xl ring-1 ring-white/10 transition-all duration-300 group-hover:brightness-75"
              :data="item.article_id.image"
              :xs="8"
              :sm="6"
              :md="4"
              :lg="4"
              :xl="4"
              />
              <div class="mt-2 flex items-center gap-x-4 text-xs">
                <time :datetime="item.article_id.date" class="text-gray-500">{{item.article_id.date}}</time>
              </div>
              <h3 
              class="text-md font-semibold leading-6 md:leading-6 text-grey-dark md:text-md lg:text-lg">
                {{ item.article_id.title }}
              </h3>
            </NuxtLink>
          </swiper-slide>
        </swiper>
      </ClientOnly> -->

    </FadeIn>

  </Section>
</template>

<script setup>
//import { Navigation } from 'swiper/modules'
//import { Swiper, SwiperSlide } from 'swiper/vue'
//import 'swiper/css'

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
  sectionIndex: {
    type: Number,
    default: 0
  }
})

const offsetLeft = ref(50)
const between = ref(10)
const perView = ref(1.2)
const free = ref(true)

const prev = () => {
  if (!process.client) return
  const clickedElement = event.currentTarget
  const parentSection = clickedElement.closest('section')
  if (!parentSection) return
  // const swiperButtonNext = parentSection.querySelector('.swiper-button-prev')
  // if (!swiperButtonNext) return
  // swiperButtonNext.click()
}

const next = () => {
  if (!process.client) return
  const clickedElement = event.currentTarget
  const parentSection = clickedElement.closest('section')
  if (!parentSection) return
  // const swiperButtonNext = parentSection.querySelector('.swiper-button-next')
  // if (!swiperButtonNext) return
  // swiperButtonNext.click()
}

const carouselSize = () => {
  const windowW = window.innerWidth
  if (windowW > 1800) {
    between.value = 20
    offsetLeft.value = (windowW - 1400) / 2 + 35
    perView.value = 5.5
    free.value = false
  } else if (windowW > 1440) {
    between.value = 20
    offsetLeft.value = (windowW - 1400) / 2 + 35
    perView.value = 4.2
    free.value = false
  } else if (windowW > 1300) {
    between.value = 15
    offsetLeft.value = (windowW - 1300) / 2 + 30
    perView.value = 3.6
    free.value = false
  } else if (windowW > 1024) {
    between.value = 15
    offsetLeft.value = 35
    perView.value = 3.2
    free.value = false
  } else if (windowW > 768) {
    between.value = 15
    offsetLeft.value = 35
    perView.value = 2.8
    free.value = false
  } else if (windowW > 600) {
    between.value = 15
    offsetLeft.value = 33
    perView.value = 1.9
    free.value = true
  } else if (windowW > 413) {
    between.value = 15
    offsetLeft.value = 33
    perView.value = 1.5
    free.value = true
  } else {
    between.value = 10
    offsetLeft.value = 15
    perView.value = 1.2
    free.value = true
  }
}

onMounted(() => {
  if (process.client) {
    carouselSize()
    window.addEventListener('resize', () => {
      if (process.client) {
        carouselSize()
      }
    })
  }
})

</script>