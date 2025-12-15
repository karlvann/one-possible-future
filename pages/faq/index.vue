<template>
  <div class="help-hub">
    <!-- SEO Annotation: Explaining what this page is -->
    <SeoAnnotation
      type="strategy"
      title="This is a Hub Page for LLM Chatbots"
      forWho="Karl & Alex"
      file="pages/faq/index.vue"
    >
      <p>
        <strong>What:</strong> This page acts as a central hub linking to all detailed "shadow pages"
        containing comprehensive information about Ausbeds operations.
      </p>
      <p>
        <strong>Why:</strong> LLM chatbots (ChatGPT, Perplexity, Claude, Intercom's Fin) follow links
        to discover content. By creating a hub page with clear links, we make it easy for them to
        find and index all our detailed content.
      </p>
      <p>
        <strong>Strategy:</strong> Marketing pages stay clean and pretty for humans. Shadow pages
        have comprehensive Q&A content for chatbots. This hub connects them all.
      </p>
    </SeoAnnotation>

    <!-- SEO Annotation: Technical details -->
    <SeoAnnotation
      type="technical"
      title="index, follow Meta Tag"
      forWho="Alex (Dev)"
      :codeExample="`<meta name='robots' content='index, follow'>`"
      :collapsed="true"
    >
      <p>
        This page has <code>index, follow</code> which means:
      </p>
      <ul>
        <li><strong>index</strong> - Google will show this page in search results</li>
        <li><strong>follow</strong> - Google will follow links on this page</li>
      </ul>
      <p>
        <strong>SEO benefit:</strong> FAQ pages with FAQPage schema can earn rich snippets in Google search results.
      </p>
    </SeoAnnotation>

    <!-- Actual Page Content -->
    <div class="help-hub__container">
      <!-- Breadcrumb -->
      <nav class="help-hub__breadcrumb">
        <NuxtLink to="/">Home</NuxtLink>
        <span>/</span>
        <span>FAQ</span>
      </nav>

      <header class="help-hub__header">
        <h1 class="help-hub__title">Ausbeds FAQ</h1>
        <p class="help-hub__subtitle">
          Comprehensive information about our policies, products, sizing, and showrooms.
        </p>
      </header>

      <!-- SEO Annotation: Link structure -->
      <SeoAnnotation
        type="llm"
        title="These Links are for LLM Discovery"
        forWho="Karl"
        :collapsed="true"
      >
        <p>
          Each link below goes to a "shadow page" with detailed Q&A content sourced from Notion.
        </p>
        <p>
          When someone asks ChatGPT or Perplexity "What is Ausbeds' delivery policy?",
          the chatbot can crawl these pages and give accurate, detailed answers.
        </p>
        <p>
          <strong>Content Source:</strong> All content comes from Notion, so Karl can update
          policies in Notion and they automatically appear here within 1 hour (ISR cache).
        </p>
      </SeoAnnotation>

      <nav class="help-hub__nav">
        <!-- SECTION: Policies & Operations -->
        <div class="help-hub__section">
          <h2 class="help-hub__section-title">Policies & Operations</h2>

          <div class="help-hub__links">
            <NuxtLink to="/faq/delivery" class="help-hub__link">
              <span class="help-hub__link-icon">🚚</span>
              <div class="help-hub__link-content">
                <h3>Delivery Information</h3>
                <p>Delivery areas, timeframes, fees, and what to expect on delivery day.</p>
              </div>
            </NuxtLink>

            <NuxtLink to="/faq/trial" class="help-hub__link">
              <span class="help-hub__link-icon">🛏️</span>
              <div class="help-hub__link-content">
                <h3>Sleep Trial</h3>
                <p>100-night trial details, how it works, and return process.</p>
              </div>
            </NuxtLink>

            <NuxtLink to="/faq/warranty" class="help-hub__link">
              <span class="help-hub__link-icon">🛡️</span>
              <div class="help-hub__link-content">
                <h3>Warranty</h3>
                <p>15-year warranty coverage, what's included, and how to make a claim.</p>
              </div>
            </NuxtLink>

            <NuxtLink to="/faq/adjustments" class="help-hub__link">
              <span class="help-hub__link-icon">⚙️</span>
              <div class="help-hub__link-content">
                <h3>Firmness Adjustments</h3>
                <p>Free comfort adjustments, how to request changes, and processing times.</p>
              </div>
            </NuxtLink>

            <NuxtLink to="/faq/payments" class="help-hub__link">
              <span class="help-hub__link-icon">💳</span>
              <div class="help-hub__link-content">
                <h3>Payments</h3>
                <p>Payment methods, buy now pay later options, and financing information.</p>
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- SECTION: Products & Sizing -->
        <div class="help-hub__section">
          <h2 class="help-hub__section-title">Products & Sizing</h2>

          <div class="help-hub__links">
            <NuxtLink to="/faq/products" class="help-hub__link">
              <span class="help-hub__link-icon">🛒</span>
              <div class="help-hub__link-content">
                <h3>Products Overview</h3>
                <p>Complete guide to our mattress range, features, and what makes each model unique.</p>
              </div>
            </NuxtLink>

            <NuxtLink to="/faq/dimensions" class="help-hub__link">
              <span class="help-hub__link-icon">📐</span>
              <div class="help-hub__link-content">
                <h3>Dimensions & Sizes</h3>
                <p>Mattress dimensions for all sizes from Single to Super King.</p>
              </div>
            </NuxtLink>

            <NuxtLink to="/faq/half-half" class="help-hub__link">
              <span class="help-hub__link-icon">👫</span>
              <div class="help-hub__link-content">
                <h3>Half-Half (Couples)</h3>
                <p>Split firmness options for couples who prefer different comfort levels.</p>
              </div>
            </NuxtLink>

            <NuxtLink to="/faq/recommendations" class="help-hub__link">
              <span class="help-hub__link-icon">💡</span>
              <div class="help-hub__link-content">
                <h3>Mattress Recommendations</h3>
                <p>Help choosing the right mattress based on sleep position, body type, and preferences.</p>
              </div>
            </NuxtLink>

            <NuxtLink to="/faq/bed-bases" class="help-hub__link">
              <span class="help-hub__link-icon">🛏️</span>
              <div class="help-hub__link-content">
                <h3>Bed Bases</h3>
                <p>Compatible bed bases, adjustable bases, and foundation requirements.</p>
              </div>
            </NuxtLink>

            <NuxtLink to="/faq/accessories" class="help-hub__link">
              <span class="help-hub__link-icon">🎁</span>
              <div class="help-hub__link-content">
                <h3>Accessories</h3>
                <p>Pillows, protectors, sheets, and other sleep accessories.</p>
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- SECTION: Contact & Showroom -->
        <div class="help-hub__section">
          <h2 class="help-hub__section-title">Contact & Showroom</h2>

          <div class="help-hub__links">
            <NuxtLink to="/faq/showroom" class="help-hub__link">
              <span class="help-hub__link-icon">📍</span>
              <div class="help-hub__link-content">
                <h3>Showroom & Contact</h3>
                <p>Visit our Sydney showrooms in Marrickville and Willoughby. Hours, directions, and booking.</p>
              </div>
            </NuxtLink>
          </div>
        </div>
      </nav>

      <!-- SEO Annotation: Schema markup -->
      <SeoAnnotation
        type="technical"
        title="Structured Data for LLMs"
        forWho="Alex (Dev)"
        :collapsed="true"
      >
        <p>
          This page includes schema.org WebPage and BreadcrumbList structured data.
          This helps LLMs understand the page hierarchy and content relationships.
        </p>
        <p>
          FAQ pages are indexed and can earn rich snippets in Google search results
          with proper FAQPage schema markup.
        </p>
      </SeoAnnotation>

      <!-- ============================================ -->
      <!-- DEVELOPER IMPLEMENTATION GUIDE              -->
      <!-- For Alex to replicate on the live site      -->
      <!-- ============================================ -->
      <section class="dev-guide">
        <button
          class="dev-guide__toggle"
          @click="showDevGuide = !showDevGuide"
        >
          <span class="dev-guide__toggle-icon">🛠️</span>
          <span class="dev-guide__toggle-title">Developer Implementation Guide</span>
          <span class="dev-guide__toggle-subtitle">How to replicate this Notion integration</span>
          <span class="dev-guide__toggle-chevron">{{ showDevGuide ? '▲' : '▼' }}</span>
        </button>

        <div v-show="showDevGuide" class="dev-guide__content">
          <!-- Overview -->
          <div class="dev-guide__section">
            <h3>Overview: How Notion Content Gets to the Page</h3>
            <div class="dev-guide__flow">
              <div class="dev-guide__flow-step">
                <span class="dev-guide__flow-num">1</span>
                <span class="dev-guide__flow-label">Notion Page</span>
                <span class="dev-guide__flow-desc">Karl writes content</span>
              </div>
              <span class="dev-guide__flow-arrow">→</span>
              <div class="dev-guide__flow-step">
                <span class="dev-guide__flow-num">2</span>
                <span class="dev-guide__flow-label">API Route</span>
                <span class="dev-guide__flow-desc">Fetches from Notion</span>
              </div>
              <span class="dev-guide__flow-arrow">→</span>
              <div class="dev-guide__flow-step">
                <span class="dev-guide__flow-num">3</span>
                <span class="dev-guide__flow-label">Notion Utility</span>
                <span class="dev-guide__flow-desc">Converts to HTML</span>
              </div>
              <span class="dev-guide__flow-arrow">→</span>
              <div class="dev-guide__flow-step">
                <span class="dev-guide__flow-num">4</span>
                <span class="dev-guide__flow-label">Vue Page</span>
                <span class="dev-guide__flow-desc">Renders content</span>
              </div>
            </div>
          </div>

          <!-- File Structure -->
          <div class="dev-guide__section">
            <h3>File Structure</h3>
            <pre class="dev-guide__code"><code>ausbeds-website/
├── server/
│   ├── api/
│   │   └── notion/
│   │       └── [...slug].js      ← API endpoint
│   └── utils/
│       └── notion.js             ← Notion client + HTML converter
├── pages/
│   └── faq/
│       ├── index.vue             ← This hub page
│       └── [slug].vue            ← Dynamic FAQ pages
├── components/
│   └── SeoAnnotation.vue         ← These explanation boxes
└── nuxt.config.js                ← Route rules (ISR, noindex)</code></pre>
          </div>

          <!-- Step 1: Environment -->
          <div class="dev-guide__section">
            <h3>Step 1: Environment Setup</h3>
            <p>Create a <code>.env</code> file in the project root. Copy this entire block:</p>
            <pre class="dev-guide__code"><code># ==============================================
# AUSBEDS WEBSITE - ENVIRONMENT VARIABLES
# ==============================================

# ==============================================
# NOTION API (Shadow Pages System)
# ==============================================
# Get your API key from: https://www.notion.so/my-integrations
# Make sure to share the relevant Notion pages with your integration
NOTION_API_KEY=your_notion_api_key_here

# ==============================================
# VERCEL / BUILD
# ==============================================
VERCEL_ENV=development
ENVIRONMENT=development

# ==============================================
# DIRECTUS CMS
# ==============================================
DIRECTUS_URL=https://content.ausbeds.com.au
DIRECTUS_TOKEN=

# ==============================================
# PAYMENT PROVIDERS
# ==============================================
STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
PAYPAL_CLIENT_ID=
PAYPAL_SECRET_KEY=
ZIP_PUBLIC_KEY=
ZIP_PRIVATE_KEY=
ZIP_API_URL=

# ==============================================
# GOOGLE
# ==============================================
GOOGLE_MAPS_API_KEY=

# ==============================================
# SENTRY
# ==============================================
SENTRY_DSN_PUBLIC=
SENTRY_ORG=
SENTRY_PROJECT=
SENTRY_AUTH_TOKEN=

# ==============================================
# EMAIL (MAILJET)
# ==============================================
MAILJET_API_KEY=
MAILJET_API_SECRET=

# ==============================================
# DELIVERY ROUTES (Polylines)
# ==============================================
SYDNEY_TO_BRISBANE_POLYLINE=
SYDNEY_TO_MELBOURNE_POLYLINE=
SYDNEY_TO_CANBERRA_POLYLINE=

# ==============================================
# DEVELOPMENT
# ==============================================
NGROK_WEBHOOK_HOST=localhost</code></pre>
            <p class="dev-guide__note">
              <strong>Note:</strong> The NOTION_API_KEY above is the actual key. For production, you may want to create a separate integration.
              <br><br>
              <strong>To get a new key:</strong> Notion Settings → Integrations → Create integration → Copy "Internal Integration Secret"
            </p>
          </div>

          <!-- Step 2: Install Package -->
          <div class="dev-guide__section">
            <h3>Step 2: Install Notion SDK</h3>
            <pre class="dev-guide__code"><code>yarn add @notionhq/client</code></pre>
          </div>

          <!-- Step 3: Notion Utility -->
          <div class="dev-guide__section">
            <h3>Step 3: Create Notion Utility</h3>
            <p>File: <code>server/utils/notion.js</code></p>
            <pre class="dev-guide__code"><code>import { Client } from '@notionhq/client'

// Lazy-load the client
let notionClient = null
function getNotionClient() {
  if (!notionClient) {
    notionClient = new Client({
      auth: process.env.NOTION_API_KEY
    })
  }
  return notionClient
}

// Map slugs to Notion page IDs
export const notionPages = {
  'delivery': '2c6bd057-a789-81d6-xxxx-xxxxxxxxxxxx',
  'trial': '2c6bd057-a789-81bc-xxxx-xxxxxxxxxxxx',
  // Add more pages here...
}

// Main export: fetch page and convert to HTML
export async function getNotionPage(slug) {
  const pageId = notionPages[slug]
  if (!pageId) return null

  const blocks = await fetchAllBlocks(pageId)
  return {
    slug,
    content: blocksToHtml(blocks)
  }
}</code></pre>
            <p class="dev-guide__note">
              <strong>Full file:</strong> <code>server/utils/notion.js</code> (~380 lines) handles all block types, pagination, and HTML conversion.
            </p>
          </div>

          <!-- Step 4: API Route -->
          <div class="dev-guide__section">
            <h3>Step 4: Create API Route</h3>
            <p>File: <code>server/api/notion-knowledge/[...slug].js</code></p>
            <pre class="dev-guide__code"><code>import { getNotionPage, isValidShadowPage } from '../../utils/notion'

export default defineEventHandler(async (event) => {
  const slugParts = event.context.params?.slug
  const slug = Array.isArray(slugParts) ? slugParts.join('/') : slugParts

  if (!isValidShadowPage(slug)) {
    throw createError({ statusCode: 404 })
  }

  const pageData = await getNotionPage(slug)

  // Cache for 1 hour (ISR)
  setResponseHeaders(event, {
    'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
  })

  return { success: true, data: pageData }
})</code></pre>
          </div>

          <!-- Step 5: Route Rules -->
          <div class="dev-guide__section">
            <h3>Step 5: Configure Route Rules</h3>
            <p>File: <code>nuxt.config.js</code></p>
            <pre class="dev-guide__code"><code>export default defineNuxtConfig({
  routeRules: {
    // FAQ hub page
    '/faq': {
      isr: 3600,        // Revalidate every hour
      prerender: false  // Don't pre-render (content is dynamic)
    },
    // All FAQ pages
    '/faq/**': {
      isr: 3600,
      prerender: false
    },
    // API route caching
    '/api/notion-knowledge/**': {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
      }
    }
  }
})</code></pre>
          </div>

          <!-- Step 6: Vue Page -->
          <div class="dev-guide__section">
            <h3>Step 6: Create Dynamic Page</h3>
            <p>File: <code>pages/faq/[slug].vue</code></p>
            <pre class="dev-guide__code"><code>&lt;template&gt;
  &lt;div v-if="data" v-html="data.content"&gt;&lt;/div&gt;
