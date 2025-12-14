<template>
  <Section>
    <Container class="text-center py-20">
      <div class="max-w-2xl mx-auto">
        <h1 class="text-3xl font-bold mb-4">Thanks for your order!</h1>
        <p class="text-lg mb-6">You will receive an email confirmation shortly. We will be in touch within 24 hours to confirm delivery dates and details.</p>
        <NuxtLink to="/" class="btn btn-blue btn-large">
          Go to home page
        </NuxtLink>
        <div v-if="order" class="mt-4 text-sm text-gray-600">
          Your Order ID: <span class="font-mono">{{ order }}</span>
        </div>
      </div>
    </Container>
  </Section>
</template>

<script setup>
const route = useRoute()
const order = route.query?.order || null
const settingsStore = useSettingsStore()
settingsStore.hideLoadingModal()
</script>