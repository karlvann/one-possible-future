<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-gradient-to-b from-grey-light to-white">
      <Container class="py-16 md:py-24 lg:py-32">
        <div class="max-w-3xl mx-auto text-center">
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6">
            Really comfy mattresses, handmade on site
          </h1>
          <p class="text-lg md:text-xl text-gray-600 mb-8">
            Try before you buy at our Sydney showrooms. We make mattresses that fit your body, not the other way around.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink
              to="/mattresses"
              class="inline-flex items-center justify-center px-8 py-4 bg-blue text-white font-semibold rounded-lg hover:bg-blue-dark transition-colors"
            >
              Shop Mattresses
            </NuxtLink>
            <NuxtLink
              to="/showrooms"
              class="inline-flex items-center justify-center px-8 py-4 bg-white text-primary font-semibold rounded-lg border-2 border-grey-med hover:border-primary transition-colors"
            >
              Visit Showroom
            </NuxtLink>
          </div>
        </div>
      </Container>
    </section>

    <!-- Demo Notice -->
    <section class="bg-blue-50 border-y border-blue-100">
      <Container class="py-6">
        <div class="flex flex-col md:flex-row items-center justify-center gap-4 text-center md:text-left">
          <div class="flex items-center gap-2">
            <svg class="w-6 h-6 text-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="font-semibold text-primary">Demo Site</span>
          </div>
          <p class="text-gray-600">
            This is a demo showcasing Notion-powered content. Check out
            <NuxtLink to="/articles" class="text-blue underline hover:text-blue-dark">Articles</NuxtLink>
            and
            <NuxtLink to="/help" class="text-blue underline hover:text-blue-dark">Help Centre</NuxtLink>
            in the footer.
          </p>
        </div>
      </Container>
    </section>

    <!-- Simple Features Grid -->
    <section class="bg-white">
      <Container class="py-16 md:py-24">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <div class="text-center">
            <div class="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-primary mb-2">Try Before You Buy</h3>
            <p class="text-gray-600">Test every firmness level at our Sydney showrooms</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-primary mb-2">Free Adjustments</h3>
            <p class="text-gray-600">Two free component swaps in the first 3 months</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-primary mb-2">Made in Sydney</h3>
            <p class="text-gray-600">Handmade at our Marrickville workshop</p>
          </div>
        </div>
      </Container>
    </section>
  </div>
</template>

<script setup>
useHead({
  title: 'Ausbeds - Really Comfy Mattresses, Handmade on Site',
  meta: [
    {
      name: 'description',
      content: 'Try before you buy at our Sydney showrooms. We make mattresses that fit your body, not the other way around.'
    }
  ]
})
</script>