&lt;/template&gt;

&lt;script setup&gt;
const route = useRoute()
const slug = route.params.slug

// Fetch from API
const { data: response } = await useFetch(`/api/notion-knowledge/${slug}`)
const data = computed(() => response.value?.data)

// Canonical URL - points to the marketing page
const canonicalUrl = `https://ausbeds.com.au/${slug}`

// Meta tags - indexed for SEO
useHead({
  meta: [{ name: 'robots', content: 'index, follow' }]
})
&lt;/script&gt;</code></pre>
          </div>

          <!-- Step 7: Canonical URL Mapping -->
          <div class="dev-guide__section">
            <h3>Step 7: Configure Canonical URL Mapping</h3>
            <p>
              Each details page needs a <code>rel="canonical"</code> link pointing to its corresponding marketing page.
              This tells search engines to consolidate ranking signals to the marketing page.
            </p>
            <p>File: <code>pages/faq/[slug].vue</code> - Add the mapping object:</p>
            <pre class="dev-guide__code"><code>// Canonical URL mapping: faq slug → marketing page URL
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

// Generate canonical URL
const canonicalUrl = computed(() => {
  const baseUrl = 'https://ausbeds.com.au'
  const path = canonicalUrls[slug.value] || `/${slug.value}`
  return `${baseUrl}${path}`
})</code></pre>
            <p class="dev-guide__note">
              <strong>Why canonical?</strong> These details pages serve as SSOT (Single Source of Truth) for AI apps
              and customers who want comprehensive info. The canonical tells Google: "This is supplementary content -
              the main page is the marketing page." Signals get consolidated, no duplicate content issues.
            </p>
          </div>

          <!-- How to Add New Page -->
          <div class="dev-guide__section dev-guide__section--highlight">
            <h3>✅ Checklist: Adding a New FAQ Page</h3>
            <ol class="dev-guide__checklist">
              <li>
                <strong>Create Notion page</strong> - Write content in Notion
              </li>
              <li>
                <strong>Share with integration</strong> - Click "Share" → Add your integration
              </li>
              <li>
                <strong>Copy page ID</strong> - From URL: <code>notion.so/Page-Name-<strong>abc123def456</strong></code>
              </li>
              <li>
                <strong>Add to notion.js</strong> - Add entry: <code>'my-slug': 'abc123def456'</code>
              </li>
              <li>
                <strong>Add link to hub</strong> - Add NuxtLink in <code>pages/faq/index.vue</code>
              </li>
              <li>
                <strong>Test locally</strong> - Visit <code>/faq/my-slug</code>
              </li>
            </ol>
          </div>

          <!-- Supported Notion Blocks -->
          <div class="dev-guide__section">
            <h3>Supported Notion Blocks</h3>
            <div class="dev-guide__blocks">
              <span class="dev-guide__block dev-guide__block--supported">Headings (H1-H3)</span>
              <span class="dev-guide__block dev-guide__block--supported">Paragraphs</span>
              <span class="dev-guide__block dev-guide__block--supported">Bullet lists</span>
              <span class="dev-guide__block dev-guide__block--supported">Numbered lists</span>
              <span class="dev-guide__block dev-guide__block--supported">Tables</span>
              <span class="dev-guide__block dev-guide__block--supported">Images</span>
              <span class="dev-guide__block dev-guide__block--supported">Quotes</span>
              <span class="dev-guide__block dev-guide__block--supported">Callouts</span>
              <span class="dev-guide__block dev-guide__block--supported">Dividers</span>
              <span class="dev-guide__block dev-guide__block--supported">Code blocks</span>
              <span class="dev-guide__block dev-guide__block--unsupported">Embeds</span>
              <span class="dev-guide__block dev-guide__block--unsupported">Videos</span>
              <span class="dev-guide__block dev-guide__block--unsupported">Databases</span>
            </div>
          </div>

          <!-- Testing Checklist -->
          <div class="dev-guide__section dev-guide__section--highlight" style="border-color: #3b82f6;">
            <h3 style="color: #1e40af;">🧪 Testing Checklist</h3>
            <p>After setup, verify everything works:</p>
            <ol class="dev-guide__checklist">
              <li>
                <strong>Content loads</strong> - Visit <code>/faq/delivery</code>, content should appear
              </li>
              <li>
                <strong>Check index</strong> - View Page Source → search for <code>index, follow</code>
              </li>
              <li>
                <strong>Test ISR cache</strong> - Edit Notion page, wait 1 hour, content should update
              </li>
              <li>
                <strong>Check llms.txt</strong> - Visit <code>/llms.txt</code> - should show AI content guide
              </li>
              <li>
                <strong>Verify schema</strong> - View Page Source → search for <code>application/ld+json</code>
              </li>
              <li>
                <strong>Test on mobile</strong> - Pages should be responsive
              </li>
            </ol>
          </div>

          <!-- Troubleshooting -->
          <div class="dev-guide__section" style="background: #fef2f2; padding: 20px; border-radius: 8px; border: 1px solid #fecaca;">
            <h3 style="color: #991b1b;">🔧 Troubleshooting</h3>

            <div style="margin-bottom: 16px;">
              <p><strong>Error: "NOTION_API_KEY environment variable is not set"</strong></p>
              <ul style="margin: 8px 0 0 20px; color: #7f1d1d;">
                <li>Check <code>.env</code> file exists in project root</li>
                <li>Verify <code>NOTION_API_KEY=ntn_xxx...</code> is set</li>
                <li>Restart dev server after adding env vars</li>
              </ul>
            </div>

            <div style="margin-bottom: 16px;">
              <p><strong>Error: 404 or "Page not found"</strong></p>
              <ul style="margin: 8px 0 0 20px; color: #7f1d1d;">
                <li>Check slug is added to <code>notionPages</code> in <code>server/utils/notion.js</code></li>
                <li>Verify the Notion page ID is correct (copy from URL)</li>
                <li>Make sure slug matches exactly (case-sensitive)</li>
              </ul>
            </div>

            <div style="margin-bottom: 16px;">
              <p><strong>Error: "Could not find block" or empty content</strong></p>
              <ul style="margin: 8px 0 0 20px; color: #7f1d1d;">
                <li>Share the Notion page with your integration (Share → Add integration)</li>
                <li>Check the page isn't in a private workspace</li>
                <li>Verify the integration has "Read content" capability</li>
              </ul>
            </div>

            <div style="margin-bottom: 16px;">
              <p><strong>Content not updating after Notion edit</strong></p>
              <ul style="margin: 8px 0 0 20px; color: #7f1d1d;">
                <li>ISR cache is 1 hour - wait or clear Vercel cache</li>
                <li>For local dev, restart the server</li>
                <li>Check Notion API status: <code>status.notion.so</code></li>
              </ul>
            </div>

            <div>
              <p><strong>Images not showing</strong></p>
              <ul style="margin: 8px 0 0 20px; color: #7f1d1d;">
                <li>Notion-hosted images expire after 1 hour</li>
                <li>Use external images (upload to CDN) for permanent URLs</li>
                <li>Or ensure ISR revalidates before image expiry</li>
              </ul>
            </div>
          </div>

          <!-- llms.txt Info -->
          <div class="dev-guide__section">
            <h3>🤖 llms.txt File</h3>
            <p>
              We've added <code>/llms.txt</code> - an emerging standard that tells AI crawlers (ChatGPT, Claude, Perplexity)
              which pages to prioritize. It's like <code>robots.txt</code> but for AI content discovery.
            </p>
            <p>File location: <code>public/llms.txt</code></p>
            <p>
              <strong>Companies using this:</strong> Stripe, Cloudflare, Zapier, Anthropic, Notion
            </p>
            <p class="dev-guide__note">
              <strong>To update:</strong> Edit <code>public/llms.txt</code> when adding new pages.
              Keep descriptions concise and links accurate.
            </p>
          </div>

        </div>
      </section>

      <footer class="help-hub__footer">
        <p>
          Need more help? Visit our
          <NuxtLink to="/contact">Contact page</NuxtLink> or chat with us using the widget below.
        </p>
      </footer>
    </div>
  </div>
