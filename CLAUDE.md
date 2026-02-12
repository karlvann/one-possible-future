# Ausbeds Website - Demo Project

## Overview

This is a demo website for Ausbeds (Australian mattress company) showcasing a three-module content architecture. The project demonstrates how to combine multiple content sources into a unified website.

**Production URL:** https://one-possible-future.vercel.app
**Tech Stack:** Nuxt 3, Vue 3, Tailwind CSS, Vercel (ISR)
**Deployment:** Push to GitHub → Vercel auto-deploys (not direct to Vercel)

---

## The Three Modules

### 1. Marketing Pages (Directus CMS)
- **Purpose:** Product pages, landing pages, marketing content
- **Source:** Directus headless CMS
- **Examples:** `/mattresses`, `/delivery`, `/trial`, `/warranty`
- **Characteristics:** SEO-optimized, benefit-driven, canonical URLs

### 2. Blog (Notion Database)
- **Purpose:** Articles, news, content marketing
- **Source:** Notion database with articles
- **API Route:** `/server/api/notion-blog/`
- **Examples:** `/articles`, `/articles/[slug]`

### 3. Knowledge Base / FAQ (Notion Database)
- **Purpose:** Comprehensive information for customers and AI chatbots (Fin, ChatGPT, Perplexity, NotebookLM)
- **Source:** Notion database (Single Source of Truth)
- **Database ID:** `f0502a707e3b4d1cb6d3410102d05cee`
- **API Route:** `/server/api/notion-faq/`
- **Examples:** `/faq/delivery`, `/faq/trial`, `/faq/warranty`
- **Characteristics:** Q&A format with FAQPage schema, indexed for SEO

---

## Knowledge Base Architecture

### Two URL Patterns

**FAQ Pages** (`/faq/[slug]`) - Full experience with site chrome:
- Header, Footer, Cart
- FAQPage schema for rich snippets
- Breadcrumbs
- Related links
- For: Customers browsing the site, SEO

**Raw Pages** (`/raw/[slug]`) - Clean content only:
- No header, footer, or navigation
- No annotations or dev notes
- Just the content
- For: NotebookLM, AI training, content ingestion

### Adding New FAQ Articles

Simply add a new row to the Notion FAQ database with:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| Title | Title | Yes | The article title displayed on the page (e.g., "Delivery Information") |
| Meta Title | Text | No | SEO title for `<title>` tag (falls back to Title if empty) |
| Slug | Text | Yes | URL slug (e.g., "delivery") |
| Meta Description | Text | No | SEO description for the page |
| Category | Select | No | One of: Policies, Products, Contact |
| Icon | Text | No | Emoji for hub page display |
| Canonical URL | Text | No | Override canonical URL if needed |
| Published | Checkbox | No | Must be checked for article to appear |
| Order | Number | No | Sort order within category |

Both URLs work automatically once published:
- `https://one-possible-future.vercel.app/faq/[slug]`
- `https://one-possible-future.vercel.app/raw/[slug]`

### Current FAQ Articles

Articles are managed in the Notion database. Current categories:

**Policies & Operations:**
- delivery, trial, warranty, adjustments, payments

**Products & Sizing:**
- products, dimensions, half-half, bed-bases, accessories, recommendations

**Contact & Showroom:**
- showroom

---

## Key Files

### Notion Integration
- `/server/utils/notionFaq.js` - FAQ database queries and HTML conversion
- `/server/utils/notion.js` - Shared Notion client and utilities
- `/server/api/notion-faq/index.js` - List all FAQ articles (supports `?grouped=true`)
- `/server/api/notion-faq/[slug].js` - Get single FAQ article by slug
- `/server/api/faq/combined.get.js` - Combined knowledge base (all FAQs in markdown)
- `/server/api/notion-blog/` - API routes for blog articles
- `/server/api/revalidate.post.js` - Webhook endpoint for on-demand ISR revalidation

### Pages
- `/pages/faq/index.vue` - FAQ hub page (dynamic from database)
- `/pages/faq/[slug].vue` - FAQ detail pages with full chrome
- `/pages/raw/[slug].vue` - Raw pages for LLM ingestion
- `/pages/raw/combined-knowledge.vue` - All FAQs combined for LLM ingestion
- `/layouts/default.vue` - Main layout (header, footer)
- `/layouts/raw.vue` - Minimal layout for raw pages

### Route Rules (nuxt.config.js ~line 280)
- `/faq/**` - ISR (on-demand revalidation), indexed
- `/raw/**` - ISR (on-demand revalidation), noindex

---

## Commands

```bash
yarn install    # Install dependencies
yarn dev        # Start dev server
yarn build      # Build for production
```

---

## Environment Variables

Required on Vercel:
- `NOTION_API_KEY` - Notion integration token (must have access to all databases)
- `NOTION_BLOG_DATABASE_ID` - Database ID for blog articles
- `NOTION_FAQ_DATABASE_ID` - Database ID for FAQ articles (`f0502a707e3b4d1cb6d3410102d05cee`)
- `REVALIDATE_SECRET` - Secret for webhook authentication
- `VERCEL_BYPASS_TOKEN` - Vercel's ISR bypass token (from project settings)
- `RAGIE_API_KEY` - Ragie API key for automatic KB re-ingestion

---

## Caching (ISR) & On-Demand Revalidation

All FAQ and raw pages use ISR (Incremental Static Regeneration):
- Cache duration: Indefinite (until webhook triggers revalidation)
- First request triggers SSR, subsequent requests serve cached HTML
- Content updates in Notion appear instantly when webhook fires

### On-Demand Revalidation (Webhooks)

