<template>
  <div class="shadow-page">
    <!-- SEO Annotation: What is a Shadow Page? (hidden in raw mode) -->
    <SeoAnnotation
      v-if="!isRaw"
      type="strategy"
      title="This is a Details Page (SSOT)"
      forWho="Karl & Alex"
      :file="`pages/faq/[slug].vue (slug: ${slug})`"
    >
      <p>
        <strong>What:</strong> Details pages are the Single Source of Truth (SSOT) for comprehensive
        information. They serve multiple purposes: AI chatbots (ChatGPT, Perplexity, Intercom Fin),
        Google NotebookLM, and customers who want full details.
      </p>
      <p>
        <strong>Marketing Page vs Details Page:</strong>
      </p>
      <ul>
        <li><code>/delivery</code> = Marketing page (focused, benefit-driven, canonical)</li>
        <li><code>/faq/delivery</code> = FAQ page (comprehensive SSOT, links here from marketing)</li>
      </ul>
      <p>
        <strong>SEO Strategy:</strong> FAQ pages are indexed by search engines with FAQPage schema markup.
        This allows Google to display rich snippets and drives organic traffic to comprehensive answers.
      </p>
      <p>
        <strong>Content Source:</strong> This content comes from Notion and refreshes every hour (ISR).
        Karl can update the Notion page and changes appear here automatically.
      </p>
    </SeoAnnotation>

    <!-- SEO Annotation: Technical Implementation (hidden in raw mode) -->
    <SeoAnnotation
      v-if="!isRaw"
      type="technical"
      title="How This Page Works"
      forWho="Alex (Dev)"
      :collapsed="true"
      :codeExample="`// Route: /faq/${slug}
// Source: FAQ Database (slug lookup)
// Cache: ISR 3600s (1 hour)
// Meta: index, follow (indexed for SEO)`"
    >
      <p>Technical flow:</p>
      <ol>
        <li>User/LLM visits <code>/faq/{{ slug }}</code></li>
        <li>Nuxt checks ISR cache (valid for 1 hour)</li>
        <li>If stale, fetches fresh content from Notion API</li>
        <li>Converts Notion blocks to HTML</li>
        <li>Returns indexed page with FAQPage schema markup</li>
      </ol>
      <p>
        <strong>File locations:</strong>
      </p>
      <ul>
        <li>This page: <code>pages/faq/[slug].vue</code></li>
        <li>FAQ utility: <code>server/utils/notionFaq.js</code></li>
        <li>API route: <code>server/api/notion-faq/[slug].js</code></li>
        <li>Route rules: <code>nuxt.config.js</code> (line ~296)</li>
      </ul>
    </SeoAnnotation>

    <!-- Loading State -->
    <div v-if="pending" class="shadow-page__loading">
      <div class="shadow-page__spinner"></div>
      <p>Loading content from Notion...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="shadow-page__error">
      <SeoAnnotation v-if="!isRaw" type="warning" title="Error Loading Content" forWho="Alex (Dev)">
        <p>The Notion API returned an error. Check:</p>
        <ul>
          <li>Is NOTION_API_KEY set in environment variables?</li>
          <li>Is the Notion page shared with the integration?</li>
          <li>Is the page ID correct in <code>server/utils/notion.js</code>?</li>
        </ul>
        <p>Error: {{ error.message }}</p>
      </SeoAnnotation>
      <p v-else>Error loading content.</p>
    </div>

    <!-- Content -->
    <div v-else-if="data" class="shadow-page__container">
      <!-- Breadcrumb for LLM context (hidden in raw mode) -->
      <nav v-if="!isRaw" class="shadow-page__breadcrumb">
        <NuxtLink to="/">Home</NuxtLink>
        <span>/</span>
        <NuxtLink to="/faq">FAQ</NuxtLink>
        <span>/</span>
        <span>{{ data.title }}</span>
      </nav>

      <!-- SEO Annotation: Content Format (hidden in raw mode) -->
      <SeoAnnotation
        v-if="!isRaw"
        type="llm"
        title="Fin-Optimized Q&A Format"
        forWho="Karl"
        :collapsed="true"
      >
        <p>
          The content below uses a Q&A format specifically designed for Intercom's Fin chatbot.
          Each section answers common customer questions in a way that Fin can easily parse and repeat.
        </p>
        <p>
          <strong>Example:</strong> When a customer asks Fin "How long does delivery take?",
          Fin searches this page, finds the "Delivery Timeframes" section, and gives an accurate answer.
        </p>
      </SeoAnnotation>

      <!-- Page Header -->
      <header class="shadow-page__header">
        <h1 class="shadow-page__title">{{ data.title }}</h1>
        <p v-if="data.lastEdited" class="shadow-page__meta">
          Last updated: {{ formatDate(data.lastEdited) }}
        </p>
      </header>

      <!-- Notion Content -->
      <article class="shadow-page__content" v-html="data.content"></article>

      <!-- Cross-links to related shadow pages (hidden in raw mode) -->
      <aside v-if="!isRaw" class="shadow-page__related">
        <SeoAnnotation
          type="info"
          title="Internal Linking for LLM Discovery"
          forWho="Karl"
          :collapsed="true"
        >
          <p>
            These links help LLMs discover other shadow pages. When ChatGPT crawls this page,
            it follows these links and indexes all our detailed content.
          </p>
        </SeoAnnotation>

        <h2 class="shadow-page__related-title">Related Information</h2>
        <div class="shadow-page__related-links">
          <NuxtLink
            v-for="link in relatedLinks"
            :key="link.slug"
            :to="link.url"
            class="shadow-page__related-link"
          >
            {{ link.title }}
          </NuxtLink>
        </div>
      </aside>

      <!-- Back to hub (hidden in raw mode) -->
      <footer v-if="!isRaw" class="shadow-page__footer">
        <NuxtLink to="/faq" class="shadow-page__back">
          &larr; Back to FAQ
        </NuxtLink>
      </footer>
    </div>
  </div>
