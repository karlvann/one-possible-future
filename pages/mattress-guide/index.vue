<template>
  
  <div
  class="relative overflow-hidden">
    <div class="pt-8 sm:pt-16">
      <Container class="prose">
        <div class="md:grid md:grid-cols-12 lg:grid-cols-12 xl:grid-cols-12 gap-8 relative">
          <div class="md:col-start-3 md:col-span-8 lg:col-start-3 lg:col-span-8 xl:col-span-6 xl:col-start-4 relative">
            <h1>Mattress Guide</h1>
            <div class="mb-4">
              <p>Your comprehensive guide to choosing the perfect mattress for a restful night's sleep.</p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  </div>

  <ElementBlogCategories 
  v-if="categories"
  :categories="categories" />

  <Section
  v-if="articles"
  margins="reset-top">
    <Container>

      <FadeIn 
      delay="200"
      class="mx-auto grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 mt-4 md:mt-8"
      >
        <ElementBlogCard v-for="(article, index) in articles" :key="'article-'+index" :article="article" />
      </FadeIn>

    </Container>
  </Section>

</template>

<script setup>
const route = useRoute()
const { getItems } = useDirectusItems()

const { data } = useAsyncData(
  `mattress-guide`,
  async () => {
    
    const articlesData = await getItems({
      collection: 'articles',
      params: {
        fields: [
          '*', 
          'image.id', 
          'image.filename_download', 
          'image.description', 
          'image.width', 
          'image.height',
          'categories.article_categories_id.title',
          'categories.article_categories_id.slug'
        ],
        sort: "-date"
      }
    })
    
    const categoriesData = await getItems({
      collection: 'article_categories',
      params: {
        fields: [
          '*'
        ]
      }
    })
    
    // Return all data in a single object
    return {
      articles: articlesData,
      categories: categoriesData
    }
  }
)

const articles = computed(() => data.value?.articles || [])
const categories = computed(() => data.value?.categories || [])

// SEO handling
const seo = computed(() => {
  return useSeo({
    meta_title: 'Mattress Guide - Ausbeds | Comfortable Mattresses in Sydney',
    meta_description: 'Ausbeds comfortable mattresses feature honeycomb springs, natural Dunlop latex, and modular comfort. Handcrafted in Sydney for lasting support and better sleep.',
    meta_image: null
  }, route.fullPath)
})

useHead(seo)
</script>