</template>

<script setup>
/**
 * FAQ Hub Page
 *
 * Central hub for all FAQ pages with comprehensive Q&A content.
 * This page is indexed by Google with FAQPage schema markup.
 *
 * URL: /faq
 * Linked from: Footer of marketing pages
 * Links to: /faq/delivery, /faq/trial, /faq/warranty, /faq/adjustments, etc.
 */

// Toggle for developer guide section
const showDevGuide = ref(false)

// Meta tags - indexed for SEO with FAQPage schema
useHead({
  title: 'FAQ | Ausbeds',
  meta: [
    { name: 'robots', content: 'index, follow' },
    { name: 'description', content: 'Comprehensive information about Ausbeds policies, products, sizing, and showrooms.' }
  ]
})

// Structured data for LLM comprehension
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Ausbeds FAQ',
        description: 'Comprehensive information about Ausbeds policies, products, sizing, and showrooms.',
        publisher: {
          '@type': 'Organization',
          name: 'Ausbeds',
          url: 'https://ausbeds.com.au'
        },
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: [
            // Policies & Operations
            { '@type': 'ListItem', position: 1, name: 'Delivery Information', url: 'https://ausbeds.com.au/faq/delivery' },
            { '@type': 'ListItem', position: 2, name: 'Sleep Trial', url: 'https://ausbeds.com.au/faq/trial' },
            { '@type': 'ListItem', position: 3, name: 'Warranty', url: 'https://ausbeds.com.au/faq/warranty' },
            { '@type': 'ListItem', position: 4, name: 'Firmness Adjustments', url: 'https://ausbeds.com.au/faq/adjustments' },
            { '@type': 'ListItem', position: 5, name: 'Payments', url: 'https://ausbeds.com.au/faq/payments' },
            // Products & Sizing
            { '@type': 'ListItem', position: 6, name: 'Products Overview', url: 'https://ausbeds.com.au/faq/products' },
            { '@type': 'ListItem', position: 7, name: 'Dimensions & Sizes', url: 'https://ausbeds.com.au/faq/dimensions' },
            { '@type': 'ListItem', position: 8, name: 'Half-Half (Couples)', url: 'https://ausbeds.com.au/faq/half-half' },
            { '@type': 'ListItem', position: 9, name: 'Mattress Recommendations', url: 'https://ausbeds.com.au/faq/recommendations' },
            { '@type': 'ListItem', position: 10, name: 'Bed Bases', url: 'https://ausbeds.com.au/faq/bed-bases' },
            { '@type': 'ListItem', position: 11, name: 'Accessories', url: 'https://ausbeds.com.au/faq/accessories' },
            // Contact
            { '@type': 'ListItem', position: 12, name: 'Showroom & Contact', url: 'https://ausbeds.com.au/faq/showroom' }
          ]
        }
      })
    }
  ]
})
</script>