For instant cache refresh when Notion content changes, set up automations in each Notion database:

**Revalidation Endpoint:**
```
POST /api/revalidate?secret=YOUR_SECRET&type=faq
POST /api/revalidate?secret=YOUR_SECRET&type=guides
```

**Notion Automation Setup:**
1. Open the Notion database → **...** menu → **Automations**
2. Create automation with:
   - **Trigger:** "Any property edited" **AND** "Page content edited"
   - **Action:** Send webhook to the revalidation URL
   - **Content:** Check "Slug" property (required for path-specific revalidation)

**IMPORTANT:** The trigger MUST include "Page content edited" - not just "Any property edited". Otherwise, editing the page body won't trigger revalidation (only property changes will).

---

## API Endpoints

### FAQ API

**List all articles:**
```
GET /api/notion-faq
GET /api/notion-faq?grouped=true  # Grouped by category
```

**Get single article:**
```
GET /api/notion-faq/[slug]
```

**Combined knowledge base (all articles in one markdown document):**
```
GET /api/faq/combined
```

---

## For NotebookLM / AI Tools

### Combined Knowledge Base (Recommended)

For ingesting the entire FAQ knowledge base in one request:
```
https://one-possible-future.vercel.app/raw/combined-knowledge
```

This single URL contains:
- All FAQ articles combined into one markdown document
- YAML-like metadata header
- Table of contents with all articles
- Articles grouped by category
- Each article with slug, update date, and URL metadata

**Best for:** NotebookLM, AI training, bulk content ingestion

### Individual Articles

Use `/raw/[slug]` URLs for specific articles:
```
https://one-possible-future.vercel.app/raw/delivery
https://one-possible-future.vercel.app/raw/trial
https://one-possible-future.vercel.app/raw/warranty
```

These pages contain only:
- Page title
- Last updated date
- The Notion content (formatted HTML)

No navigation, no annotations, no site chrome.

---

## Ragie Knowledge Base Integration

### Pipeline Overview

```
Notion FAQ Database
         ↓ (Notion automation webhook)
   POST /api/revalidate?type=faq
         ↓ (busts ISR cache, then auto re-ingests)
   /kb → Ragie ingests as "Ausbeds KB v3"
```

The full pipeline is automatic: edit Notion → webhook fires → ISR cache busts → Ragie re-ingests.

### Ragie Configuration

- **Document Source:** `https://one-possible-future.vercel.app/kb`
- **Document Name:** Ausbeds KB v3
- **Document ID:** `16248a9c-bcbf-4a65-9456-402e6bfd2dd0`
- **Chunk Count:** ~71 chunks
- **Ingestion Mode:** Fast (text-only, no OCR needed for Q&A content)

### Ragie API Access

```bash
# List documents
curl -H "Authorization: Bearer YOUR_API_KEY" https://api.ragie.ai/documents

# View chunks
curl -H "Authorization: Bearer YOUR_API_KEY" \
  "https://api.ragie.ai/documents/DOCUMENT_ID/chunks"

# Re-ingest from URL (after Notion updates)
curl -X PUT -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  "https://api.ragie.ai/documents/DOCUMENT_ID/url" \
  -d '{"url": "https://one-possible-future.vercel.app/kb"}'
```

### Ragie MCP (Claude Code)

The Ragie MCP only exposes `retrieve` (read-only). For document management (create, update, delete), use the API directly.

### Re-syncing After Notion Edits

**Automatic (recommended):** Just edit the Notion FAQ Database. The Notion automation fires a webhook → ISR cache busts → Ragie re-ingests. No manual steps needed.

**Manual (if webhook isn't firing):**
```bash
curl -X POST "https://one-possible-future.vercel.app/api/revalidate?secret=YOUR_SECRET&type=faq"
```
This busts the ISR cache AND triggers Ragie re-ingestion automatically.

---

## IMPORTANT: Notion Content Architecture

### Two Parallel Systems (Potential Duplication!)

There are TWO places where KB content exists in Notion:

| System | Purpose | Powers |
|--------|---------|--------|
| **FAQ Articles Database** | Production content | `/kb` → Ragie, `/faq/*`, `/raw/*` |
| **Operations Pages** | Internal reference/drafts? | Nothing (orphaned) |

**FAQ Articles Database ID:** `f0502a707e3b4d1cb6d3410102d05cee`
**Operations Page ID:** `2c8bd057a78980c0a7e7cdbf5b34c930`

### Which to Edit?

- **For changes to appear in Ragie:** Edit the FAQ Articles Database
- **Operations pages** appear to be a parallel/internal copy - edits there won't reach Ragie

### Verifying Content Flow

1. Edit page in FAQ Articles Database
2. Wait for webhook to fire (or trigger manually)
3. Visit `https://one-possible-future.vercel.app/kb` to verify changes appear
4. Test retrieval via Ragie MCP (re-ingestion happens automatically)

---

## Ragie Retrieval Optimization

### Recommended Query Parameters

```javascript
{
  "topK": 6,        // Balance coverage vs noise
  "rerank": true,   // Filter to most relevant chunks
  "recencyBias": false  // Content is stable, not time-sensitive
}
```

### Query Formulation Tips

The FAQ content uses `## Question?` headings. Queries matching this format retrieve better:

| Query Style | Quality |
|-------------|---------|
| "delivery cost Sydney" | Good |
| "How much is delivery to Sydney?" | Excellent |

### Content Optimization (Done Dec 2025)

- Consolidated repetitive weight Q&As
- Removed duplicate trial/swap mentions (link to dedicated page instead)
- Trimmed verbose FAQ sections (flippable, cover, bouncy)
- Deduplicated Aurora vs Cloud across pages
