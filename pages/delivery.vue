<template>
  <div class="delivery-page">
    <!-- Hero Section -->
    <section class="hero bg-gradient-to-b from-purple-50 to-white py-16 md:py-24">
      <Container>
        <div class="max-w-3xl mx-auto text-center">
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Delivery to Your Door
          </h1>
          <p class="text-xl text-gray-600 mb-8">
            Free Sydney delivery within 15km. Full-size delivery — we never compress our mattresses.
            Setup included, packaging removed.
          </p>
          <div class="flex flex-wrap justify-center gap-4">
            <NuxtLink to="/mattresses/cloud" class="btn bg-purple-600 text-white hover:bg-purple-700 px-6 py-3 rounded-lg font-medium">
              Shop Mattresses
            </NuxtLink>
            <a href="#faq" class="btn bg-white text-purple-600 border border-purple-200 hover:border-purple-400 px-6 py-3 rounded-lg font-medium">
              View FAQ
            </a>
          </div>
        </div>
      </Container>
    </section>

    <!-- Key Benefits -->
    <section class="benefits py-16 bg-white">
      <Container>
        <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div class="benefit text-center p-6">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="ic:outline-local-shipping" class="w-8 h-8 text-green-600" />
            </div>
            <h3 class="text-lg font-semibold mb-2">Free Sydney Delivery</h3>
            <p class="text-gray-600">Within 15km of Marrickville. Beyond that, just $2/km.</p>
          </div>
          <div class="benefit text-center p-6">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="ic:outline-schedule" class="w-8 h-8 text-blue-600" />
            </div>
            <h3 class="text-lg font-semibold mb-2">Fast Turnaround</h3>
            <p class="text-gray-600">Most Sydney orders delivered within 3 days. Same-day often available.</p>
          </div>
          <div class="benefit text-center p-6">
            <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="ic:outline-home" class="w-8 h-8 text-purple-600" />
            </div>
            <h3 class="text-lg font-semibold mb-2">Room Delivery & Setup</h3>
            <p class="text-gray-600">Delivered to your room, unpacked, packaging removed.</p>
          </div>
        </div>

        <!-- Pricing Table -->
        <div class="mt-16 max-w-2xl mx-auto">
          <h2 class="text-2xl font-bold text-center mb-8">Delivery Pricing</h2>
          <div class="bg-gray-50 rounded-xl overflow-hidden">
            <table class="w-full">
              <thead class="bg-gray-100">
                <tr>
                  <th class="px-6 py-4 text-left font-semibold">Location</th>
                  <th class="px-6 py-4 text-right font-semibold">Price</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr>
                  <td class="px-6 py-4">Sydney (within 15km of Marrickville)</td>
                  <td class="px-6 py-4 text-right font-medium text-green-600">FREE</td>
                </tr>
                <tr>
                  <td class="px-6 py-4">Sydney (beyond 15km)</td>
                  <td class="px-6 py-4 text-right">$2 per km</td>
                </tr>
                <tr>
                  <td class="px-6 py-4">Melbourne / Brisbane / Canberra (within 15km CBD)</td>
                  <td class="px-6 py-4 text-right">$190 flat</td>
                </tr>
                <tr>
                  <td class="px-6 py-4">Interstate (beyond 15km)</td>
                  <td class="px-6 py-4 text-right">$190 + $2/km</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p class="text-center text-gray-500 mt-4 text-sm">
            Use the shipping calculator on any product page for your exact cost.
          </p>
        </div>
      </Container>
    </section>

    <!-- AI Chat Section -->
    <section class="chat-section py-16 bg-purple-50">
      <Container>
        <div class="max-w-2xl mx-auto">
          <div class="text-center mb-8">
            <h2 class="text-2xl font-bold mb-2">Have a Question?</h2>
            <p class="text-gray-600">Ask our AI assistant about delivery times, costs, or anything else.</p>
          </div>
          <AusbedsChat />
        </div>
      </Container>
    </section>

    <!-- FAQ Dropdown Section -->
    <section id="faq" class="faq-section py-16 bg-white">
      <Container>
        <div class="max-w-3xl mx-auto">
          <div class="text-center mb-12">
            <h2 class="text-2xl font-bold mb-2">Delivery FAQ</h2>
            <p class="text-gray-600">Everything you need to know about getting your mattress delivered.</p>
          </div>
          <NotionFaqDropdown slug="delivery" />
        </div>
      </Container>
    </section>

    <!-- CTA Section -->
    <section class="cta py-16 bg-gray-900 text-white">
      <Container>
        <div class="max-w-2xl mx-auto text-center">
          <h2 class="text-3xl font-bold mb-4">Ready to Order?</h2>
          <p class="text-gray-300 mb-8">
            Every mattress comes with a 4-month trial. If delivery or the mattress isn't right, we'll make it right.
          </p>
          <NuxtLink to="/mattresses" class="btn bg-purple-600 text-white hover:bg-purple-700 px-8 py-4 rounded-lg font-medium text-lg">
            Browse Mattresses
          </NuxtLink>
        </div>
      </Container>
    </section>
  </div>
</template>

<script setup>
/**
 * Delivery Marketing Page
 *
 * Combines:
 * - Marketing content (hero, benefits, pricing)
 * - AI chatbox (answers from Ragie KB)
 * - FAQ dropdown (from Notion FAQ database)
 *
 * All delivery content on one URL for SEO + UX
 */

useHead({
  title: 'Delivery Information | Ausbeds',
  meta: [
    { name: 'description', content: 'Free Sydney delivery within 15km. Melbourne, Brisbane, Canberra from $190. Full-size mattress delivery to your room with setup included.' }
  ]
})

// FAQ Schema for SEO (will be populated by NotionFaqDropdown)
</script>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
</style>
