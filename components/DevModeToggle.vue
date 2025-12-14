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
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  background: #1f2937;
  color: #9ca3af;
  border: 2px solid #374151;
  border-radius: 50px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
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
  font-size: 16px;
}

.dev-mode-toggle__label {
  font-family: system-ui, -apple-system, sans-serif;
}

@media (max-width: 640px) {
  .dev-mode-toggle {
    bottom: 16px;
    left: 16px;
    padding: 8px 12px;
    font-size: 12px;
  }
}
</style>
