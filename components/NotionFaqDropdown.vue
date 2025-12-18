<template>
  <div class="notion-faq-dropdown">
    <!-- Loading -->
    <div v-if="pending" class="faq-loading">
      <div class="faq-skeleton" v-for="i in 5" :key="i"></div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="faq-error">
      <p>Unable to load FAQ. Please try refreshing the page.</p>
    </div>

    <!-- FAQ Items -->
    <div v-else-if="faqItems.length" class="faq-list">
      <Disclosure
        v-for="(item, index) in faqItems"
        :key="index"
        as="div"
        v-slot="{ open }"
        class="faq-item"
      >
        <DisclosureButton class="faq-question">
          <span>{{ item.question }}</span>
          <Icon
            name="ic:outline-keyboard-arrow-down"
            class="faq-icon"
            :class="{ 'faq-icon--open': open }"
          />
        </DisclosureButton>
        <transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="transform -translate-y-2 opacity-0"
          enter-to-class="transform translate-y-0 opacity-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="transform translate-y-0 opacity-100"
          leave-to-class="transform -translate-y-2 opacity-0"
        >
          <DisclosurePanel class="faq-answer">
            <div v-html="item.answer"></div>
          </DisclosurePanel>
        </transition>
      </Disclosure>
    </div>

    <!-- Empty state -->
    <div v-else class="faq-empty">
      <p>No FAQ items found.</p>
    </div>
  </div>
</template>

<script setup>
/**
 * NotionFaqDropdown Component
 *
 * Fetches FAQ content from Notion and displays as an accordion.
 * Content is server-rendered for SEO.
 *
 * Props:
 * - slug: The FAQ page slug (e.g., 'delivery', 'trial')
 */
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'

const props = defineProps({
  slug: {
    type: String,
    required: true
  }
})

// Fetch FAQ content from Notion
const { data, pending, error } = await useFetch(`/api/notion-faq/${props.slug}`, {
  key: `faq-dropdown-${props.slug}`
})

// Parse the HTML content into Q&A pairs
// Notion content uses ## for questions, content below is the answer
const faqItems = computed(() => {
  if (!data.value?.data?.content) return []

  const html = data.value.data.content
  const items = []

  // Split by h2 tags (questions)
  const parts = html.split(/<h2[^>]*>/)

  for (let i = 1; i < parts.length; i++) {
    const part = parts[i]
    const endH2 = part.indexOf('</h2>')

    if (endH2 === -1) continue

    const question = part.substring(0, endH2).replace(/<[^>]+>/g, '').trim()
    let answer = part.substring(endH2 + 5).trim()

    // Stop at next h2 or end
    const nextH2 = answer.indexOf('<h2')
    if (nextH2 !== -1) {
      answer = answer.substring(0, nextH2)
    }

    // Clean up answer
    answer = answer.replace(/^<hr\s*\/?>/i, '').trim()

    if (question && answer) {
      items.push({ question, answer })
    }
  }

  return items
})

// Generate FAQ Schema for SEO
const faqSchema = computed(() => {
  if (!faqItems.value.length) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.value.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer.replace(/<[^>]+>/g, '') // Strip HTML for schema
      }
    }))
  }
})

// Add FAQ schema to head
useHead({
  script: computed(() => {
    if (!faqSchema.value) return []
    return [{
      type: 'application/ld+json',
      innerHTML: JSON.stringify(faqSchema.value)
    }]
  })
})
</script>

<style scoped>
.notion-faq-dropdown {
  width: 100%;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.faq-item {
  background: #f9fafb;
  border-radius: 8px;
  overflow: hidden;
}

.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 16px 20px;
  text-align: left;
  font-weight: 500;
  color: #1f2937;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}

.faq-question:hover {
  background: #f3f4f6;
}

.faq-icon {
  width: 24px;
  height: 24px;
  color: #6b7280;
  transition: transform 0.2s;
  flex-shrink: 0;
}

.faq-icon--open {
  transform: rotate(180deg);
}

.faq-answer {
  padding: 0 20px 16px;
  color: #4b5563;
  line-height: 1.6;
}

.faq-answer :deep(p) {
  margin-bottom: 12px;
}

.faq-answer :deep(p:last-child) {
  margin-bottom: 0;
}

.faq-answer :deep(ul),
.faq-answer :deep(ol) {
  margin: 12px 0;
  padding-left: 20px;
}

.faq-answer :deep(li) {
  margin-bottom: 6px;
}

.faq-answer :deep(strong) {
  font-weight: 600;
  color: #1f2937;
}

.faq-answer :deep(a) {
  color: #7c3aed;
  text-decoration: none;
}

.faq-answer :deep(a:hover) {
  text-decoration: underline;
}

.faq-loading {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.faq-skeleton {
  height: 56px;
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.faq-error,
.faq-empty {
  text-align: center;
  padding: 24px;
  color: #6b7280;
}
</style>
