<template>
  <div class="checkout-page">
    <div class="checkout-container">
      <!-- Header -->
      <div class="checkout-header">
        <NuxtLink to="/" class="logo">
          <img src="https://cdn.ausbeds.com.au/logo.png" alt="Ausbeds" />
        </NuxtLink>
        <span class="secure-badge">Secure Checkout</span>
      </div>

      <div v-if="error" class="checkout-error">
        <h2>Quote Not Found</h2>
        <p>We couldn't find your quote. Please try going through the chat again.</p>
        <NuxtLink to="/" class="btn btn-primary">Back to Homepage</NuxtLink>
      </div>

      <div v-else class="checkout-content">
        <!-- Order Summary (Right Column) -->
        <div class="order-summary">
          <h2>Order Summary</h2>

          <div class="product-card">
            <div class="product-info">
              <h3>{{ quote.product?.name }} Mattress</h3>
              <p class="product-size">{{ quote.sizeName }}</p>
              <p class="product-firmness" v-if="quote.firmness">
                {{ quote.firmness.name }} springs ({{ quote.weight }}kg)
              </p>
            </div>
            <div class="product-price">{{ quote.product?.priceFormatted }}</div>
          </div>

          <div class="summary-line">
            <span>Delivery to {{ quote.postcode }}</span>
            <span>{{ quote.delivery?.formatted || '$79' }}</span>
          </div>

          <div class="summary-total">
            <span>Total</span>
            <span>{{ quote.totalFormatted }}</span>
          </div>

          <div class="trial-info">
            <p><strong>4-month trial</strong> included</p>
            <p class="trial-note">Your risk: {{ quote.returnCost }} if you return it</p>
          </div>
        </div>

        <!-- Checkout Form (Left Column) -->
        <div class="checkout-form">
          <form @submit.prevent="handleSubmit">
            <!-- Contact Section -->
            <div class="form-section">
              <h3>Contact</h3>
              <div class="form-group">
                <label for="email">Email</label>
                <input
                  type="email"
                  id="email"
                  v-model="form.email"
                  required
                  placeholder="your@email.com"
                />
              </div>
              <div class="form-group">
                <label for="phone">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  v-model="form.phone"
                  required
                  placeholder="0400 000 000"
                />
              </div>
            </div>

            <!-- Delivery Section -->
            <div class="form-section">
              <h3>Delivery Address</h3>
              <div class="form-group">
                <label for="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  v-model="form.name"
                  required
                  placeholder="John Smith"
                />
              </div>
              <div class="form-group">
                <label for="address">Street Address</label>
                <input
                  type="text"
                  id="address"
                  v-model="form.address"
                  required
                  placeholder="123 Example Street"
                />
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label for="suburb">Suburb</label>
                  <input
                    type="text"
                    id="suburb"
                    v-model="form.suburb"
                    required
                    placeholder="Sydney"
                  />
                </div>
                <div class="form-group form-group-small">
                  <label for="state">State</label>
                  <select id="state" v-model="form.state" required>
                    <option value="NSW">NSW</option>
                    <option value="VIC">VIC</option>
                    <option value="QLD">QLD</option>
                    <option value="SA">SA</option>
                    <option value="WA">WA</option>
                    <option value="TAS">TAS</option>
                    <option value="NT">NT</option>
                    <option value="ACT">ACT</option>
                  </select>
                </div>
                <div class="form-group form-group-small">
                  <label for="postcode">Postcode</label>
                  <input
                    type="text"
                    id="postcode"
                    v-model="form.postcode"
                    required
                    maxlength="4"
                    placeholder="2000"
                  />
                </div>
              </div>
              <div class="form-group">
                <label for="instructions">Delivery Instructions (optional)</label>
                <textarea
                  id="instructions"
                  v-model="form.instructions"
                  rows="2"
                  placeholder="e.g., Leave at front door, call on arrival"
                ></textarea>
              </div>
            </div>

            <!-- Payment Section -->
            <div class="form-section">
              <h3>Payment</h3>
              <div class="payment-placeholder">
                <p>Payment integration coming soon.</p>
                <p class="payment-note">For now, we'll call you to complete payment over the phone.</p>
              </div>
            </div>

            <!-- Submit -->
            <button type="submit" class="btn btn-primary btn-submit" :disabled="isSubmitting">
              {{ isSubmitting ? 'Processing...' : 'Complete Order' }}
            </button>

            <p class="terms-note">
              By completing this order, you agree to our
              <a href="/faq/trial" target="_blank">trial policy</a> and
              <a href="/faq/warranty" target="_blank">warranty terms</a>.
            </p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

