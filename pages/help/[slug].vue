<template>
  <div class="shadow-page">
    <!-- SEO Annotation: What is a Shadow Page? -->
    <SeoAnnotation
      type="strategy"
      title="This is a Details Page (SSOT)"
      forWho="Karl & Alex"
      :file="`pages/help/[slug].vue (slug: ${slug})`"
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
        <li><code>/help/delivery</code> = Details page (comprehensive SSOT, links here from marketing)</li>
      </ul>
      <p>
        <strong>SEO Strategy:</strong> This page has <code>rel="canonical"</code> pointing to the marketing page,
        telling search engines to consolidate ranking signals there. Content is noindex but accessible via links.
      </p>
      <p>
        <strong>Content Source:</strong> This content comes from Notion and refreshes every hour (ISR).
        Karl can update the Notion page and changes appear here automatically.
      </p>
    </SeoAnnotation>

    <!-- SEO Annotation: Technical Implementation -->
    <SeoAnnotation
      type="technical"
      title="How This Page Works"
      forWho="Alex (Dev)"
      :collapsed="true"
      :codeExample="`// Route: /help/${slug}
// Maps to Notion page: ${notionPageId}
// Cache: ISR 3600s (1 hour)
// Meta: noindex, follow
// Canonical: points to marketing page`"
    >
      <p>Technical flow:</p>
      <ol>
        <li>User/LLM visits <code>/help/{{ slug }}</code></li>
        <li>Nuxt checks ISR cache (valid for 1 hour)</li>
        <li>If stale, fetches fresh content from Notion API</li>
        <li>Converts Notion blocks to HTML</li>
        <li>Returns page with noindex + canonical link to marketing page</li>
      </ol>
      <p>
        <strong>File locations:</strong>
      </p>
      <ul>
        <li>This page: <code>pages/help/[slug].vue</code></li>
        <li>Notion utility: <code>server/utils/notion.js</code></li>
        <li>API route: <code>server/api/notion-knowledge/[...slug].js</code></li>
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
      <SeoAnnotation type="warning" title="Error Loading Content" forWho="Alex (Dev)">
        <p>The Notion API returned an error. Check:</p>
        <ul>
          <li>Is NOTION_API_KEY set in environment variables?</li>
          <li>Is the Notion page shared with the integration?</li>
          <li>Is the page ID correct in <code>server/utils/notion.js</code>?</li>
        </ul>
        <p>Error: {{ error.message }}</p>
      </SeoAnnotation>
    </div>

    <!-- Content -->
    <div v-else-if="data" class="shadow-page__container">
      <!-- Breadcrumb for LLM context -->
      <nav class="shadow-page__breadcrumb">
        <NuxtLink to="/">Home</NuxtLink>
        <span>/</span>
        <NuxtLink to="/help">Help Centre</NuxtLink>
        <span>/</span>
        <span>{{ data.title }}</span>
      </nav>

      <!-- SEO Annotation: Content Format -->
      <SeoAnnotation
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

      <!-- Cross-links to related shadow pages -->
      <aside class="shadow-page__related">
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

      <!-- Back to hub -->
      <footer class="shadow-page__footer">
        <NuxtLink to="/help" class="shadow-page__back">
          &larr; Back to Help Centre
        </NuxtLink>
      </footer>
    </div>
  </div>
</template>

<script setup>
/**
 * Dynamic Shadow Page
 *
 * Renders Notion content for shadow pages at /help/[slug]
 * Content is fetched from Notion API with ISR caching (1 hour)
 *
 * Available slugs:
 * - delivery -> /help/delivery
 * - trial -> /help/trial
 * - warranty -> /help/warranty
 * - adjustments -> /help/adjustments
 */

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
const notionPageId = computed(() => {
  const pageIds = {
    'delivery-details': '2c6bd057-a789-81d6-b551-f6e5bebce61b',
    'trial-details': '2c6bd057-a789-81bc-b86d-c5aeb2094098',
    'warranty-details': '2c6bd057-a789-814c-801b-d893a535c5d4',
    'adjustments-details': '2c6bd057-a789-816c-bf7c-eba63efa9823'
  }
  return pageIds[notionSlug.value] || 'unknown'
})

// Fetch content from Notion API
const { data: response, pending, error } = await useFetch(`/api/notion-knowledge/${notionSlug.value}`, {
  key: `shadow-page-${notionSlug.value}`
})

// Extract the page data from the API response
const data = computed(() => response.value?.data)

