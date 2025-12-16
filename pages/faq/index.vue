<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Help & FAQ</h1>

    <div v-if="pending" class="text-gray-500">Loading...</div>

    <div v-else-if="error" class="text-red-500">
      Failed to load FAQ articles. Please try again later.
    </div>

    <div v-else-if="groupedArticles" class="space-y-8">
      <section v-for="(articles, category) in groupedArticles" :key="category">
        <h2 class="text-xl font-semibold mb-4 text-gray-700">{{ category }}</h2>
        <ul class="space-y-2">
          <li v-for="article in articles" :key="article.slug">
            <NuxtLink
              :to="`/faq/${article.slug}`"
              class="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline"
            >
              <span v-if="article.icon">{{ article.icon }}</span>
              <span>{{ article.title }}</span>
            </NuxtLink>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script setup>
const { data: faqData, pending, error } = await useFetch('/api/notion-faq')

const groupedArticles = computed(() => {
  if (!faqData.value?.data) return null

  const groups = {}
  for (const article of faqData.value.data) {
    const category = article.category || 'Other'
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(article)
  }
  return groups
})

useHead({
  title: 'Help & FAQ - Ausbeds',
  meta: [
    { name: 'description', content: 'Find answers to common questions about Ausbeds mattresses, delivery, warranty, and more.' }
  ]
})
</script>
