<template>
    
  <article 
  v-if="page"
  :class="!pageCat ? 'pb-12 md:pb-16 lg:pb-20' : ''"
  >
    
    <ElementHeroBlog :data="page" />

    <Container class="px-0 pl-4 sm:pl-8 sm:px-0 md:px-8">
      <div class="md:grid md:grid-cols-12 lg:grid-cols-12 gap-8 relative">
                
        <div class="md:col-start-3 md:col-span-8 lg:col-start-3 lg:col-span-8 xl:col-span-6 xl:col-start-4 relative">

          <template v-if="page?.blocks && page?.blocks.length">
            <template v-for="(section, index) in page?.blocks">
              <component
              :is="getSectionComponent(section.collection)"
              :section-index="index"
              :data="section.item"
              :section-total="page.blocks.length"
              />
            </template>
          </template>

          <!-- Author Block -->
          <div class="mt-8 md:mt-10 lg:mt-12">
            <div class="prose"><h2>About the author</h2></div>
            <div class="flex flex-col sm:flex-row gap-6 mt-6">
              <img
              src="https://cdn.ausbeds.com.au/3e598d9e-0716-4a54-b0e7-2ab8a0e9a72e/karl.jpg"
              alt="Karl from Ausbeds"
              class="w-32 h-32 rounded-full object-cover flex-shrink-0"
              />
              <div class="prose text-sm">
                <p>Karl is the owner of Ausbeds. He started the company after realising how many people were frustrated by mattresses that failed too soon and too often. So he built a workshop in Sydney and began making mattresses the way they should be made - with transparent materials, adjustable designs, and customer-first thinking. When he's not in the showroom/workshop, he's on Reddit, Whirlpool, and OzBargain, cutting through industry fluff with honest mattress advice.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Container>

  </article>

  <ElementArticlesRelated
  v-if="pageCat"
  :category="pageCat" 
  :exclude="excludeSlug" 
  />
    
</template>

<script setup>
const { getItems } = useDirectusItems()
const fields = useFields()
const route = useRoute()
const router = useRouter()
const contentSections = useContentSections()

const excludeSlug = computed(() => {
  return route.params?.slug
})

const { data } = await useAsyncData(
  'article-'+route.params.slug,
  () => getItems({
    collection: 'articles',
    params: {
      filter: {
        slug: {
          "_eq": route.params.slug
        }
      },
      fields
    }
  })
)

if (!data.value || !data.value.length) {
  router.push({ path: '/mattress-guide' })
}

const page = data?.value[0]

const pageCat = computed(() => {
  if (page?.categories?.length) {
    if (page?.categories[0]?.article_categories_id?.slug) {
      return page?.categories[0]?.article_categories_id?.slug
    }
  }
  return null
})

const seo = computed(() => {
  if (page?.seo) {
    return useSeo(page.seo, route.fullPath)
  }
  return {}
})

useHead(seo)

const schema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": page?.seo?.meta_title || '',
  "description": page?.seo?.meta_description || '',
  "image": page?.seo?.meta_image?.id ? useCdn(page?.seo?.meta_image.id, page?.seo?.meta_image.filename_download) : '',
  "datePublished": page?.date_created || '',
  "dateModified": page?.date_updated || '',
  "author": {
    "@type": "Person",
    "name": "Karl from Ausbeds",
    "url": "https://ausbeds.com.au/about/our-story"
  }
}

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(schema)
    }
  ]
})

const getSectionComponent = key => {
  return contentSections[key]
}
</script>