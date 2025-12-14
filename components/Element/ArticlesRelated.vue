<template>
  <Section v-if="articles?.length" background="#f9f8f6" class="">
    <FadeIn>
      <Container>
        <div class="md:flex">
          <div class="md:w-[70%] lg:w-[50%]">
            <h2 class="text-[1.5rem] font-bold leading-[1.2] text-grey-dark sm:text-[1.9rem] sm:leading-[1.2] md:text-[2.1rem]">You might also like</h2>
          </div>
          <div class="hidden md:block md:w-[30%] lg:w-[50%]">
            <div class="flex justify-end h-full items-end pb-3">
              <button 
              @click="prev()" 
              class="bg-grey-light rounded w-12 h-8 flex items-center justify-center text-grey-dark"
              role="button"
              aria-label="Previous item"
              >
                <Icon name="heroicons:arrow-left-20-solid" class="w-8 h-6" />
              </button>
              <button 
              @click="next()" 
              class="ml-4 bg-grey-light rounded w-12 h-8 flex items-center justify-center text-grey-dark"
              role="button"
              aria-label="Next item"
              >
                <Icon name="heroicons:arrow-right-20-solid" class="w-8 h-6" />
              </button>
            </div>
          </div>
        </div>
      </Container>

      <ClientOnly>
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
          <swiper-slide v-for="(item, index) in articles">
            <NuxtLink
            :to="`/guides/${item.slug}`"
            class="flow-root rounded-xl relative flex flex-col justify-between flex-1 group"
            >
              <ImageResponsive
              v-if="item.image"
              classes="rounded-lg ring-1 ring-white/10 transition-all duration-300 group-hover:brightness-75"
              :data="item.image"
              :xs="8"
              :sm="6"
              :md="4"
              :lg="4"
              :xl="4"
              />
              <div class="mt-4 flex items-center gap-x-4 text-xs">
                <time :datetime="item.date" class="text-gray-500">{{ useFormattedDate(item.date) }}</time>
              </div>
              <h3 class="mt-2 text-sm leading-5 font-semibold sm:leading-6 xl:leading-6 text-grey-dark sm:text-base xl:text-lg">
                {{ item.title }}
              </h3>
            </NuxtLink>
          </swiper-slide>
        </swiper>
      </ClientOnly>

    </FadeIn>

  </Section>
</template>

<script setup>
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'

const { getItems } = useDirectusItems()
const route = useRoute()

const props = defineProps({
  category: {
    type: String,
    required: true
  },
  exclude: {
    type: String,
    default: null
  },
  type: {
    type: String,
    default: 'articles'
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
  const swiperButtonNext = parentSection.querySelector('.swiper-button-prev')
  if (!swiperButtonNext) return
  swiperButtonNext.click()
}

const next = () => {
  if (!process.client) return
  const clickedElement = event.currentTarget
  const parentSection = clickedElement.closest('section')
  if (!parentSection) return
  const swiperButtonNext = parentSection.querySelector('.swiper-button-next')
  if (!swiperButtonNext) return
  swiperButtonNext.click()
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

const { data } = await useAsyncData(
  'articles-related-'+route.params.slug,
  () => getItems({
    collection: 'articles',
    params: {
      filter: {
        slug: {
          _neq: props.exclude
        },
        categories: {
          article_categories_id: {
            slug: {
              _eq: props.category
            }
          }
        }
      },
      fields: [
        '*', 
        'image.id', 'image.filename_download', 'image.description', 'image.width', 'image.height', 'category.category_id.title', 'category.category_id.slug',
      ],
      sort: "-date"
    }
  })
)

const articles = computed(() => data.value)

</script>