<template>
  <Section class="relative" :id="data.anchor_id || null">
    <div 
    class="absolute inset-0 -z-10 top-[50%]"
    :class="`bg-[${data.color || '#FFC2CB'}]`"
    ></div>

    <Container>
      
      <div class="max-w-[480px] mx-auto text-center mb-12 md:mb-16 lg:mb-20">
        <ElementPretitle
        text="Sharing is caring" 
        :color="data.color || '#FFC2CB'" 
        size="large" />
        <h2 class="text-xl md:text-3xl lg:text-4xl font-bold mb-2 lg:mb-4 mt-4">
          Trusted by the community
        </h2>
        <div class="text-base">
          Karl built his rep on forums by telling people what they needed to hear. Mattress overwhelm? He answers questions on forums and YouTube. Just ask <NuxtLink to="https://www.reddit.com/user/karlatausbeds/">u/karlatausbeds</NuxtLink>!
        </div>
        <div class="mt-8 text-base">
          Here's Karl's most popular reddit post at 1.1 million+ views.
        </div>
      </div>

      <div class="max-w-3xl mx-auto">
        <NuxtLink
        to="https://www.reddit.com/r/Mattress/comments/1dvvah2/ive_been_designing_and_making_mattresses_since/"
        target="_blank"
        >
          <img 
          class="w-full rounded-lg shadow border border-grey-med-light"
          alt="Why most mattresses suck"
          loading="lazy"
          width="1500"
          height="477"
          :src="useCdn('2a2f862e-2cc1-45f8-9bd9-c5770dbcde4f', 'why-most-mattresses-suck.png', 1500)"
          >
        </NuxtLink>
      </div>

      <div class="max-w-[480px] mx-auto text-center mb-12 mt-12">
        <div 
        class="text-xl md:text-2xl lg:text-3xl font-bold mb-2 lg:mb-4 mt-4"
        :class="`text-[${useColors(data.color).dark || '#A53D4C'}]`"
        >
          Browse other collections of Karl's honest comments online:
        </div>
      </div>

      <div class="max-w-xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">

        <NuxtLink
        v-for="item in socials"
        :to="item.url"
        target="_blank"
        class="ring-1 ring-grey-med-light rounded-xl shadow bg-white relative flex flex-col gap-5 px-4 py-3 text-center h-full"
        >
          <img 
          class="w-full h-12 object-contain"
          :alt="item.alt"
          loading="lazy"
          :src="item.img"
          >
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

const socials = [
  {
    name: 'Reddit',
    url: 'https://www.reddit.com/user/karlatausbeds/',
    img: useCdn('ede6fe90-c2e7-491b-ab09-fded66412627', 'logo-reddit.png'),
    alt: 'Reddit logo'
  },
  {
    name: 'OzBargains',
    url: 'https://www.ozbargain.com.au/user/77255',
    img: useCdn('176ccae0-f98e-4084-8f9d-a6a90a925d94', 'logo-ozbargain.png'),
    alt: 'OzBargains logo'
  },
  {
    name: 'YouTube',
    url: 'https://www.youtube.com/@AusbedsTheMattressGuy',
    img: useCdn('50fb4ce3-b24e-42fa-a53c-80f09d89b553', 'logo-youtube.png'),
    alt: 'YouTube logo'
  },
  {
    name: 'Whirlpool',
    url: 'https://forums.whirlpool.net.au/thread/3lqnypr9?r=76038370&u=903959#r76038370',
    img: useCdn('edfe8823-e532-44af-a5e5-7ee573c1c2bd', 'logo-whirlpool.png'),
    alt: 'Whirlpool logo'
  }
]

</script>