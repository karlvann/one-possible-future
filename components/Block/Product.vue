<template>
  <Section :id="data.anchor_id || null">
    <Container>
      
      <div class="max-w-[480px] mx-auto text-center mb-12 md:mb-16 lg:mb-20">
        <h2 class="text-xl md:text-3xl lg:text-4xl font-bold mb-2 lg:mb-4">{{ data.title }}</h2>
        <p class="text-base">{{ data.subtitle }}</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        <template v-for="(product) in products">
          <div class="border border-grey-med-light rounded-xl overflow-hidden rounded-lg flex flex-col">
            <div class="mb-4 relative">
              <ImageResponsive 
              v-if="product.image?.filename_download" 
              :data="product.image"
              class="w-full h-auto object-cover rounded-md"
              classes="w-[100%]"
              :xs="12"
              :sm="12"
              :md="4"
              :lg="4"
              :xl="4"
              :lazy="true"
              />
              <ElementTag 
              :tag="product.tag"
              :color="data.color"
              class="absolute bottom-4 left-4" 
              />
            </div>
            <div class="p-4 flex flex-col flex-grow">
              <div class="flex items-start mb-2">
                <div class="w-1/2">
                  <h2 class="text-lg font-semibold">{{ product.title }}</h2>
                  <div class="text-sm mb-4">{{ product.price }}</div>
                </div>
                <div class="w-1/2">
                  <NuxtLink
                  :to="product.url"
                  class="block btn btn-grey btn-small"
                  :aria-label="`Explore ${product.title} mattress`"
                  >
                    Explore <Icon name="ic:baseline-arrow-forward" class="w-5 h-5 inline-block relative top-1" />
                  </NuxtLink>
                </div>
              </div>
              <p class="text-sm flex-grow">{{ product.subtitle }}</p>
            </div>
          </div>
        </template>
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

const products = [
  {
    title: 'Cooper',
    subtitle: `Made from durable polyfoam, it's our most budget-friendly option and gets the job done.`,
    image: {
      id: '970b19fb-67cd-459d-a366-cc8f56518976',
      filename_download: 'cooper-mattress-sm.jpg',
      description: 'Ausbeds Cooper Mattress',
      width: 500,
      height: 500
    },
    tag: 'Essential solution',
    price: 'From $850',
    url: '/mattresses/cooper'
  },
  {
    title: 'Aurora',
    subtitle: `Upgrades the comfort layer to natural latex. Usually suits front and back sleepers.`,
    image: {
      id: '893dfc33-3056-4a0f-9331-5abd7838c056',
      filename_download: 'aurora-mattress-sm.jpg',
      description: 'Ausbeds Aurora Mattress',
      width: 500,
      height: 500
    },
    tag: 'Durable upgrade',
    price: 'From $1700',
    url: '/mattresses/aurora'
  },
  {
    title: 'Cloud',
    subtitle: `Has double the microsprings for max plushiness, ideal for side sleepers.`,
    image: {
      id: '7fa5ba89-5730-44df-8bdf-816a1c755139',
      filename_download: 'cloud-mattress-sm.jpg',
      description: 'Ausbeds Cloud Mattress',
      width: 500,
      height: 500
    },
    tag: 'Extra plush',
    price: 'From $1950',
    url: '/mattresses/cloud'
  }
]

</script>