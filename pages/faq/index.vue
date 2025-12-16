<template>
  <div class="help-hub">
    <div class="help-hub__container">
      <h1>Ausbeds FAQ</h1>
      <p>Comprehensive information about our policies, products, sizing, and showrooms.</p>
      <p>Status: Page is loading...</p>
    </div>
  </div>
</template>

<script setup>
/**
 * FAQ Hub Page - Ultra-minimal version for SSR debugging
 */

// No API calls, no computed, just basic page
useHead({
  title: 'FAQ | Ausbeds'
})
</script>

<style scoped>
.help-hub {
  min-height: 100vh;
  background: #f9fafb;
  padding: 40px 20px;
}

.help-hub__container {
  max-width: 900px;
  margin: 0 auto;
}
</style>
