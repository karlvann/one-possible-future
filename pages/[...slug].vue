<template>
    
  <BlockHero v-if="page?.hero" :data="page?.hero" />
    
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

</template>

<script setup>
const route = useRoute()
const contentSections = useContentSections()
const { getItems } = useDirectusItems()
const fields = useFields()

const pathSegments = route.params.slug
const slug = pathSegments[pathSegments.length - 1]

const { data } = await useAsyncData(
  'page-'+slug,
  () => getItems({
    collection: 'pages',
    params: {
      filter: {
        slug: {
          _eq: slug
        }
      },
      fields
    },
  })
)

if (!data.value?.length) {
  throw createError({
    statusCode: 404,
    message: 'Page not found',
    fatal: true
  })
}

const page = data.value[0]

const seo = computed(() => {
  if (page) {
    return useSeo(page?.seo, route.fullPath)
  }
  return {}
})

useHead(seo)

const getSectionComponent = key => {
  return contentSections[key]
}

const faqs = []
if (page?.blocks && page?.blocks.length) {
  for (const section of page.blocks) {
    if (section?.collection === 'block_faqs') {
      for (const faq of section.item.faqs) {
        faqs.push(faq.faq_id)
      }
    }
  }
}

if (faqs.length) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": usePlainText(faq.a)
      }
    }))
  }

  useHead({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(faqSchema)
      }
    ]
  })
}

</script>