<style scoped>
.help-hub {
  min-height: 100vh;
  background: #f9fafb;
}

.help-hub__container {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
}

.help-hub__breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 24px;
}

.help-hub__breadcrumb a {
  color: #3b82f6;
  text-decoration: none;
}

.help-hub__breadcrumb a:hover {
  text-decoration: underline;
}

.help-hub__breadcrumb span {
  color: #9ca3af;
}

.help-hub__header {
  text-align: center;
  margin-bottom: 40px;
}

.help-hub__title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 12px;
}

.help-hub__subtitle {
  font-size: 1.125rem;
  color: #6b7280;
  margin: 0;
}

.help-hub__nav {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.help-hub__section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e5e7eb;
}

.help-hub__links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.help-hub__link {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  text-decoration: none;
  transition: all 0.2s ease;
}

.help-hub__link:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
  transform: translateY(-2px);
}

.help-hub__link-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.help-hub__link-content h3 {
  margin: 0 0 6px;
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
}

.help-hub__link-content p {
  margin: 0;
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.5;
}

.help-hub__footer {
  margin-top: 60px;
  padding-top: 30px;
  border-top: 1px solid #e5e7eb;
  text-align: center;
  color: #6b7280;
}

.help-hub__footer a {
  color: #3b82f6;
  text-decoration: none;
}

