# Ausbeds Website - Demo Project

## Overview

This is a demo website for Ausbeds (Australian mattress company) showcasing a three-module content architecture. The project demonstrates how to combine multiple content sources into a unified website.

**Production URL:** https://one-possible-future.vercel.app
**Tech Stack:** Nuxt 3, Vue 3, Tailwind CSS, Vercel (ISR)

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

### 3. Knowledge Base / Help (Notion Pages)
- **Purpose:** Comprehensive information for customers and AI chatbots (Fin, ChatGPT, Perplexity, NotebookLM)
- **Source:** Individual Notion pages (SSOT - Single Source of Truth)
- **API Route:** `/server/api/notion-knowledge/`
- **Examples:** `/help/delivery`, `/help/trial`, `/help/warranty`
- **Characteristics:** Q&A format optimized for LLM ingestion, noindex but crawlable

---

## Knowledge Base Architecture

### Two URL Patterns

**Help Pages** (`/help/[slug]`) - Full experience with site chrome:
- Header, Footer, Cart
- SEO annotations (developer notes)
- Breadcrumbs
- Related links
- For: Customers browsing the site

**Raw Pages** (`/raw/[slug]`) - Clean content only:
- No header, footer, or navigation
- No annotations or dev notes
- Just the content
- For: NotebookLM, AI training, content ingestion

### Adding New Help Articles

Add one line to `/server/utils/notion.js`:

```javascript
export const notionPages = {
  // ... existing pages
  'new-topic': 'notion-page-id-here',
}
```

Both URLs work automatically:
- `https://one-possible-future.vercel.app/help/new-topic`
- `https://one-possible-future.vercel.app/raw/new-topic`

### Current Help Articles

| Slug | Notion Page ID | Help URL | Raw URL |
|------|----------------|----------|---------|
| delivery | 2c6bd057-a789-81d6-b551-f6e5bebce61b | /help/delivery | /raw/delivery |
| trial | 2c6bd057-a789-81bc-b86d-c5aeb2094098 | /help/trial | /raw/trial |
| warranty | 2c6bd057-a789-814c-801b-d893a535c5d4 | /help/warranty | /raw/warranty |
| adjustments | 2c6bd057-a789-816c-bf7c-eba63efa9823 | /help/adjustments | /raw/adjustments |
| payments | 2c8bd057-a789-8115-a846-e20f2085f1c2 | /help/payments | /raw/payments |
| products | 2c6bd057-a789-819c-bb41-fb875075c23a | /help/products | /raw/products |
| dimensions | 2c8bd057-a789-81e7-954b-eb16377d5f0e | /help/dimensions | /raw/dimensions |
| half-half | 2c6bd057-a789-8111-8506-e43e4b14f80e | /help/half-half | /raw/half-half |
| bed-bases | 2c8bd057-a789-8164-9ca5-d8326dbd541c | /help/bed-bases | /raw/bed-bases |
| accessories | 2c8bd057-a789-81bd-b892-d1ad96018a1b | /help/accessories | /raw/accessories |
| recommendations | 2c8bd057-a789-8184-a02e-fdc38733164f | /help/recommendations | /raw/recommendations |
| showroom | 2c6bd057-a789-8176-a125-cbca4893b4ab | /help/showroom | /raw/showroom |

---

## Key Files

### Notion Integration
- `/server/utils/notion.js` - Notion client, page ID mapping, HTML conversion
- `/server/api/notion-knowledge/[...slug].js` - API route for help/raw pages
- `/server/api/notion-blog/` - API routes for blog articles

### Pages
- `/pages/help/[slug].vue` - Help pages with full chrome
- `/pages/raw/[slug].vue` - Raw pages for LLM ingestion
- `/layouts/default.vue` - Main layout (header, footer)
- `/layouts/raw.vue` - Minimal layout for raw pages

### Route Rules (nuxt.config.js ~line 280)
- `/help/**` - ISR 1 hour, noindex
- `/raw/**` - ISR 1 hour, noindex

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
- `NOTION_API_KEY` - Notion integration token (must have access to all pages)
- `NOTION_BLOG_DATABASE_ID` - Database ID for blog articles

---

## Caching (ISR)

All help and raw pages use ISR (Incremental Static Regeneration):
- Cache duration: 1 hour (3600 seconds)
- First request triggers SSR, subsequent requests serve cached HTML
- Content updates in Notion appear within 1 hour

---

## For NotebookLM / AI Tools

Use the `/raw/` URLs for clean content ingestion:

```
https://one-possible-future.vercel.app/raw/delivery
https://one-possible-future.vercel.app/raw/trial
https://one-possible-future.vercel.app/raw/warranty
https://one-possible-future.vercel.app/raw/adjustments
https://one-possible-future.vercel.app/raw/payments
https://one-possible-future.vercel.app/raw/products
https://one-possible-future.vercel.app/raw/dimensions
https://one-possible-future.vercel.app/raw/half-half
https://one-possible-future.vercel.app/raw/bed-bases
https://one-possible-future.vercel.app/raw/accessories
https://one-possible-future.vercel.app/raw/recommendations
https://one-possible-future.vercel.app/raw/showroom
```

These pages contain only:
- Page title
- Last updated date
- The Notion content (formatted HTML)

No navigation, no annotations, no site chrome.
