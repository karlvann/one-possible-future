<template>
<article v-if="page">
    
    <div class="relative overflow-hidden">
      <div class="pt-8 sm:pt-16">

        <Container class="prose">
          <div class="md:grid md:grid-cols-12 lg:grid-cols-12 xl:grid-cols-12 gap-8 relative">
            <div class="md:col-start-3 md:col-span-8 lg:col-start-3 lg:col-span-8 xl:col-span-6 xl:col-start-4 relative">
              
              <h1>{{ page.title }}</h1>
              
              <div class="mb-4" v-interpolation v-html="page.subtitle"></div>

            </div>
          </div>
        </Container>

      </div>
    </div>

    <Container class="px-0 pl-4 sm:pl-8 sm:px-0 md:px-8 mb-16 md:mb-24">
      <div class="md:grid md:grid-cols-12 lg:grid-cols-12 gap-8 relative">
                
        <div class="md:col-start-3 md:col-span-8 lg:col-start-3 lg:col-span-8 xl:col-span-6 xl:col-start-4 relative">

          <div v-html="page.content" class="prose"></div>

        </div>
      </div>
    </Container>

  </article>
</template>

<script setup>
const { getItems } = useDirectusItems()
const route = useRoute()
const { data } = await useAsyncData(
  'policy-'+route.params.slug,
  () => getItems({
    collection: 'policies',
    params: {
      filter: {
        slug: {
          "_eq": route.params.slug
        }
      },
      fields: ['*']
    }
  })
)
const page = computed(() => {
  return data.value?.[0] || null
})
</script>