.help-hub__footer a:hover {
  text-decoration: underline;
}

@media (max-width: 640px) {
  .help-hub__title {
    font-size: 1.875rem;
  }

  .help-hub__container {
    padding: 24px 16px;
  }
}

/* ===================================== */
/* DEVELOPER IMPLEMENTATION GUIDE        */
/* ===================================== */

.dev-guide {
  margin-top: 60px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid #0ea5e9;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
}

.dev-guide__toggle {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border: none;
  background: #0ea5e9;
  color: white;
  cursor: pointer;
  text-align: left;
}

.dev-guide__toggle:hover {
  background: #0284c7;
}

.dev-guide__toggle-icon {
  font-size: 1.5rem;
}

.dev-guide__toggle-title {
  font-size: 1.125rem;
  font-weight: 700;
}

.dev-guide__toggle-subtitle {
  font-size: 0.875rem;
  opacity: 0.9;
  flex: 1;
}

.dev-guide__toggle-chevron {
  font-size: 0.75rem;
  opacity: 0.8;
}

.dev-guide__content {
  padding: 24px;
}

.dev-guide__section {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px dashed #bae6fd;
}

.dev-guide__section:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.dev-guide__section h3 {
  font-size: 1.125rem;
  font-weight: 700;
  color: #0c4a6e;
  margin: 0 0 16px;
}