definePageMeta({
  layout: 'raw'
})

const route = useRoute()
const quoteId = route.query.quote

// Fetch quote data
const { data: quote, error } = await useFetch(
  quoteId ? `/api/quote/${quoteId}` : '/api/quote/preview'
)

// Form state - pre-filled from quote
const form = reactive({
  email: '',
  phone: '',
  name: '',
  address: '',
  suburb: '',
  state: 'NSW',
  postcode: '',
  instructions: ''
})

const isSubmitting = ref(false)

// Pre-fill form when quote loads
onMounted(() => {
  if (quote.value) {
    form.email = quote.value.email || ''
    form.phone = quote.value.phone || ''
    form.name = quote.value.customerName || ''
    form.postcode = quote.value.postcode || ''

    // Parse address if available
    if (quote.value.address) {
      form.address = quote.value.address
    }
  }
})

async function handleSubmit() {
  isSubmitting.value = true

  try {
    // For now, just save the order details
    await $fetch('/api/quote/order', {
      method: 'POST',
      body: {
        quoteId,
        ...form,
        product: quote.value.product,
        size: quote.value.size,
        sizeName: quote.value.sizeName,
        delivery: quote.value.delivery,
        totalPrice: quote.value.totalPrice,
        totalFormatted: quote.value.totalFormatted
      }
    })

    // Redirect to confirmation (placeholder)
    alert('Order submitted! We will call you to complete payment.')
  } catch (err) {
    console.error('Order submission failed:', err)
    alert('Something went wrong. Please try again or call us.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.checkout-page {
  min-height: 100vh;
  background: #f3f4f6;
}

.checkout-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 20px;
}

.checkout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  margin-bottom: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.logo img {
  height: 36px;
}

.secure-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #059669;
  font-size: 0.875rem;
  font-weight: 500;
}

.secure-badge::before {
  content: '🔒';
}

.checkout-error {
  max-width: 500px;
  margin: 80px auto;
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.checkout-error h2 {
  margin: 0 0 12px 0;
}

.checkout-error p {
  color: #666;
  margin-bottom: 20px;
}

.checkout-content {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 32px;
}

@media (max-width: 900px) {
  .checkout-content {
    grid-template-columns: 1fr;
  }

  .order-summary {
    order: -1;
  }
}

/* Order Summary */
.order-summary {
  background: white;
  border-radius: 12px;
  padding: 24px;
  height: fit-content;
  position: sticky;
  top: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.order-summary h2 {
  margin: 0 0 20px 0;
  font-size: 1.25rem;
}

.product-card {
  display: flex;
  justify-content: space-between;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  margin-bottom: 16px;
}

.product-info h3 {
  margin: 0 0 4px 0;
  font-size: 1rem;
}

.product-size {
  margin: 0;
  color: #666;
}

.product-firmness {
  margin: 4px 0 0 0;
  font-size: 0.875rem;
  color: #0857A6;
}

.product-price {
  font-weight: 600;
}

.summary-line {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #e5e7eb;
  color: #666;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  padding: 16px 0;
  font-size: 1.25rem;
  font-weight: 700;
}

.trial-info {
  background: #EFF6FF;
  border-radius: 8px;
  padding: 12px 16px;
  margin-top: 16px;
}

.trial-info p {
  margin: 0;
}

.trial-note {
  margin-top: 4px !important;
  font-size: 0.875rem;
  color: #666;
}

/* Checkout Form */
.checkout-form {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.form-section {
  margin-bottom: 28px;
}

.form-section h3 {
  margin: 0 0 16px 0;
  font-size: 1.125rem;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #0857A6;
  box-shadow: 0 0 0 3px rgba(8, 87, 166, 0.1);
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: #9ca3af;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 100px 100px;
  gap: 12px;
}

@media (max-width: 600px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}

.payment-placeholder {
  background: #f9fafb;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 24px;
  text-align: center;
}

.payment-placeholder p {
  margin: 0;
  color: #666;
}

.payment-note {
  margin-top: 8px !important;
  font-size: 0.875rem;
}

.btn {
  display: inline-block;
  padding: 14px 28px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #0857A6;
  color: white;
}

.btn-primary:hover {
  background: #064785;
}

.btn-primary:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.btn-submit {
  width: 100%;
  font-size: 1.125rem;
  padding: 16px 28px;
  margin-top: 8px;
}

.terms-note {
  margin-top: 16px;
  font-size: 0.8125rem;
  color: #666;
  text-align: center;
}

.terms-note a {
  color: #0857A6;
  text-decoration: none;
}

.terms-note a:hover {
  text-decoration: underline;
}
</style>
