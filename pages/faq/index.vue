<template>
  <div class="help-hub">
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

      <nav class="help-hub__nav">
        <!-- SECTION: Policies & Operations -->
        <div v-if="groupedFaqs.Policies?.length" class="help-hub__section">
          <h2 class="help-hub__section-title">Policies & Operations</h2>

          <div class="help-hub__links">
            <NuxtLink
              v-for="faq in groupedFaqs.Policies"
              :key="faq.slug"
              :to="`/faq/${faq.slug}`"
              class="help-hub__link"
            >
              <span class="help-hub__link-icon">{{ faq.icon || '📄' }}</span>
              <div class="help-hub__link-content">
                <h3>{{ faq.title }}</h3>
                <p>{{ faq.metaDescription }}</p>
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- SECTION: Products & Sizing -->
        <div v-if="groupedFaqs.Products?.length" class="help-hub__section">
          <h2 class="help-hub__section-title">Products & Sizing</h2>

          <div class="help-hub__links">
            <NuxtLink
              v-for="faq in groupedFaqs.Products"
              :key="faq.slug"
              :to="`/faq/${faq.slug}`"
              class="help-hub__link"
            >
              <span class="help-hub__link-icon">{{ faq.icon || '📄' }}</span>
              <div class="help-hub__link-content">
                <h3>{{ faq.title }}</h3>
                <p>{{ faq.metaDescription }}</p>
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- SECTION: Contact & Showroom -->
        <div v-if="groupedFaqs.Contact?.length" class="help-hub__section">
          <h2 class="help-hub__section-title">Contact & Showroom</h2>

          <div class="help-hub__links">
            <NuxtLink
              v-for="faq in groupedFaqs.Contact"
              :key="faq.slug"
              :to="`/faq/${faq.slug}`"
              class="help-hub__link"
            >
              <span class="help-hub__link-icon">{{ faq.icon || '📄' }}</span>
              <div class="help-hub__link-content">
                <h3>{{ faq.title }}</h3>
                <p>{{ faq.metaDescription }}</p>
              </div>
            </NuxtLink>
          </div>
        </div>
      </nav>

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
 * FAQ Hub Page - Simplified version for SSR debugging
 */

// Fetch FAQ articles grouped by category from database
const { data: faqResponse } = await useFetch('/api/notion-faq?grouped=true', {
  key: 'faq-index-grouped'
})

// Extract grouped data
const groupedFaqs = computed(() => faqResponse.value?.data || { Policies: [], Products: [], Contact: [] })

// Meta tags
useHead({
  title: 'FAQ | Ausbeds',
  meta: [
    { name: 'robots', content: 'index, follow' },
    { name: 'description', content: 'Comprehensive information about Ausbeds policies, products, sizing, and showrooms.' }
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
</style>
