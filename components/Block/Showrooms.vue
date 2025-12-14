<template>
  <Section class="relative" :id="data.anchor_id || null">
    <div
    class="absolute inset-0 -z-10 top-[50%]"
    :class="`bg-[${data.color || '#B4F8CC'}]`"
    ></div>

    <Container>
      
      <div class="max-w-[480px] mx-auto text-center mb-12 md:mb-16 lg:mb-20">
        <ElementPretitle
        v-if="data.pretitle"
        :text="data.pretitle" 
        :color="data.color || '#B4F8CC'" 
        size="large" 
        />
        <h2 class="text-xl md:text-3xl lg:text-4xl font-bold mb-2 lg:mb-4 mt-4">
          {{ data.title }}
        </h2>
        <div class="text-base">
          {{ data.subtitle }}
        </div>
      </div>

      <div 
      class="mx-auto grid grid-cols-1 gap-6"
      :class="showroomToDisplay.length === 1 ? `md:grid-cols-1 max-w-[365px]` : `md:grid-cols-${showroomToDisplay.length} max-w-3xl`"
      >
        <div 
        v-for="showroom in showroomToDisplay"
        class="border border-grey-med-light rounded-xl shadow bg-white"
        >
          <a
          :href="showroom.directionsUrl"
          target="_blank"
          >
            <img 
            class="w-full h-48 object-cover rounded-t-xl"
            :alt="showroom.title"
            loading="lazy"
            :src="showroom.image"
            >
          </a>
          <div class="p-4 flex flex-col gap-3">
            <div class="flex-grow flex flex-col gap-3 mb-4">
              <h3 class="text-xl font-bold">
                {{ showroom.title }}
              </h3>
              <div class="flex">
                <Icon name="ic:baseline-location-on" class="w-5 h-5 text-grey-dark mr-2 flex-shrink-0" />
                <div class="text-base text-grey-dark">
                  {{ showroom.address }}
                </div>
              </div>
              <div class="flex">
                <Icon name="ic:baseline-access-time" class="w-5 h-5 text-grey-dark mr-2 flex-shrink-0" />
                <div class="text-base text-grey-dark">
                  <div v-html="showroom.openingTimes"></div>
                  <div v-html="showroom.notes"></div>
                </div>
              </div>
            </div>
            <a
            :href="showroom.directionsUrl"
            target="_blank"
            class="block btn btn-grey btn-small"
            >
              Get directions
            </a>
          </div>
        </div>
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

const showrooms = [
  {
    id: 'marrickville',
    title: 'Sydney workshop & showroom',
    address: '136 Victoria Rd, Marrickville NSW',
    openingTimes: 'Monday to Friday: 10am-6pm<br>Saturday to Sunday: 10am - 2pm',
    notes: null,
    image: useCdn('9d059e83-a2c0-4b0a-95b9-b9d96761fc7d', 'ausbeds-showroom-marrickville.png'),
    directionsUrl: 'https://maps.app.goo.gl/daLvihsYoWfUbNp6A'
  },
  {
    id: 'willoughby',
    title: 'Staffless showroom - Willoughby',
    address: '94 Penshurst St, Willoughby NSW',
    openingTimes: 'Every day: 6am - 8pm',
    notes: 'No staff. Push the door to enter.',
    image: useCdn('cf6504a1-e906-42e3-8d36-9c25973b53e0', 'ausbeds-staffless-showroom.png'),
    directionsUrl: 'https://maps.app.goo.gl/BKLCjB3DjbtMHVk77'
  }
]

const showroomToDisplay = computed(() => {
  if (!route.params.slug) {
    return showrooms
  }
  if (route.params.slug.includes('marrickville')) {
    return showrooms.filter(showroom => showroom.id === 'marrickville')
  } else if (route.params.slug.includes('willoughby')) {
    return showrooms.filter(showroom => showroom.id === 'willoughby')
  } else {
    return showrooms
  }
})
</script>