import { getDynamicSitemapRoutes } from './server/utils/dynamicRoutes'

const isPreview = process.env.VERCEL_ENV !== 'production' ? true : false

console.log(`🛠️  Building for ${isPreview ? 'PREVIEW' : 'PRODUCTION'} environment`)

const silenceSomeSassDeprecationWarnings = {
  verbose: true,
  logger: {
    warn() {
      return
    }
  }
}

export default defineNuxtConfig({
  site: {
    url: 'https://ausbeds.com.au',
    name: 'Ausbeds'
  },

  app: {
    head: {
      title: 'Ausbeds', 
      titleTemplate: (title) => {
        return title ? `${title}` : 'Ausbeds'
      },
      htmlAttrs: {
        lang: 'en'
      },
      meta: [
        { charset: 'utf-8' },
        {
          name: 'viewport',
          content:
            'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'
        },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'description', hid: 'description', content: '' },
        { name: 'og:locale', hid: 'og:locale', content: 'en_AU' },
        { name: 'og:type', hid: 'og:type', content: 'website' },
        { name: 'og:site_name', hid: 'og:site_name', content: 'Ausbeds' },
        { name: 'theme-color', hid: 'theme-color', content: '#FFFFFF' },
        {
          name: 'msapplication-TileColor',
          content: '#cd113b'
        },
        {
          name: 'msapplication-TileImage',
          content: '#FFFFFF'
        },
        {
          name: 'theme-color',
          content: '#FFFFFF'
        }
      ],
      link: [
        // Preconnect to external domains
        { rel: 'preconnect', href: 'https://www.googletagmanager.com' },
        { rel: 'preconnect', href: 'https://cdn.ausbeds.com.au' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        // preload header image and fonts
        { rel: 'preload', as: 'image', href: 'https://cdn.ausbeds.com.au/f2289d35-5d04-40f7-9ed8-60fde5e37d84/mattress.png', fetchpriority: 'high' },
        { rel: 'preload', as: 'font', type: 'font/woff2', href: 'https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7W0Q5nw.woff2', crossorigin: 'anonymous', fetchpriority: 'high' },
        { rel: 'preload', as: 'font', type: 'font/woff2', href: 'https://fonts.gstatic.com/s/permanentmarker/v16/Fh4uPib9Iyv2ucM6pGQMWimMp004La2Cf5b6jlg.woff2', crossorigin: 'anonymous', fetchpriority: 'high' },
        // favicons  
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'shortcut icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', type: 'image/png', sizes: '57x57', href: '/apple-icon-57x57.png' },
        { rel: 'apple-touch-icon', type: 'image/png', sizes: '60x60', href: '/apple-icon-60x60.png' },
        { rel: 'apple-touch-icon', type: 'image/png', sizes: '72x72', href: '/apple-icon-72x72.png' },
        { rel: 'apple-touch-icon', type: 'image/png', sizes: '76x76', href: '/apple-icon-76x76.png' },
        { rel: 'apple-touch-icon', type: 'image/png', sizes: '114x114', href: '/apple-icon-114x114.png' },
        { rel: 'apple-touch-icon', type: 'image/png', sizes: '120x120', href: '/apple-icon-120x120.png' },
        { rel: 'apple-touch-icon', type: 'image/png', sizes: '144x144', href: '/apple-icon-144x144.png' },
        { rel: 'apple-touch-icon', type: 'image/png', sizes: '152x152', href: '/apple-icon-152x152.png' },
        { rel: 'apple-touch-icon', type: 'image/png', sizes: '180x180', href: '/apple-icon-180x180.png' },
        { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/android-icon-192x192.png' },
        { rel: 'icon', type: 'image/png', sizes: '144x144', href: '/android-icon-144x144.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicon-96x96.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'manifest', href: '/manifest.json' }
      ],
      script: [
        // { 
        //   src: 'https://gettermscmp.com/cookie-consent/embed/c84b8d4b-fe13-4d7d-aa78-8ac5435b9ede/en-us?auto=true',
        //   async: true
        // },
        {
          src: `https://www.paypal.com/sdk/js?client-id=${process.env.PAYPAL_CLIENT_ID}&currency=AUD`,
          tagPosition: 'bodyClose',
          defer: true
        },
        {
          children: `window.__productReviewSettings = { brandId: '13fb62c9-a0ce-3469-a782-26115f1c6aba' };`
        },
        {
          src: 'https://cdn.productreview.com.au/assets/widgets/loader.js',
          async: true
        }
      ]
    }
  },

  siteConfig: {
    title: 'Mattress Shop Sydney | Discover & Shop Ausbeds Today',
    description: 'Discover comfort at Ausbeds – the trusted mattress shop in Sydney. Visit our Marrickville or Willoughby showroom for honest advice.',
    url: 'https://ausbeds.com.au',
  },

  modules: [
    '@nuxt/icon',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/sitemap',
    [
      '@pinia/nuxt',
      {
        autoImports: ['defineStore', 'acceptHMRUpdate']
      }
    ],
    '@sentry/nuxt/module',
    // 'nuxt-directus', // DISABLED: Running standalone without Directus
    'nuxt-umami',
    'nuxt3-interpolation',
    'pinia-plugin-persistedstate/nuxt',
  ],

  imports: {
    dirs: ['stores']
  },

  components: {
    global: true,
    dirs: ['~/components']
  },

  // https://tailwindcss.nuxtjs.org/getting-started/options
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css'
  },

  // https://umami.nuxt.dev/
  umami: {
    // Self-hosted Umami instance
    id: '8ee828e3-2e16-4dd4-a4a3-c5d4e3357c62',
    host: 'https://ausbeds.up.railway.app',
    // Umami Cloud instance
    // id: '663f1463-d5da-46da-85df-aee33a5c59a1',
    // host: 'https://cloud.umami.is',
    autoTrack: true,
    // proxy: 'cloak',
    useDirective: true,
    ignoreLocalhost: true,
    // ignoreLocalhost: false,
    domains: [
      'ausbeds.com.au'
    ],
    urlOptions: {
      trailingSlash: 'never',
      excludeSearch: false,
      excludeHash: true,
    },
    enabled: true,
    // logErrors: true,
  },

  sitemap: {
    xsl: false,
    credits: false,
    discoverImages: false,
    debug: true,
    sources: [
      '/api/__sitemap__/urls',
    ]
  },

  icon: {
    // mode: 'css',
    // cssLayer: 'base',
    serverBundle: {
      remote: 'jsdelivr',
    }
  },

  runtimeConfig: {
    public: {
      environment: process.env.ENVIRONMENT || 'development',
      sentry: {
        dsn: !isPreview ? process.env.SENTRY_DSN_PUBLIC : null,
      },
      siteUrl: 'https://ausbeds.com.au',
      // DISABLED: Running standalone without Directus
      // directus: {
      //   // url: "https://content.ausbeds.com.au",
      //   url: process.env.DIRECTUS_URL || 'https://content.ausbeds.com.au',
      //   autoFetch: false,
      //   autoRefresh: false
      // },
      postStatus: isPreview ? ['published','draft'] : ['published'],
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
      paypalClientId: process.env.PAYPAL_CLIENT_ID,
      sydneyToBrisbanePolyline: process.env.SYDNEY_TO_BRISBANE_POLYLINE,
      sydneyToMelbournePolyline: process.env.SYDNEY_TO_MELBOURNE_POLYLINE,
      sydneyToCanberraPolyline: process.env.SYDNEY_TO_CANBERRA_POLYLINE,
      zipPublicKey: process.env.ZIP_PUBLIC_KEY,
      zipApiUrl: process.env.ZIP_API_URL
    },
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
    // DISABLED: Running standalone without Directus
    // directusToken: process.env.DIRECTUS_TOKEN || '',
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    paypalClientSecret: process.env.PAYPAL_SECRET_KEY,
    zipPrivateKey: process.env.ZIP_PRIVATE_KEY,
    mailjetApiKey: process.env.MAILJET_API_KEY,
    mailjetApiSecret: process.env.MAILJET_API_SECRET,
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    // On-demand ISR revalidation
    revalidateSecret: process.env.REVALIDATE_SECRET,
    vercelBypassToken: process.env.VERCEL_BYPASS_TOKEN,
    // Ragie RAG knowledge base
    ragieApiKey: process.env.RAGIE_API_KEY,
  },

  hooks: {
    async 'nitro:config'(nitroConfig) {
      if (isPreview) return
      const slugs = await getDynamicSitemapRoutes()
      const formattedSlugs = slugs.map(slug => slug.loc)
      console.log('🛠️  Adding dynamic routes to Nitro prerender config:', formattedSlugs)
      if (nitroConfig?.prerender?.routes) {
        nitroConfig.prerender.routes.push(...formattedSlugs)
      }
      return
    }
  },

  ssr: !isPreview,

  experimental: {
    payloadExtraction: !isPreview,
    sharedPrerenderData: true
  },

  routeRules: {
    '/': {
      prerender: !isPreview
    },
    '/**': {
      prerender: !isPreview
    },
    '/checkout': {
      ssr: false,
      prerender: false,
      robots: false
    },
    '/checkout/**': {
      ssr: false,
      prerender: false,
      robots: false
    },
    '/mattresses/test': {
      ssr: false,
      prerender: false,
      robots: false
    },

    // ============================================
    // FAQ PAGES - Notion-powered content
    // ISR: Cache indefinitely, revalidate on-demand via webhook
    // These pages ARE indexed for SEO (FAQPage schema)
    // ============================================

    // FAQ hub page (links to all FAQ pages)
    '/faq': {
      isr: true,
      prerender: false
    },

    // FAQ pages with comprehensive Q&A content
    // /faq/delivery, /faq/trial, /faq/warranty, /faq/adjustments
    '/faq/**': {
      isr: true,
      prerender: false
    },

    // Knowledge base - all FAQ content combined for LLM ingestion
    '/kb': {
      isr: true,
      prerender: false,
      robots: false
    },

    // Marketing pages with FAQ content (revalidated on Notion webhook)
    // Add new pages here: /trial, /warranty, /adjustments, etc.
    '/delivery': { isr: true, prerender: false },
    '/trial': { isr: true, prerender: false },
    '/warranty': { isr: true, prerender: false },
    '/adjustments': { isr: true, prerender: false },

    // Raw content pages for LLM/NotebookLM ingestion
    // /raw/delivery, /raw/trial, etc. - clean content without chrome
    '/raw/**': {
      isr: true,
      prerender: false,
      robots: false
    },

    // ============================================
    // GUIDES/BLOG - Notion-powered articles
    // ISR: Cache indefinitely, revalidate on-demand via webhook
    // ============================================
    '/guides': {
      isr: true,
      prerender: false
    },
    '/guides/**': {
      isr: true,
      prerender: false
    },

    // Legacy URL redirects
    // Redirect old internal development routes to new canonical /faq/* URLs
    '/delivery-details': { redirect: '/faq/delivery' },
    '/trial-details': { redirect: '/faq/trial' },
    '/warranty-details': { redirect: '/faq/warranty' },
    '/adjustments-details': { redirect: '/faq/adjustments' },

    // Redirect old /help/* URLs to new /faq/* URLs (SEO migration)
    '/help': { redirect: '/faq' },
    '/help/delivery': { redirect: '/faq/delivery' },
    '/help/trial': { redirect: '/faq/trial' },
    '/help/warranty': { redirect: '/faq/warranty' },
    '/help/adjustments': { redirect: '/faq/adjustments' },
    '/help/payments': { redirect: '/faq/payments' },
    '/help/products': { redirect: '/faq/products' },
    '/help/dimensions': { redirect: '/faq/dimensions' },
    '/help/half-half': { redirect: '/faq/half-half' },
    '/help/bed-bases': { redirect: '/faq/bed-bases' },
    '/help/accessories': { redirect: '/faq/accessories' },
    '/help/recommendations': { redirect: '/faq/recommendations' },
    '/help/showroom': { redirect: '/faq/showroom' },

    // Voice shadow pages (Narrative format)
    '/voice/**': {
      isr: 3600,
      prerender: false,
      robots: false
    },

  },

  nitro: {
    preset: isPreview ? 'static' : 'vercel',
    prerender: {
      crawlLinks: false,
      failOnError: false,
    },
    // On-demand ISR revalidation via bypassToken header
    vercel: {
      config: {
        bypassToken: process.env.VERCEL_BYPASS_TOKEN?.trim()
      }
    }
  },

  vite: {
    define: {
      'window.global': {}
    },
    css: {
      preprocessorOptions: {
        scss: {
          ...silenceSomeSassDeprecationWarnings
        },
        sass: {
          ...silenceSomeSassDeprecationWarnings
        }
      }
    },
    server: {
      allowedHosts: [
        process.env.NGROK_WEBHOOK_HOST || 'localhost'
      ]
    }
  },

  // fix before go live
  sentry: {
    enabled: !isPreview,
    sourceMapsUploadOptions: {
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
    },

    autoInjectServerSentry: 'top-level-import'
  },

  build: {
    sourcemap: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'nuxt'],
          ui: ['swiper']
        }
      }
    }
  },

  sourcemap: { 
    client: 'hidden'
  },

  debug: false,

  devtools: { 
    enabled: isPreview
  },

  compatibilityDate: '2025-09-30'
  
})