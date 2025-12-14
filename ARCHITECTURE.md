# Ausbeds Website Architecture

This document explains the three-module architecture of the Ausbeds website.

## Overview

The website is divided into three distinct content modules, each with its own data source and purpose:

```
┌─────────────────────────────────────────────────────────────────┐
│                     Ausbeds Website (Nuxt 4)                    │
├─────────────────────┬─────────────────────┬─────────────────────┤
│   Marketing Module  │    Blog Module      │  Knowledge Module   │
│     (Directus)      │   (Notion DB)       │   (Notion Pages)    │
├─────────────────────┼─────────────────────┼─────────────────────┤
│ - Product pages     │ - Articles listing  │ - Shadow pages      │
│ - Landing pages     │ - Individual posts  │ - Help centre       │
│ - Showroom info     │ - Categories/tags   │ - LLM-optimized     │
│ - CMS-managed       │ - Editorial content │ - noindex pages     │
└─────────────────────┴─────────────────────┴─────────────────────┘
```

## Module Details

### 1. Marketing Module (Directus CMS)

**Data Source:** Directus CMS at https://content.ausbeds.com.au

**Purpose:** Core website content managed by the marketing team.

**Location in codebase:**
- `pages/[slug].vue` - Generic CMS pages
- `pages/mattresses/**` - Product pages
- `pages/showrooms/**` - Showroom pages
- `composables/useFields.js` - Directus field selection
- `server/utils/dynamicRoutes.js` - Generates routes from Directus

**Characteristics:**
- Full SEO optimization (indexed by search engines)
- Visual content with images, videos, CTAs
- Managed through Directus admin panel
- Pre-rendered at build time

---

### 2. Blog Module (Notion Database)

**Data Source:** Notion Database

**Purpose:** Editorial blog content (articles, guides, news).

**Location in codebase:**
- `pages/articles/index.vue` - Articles listing page
- `pages/articles/[slug].vue` - Individual article page
- `server/api/notion-blog/index.js` - Fetches all articles
- `server/api/notion-blog/[slug].js` - Fetches single article

**API Routes:**
- `GET /api/notion-blog` - List all published articles
- `GET /api/notion-blog/:slug` - Get single article by slug

**Characteristics:**
- Full SEO optimization (indexed by search engines)
- Rich content with images, formatting
- Managed directly in Notion
- ISR caching for performance

---

### 3. Knowledge Base Module (Notion Pages)

**Data Source:** Notion Pages (individual pages, not database)

**Purpose:** Shadow pages optimized for LLM/AI consumption.

**Location in codebase:**
- `pages/help/index.vue` - Help centre hub
- `pages/help/[slug].vue` - Individual shadow pages
- `composables/useShadowPage.js` - Shadow page data fetching
- `server/api/notion-knowledge/[...slug].js` - Fetches Notion page content

**API Routes:**
- `GET /api/notion-knowledge/:slug` - Get shadow page content

**Characteristics:**
- `noindex` meta tag (not indexed by search engines)
- Canonical URL points to marketing page equivalent
- Plain text optimized for ChatGPT, Perplexity, etc.
- Comprehensive Q&A format content
- 1-hour ISR cache

**Shadow Page Mapping:**
```
/help/delivery     → Notion: "Delivery Information"
/help/returns      → Notion: "Returns & Exchanges"
/help/warranty     → Notion: "Warranty Information"
/help/mattress-care → Notion: "Mattress Care Guide"
```

---

## Directory Structure

```
├── pages/
│   ├── [slug].vue              # Marketing (Directus)
│   ├── articles/
│   │   ├── index.vue           # Blog listing
│   │   └── [slug].vue          # Blog article
│   └── help/
│       ├── index.vue           # Knowledge hub
│       └── [slug].vue          # Shadow pages
│
├── server/api/
│   ├── notion-blog/            # Blog Module API
│   │   ├── index.js            # GET /api/notion-blog
│   │   └── [slug].js           # GET /api/notion-blog/:slug
│   │
│   └── notion-knowledge/       # Knowledge Module API
│       └── [...slug].js        # GET /api/notion-knowledge/:slug
│
├── composables/
│   ├── useFields.js            # Directus fields (Marketing)
│   └── useShadowPage.js        # Shadow page helper (Knowledge)
│
└── stores/
    └── settingsStore.js        # Site-wide settings
```

## Data Flow

```
Marketing:  Directus CMS → Nuxt SSG → Static HTML
Blog:       Notion DB → /api/notion-blog → Vue pages → ISR HTML
Knowledge:  Notion Pages → /api/notion-knowledge → Vue pages → ISR HTML
```

## Why This Architecture?

1. **Separation of Concerns:** Each module has a clear purpose and data source
2. **Team Autonomy:** Marketing edits Directus, content team edits Notion
3. **Appropriate SEO:** Marketing/Blog indexed, Knowledge pages noindex
4. **LLM Optimization:** Knowledge module specifically designed for AI crawlers
5. **Maintainability:** Clear folder naming makes the codebase navigable

## Adding New Content

- **New marketing page:** Add to Directus, will auto-generate route
- **New blog article:** Add to Notion Database with status "Published"
- **New shadow page:** Add Notion page + map in `pages/help/[slug].vue`