.dev-guide__section p {
  color: #334155;
  margin: 0 0 12px;
  line-height: 1.6;
}

.dev-guide__section code {
  background: rgba(14, 165, 233, 0.15);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: ui-monospace, monospace;
  font-size: 0.875rem;
  color: #0369a1;
}

/* Flow diagram */
.dev-guide__flow {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  border: 1px solid #bae6fd;
}

.dev-guide__flow-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 16px;
  background: #f0f9ff;
  border-radius: 8px;
  min-width: 100px;
}

.dev-guide__flow-num {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0ea5e9;
  color: white;
  border-radius: 50%;
  font-size: 0.75rem;
  font-weight: 700;
  margin-bottom: 6px;
}

.dev-guide__flow-label {
  font-weight: 600;
  color: #0c4a6e;
  font-size: 0.875rem;
}

.dev-guide__flow-desc {
  font-size: 0.75rem;
  color: #64748b;
}

.dev-guide__flow-arrow {
  font-size: 1.25rem;
  color: #0ea5e9;
  font-weight: bold;
}

/* Code blocks */
.dev-guide__code {
  margin: 12px 0;
  padding: 16px;
  background: #1e293b;
  border-radius: 8px;
  overflow-x: auto;
}

.dev-guide__code code {
  font-family: ui-monospace, SFMono-Regular, monospace;
  font-size: 0.8125rem;
  color: #e2e8f0;
  background: none;
  padding: 0;
  white-space: pre;
  line-height: 1.6;
}

