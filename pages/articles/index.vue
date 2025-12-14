<template>
  <div class="relative overflow-hidden">
    <!-- Page Header - matches mattress-guide pattern -->
    <div class="pt-8 sm:pt-16">
      <Container class="prose">
        <div class="md:grid md:grid-cols-12 lg:grid-cols-12 xl:grid-cols-12 gap-8 relative">
          <div class="md:col-start-3 md:col-span-8 lg:col-start-3 lg:col-span-8 xl:col-span-6 xl:col-start-4 relative">
            <h1>Articles</h1>
            <div class="mb-4">
              <p>Insights, guides, and tips for better sleep from the Ausbeds team.</p>
            </div>
          </div>
        </div>
      </Container>
    </div>

    <!-- Loading State -->
    <Section v-if="pending" margins="reset-top">
      <Container>
        <div class="flex items-center justify-center py-16 text-grey-medium">
          <div class="w-8 h-8 border-2 border-grey-med-light border-t-grey rounded-full animate-spin mr-3"></div>
          <span>Loading articles...</span>
        </div>
      </Container>
    </Section>

    <!-- Error State -->
    <Section v-else-if="error" margins="reset-top">
      <Container>
        <div class="text-center py-16">
          <h2 class="text-xl text-grey-dark mb-2">Unable to load articles</h2>
          <p class="text-grey-medium mb-6">{{ error.message }}</p>
          <button
            @click="refresh"
            class="px-6 py-3 bg-grey-dark text-white rounded-lg hover:bg-grey transition-colors"
          >
            Try Again
          </button>
        </div>
      </Container>
    </Section>

    <!-- Empty State -->
    <Section v-else-if="!articles?.length" margins="reset-top">
      <Container>
        <div class="text-center py-16 text-grey-medium">
          <p>No articles published yet. Check back soon!</p>
        </div>
      </Container>
    </Section>

    <!-- Articles Grid - matches mattress-guide pattern -->
    <Section v-else margins="reset-top">
      <Container>
        <FadeIn
          delay="200"
          class="mx-auto grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 mt-4 md:mt-8"
        >
          <!-- Article Card - matches ElementBlogCard pattern -->
          <article
            v-for="article in articles"
            :key="article.id"
            class="flex flex-col items-start"
          >
            <div class="relative w-full">
              <NuxtLink
                :to="`/articles/${article.slug}`"
                :aria-label="article.title"
              >
                <img
                  v-if="article.featuredImage"
                  :src="article.featuredImage"
                  :alt="article.title"
                  class="aspect-[16/10] w-full rounded-lg bg-grey-light object-cover"
                  loading="lazy"
                />
                <div
                  v-else
                  class="aspect-[16/10] w-full rounded-lg bg-grey-light flex items-center justify-center"
                >
                  <span class="text-grey-medium text-sm">Ausbeds</span>
                </div>
              </NuxtLink>
            </div>
            <div class="max-w-xl mt-2 sm:mt-4">
              <div class="group relative">
                <NuxtLink :to="`/articles/${article.slug}`">
                  <h3 class="text-md font-semibold leading-6 md:leading-6 text-grey-dark md:text-md lg:text-lg">
                    {{ article.title }}
                  </h3>
                  <div class="mt-2 flex items-center gap-x-4 text-xs">
                    <time
                      v-if="article.publishDate"
                      :datetime="article.publishDate"
                      class="text-gray-500"
                    >
                      {{ formatDate(article.publishDate) }}
                    </time>
                  </div>
                </NuxtLink>
              </div>
            </div>
          </article>
        </FadeIn>
      </Container>
    </Section>
  </div>
</template>

<script setup>
/**
 * Articles Listing Page
 *
 * Displays all published articles from the Notion database.
 * Layout matches the mattress-guide page for consistency.
 */

// Fetch articles from API
const { data: response, pending, error, refresh } = await useFetch('/api/articles', {
  key: 'articles-list'
})

// Extract articles from response
const articles = computed(() => response.value?.data || [])

// Format date for display - matches useFormattedDate pattern
function formatDate(dateString) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// SEO
const route = useRoute()
const seo = computed(() => {
  return useSeo({
    meta_title: 'Articles - Ausbeds | Sleep Tips & Mattress Guides',
    meta_description: 'Read our latest articles about sleep, mattresses, and bedroom tips from Ausbeds Sydney.',
    meta_image: null
  }, route.fullPath)
})

useHead(seo)
</script>
