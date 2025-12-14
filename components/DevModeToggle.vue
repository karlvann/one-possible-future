<template>
  <button
    class="dev-mode-toggle"
    :class="{ 'dev-mode-toggle--active': isDevMode }"
    @click="toggleDevMode"
    :title="isDevMode ? 'Hide dev notes (Customer View)' : 'Show dev notes (Dev View)'"
  >
    <span class="dev-mode-toggle__icon">{{ isDevMode ? '👁️' : '👁️‍🗨️' }}</span>
    <span class="dev-mode-toggle__label">{{ isDevMode ? 'Dev' : 'Customer' }}</span>
  </button>
</template>

<script setup>
const { isDevMode, toggleDevMode } = useDevMode()
</script>

<style scoped>
.dev-mode-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: #1f2937;
  color: #9ca3af;
  border: 1px solid #374151;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.dev-mode-toggle:hover {
  background: #374151;
  color: #fff;
}

.dev-mode-toggle--active {
  background: #7c3aed;
  border-color: #8b5cf6;
  color: #fff;
}

.dev-mode-toggle--active:hover {
  background: #6d28d9;
}

.dev-mode-toggle__icon {
  font-size: 14px;
}

.dev-mode-toggle__label {
  font-family: system-ui, -apple-system, sans-serif;
}
</style>
