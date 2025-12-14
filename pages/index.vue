<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <!-- Header Section -->
      <div class="text-center mb-16">
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
          Ausbeds Content Demo
        </h1>
        <p class="text-xl sm:text-2xl text-gray-600 mb-8">
          Notion-Powered Content Management System
        </p>
        <p class="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          This demo showcases how Notion can power website content. Articles are managed in a Notion database,
          and support pages are written directly in Notion.
        </p>
      </div>

      <!-- Cards Section -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <!-- Articles Card -->
        <NuxtLink
          to="/articles"
          class="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 hover:border-blue-200 hover:-translate-y-1"
        >
          <div class="flex flex-col h-full">
            <div class="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors duration-300">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-gray-900 mb-3">
              Articles
            </h2>
            <p class="text-gray-600 leading-relaxed flex-grow">
              Blog system powered by Notion. Browse articles dynamically fetched from a Notion database.
            </p>
            <div class="mt-6 flex items-center text-blue-600 font-semibold group-hover:text-blue-700">
              View Articles
              <svg class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </NuxtLink>

        <!-- Help Centre Card -->
        <NuxtLink
          to="/help"
          class="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 hover:border-green-200 hover:-translate-y-1"
        >
          <div class="flex flex-col h-full">
            <div class="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-200 transition-colors duration-300">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-gray-900 mb-3">
              Help Centre
            </h2>
            <p class="text-gray-600 leading-relaxed flex-grow">
              Shadow pages for support content. Content pages written directly in Notion and rendered on the site.
            </p>
            <div class="mt-6 flex items-center text-green-600 font-semibold group-hover:text-green-700">
              Browse Help
              <svg class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </NuxtLink>

        <!-- Delivery Info Card -->
        <NuxtLink
          to="/help/delivery"
          class="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 hover:border-purple-200 hover:-translate-y-1"
        >
          <div class="flex flex-col h-full">
            <div class="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-200 transition-colors duration-300">
              <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-gray-900 mb-3">
              Delivery Info
            </h2>
            <p class="text-gray-600 leading-relaxed flex-grow">
              Example shadow page. See how a specific support page looks when powered by Notion content.
            </p>
            <div class="mt-6 flex items-center text-purple-600 font-semibold group-hover:text-purple-700">
              View Example
              <svg class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- Additional Info -->
      <div class="mt-16 text-center">
        <div class="inline-flex items-center px-6 py-3 bg-gray-100 rounded-full">
          <svg class="w-5 h-5 text-gray-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
          </svg>
          <span class="text-gray-700 font-medium">Powered by Notion API</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// SEO
useHead({
  title: 'Ausbeds Content Demo - Notion-Powered CMS',
  meta: [
    {
      name: 'description',
      content: 'Demo showcasing how Notion can power website content. Articles are managed in a Notion database, and support pages are written directly in Notion.'
    }
  ]
})
</script>
