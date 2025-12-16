<template>
  <div class="combined-knowledge">
    <!-- Loading State -->
    <div v-if="pending" class="combined-knowledge__loading">
      <p>Loading knowledge base...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="combined-knowledge__error">
      <p>Error loading content. Please try again.</p>
    </div>

    <!-- Content - Render as preformatted markdown -->
    <pre v-else class="combined-knowledge__content">{{ content }}</pre>
  </div>
</template>

<script setup>
/**
 * Combined Knowledge Base Page
 *
 * Serves ALL FAQ articles combined into a single markdown document.
 * Optimized for LLM ingestion:
 * - NotebookLM
 * - ChatGPT
 * - Perplexity
 * - AI training
 *
 * URL: /raw/combined-knowledge
 */

// Use raw layout (no header/footer)
definePageMeta({
  layout: 'raw'
})

// Fetch combined markdown from API
const { data: content, pending, error } = await useFetch('/api/faq/combined', {
  key: 'combined-knowledge'
})

// Meta tags - noindex (LLM consumption only)
useHead({
  title: 'Ausbeds Complete FAQ Knowledge Base',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' },
    { name: 'description', content: 'Complete FAQ knowledge base for Ausbeds mattresses - all articles combined for AI/LLM ingestion.' }
  ]
})
</script>

<style scoped>
.combined-knowledge {
  min-height: 100vh;
  background: #fff;
  padding: 0;
  margin: 0;
}

.combined-knowledge__content {
  font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace;
  font-size: 14px;
  line-height: 1.6;
  color: #1f2937;
  background: #fff;
  padding: 24px;
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow-x: auto;
}

.combined-knowledge__loading,
.combined-knowledge__error {
  text-align: center;
  padding: 40px;
  color: #6b7280;
  font-family: system-ui, -apple-system, sans-serif;
}
</style>
