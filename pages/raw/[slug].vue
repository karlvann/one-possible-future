<template>
  <div class="raw-page">
    <!-- Loading State -->
    <div v-if="pending" class="raw-page__loading">
      <p>Loading...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="raw-page__error">
      <p>Error loading content.</p>
    </div>

    <!-- Content -->
    <div v-else-if="data" class="raw-page__container">
      <!-- Page Header -->
      <header class="raw-page__header">
        <h1 class="raw-page__title">{{ data.title }}</h1>
        <p v-if="data.lastEdited" class="raw-page__meta">
          Last updated: {{ formatDate(data.lastEdited) }}
        </p>
      </header>

      <!-- Notion Content -->
      <article class="raw-page__content" v-html="data.content"></article>
    </div>
  </div>
</template>

<script setup>
/**
 * Raw Content Page
 *
 * Serves clean Notion content without any chrome (header, footer, annotations).
 * Optimized for:
 * - NotebookLM
 * - AI content ingestion
 * - LLM training data
 *
 * URL: /help/[slug]/raw
 * Example: /help/delivery/raw
 */

// Use raw layout (no header/footer)
definePageMeta({
  layout: 'raw'
})

const route = useRoute()
const slug = computed(() => route.params.slug)

// Map new slugs to old Notion page keys
const slugMapping = {
  'delivery': 'delivery-details',
  'trial': 'trial-details',
  'warranty': 'warranty-details',
  'adjustments': 'adjustments-details'
}

const notionSlug = computed(() => slugMapping[slug.value] || slug.value)

// Fetch content from Notion API
const { data: response, pending, error } = await useFetch(`/api/notion-knowledge/${notionSlug.value}`, {
  key: `raw-page-${notionSlug.value}`
})

// Extract the page data from the API response
const data = computed(() => response.value?.data)

// Page titles for meta
const pageTitles = {
  'delivery': 'Delivery Information',
  'trial': 'Sleep Trial',
  'warranty': 'Warranty',
  'adjustments': 'Firmness Adjustments',
  'payments': 'Payments',
  'products': 'Products Overview',
  'dimensions': 'Dimensions & Sizes',
  'half-half': 'Half-Half (Couples)',
  'recommendations': 'Mattress Recommendations',
  'bed-bases': 'Bed Bases',
  'accessories': 'Accessories',
  'showroom': 'Showroom & Contact'
}

// Meta tags - noindex for raw pages
useHead({
  title: computed(() => data.value?.title ? `${data.value.title} | Ausbeds` : 'Loading...'),
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

// Format date for display
function formatDate(isoDate) {
  if (!isoDate) return ''
  return new Date(isoDate).toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
.raw-page {
  min-height: 100vh;
  background: #fff;
  padding: 20px;
}

.raw-page__container {
  max-width: 800px;
  margin: 0 auto;
}

.raw-page__header {
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.raw-page__title {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px;
}

.raw-page__meta {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.raw-page__content {
  color: #374151;
  line-height: 1.75;
}

.raw-page__content :deep(h1) {
  font-size: 1.75rem;
  font-weight: 700;
  color: #111827;
  margin: 32px 0 16px;
}

.raw-page__content :deep(h2) {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin: 28px 0 12px;
}

.raw-page__content :deep(h3) {
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  margin: 24px 0 8px;
}

.raw-page__content :deep(p) {
  margin: 0 0 16px;
}

.raw-page__content :deep(ul),
.raw-page__content :deep(ol) {
  margin: 0 0 16px;
  padding-left: 24px;
}

.raw-page__content :deep(li) {
  margin-bottom: 8px;
}

.raw-page__content :deep(strong) {
  font-weight: 600;
  color: #111827;
}

.raw-page__content :deep(a) {
  color: #3b82f6;
  text-decoration: none;
}

.raw-page__content :deep(a:hover) {
  text-decoration: underline;
}

.raw-page__content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
}

.raw-page__content :deep(th),
.raw-page__content :deep(td) {
  border: 1px solid #e5e7eb;
  padding: 12px;
  text-align: left;
}

.raw-page__content :deep(th) {
  background: #f3f4f6;
  font-weight: 600;
}

.raw-page__loading,
.raw-page__error {
  text-align: center;
  padding: 40px;
  color: #6b7280;
}
</style>
