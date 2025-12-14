<template>
  <div class="relative overflow-hidden">
    <!-- Loading State -->
    <Section v-if="pending" margins="lg">
      <Container>
        <div class="flex items-center justify-center py-24 text-grey-medium">
          <div class="w-8 h-8 border-2 border-grey-med-light border-t-grey rounded-full animate-spin mr-3"></div>
          <span>Loading guide...</span>
        </div>
      </Container>
    </Section>

    <!-- Error State -->
    <Section v-else-if="error || !article" margins="lg">
      <Container>
        <div class="max-w-xl mx-auto text-center py-24">
          <h1 class="text-2xl font-bold text-grey-dark mb-3">Guide not found</h1>
          <p class="text-grey-medium mb-8">
            The guide you're looking for doesn't exist or has been removed.
          </p>
          <NuxtLink
            to="/guides"
            class="inline-block px-6 py-3 bg-grey-dark text-white rounded-lg hover:bg-grey transition-colors"
          >
            &larr; Back to Guides
          </NuxtLink>
        </div>
      </Container>
    </Section>

    <!-- Article Content - matches mattress-guide/guides pattern -->
    <article v-else>
      <!-- Hero Section - matches ElementHeroBlog pattern -->
      <div class="pt-8 sm:pt-16">
        <Container class="prose">
          <div class="md:grid md:grid-cols-12 lg:grid-cols-12 xl:grid-cols-12 gap-8 relative">
            <div class="md:col-start-3 md:col-span-8 lg:col-start-3 lg:col-span-8 xl:col-span-6 xl:col-start-4 relative">
              <!-- Date -->
              <time
                v-if="article.publishDate"
                :datetime="article.publishDate"
                class="text-grey-medium mb-2 block"
              >
                {{ formatDate(article.publishDate) }}
              </time>

              <!-- Title -->
              <h1>{{ article.title }}</h1>

              <!-- Description/Subtitle -->
              <div v-if="article.metaDescription" class="blog-subtitle mb-4">
                <p>{{ article.metaDescription }}</p>
              </div>

              <!-- Featured Image -->
              <img
                v-if="article.featuredImage"
                :src="article.featuredImage"
                :alt="article.title"
                class="w-full rounded-lg"
                loading="eager"
              />
            </div>
          </div>
        </Container>
      </div>

      <!-- Article Body - matches guides/[slug] pattern -->
      <Section margins="reset-top">
        <Container class="prose">
          <div class="md:grid md:grid-cols-12 lg:grid-cols-12 xl:grid-cols-12 gap-8 relative">
            <div class="md:col-start-3 md:col-span-8 lg:col-start-3 lg:col-span-8 xl:col-span-6 xl:col-start-4 relative">
              <div class="article-content" v-html="sanitizedContent"></div>
            </div>
          </div>
        </Container>
      </Section>

      <!-- Footer -->
      <Section margins="lg">
        <Container>
          <div class="md:grid md:grid-cols-12 lg:grid-cols-12 xl:grid-cols-12 gap-8 relative">
            <div class="md:col-start-3 md:col-span-8 lg:col-start-3 lg:col-span-8 xl:col-span-6 xl:col-start-4 relative pt-8 border-t border-grey-med-light">
              <NuxtLink
                to="/guides"
                class="inline-flex items-center gap-2 text-grey-medium hover:text-grey-dark transition-colors"
              >
                <span>&larr;</span>
                <span>Back to Guides</span>
              </NuxtLink>
            </div>
          </div>
        </Container>
      </Section>
    </article>
  </div>
</template>

<script setup>
/**
 * Single Article Page
 *
 * Displays a single article with clean, centered typography
 * optimized for reading. Content is fetched from Notion.
 */

const route = useRoute()
const slug = computed(() => route.params.slug)

// Fetch article from API
const { data: response, pending, error } = await useFetch(
  () => `/api/notion-blog/${slug.value}`,
  {
    key: `article-${slug.value}`
  }
)

// Extract article from response
const article = computed(() => response.value?.data)

// Sanitize article content
const sanitizedContent = computed(() => {
  if (!article.value?.content) return ''
  return useSanitize(article.value.content)
})

// SEO Meta
useSeoMeta({
  title: () => article.value?.metaTitle
    ? `${article.value.metaTitle} | Ausbeds`
    : article.value?.title
      ? `${article.value.title} | Ausbeds`
      : 'Guide | Ausbeds',
  description: () => article.value?.metaDescription || '',
  ogTitle: () => article.value?.metaTitle || article.value?.title || 'Guide',
  ogDescription: () => article.value?.metaDescription || '',
  ogType: 'article',
  ogImage: () => article.value?.featuredImage || '',
  articlePublishedTime: () => article.value?.publishDate || '',
  articleModifiedTime: () => article.value?.lastEditedTime || ''
})

// Format date for display
function formatDate(dateString) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Structured data
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: computed(() => {
        if (!article.value) return '{}'
        return JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: article.value.title,
          description: article.value.metaDescription || '',
          image: article.value.featuredImage || '',
          datePublished: article.value.publishDate || '',
          dateModified: article.value.lastEditedTime || article.value.publishDate || '',
          author: {
            '@type': 'Organization',
            name: 'Ausbeds'
          },
          publisher: {
            '@type': 'Organization',
            name: 'Ausbeds',
            url: 'https://ausbeds.com.au'
          }
        })
      })
    }
  ]
})
</script>

<style scoped>
/* Article content - inherits from prose class, with Notion-specific overrides */
.article-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 1.5rem 0;
}

/* Callout boxes from Notion */
.article-content :deep(.callout) {
  background: #f7f7f7;
  border-left: 3px solid #787878;
  padding: 1rem 1.25rem;
  margin: 1.5rem 0;
  border-radius: 0 0.5rem 0.5rem 0;
}

/* Blog subtitle matches ElementHeroBlog */
.blog-subtitle :deep(p) {
  margin-bottom: 0;
}
</style>