// Page titles for meta and related links
const pageTitles = {
  // Policies & Operations
  'delivery': 'Delivery Information',
  'trial': 'Sleep Trial',
  'warranty': 'Warranty',
  'adjustments': 'Firmness Adjustments',
  'payments': 'Payments',
  // Products & Sizing
  'products': 'Products Overview',
  'dimensions': 'Dimensions & Sizes',
  'half-half': 'Half-Half (Couples)',
  'recommendations': 'Mattress Recommendations',
  'bed-bases': 'Bed Bases',
  'accessories': 'Accessories',
  // Contact
  'showroom': 'Showroom & Contact'
}

// Canonical URL mapping: help page slug → marketing page URL
// This tells search engines which page is the "main" version
const canonicalUrls = {
  // Policies & Operations
  'delivery': '/delivery',
  'trial': '/trial',
  'warranty': '/warranty',
  'adjustments': '/adjustments',
  'payments': '/payments',
  // Products & Sizing
  'products': '/mattresses',
  'dimensions': '/mattresses',
  'half-half': '/half-half',
  'recommendations': '/mattresses',
  'bed-bases': '/bed-bases',
  'accessories': '/accessories',
  // Contact
  'showroom': '/contact'
}

// Get the canonical URL for this page
const canonicalUrl = computed(() => {
  const baseUrl = 'https://ausbeds.com.au'
  const path = canonicalUrls[slug.value] || `/${slug.value}`
  return `${baseUrl}${path}`
})

// All shadow pages organized by category
const allLinks = [
  // Policies & Operations
  { slug: 'delivery', title: 'Delivery Information', url: '/help/delivery', category: 'policies' },
  { slug: 'trial', title: 'Sleep Trial', url: '/help/trial', category: 'policies' },
  { slug: 'warranty', title: 'Warranty', url: '/help/warranty', category: 'policies' },
  { slug: 'adjustments', title: 'Firmness Adjustments', url: '/help/adjustments', category: 'policies' },
  { slug: 'payments', title: 'Payments', url: '/help/payments', category: 'policies' },
  // Products & Sizing
  { slug: 'products', title: 'Products Overview', url: '/help/products', category: 'products' },
  { slug: 'dimensions', title: 'Dimensions & Sizes', url: '/help/dimensions', category: 'products' },
  { slug: 'half-half', title: 'Half-Half (Couples)', url: '/help/half-half', category: 'products' },
  { slug: 'recommendations', title: 'Mattress Recommendations', url: '/help/recommendations', category: 'products' },
  { slug: 'bed-bases', title: 'Bed Bases', url: '/help/bed-bases', category: 'products' },
  { slug: 'accessories', title: 'Accessories', url: '/help/accessories', category: 'products' },
  // Contact
  { slug: 'showroom', title: 'Showroom & Contact', url: '/help/showroom', category: 'contact' }
]

// Related links: show pages from same category first, then others (max 5)
const relatedLinks = computed(() => {
  const currentSlug = slug.value
  const currentPage = allLinks.find(link => link.slug === currentSlug)
  const currentCategory = currentPage?.category || 'policies'

  // Filter out current page
  const otherPages = allLinks.filter(link => link.slug !== currentSlug)

  // Sort: same category first
  const sorted = otherPages.sort((a, b) => {
    if (a.category === currentCategory && b.category !== currentCategory) return -1
    if (b.category === currentCategory && a.category !== currentCategory) return 1
    return 0
  })

  // Return max 5 related links to avoid cluttering
  return sorted.slice(0, 5)
})

// Meta tags with canonical link
useHead({
  title: computed(() => data.value?.title ? `${data.value.title} | Ausbeds Help` : 'Loading...'),
  meta: [
    { name: 'robots', content: 'noindex, follow' },
    { name: 'description', content: computed(() => `Comprehensive information about Ausbeds ${pageTitles[slug.value] || slug.value}.`) }
  ],
  link: [
    // Canonical points to the marketing page - tells search engines this is a supplementary page
    { rel: 'canonical', href: canonicalUrl }
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
        name: data.value?.title || pageTitles[slug.value],
        description: `Comprehensive ${pageTitles[slug.value] || slug.value} information for Ausbeds customers.`,
        publisher: {
          '@type': 'Organization',
          name: 'Ausbeds',
          url: 'https://ausbeds.com.au'
        },
        dateModified: data.value?.lastEdited || new Date().toISOString()
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
