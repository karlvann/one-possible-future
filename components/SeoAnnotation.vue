<template>
  <div class="seo-annotation" :class="[`seo-annotation--${type}`, { 'seo-annotation--collapsed': isCollapsed }]">
    <button
      class="seo-annotation__toggle"
      @click="isCollapsed = !isCollapsed"
      :title="isCollapsed ? 'Show SEO explanation' : 'Hide SEO explanation'"
    >
      <span class="seo-annotation__icon">{{ typeIcon }}</span>
      <span class="seo-annotation__label">{{ typeLabel }}</span>
      <span class="seo-annotation__chevron">{{ isCollapsed ? '▼' : '▲' }}</span>
    </button>

    <div v-show="!isCollapsed" class="seo-annotation__content">
      <div class="seo-annotation__header">
        <h4 class="seo-annotation__title">{{ title }}</h4>
        <span v-if="forWho" class="seo-annotation__for">For: {{ forWho }}</span>
      </div>

      <div class="seo-annotation__body">
        <slot />
      </div>

      <div v-if="codeExample" class="seo-annotation__code">
        <span class="seo-annotation__code-label">Implementation:</span>
        <pre><code>{{ codeExample }}</code></pre>
      </div>

      <div v-if="file" class="seo-annotation__file">
        <span class="seo-annotation__file-icon">📁</span>
        <code>{{ file }}</code>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * SeoAnnotation Component
 *
 * Displays visible SEO explanations on the page.
 * Used to educate Karl and Alex about what's happening and why.
 *
 * Types:
 * - info: General information (blue)
 * - strategy: SEO strategy explanation (purple)
 * - technical: Technical implementation (green)
 * - warning: Important consideration (orange)
 * - llm: LLM-specific behavior (pink)
 */

import { ref, computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'info',
    validator: (v) => ['info', 'strategy', 'technical', 'warning', 'llm'].includes(v)
  },
  title: {
    type: String,
    required: true
  },
  forWho: {
    type: String,
    default: '' // e.g., "Karl", "Alex (Dev)", "Both"
  },
  codeExample: {
    type: String,
    default: ''
  },
  file: {
    type: String,
    default: '' // e.g., "components/ShadowPage.vue:67"
  },
  collapsed: {
    type: Boolean,
    default: false
  }
})

const isCollapsed = ref(props.collapsed)

const typeIcon = computed(() => {
  const icons = {
    info: 'ℹ️',
    strategy: '🎯',
    technical: '⚙️',
    warning: '⚠️',
    llm: '🤖'
  }
  return icons[props.type]
})

const typeLabel = computed(() => {
  const labels = {
    info: 'SEO Info',
    strategy: 'SEO Strategy',
    technical: 'Technical',
    warning: 'Important',
    llm: 'LLM Behavior'
  }
  return labels[props.type]
})
</script>

<style scoped>
.seo-annotation {
  margin: 16px 0;
  border-radius: 8px;
  font-family: system-ui, -apple-system, sans-serif;
  font-size: 14px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Type variations */
.seo-annotation--info {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border: 2px solid #3b82f6;
}
.seo-annotation--info .seo-annotation__toggle {
  background: #3b82f6;
}

.seo-annotation--strategy {
  background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
  border: 2px solid #8b5cf6;
}
.seo-annotation--strategy .seo-annotation__toggle {
  background: #8b5cf6;
}

.seo-annotation--technical {
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
  border: 2px solid #10b981;
}
.seo-annotation--technical .seo-annotation__toggle {
  background: #10b981;
}

.seo-annotation--warning {
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  border: 2px solid #f59e0b;
}
.seo-annotation--warning .seo-annotation__toggle {
  background: #f59e0b;
}

.seo-annotation--llm {
  background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%);
  border: 2px solid #ec4899;
}
.seo-annotation--llm .seo-annotation__toggle {
  background: #ec4899;
}

/* Toggle button */
.seo-annotation__toggle {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  color: white;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  text-align: left;
}

.seo-annotation__toggle:hover {
  filter: brightness(1.1);
}

.seo-annotation__icon {
  font-size: 16px;
}

.seo-annotation__label {
  flex: 1;
}

.seo-annotation__chevron {
  font-size: 10px;
  opacity: 0.8;
}

/* Content */
.seo-annotation__content {
  padding: 16px;
}

.seo-annotation__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.seo-annotation__title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
}

.seo-annotation__for {
  font-size: 12px;
  padding: 2px 8px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  color: #4b5563;
}

.seo-annotation__body {
  color: #374151;
  line-height: 1.6;
}

.seo-annotation__body :deep(p) {
  margin: 0 0 8px;
}

.seo-annotation__body :deep(ul) {
  margin: 8px 0;
  padding-left: 20px;
}

.seo-annotation__body :deep(li) {
  margin-bottom: 4px;
}

.seo-annotation__body :deep(strong) {
  color: #111827;
}

.seo-annotation__body :deep(code) {
  background: rgba(0, 0, 0, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: ui-monospace, monospace;
  font-size: 13px;
}

/* Code example */
.seo-annotation__code {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed rgba(0, 0, 0, 0.2);
}

.seo-annotation__code-label {
  display: block;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  color: #6b7280;
  margin-bottom: 6px;
}

.seo-annotation__code pre {
  margin: 0;
  padding: 12px;
  background: #1f2937;
  border-radius: 6px;
  overflow-x: auto;
}

.seo-annotation__code code {
  font-family: ui-monospace, SFMono-Regular, monospace;
  font-size: 12px;
  color: #e5e7eb;
  background: none;
  padding: 0;
}

/* File reference */
.seo-annotation__file {
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #6b7280;
}

.seo-annotation__file code {
  font-family: ui-monospace, monospace;
  color: #4b5563;
}

/* Collapsed state */
.seo-annotation--collapsed .seo-annotation__toggle {
  border-radius: 6px;
}
</style>