</template>

<script setup>
/**
 * Dynamic FAQ Page
 *
 * Renders Notion content for FAQ pages at /faq/[slug]
 * Content is fetched from Notion API with ISR caching (1 hour)
 *
 * Available slugs:
 * - delivery -> /faq/delivery
 * - trial -> /faq/trial
 * - warranty -> /faq/warranty
 * - adjustments -> /faq/adjustments
 *
 * Raw mode: Add ?raw=true to get clean content without header/footer/annotations
 * Useful for NotebookLM, AI tools, or any system that just needs the content
 */

const route = useRoute()
const slug = computed(() => route.params.slug)

// Raw mode: strips header, footer, and all annotations for clean LLM ingestion
// Using useRequestURL for reliable SSR-compatible detection (Vercel compatible)
const requestURL = useRequestURL()
const isRaw = computed(() => {
  return requestURL.searchParams.get('raw') === 'true'
})

// Fetch content from FAQ database API
const { data: response, pending, error } = await useFetch(`/api/notion-faq/${slug.value}`, {
  key: `faq-page-${slug.value}`
})

// Fetch all FAQ articles for related links
const { data: allFaqResponse } = await useFetch('/api/notion-faq', {
  key: 'all-faq-articles'
})

// Extract the page data from the API response
const data = computed(() => response.value?.data)

// Get the canonical URL from database or fall back to default
const canonicalUrl = computed(() => {
  const baseUrl = 'https://ausbeds.com.au'
  const path = data.value?.canonicalUrl || `/${slug.value}`
  return `${baseUrl}${path}`
})

// All FAQ articles from database
const allFaqArticles = computed(() => allFaqResponse.value?.data || [])

// Related links: show pages from same category first, then others (max 5)
const relatedLinks = computed(() => {
  const currentSlug = slug.value
  const currentCategory = data.value?.category

  // Filter out current page
  const otherPages = allFaqArticles.value.filter(article => article.slug !== currentSlug)

  // Sort: same category first
  const sorted = [...otherPages].sort((a, b) => {
    if (a.category === currentCategory && b.category !== currentCategory) return -1
    if (b.category === currentCategory && a.category !== currentCategory) return 1
    // Then by order
    return (a.order || 0) - (b.order || 0)
  })

  // Return max 5 related links with url added
  return sorted.slice(0, 5).map(article => ({
    slug: article.slug,
    title: article.title,
    url: `/faq/${article.slug}`,
    category: article.category
  }))
})