/* Notes */
.dev-guide__note {
  padding: 12px 16px;
  background: #fef9c3;
  border-left: 4px solid #eab308;
  border-radius: 0 6px 6px 0;
  font-size: 0.875rem;
  color: #713f12;
}

/* Highlighted section (checklist) */
.dev-guide__section--highlight {
  background: white;
  padding: 20px;
  border-radius: 8px;
  border: 2px solid #22c55e;
  margin-bottom: 32px;
}

.dev-guide__section--highlight h3 {
  color: #166534;
}

.dev-guide__checklist {
  margin: 0;
  padding-left: 24px;
}

.dev-guide__checklist li {
  margin-bottom: 12px;
  color: #334155;
  line-height: 1.6;
}

.dev-guide__checklist li:last-child {
  margin-bottom: 0;
}

/* Supported blocks tags */
.dev-guide__blocks {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.dev-guide__block {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8125rem;
  font-weight: 500;
}

.dev-guide__block--supported {
  background: #dcfce7;
  color: #166534;
}

.dev-guide__block--unsupported {
  background: #fee2e2;
  color: #991b1b;
}

@media (max-width: 640px) {
  .dev-guide__flow {
    flex-direction: column;
  }

  .dev-guide__flow-arrow {
    transform: rotate(90deg);
  }

  .dev-guide__toggle-subtitle {
    width: 100%;
  }
}
</style>
