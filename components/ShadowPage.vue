<template>
  <main class="shadow-page">
    <!-- Loading state -->
    <div v-if="isLoading" class="shadow-page__loading">
      <p>Loading content...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="hasError" class="shadow-page__error">
      <h1>Content Unavailable</h1>
      <p>We couldn't load this page. Please try again later.</p>
    </div>

    <!-- Content -->
    <template v-else>
      <header class="shadow-page__header">
        <h1 class="shadow-page__title">{{ title }}</h1>
        <p v-if="lastEditedFormatted" class="shadow-page__meta">
          Last updated: {{ lastEditedFormatted }}
        </p>
      </header>

      <article class="shadow-page__content" v-html="content" />

      <footer class="shadow-page__footer">
        <p>
          For more information, visit
          <NuxtLink to="/" class="shadow-page__link">ausbeds.com.au</NuxtLink>
          or contact us at
          <a href="tel:1300287233" class="shadow-page__link">1300 AUS BED</a>
        </p>
      </footer>
    </template>
  </main>
</template>

<script setup>
/**
 * Shadow Page Component
 *
 * Renders Notion content for shadow pages with noindex meta tag.
 * These pages are hidden from Google but readable by LLMs.
 *
 * Usage:
 * <ShadowPage slug="delivery-details" />
 */

const props = defineProps({
  slug: {
    type: String,
    required: true
  }
})

// Fetch shadow page content
const {
  title,
  content,
  lastEditedFormatted,
  isLoading,
  hasError
} = useShadowPage(props.slug)

// CRITICAL: Hide shadow pages from Google
// LLMs (ChatGPT, Perplexity) will still read them
useHead({
  title: () => title.value ? `${title.value} | Ausbeds` : 'Ausbeds',
  meta: [
    // noindex prevents Google from indexing this page
    // follow allows Google to still follow links on this page
    { name: 'robots', content: 'noindex, follow' },
    // Description for LLMs that may read meta tags
    { name: 'description', content: `Detailed information about ${props.slug.replace(/-/g, ' ')} from Ausbeds` }
  ]
})
</script>

<style scoped>
.shadow-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.8;
  color: #1f2937;
}

.shadow-page__loading,
.shadow-page__error {
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
}

.shadow-page__error h1 {
  color: #991b1b;
  margin-bottom: 10px;
}

.shadow-page__header {
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.shadow-page__title {
  font-size: 2.25rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 10px 0;
  line-height: 1.2;
}

.shadow-page__meta {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.shadow-page__content {
  font-size: 1.0625rem;
}

/* Content typography */
.shadow-page__content :deep(h1) {
  font-size: 2rem;
  font-weight: 700;
  margin: 2.5rem 0 1rem;
  color: #111827;
  line-height: 1.25;
}

.shadow-page__content :deep(h2) {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 2rem 0 0.75rem;
  color: #1f2937;
  line-height: 1.3;
}

.shadow-page__content :deep(h3) {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 1.5rem 0 0.5rem;
  color: #374151;
  line-height: 1.4;
}

.shadow-page__content :deep(p) {
  margin: 0 0 1rem;
  color: #374151;
}

.shadow-page__content :deep(ul),
.shadow-page__content :deep(ol) {
  margin: 0 0 1.5rem;
  padding-left: 1.5rem;
}

.shadow-page__content :deep(li) {
  margin-bottom: 0.5rem;
  color: #374151;
}

.shadow-page__content :deep(a) {
  color: #2563eb;
  text-decoration: underline;
}

.shadow-page__content :deep(a:hover) {
  color: #1d4ed8;
}

.shadow-page__content :deep(strong) {
  font-weight: 600;
  color: #1f2937;
}

.shadow-page__content :deep(blockquote) {
  margin: 1.5rem 0;
  padding: 1rem 1.5rem;
  border-left: 4px solid #e5e7eb;
  background: #f9fafb;
  font-style: italic;
  color: #4b5563;
}

.shadow-page__content :deep(hr) {
  margin: 2rem 0;
  border: none;
  border-top: 1px solid #e5e7eb;
}

.shadow-page__content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
}

.shadow-page__content :deep(th),
.shadow-page__content :deep(td) {
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  text-align: left;
}

.shadow-page__content :deep(th) {
  background: #f3f4f6;
  font-weight: 600;
  color: #1f2937;
}

.shadow-page__content :deep(pre) {
  background: #1f2937;
  color: #e5e7eb;
  padding: 1rem;
  border-radius: 6px;
  overflow-x: auto;
  margin: 1.5rem 0;
}

.shadow-page__content :deep(code) {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.875em;
}

.shadow-page__content :deep(p code) {
  background: #f3f4f6;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  color: #1f2937;
}

.shadow-page__content :deep(.callout) {
  background: #fef3c7;
  border: 1px solid #f59e0b;
  padding: 1rem;
  border-radius: 6px;
  margin: 1.5rem 0;
}

.shadow-page__footer {
  margin-top: 60px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
  font-size: 0.875rem;
  color: #6b7280;
}

.shadow-page__link {
  color: #2563eb;
  text-decoration: underline;
}

.shadow-page__link:hover {
  color: #1d4ed8;
}
</style>
