<template>
  <div class="app" ref="refocus" tabindex="-1">
    
    <Header />
    
    <main>
      <div class="pt-12 md:pt-16 lg:pt-24 w-full flex flex-col justify-center text-center relative">
        <div class="flex flex-col flex-1 w-full overflow-x-hidden">
          <div
          class="items-center flex-col flex">
            <ElementHeroSlogan
            :data="{
            title_styled: `<span><em>${statusCode}</em></span><span>${ message }</span>`,
            title: '',
            color: '#97D7ED',
            image: null,
            cta: null,
            tags: null
            }"
            :error-page="true"
            />
          </div>
        </div>
      </div>

      <Container class="mt-8 mb-16 md:mb-24">
        <div class="max-w-xl mx-auto">
          <h2 class="sr-only">Useful links</h2>
          <ul role="list" class="-mt-6">
            <li class="relative flex gap-x-4 pt-4 pb-2 border-b border-grey-med-light hover:text-blue transition-colors">
              <div class="flex-auto">
                <NuxtLink 
                v-umami="{ name: 'error_link_click', type: 'Home' }"
                to="/" class="text-xl font-semibold leading-6 md:leading-6 transition-colors md:text-md lg:text-lg">
                  <span class="absolute inset-0" />
                  Go back home
                </NuxtLink>
              </div>
              <div class="flex-none self-center">
                <Icon name="ic:baseline-arrow-forward" class="w-8 h-8 inline-block relative -top-[5px]" />
              </div>
            </li>
            <li class="relative flex gap-x-4 pt-4 pb-2 border-b border-grey-med-light hover:text-blue transition-colors">
              <div class="flex-auto">
                <NuxtLink 
                v-umami="{ name: 'error_link_click', type: 'Shop' }"
                to="/mattresses" class="text-xl font-semibold leading-6 md:leading-6 md:text-md lg:text-lg">
                  <span class="absolute inset-0" />
                  Shop for mattresses
                </NuxtLink>
              </div>
              <div class="flex-none self-center">
                <Icon name="ic:baseline-arrow-forward" class="w-8 h-8 inline-block relative -top-[5px]" />
              </div>
            </li>
            <li class="relative flex gap-x-4 pt-4 pb-2 border-b border-grey-med-light hover:text-blue transition-colors">
              <div class="flex-auto">
                <NuxtLink 
                v-umami="{ name: 'error_link_click', type: 'Blog' }"
                to="/mattress-guide" class="text-xl font-semibold leading-6 md:leading-6 md:text-md lg:text-lg">
                  <span class="absolute inset-0" />
                  Read our expert guides & tips
                </NuxtLink>
              </div>
              <div class="flex-none self-center">
                <Icon name="ic:baseline-arrow-forward" class="w-8 h-8 inline-block relative -top-[5px]" />
              </div>
            </li>
            <li class="relative flex gap-x-4 pt-4 pb-2 border-b border-grey-med-light hover:text-blue transition-colors">
              <div class="flex-auto">
                <a 
                v-umami="{ name: 'error_link_click', type: 'Phone' }"
                href="tel:0289993333" class="text-xl font-semibold leading-6 md:leading-6 md:text-md lg:text-lg">
                  <span class="absolute inset-0" />
                  Call us: (02) 8999 3333
                </a>
              </div>
              <div class="flex-none self-center">
                <Icon name="ic:baseline-arrow-forward" class="w-8 h-8 inline-block relative -top-[5px]" />
              </div>
            </li>
          </ul>
        </div>
      </Container>
      
    </main>

    <Footer />
  </div>

</template>

<script setup>
const error = useError()

const statusCode = computed(() => error.value?.statusCode || 404)
const theUrl = computed(() => error.value?.url || '/')

const message = computed(() => {
  if (statusCode.value === 404) {
    return 'Page not found'
  } else if (statusCode.value === 500) {
    return 'Internal server error'
  } else {
    return 'An unexpected error occurred'
  }
})

const seo = computed(() => {
  return {
    metaTitle: statusCode.value + ' | ' + theUrl.value,
    metaDescription: message.value,
    metaImage: null
  }
})

useHead(seo)
</script>