<template>
  
  <div
  v-if="page"
  class="relative overflow-hidden">
    <div class="pt-8 sm:pt-16">
      <Container class="prose">
        <div class="md:grid md:grid-cols-12 lg:grid-cols-12 xl:grid-cols-12 gap-8 relative">
          <div class="md:col-start-3 md:col-span-8 lg:col-start-3 lg:col-span-8 xl:col-span-6 xl:col-start-4 relative">
            <h1>{{ page.title }}</h1>
            <div class="mb-4" v-html="page.subtitle">
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
  `mattress-guide-${route.params.slug}`,
  async () => {

    const pageData = await getItems({
      collection: 'article_categories',
      params: {
        filter: {
          slug: {
            _eq: route.params.slug
          }
        },
        fields: [
          '*',
          'seo.*',
          'seo.meta_title', 
          'seo.meta_description',
          'seo.meta_image.*'
        ]
      }
    })

    if (!pageData?.length) {
      throw createError({
        statusCode: 404
      })
    }
    
    const articlesData = await getItems({
      collection: 'articles',
      params: {
        filter: {
          categories: {
            article_categories_id: {
              slug: {
                _eq: route.params.slug
              }
            }
          } 
        },
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
    
    return {
      page: pageData[0],
      articles: articlesData,
      categories: categoriesData
    }
  }
)

const page = computed(() => data.value?.page || null)
const articles = computed(() => data.value?.articles || [])
const categories = computed(() => data.value?.categories || [])

const seo = computed(() => {
  if (page.value?.seo) {
    return useSeo(page.value?.seo, route.fullPath)
  }
  return {}
})

useHead(seo)
</script>