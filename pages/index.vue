<template>
  <BlockHero :data="heroData" />

  <!-- Demo Notice -->
  <section class="bg-blue-50 border-y border-blue-100">
    <Container class="py-6">
      <div class="flex flex-col md:flex-row items-center justify-center gap-4 text-center md:text-left">
        <div class="flex items-center gap-2">
          <Icon name="ic:outline-info" class="w-6 h-6 text-blue" />
          <span class="font-semibold text-primary">Demo Site</span>
        </div>
        <p class="text-gray-600">
          This demo showcases Notion-powered content. Check out
          <NuxtLink to="/articles" class="text-blue underline hover:text-blue-dark">Articles</NuxtLink>
          and
          <NuxtLink to="/help" class="text-blue underline hover:text-blue-dark">Help Centre</NuxtLink>
          in the footer.
        </p>
      </div>
    </Container>
  </section>
</template>

<script setup>
const heroData = {
  type: 'Image',
  title: 'Mattress Shop Sydney',
  title_styled: '<span>Really comfy mattresses</span><span>handmade on site</span>',
  subtitle: '<p class="text-lg md:text-xl text-gray-600">Try before you buy at our Sydney showrooms. We match spring tension to your body weight for the perfect fit.</p>',
  color: '#3B82F6',
  image: {
    id: '893dfc33-3056-4a0f-9331-5abd7838c056',
    filename_download: 'aurora-mattress-sm.jpg'
  },
  cta: [
    {
      cta_id: {
        title: 'Shop Mattresses',
        url: '/mattresses'
      }
    },
    {
      cta_id: {
        title: 'Visit Showroom',
        url: '/showrooms'
      }
    }
  ]
}

useHead({
  title: 'Mattress Shop Sydney | Discover & Shop Ausbeds Today',
  meta: [
    {
      name: 'description',
      content: 'Try before you buy at our Sydney showrooms. We make mattresses that fit your body, not the other way around.'
    }
  ]
})
</script>
