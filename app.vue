<template>
  <NuxtLayout>
    <NuxtLoadingIndicator :duration="1500" color="#97D7ED" />
    <NuxtPage :page-key="route => route.fullPath" />
  </NuxtLayout>
</template>

<script setup>
const route = useRoute()

// Paths where LocalBusiness schema should NOT appear
const excludedPaths = ['/guides', '/mattress-guide', '/mattresses']

const shouldShowLocalBusiness = computed(() => {
  const path = route.path
  return !excludedPaths.some(excluded => path.startsWith(excluded))
})

const schema = {
  "@context": "https://schema.org",
  "@type": "FurnitureStore",
  "name": "Ausbeds",
  "description": "Discover comfort at Ausbeds – the trusted mattress shop in Sydney. Visit our Marrickville or Willoughby showroom for honest advice.",
  "logo": "https://cdn.ausbeds.com.au/b594e9ab-11f8-4524-8a38-cb258c507c7c/ausbeds-logo.png",
  "url": "https://ausbeds.com.au",
  "sameAs": [
    'https://www.youtube.com/channel/UCCzDMTM7buWHtB6D_UdzpzA',
    'https://www.linkedin.com/company/ausbeds/?originalSubdomain=au',
    'https://www.reddit.com/user/karlatausbeds/',
    'https://www.instagram.com/ausbeds/',
    'https://www.facebook.com/Ausbeds/',
    'https://www.ozbargain.com.au/user/77255',
    'https://forums.whirlpool.net.au/user/903959'
  ],
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": -33.90669427673231,
    "longitude": 151.1648183071551
  },
  "areaServed": [
    {
      "@type": "City",
      "name": "Sydney"
    },
    {
      "@type": "City",
      "name": "Melbourne"
    },
    {
      "@type": "City",
      "name": "Brisbane"
    },
    {
      "@type": "City",
      "name": "Canberra"
    },
  ],
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "10:00",
      "closes": "18:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Saturday", "Sunday"],
      "opens": "10:00",
      "closes": "14:00"
    }
  ],
  "telephone": "02-8999-3333",
  "email": "sales@ausbeds.com.au",
  "paymentAccepted": "Cash, Credit Card, Debit Card, PayPal, Bank Transfer",
  "currenciesAccepted": "AUD",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "136 Victoria Rd",
    "addressLocality": "Marrickville",
    "addressRegion": "NSW",
    "postalCode": "2204",
    "addressCountry": "AU"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "bestRating": "5",
    "worstRating": "1",
    "ratingCount": "378",
    "reviewCount": "378"
  }
}

watchEffect(() => {
  if (shouldShowLocalBusiness.value) {
    useHead({
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify(schema),
          key: 'schema-local-business'
        }
      ]
    })
  }
})
</script>