// Meta tags - FAQ pages are now indexed
useHead({
  title: computed(() => data.value?.title ? `${data.value.title} | Ausbeds FAQ` : 'Loading...'),
  meta: [
    { name: 'robots', content: 'index, follow' },
    { name: 'description', content: computed(() => data.value?.metaDescription || `Comprehensive information about ${data.value?.title || slug.value}.`) }
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

// Structured data
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: computed(() => JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        name: data.value?.title,
        description: data.value?.metaDescription || `Comprehensive ${data.value?.title || slug.value} information for Ausbeds customers.`,
        publisher: {
          '@type': 'Organization',
          name: 'Ausbeds',
          url: 'https://ausbeds.com.au'
        },
        dateModified: data.value?.lastEditedTime || new Date().toISOString()
      }))
    }
  ]
})
</script>

<style scoped>
.shadow-page {
  min-height: 100vh;
  background: #f9fafb;
}

.shadow-page__container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

.shadow-page__breadcrumb {
  display: flex;
  gap: 8px;
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 24px;
}

.shadow-page__breadcrumb a {
  color: #3b82f6;
  text-decoration: none;
}

.shadow-page__breadcrumb a:hover {
  text-decoration: underline;
}

.shadow-page__header {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.shadow-page__title {
  font-size: 2.25rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px;
}

.shadow-page__meta {
  font-size: 0.875rem;
  color: #9ca3af;
  margin: 0;
}

/* Notion content styling */
.shadow-page__content {
  color: #374151;
  line-height: 1.75;
}

.shadow-page__content :deep(h1) {
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  margin: 40px 0 16px;
}

.shadow-page__content :deep(h2) {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin: 32px 0 12px;
}

.shadow-page__content :deep(h3) {
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  margin: 24px 0 8px;
}

.shadow-page__content :deep(p) {
  margin: 0 0 16px;
}

.shadow-page__content :deep(ul),
.shadow-page__content :deep(ol) {
  margin: 0 0 16px;
  padding-left: 24px;
}

.shadow-page__content :deep(li) {
  margin-bottom: 8px;
}

.shadow-page__content :deep(strong) {
  font-weight: 600;
  color: #111827;
}

.shadow-page__content :deep(a) {
  color: #3b82f6;
  text-decoration: none;
}

.shadow-page__content :deep(a:hover) {
  text-decoration: underline;
}

.shadow-page__content :deep(blockquote) {
  border-left: 4px solid #3b82f6;
  padding-left: 16px;
  margin: 16px 0;
  color: #4b5563;
  font-style: italic;
}

.shadow-page__content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
}

.shadow-page__content :deep(th),
.shadow-page__content :deep(td) {
  border: 1px solid #e5e7eb;
  padding: 12px;
  text-align: left;
}

.shadow-page__content :deep(th) {
  background: #f3f4f6;
  font-weight: 600;
}

.shadow-page__content :deep(hr) {
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 32px 0;
}

.shadow-page__content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 16px 0;
}

.shadow-page__content :deep(figure) {
  margin: 24px 0;
}

.shadow-page__content :deep(figcaption) {
  font-size: 0.875rem;
  color: #6b7280;
  text-align: center;
  margin-top: 8px;
}

/* YouTube video embeds (lite-youtube-embed) */
.shadow-page__content :deep(.video-container) {
  margin: 24px 0;
}

.shadow-page__content :deep(lite-youtube) {
  border-radius: 8px;
  overflow: hidden;
  max-width: 100%;
}

.shadow-page__content :deep(.video-caption) {
  font-size: 0.875rem;
  color: #6b7280;
  text-align: center;
  margin-top: 8px;
}

/* Related links */
.shadow-page__related {
  margin-top: 48px;
  padding-top: 32px;
  border-top: 1px solid #e5e7eb;
}

.shadow-page__related-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 16px;
}

.shadow-page__related-links {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.shadow-page__related-link {
  padding: 10px 16px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #374151;
  text-decoration: none;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.shadow-page__related-link:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

/* Footer */
.shadow-page__footer {
  margin-top: 40px;
}

.shadow-page__back {
  color: #3b82f6;
  text-decoration: none;
  font-size: 0.875rem;
}

.shadow-page__back:hover {
  text-decoration: underline;
}

/* Loading state */
.shadow-page__loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: #6b7280;
}

.shadow-page__spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Error state */
.shadow-page__error {
  max-width: 600px;
  margin: 40px auto;
  padding: 0 20px;
}

@media (max-width: 640px) {
  .shadow-page__title {
    font-size: 1.75rem;
  }

  .shadow-page__container {
    padding: 24px 16px;
  }
}
</style>
