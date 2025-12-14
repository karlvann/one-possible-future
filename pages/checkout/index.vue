<template>
  <div class="lg:min-h-screen">
    
    <div class="grid grid-cols-1 lg:grid-cols-12">
      <!-- Left Column - Checkout Form -->
      <div class="lg:col-span-7 py-8 lg:py-8 lg:pb-16 bg-white">

        <div class="px-4 sm:px-8">

          <div class="mb-8">
            <LogoDark class="w-[120px] sm:w-[150px] mb-4" />
            <NuxtLink
            v-if="!invoiceId"
            to="/" class="text-sm text-gray-600 hover:text-grey-dark flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back to shop
            </NuxtLink>
          </div>

          <h1 class="text-3xl font-bold text-grey-dark"><template v-if="invoiceId">Pay for Invoice #{{ invoiceId }}</template><template v-else>Checkout</template></h1>

          <div v-if="cartStore.subtotal <= 0" class="mt-4">
            Your cart is empty. Please add items to your cart before proceeding to checkout.
          </div>

          <form class="space-y-8 mt-8" v-else>
            <!-- Contact Section -->
            <div>
              <h2 class="text-lg md:text-xl font-bold text-grey-dark mb-4">Contact information</h2>
              <label for="email" class="block text-sm font-medium text-grey-dark mb-1">
                Email address
              </label>
              <input
              v-model="customer.email"
              type="email"
              id="email"
              name="email"
              autocomplete="email"
              :class="[
                'w-full px-4 py-3 border border-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors',
                formErrors.email ? 'border-[#EC5528]' : 'border-grey-dark focus:border-blue-500'
              ]"
              placeholder="your@email.com"
              @blur="handleBlur('email'); saveCart()"
              />
              <p v-if="formErrors.email" class="mt-1 text-sm text-[#EC5528]">{{ formErrors.email }}</p>
            </div>

            <!-- Shipping Address Section -->
            <div>
              <h2 class="text-lg md:text-xl font-bold text-grey-dark mb-4">Shipping address</h2>
              <div class="space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label for="first_name" class="block text-sm font-medium text-grey-dark mb-1">
                      First name
                    </label>
                    <input
                    v-model="customer.first_name"
                    type="text"
                    id="first_name"
                    name="first_name"
                    autocomplete="given-name"
                    :class="[
                      'w-full px-4 py-3 border border-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors',
                      formErrors.first_name ? 'border-[#EC5528]' : 'border-grey-dark focus:border-blue-500'
                    ]"
                    @blur="handleBlur('first_name')"
                    />
                    <p v-if="formErrors.first_name" class="mt-1 text-sm text-[#EC5528]">{{ formErrors.first_name }}</p>
                  </div>
                  <div>
                    <label for="last_name" class="block text-sm font-medium text-grey-dark mb-1">
                      Last name
                    </label>
                    <input
                    v-model="customer.last_name"
                    type="text"
                    id="last_name"
                    name="last_name"
                    autocomplete="family-name"
                    :class="[
                      'w-full px-4 py-3 border border-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors',
                      formErrors.last_name ? 'border-[#EC5528]' : 'border-grey-dark focus:border-blue-500'
                    ]"
                    @blur="handleBlur('last_name')"
                    />
                    <p v-if="formErrors.last_name" class="mt-1 text-sm text-[#EC5528]">{{ formErrors.last_name }}</p>
                  </div>
                </div>

                <div>
                  <label for="phone" class="block text-sm font-medium text-grey-dark mb-1">
                    Phone number
                  </label>
                  <input
                  v-model="customer.phone"
                  type="tel"
                  id="phone"
                  name="phone"
                  autocomplete="tel"
                  :class="[
                    'w-full px-4 py-3 border border-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors',
                    formErrors.phone ? 'border-[#EC5528]' : 'border-grey-dark focus:border-blue-500'
                  ]"
                  placeholder="04XX XXX XXX"
                  @blur="handleBlur('phone')"
                  />
                  <p v-if="formErrors.phone" class="mt-1 text-sm text-[#EC5528]">{{ formErrors.phone }}</p>
                </div>

                <div>
                  <label for="shipping_address_line1" class="block text-sm font-medium text-grey-dark mb-1">
                    Address
                  </label>
                  <input
                  v-model="customer.shipping_address_line1"
                  type="text"
                  id="shipping_address_line1"
                  name="shipping_address_line1"
                  autocomplete="address-line1"
                  :class="[
                    'w-full px-4 py-3 border border-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors',
                    formErrors.shipping_address_line1 ? 'border-[#EC5528]' : 'border-grey-dark focus:border-blue-500'
                  ]"
                  @blur="handleBlur('shipping_address_line1')"
                  />
                  <p v-if="formErrors.shipping_address_line1" class="mt-1 text-sm text-[#EC5528]">{{ formErrors.shipping_address_line1 }}</p>
                </div>

                <div>
                  <label for="shipping_address_line2" class="block text-sm font-medium text-grey-dark mb-1">
                    Address line 2 (optional)
                  </label>
                  <input
                  v-model="customer.shipping_address_line2"
                  type="text"
                  id="shipping_address_line2"
                  name="shipping_address_line2"
                  autocomplete="address-line2"
                  class="w-full px-4 py-3 border border-2 border-grey-dark rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>

                <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div class="col-span-2 md:col-span-1">
                    <label for="shipping_address_city" class="block text-sm font-medium text-grey-dark mb-1">
                      City
                    </label>
                    <input
                    v-model="customer.shipping_address_city"
                    type="text"
                    id="shipping_address_city"
                    name="shipping_address_city"
                    autocomplete="address-level2"
                    :class="[
                      'w-full px-4 py-3 border border-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors',
                      formErrors.shipping_address_city ? 'border-[#EC5528]' : 'border-grey-dark focus:border-blue-500'
                    ]"
                    @blur="handleBlur('shipping_address_city')"
                    />
                    <p v-if="formErrors.shipping_address_city" class="mt-1 text-sm text-[#EC5528]">{{ formErrors.shipping_address_city }}</p>
                  </div>
                  <div>
                    <label for="shipping_address_state" class="block text-sm font-medium text-grey-dark mb-1">
                      State
                    </label>
                    <input
                    v-model="customer.shipping_address_state"
                    type="text"
                    id="shipping_address_state"
                    name="shipping_address_state"
                    autocomplete="address-level1"
                    :class="[
                      'w-full px-4 py-3 border border-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors',
                      formErrors.shipping_address_state ? 'border-[#EC5528]' : 'border-grey-dark focus:border-blue-500'
                    ]"
                    @blur="handleBlur('shipping_address_state')"
                    />
                    <p v-if="formErrors.shipping_address_state" class="mt-1 text-sm text-[#EC5528]">{{ formErrors.shipping_address_state }}</p>
                  </div>
                  <div>
                    <label for="shipping_address_postal_code" class="block text-sm font-medium text-grey-dark mb-1">
                      Postcode
                    </label>
                    <input
                    v-model="customer.shipping_address_postal_code"
                    type="text"
                    id="shipping_address_postal_code"
                    name="shipping_address_postal_code"
                    autocomplete="postal-code"
                    :class="[
                      'w-full px-4 py-3 border border-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors',
                      formErrors.shipping_address_postal_code ? 'border-[#EC5528]' : 'border-grey-dark focus:border-blue-500'
                    ]"
                    @blur="handleBlur('shipping_address_postal_code')"
                    />
                    <p v-if="formErrors.shipping_address_postal_code" class="mt-1 text-sm text-[#EC5528]">{{ formErrors.shipping_address_postal_code }}</p>
                  </div>
                </div>

                <!-- Different Billing Address Checkbox -->
                <div class="pt-2 pb-4">
                  <label class="flex items-center cursor-pointer">
                    <input
                    v-model="customer.different_billing"
                    type="checkbox"
                    class="mr-3 h-6 w-6 text-blue-600 border border-2 border-grey-dark rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span class="text-sm font-medium text-grey-dark">Use different billing address</span>
                  </label>
                </div>

                <!-- Billing Address Fields - Shown when different_billing is true -->
                <Transition
                enter-active-class="transition-all duration-300 ease-out"
                enter-from-class="opacity-0 max-h-0"
                enter-to-class="opacity-100 max-h-[1000px]"
                leave-active-class="transition-all duration-300 ease-in"
                leave-from-class="opacity-100 max-h-[1000px]"
                leave-to-class="opacity-0 max-h-0"
                >
                  <div v-if="customer.different_billing" class="space-y-4 overflow-hidden">
                    <h3 class="text-lg font-semibold text-grey-dark mb-4">Billing Address</h3>

                    <div>
                      <label for="billing_address_line1" class="block text-sm font-medium text-grey-dark mb-1">
                        Address
                      </label>
                      <input
                        v-model="customer.billing_address_line1"
                        type="text"
                        id="billing_address_line1"
                        name="billing_address_line1"
                        :class="[
                          'w-full px-4 py-3 border border-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors',
                          formErrors.billing_address_line1 ? 'border-[#EC5528]' : 'border-grey-dark focus:border-blue-500'
                        ]"
                        @blur="handleBlur('billing_address_line1')"
                      />
                      <p v-if="formErrors.billing_address_line1" class="mt-1 text-sm text-[#EC5528]">{{ formErrors.billing_address_line1 }}</p>
                    </div>

                    <div>
                      <label for="billing_address_line2" class="block text-sm font-medium text-grey-dark mb-1">
                        Apartment, suite, etc. (optional)
                      </label>
                      <input
                        v-model="customer.billing_address_line2"
                        type="text"
                        id="billing_address_line2"
                        name="billing_address_line2"
                        class="w-full px-4 py-3 border border-2 border-grey-dark rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>

                    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div class="col-span-2 md:col-span-1">
                        <label for="billing_address_city" class="block text-sm font-medium text-grey-dark mb-1">
                          City
                        </label>
                        <input
                          v-model="customer.billing_address_city"
                          type="text"
                          id="billing_address_city"
                          name="billing_address_city"
                          :class="[
                            'w-full px-4 py-3 border border-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors',
                            formErrors.billing_address_city ? 'border-[#EC5528]' : 'border-grey-dark focus:border-blue-500'
                          ]"
                          @blur="handleBlur('billing_address_city')"
                        />
                        <p v-if="formErrors.billing_address_city" class="mt-1 text-sm text-[#EC5528]">{{ formErrors.billing_address_city }}</p>
                      </div>
                      <div>
                        <label for="billing_address_state" class="block text-sm font-medium text-grey-dark mb-1">
                          State
                        </label>
                        <input
                        v-model="customer.billing_address_state"
                        type="text"
                        id="billing_address_state"
                        name="billing_address_state"
                        autocomplete="address-level1"
                        :class="[
                          'w-full px-4 py-3 border border-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors',
                          formErrors.billing_address_state ? 'border-[#EC5528]' : 'border-grey-dark focus:border-blue-500'
                        ]"
                        @blur="handleBlur('billing_address_state')"
                        />
                        <p v-if="formErrors.billing_address_state" class="mt-1 text-sm text-[#EC5528]">{{ formErrors.billing_address_state }}</p>
                      </div>
                      <div>
                        <label for="billing_address_postal_code" class="block text-sm font-medium text-grey-dark mb-1">
                          Postcode
                        </label>
                        <input
                          v-model="customer.billing_address_postal_code"
                          type="text"
                          id="billing_address_postal_code"
                          name="billing_address_postal_code"
                          :class="[
                            'w-full px-4 py-3 border border-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors',
                            formErrors.billing_address_postal_code ? 'border-[#EC5528]' : 'border-grey-dark focus:border-blue-500'
                          ]"
                          @blur="handleBlur('billing_address_postal_code')"
                        />
                        <p v-if="formErrors.billing_address_postal_code" class="mt-1 text-sm text-[#EC5528]">{{ formErrors.billing_address_postal_code }}</p>
                      </div>
                    </div>
                    <div>
                      <label for="abn" class="block text-sm font-medium text-grey-dark mb-1">
                        ABN (optional)
                      </label>
                      <input
                        v-model="customer.abn"
                        type="text"
                        id="abn"
                        name="abn"
                        class="w-full px-4 py-3 border border-2 border-grey-dark rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="XX XXX XXX XXX"
                      />
                    </div>
                  </div>
                </Transition>
              </div>
            </div>

            <div>
              <h2 class="text-lg md:text-xl font-bold text-grey-dark mb-4">Shipping</h2>
              <div v-if="deliveryError" class="bg-red-dark text-white p-4 rounded-md">
                {{ deliveryError }}
              </div>
              <div v-else-if="deliveryInfo.twoManDeliveryAvailable" class="smd:flex smd:gap-4 mb-4">
                <select
                v-model="twoManDelivery"
                @change="updateDeliveryMen"
                class="w-[180px] px-4 py-3 text-lg border-2 border-grey rounded-md appearance-none bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600"
                style="background-image: url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27currentColor%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e'); background-repeat: no-repeat; background-position: right 1rem center; background-size: 1.5em;"
                >
                  <option v-for="person in ['1 person', '2 person']" :value="person">
                    {{ person }}
                  </option>
                </select>
                <DeliveryInfoModal class="inline-block" />
              </div>
              <div v-if="deliveryInfo.cost !== null">
                <div>Shipping cost: <span class="font-bold">${{ cartStore.delivery.toLocaleString() }}</span></div>
                <div>{{ deliveryInfo.message }}</div>
              </div>
              <div v-else-if="!deliveryError">
                Enter your address to view shipping options.
              </div>
              <div class="mt-4">
                <label for="customernote" class="block text-sm font-medium text-grey-dark mb-1">
                  Notes
                </label>
                <textarea
                name="customernotes"
                v-model="customerNotes"
                placeholder="Delivery date preferences, special instructions, etc"
                class="w-full px-4 py-3 border border-2 border-grey-dark rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                rows="3"
                ></textarea>
              </div>
            </div>

            <!-- Payment Section -->
            <div>
              <h2 class="text-lg md:text-xl font-bold text-grey-dark mb-4">Payment</h2>
              
              <!-- Security Message -->
              <!-- <div class="bg-gray-50 border border-gray-300 rounded-lg p-3 mb-4">
                <p class="text-sm text-grey-dark">We never store your credit card number and your payment is secure.</p>
              </div> -->

              <!-- Payment Method Options -->
              <div class="space-y-3">
                <!-- Credit Card Option -->
                <div class="border border-2 rounded-lg" :class="selectedPaymentMethod === 'stripe' ? 'border-blue-500' : 'border-gray-300'">
                  <label class="flex items-center justify-between p-4 cursor-pointer">
                    <div class="flex items-center">
                      <input
                        type="radio"
                        name="payment_method"
                        value="stripe"
                        v-model="selectedPaymentMethod"
                        class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span class="ml-3 font-medium text-grey-dark">Credit card</span>
                    </div>
                    <img :src="stripeImg" alt="Stripe" loading="lazy" class="ml-auto h-6" />
                  </label>

                  <!-- Credit Card Form -->
                  <div v-if="selectedPaymentMethod === 'stripe'" class="px-4 pb-4 space-y-4 overflow-hidden">
                    <!-- Stripe Card Element -->
                    <div id="stripe-card-element" class="p-3 border-2 border-grey-dark rounded-lg min-h-[44px]">
                      <!-- Stripe Elements will be mounted here -->
                    </div>
                    <div v-if="stripeError" class="text-red-600 text-sm">{{ stripeError }}</div>
                  </div>
                </div>

                <!-- PayPal Option -->
                <div class="border border-2 rounded-lg" :class="selectedPaymentMethod === 'paypal' ? 'border-blue-500' : 'border-gray-300'">
                  <label class="flex items-center p-4 cursor-pointer">
                    <input
                    type="radio"
                    name="payment_method"
                    value="paypal"
                    v-model="selectedPaymentMethod"
                    class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span class="ml-3 font-medium text-grey-dark">PayPal</span>
                    <!-- PayPal Logo -->
                    <img :src="paypalImg" alt="PayPal" loading="lazy" class="ml-auto h-5" />
                  </label>

                  <!-- PayPal Container -->
                  <div v-if="selectedPaymentMethod === 'paypal'" class="hidden overflow-hidden">
                  </div>
                </div>

                <!-- Zip -->
                <div class="border border-2 rounded-lg" :class="selectedPaymentMethod === 'zip' ? 'border-blue-500' : 'border-gray-300'">
                  <label class="flex items-center p-4 cursor-pointer">
                    <input
                    type="radio"
                    name="payment_method"
                    value="zip"
                    v-model="selectedPaymentMethod"
                    class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span class="ml-3 font-medium text-grey-dark">Zip</span>
                    <img :src="zipImg" alt="Zip" loading="lazy" class="ml-auto h-5" />
                  </label>
                </div>

              </div>
            </div>

            <!-- Place Order Button -->
            <div class="hidden lg:block">

              <div 
              v-if="selectedPaymentMethod === 'paypal'"
              id="paypal-button-container" class="mt-2">
              </div>
              
              <button
              v-else
              @click="submitOrder"
              type="button"
              class="block w-full btn btn-blue btn-hover btn-large"
              >
                Pay now
              </button>

              <div
              v-if="submitError"
              class="bg-red p-2 lg:p-4 rounded-lg text-black text-sm mt-3 text-center">
                {{ submitError }}
              </div>

              <!-- Security Notice -->
              <div class="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Secure checkout powered by {{ selectedPaymentMethod === 'paypal' ? 'PayPal' : 'Stripe' }}</span>
              </div>
            </div>
            
          </form>
        </div>
      </div>

      <!-- Right Column - Order Summary (Sticky) -->
      <div class="lg:col-span-5 bg-[#f9f8f6] lg:min-h-screen">
        <div class="lg:sticky lg:top-0 py-8 lg:py-8" v-if="cartStore.subtotal > 0">
          <div class="px-4 sm:px-8">
            <h2 class="text-lg md:text-xl font-bold text-grey-dark mb-4">Order summary <span class="font-normal text-sm cursor-pointer" @click="cartStore.toggleCartOpen">(edit)</span></h2>
            
            <!-- Cart Items -->
            <div class="space-y-4 mb-6">
              <div v-for="item in cart" :key="item.sku" class="flex gap-4">
                <div class="relative">
                  <!-- Placeholder for product image -->
                  <div v-if="item.image" class="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    <NuxtLink v-if="item.slug" :to="`/mattresses/${item.slug}`">
                      <img :src="item.image" alt="Product Image" loading="lazy" class="w-full h-full object-cover rounded-lg" />
                    </NuxtLink>
                    <img v-else :src="item.image" alt="Product Image" loading="lazy" class="w-full h-full object-cover rounded-lg" />
                  </div>
                  <span class="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-blue text-white text-xs flex items-center justify-center">
                    {{ item.quantity }}
                  </span>
                </div>
                <div class="flex-1">
                  <NuxtLink v-if="item.slug" :to="`/mattresses/${item.slug}`">
                    <h3 class="font-medium text-grey-dark">{{ item.title }}</h3>
                  </NuxtLink>
                  <h3 v-else class="font-medium text-grey-dark">{{ item.title }}</h3>
                  <p class="text-sm text-gray-600">
                    <span v-if="item.size">{{ item.size }}</span>
                    <span v-if="item.size && item.firmness"> / </span>
                    <span v-if="item.firmness">{{ capitalizeFirstLetter(item.firmness) }}</span>
                  </p>
                </div>
                <div class="text-right">
                  <p class="font-medium text-grey-dark">${{ (item.price * item.quantity).toLocaleString() }}</p>
                </div>
              </div>
            </div>

            <!-- Totals -->
            <div class="border-t-2 border-grey-dark pt-6 space-y-3">
              <div class="flex justify-between text-base">
                <span class="text-gray-600">Subtotal</span>
                <span class="font-medium text-grey-dark">${{ cartStore.subtotal.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between text-base">
                <span class="text-gray-600">Shipping</span>
                <span class="font-medium text-grey-dark">{{ cartStore.delivery !== null ? `$${cartStore.delivery.toLocaleString()}` : 'Enter your address' }}</span>
              </div>
              <div
              v-if="discount > 0"
              class="flex justify-between text-base">
                <span class="text-gray-600">Discount</span>
                <span class="font-medium text-grey-dark">-${{ discount.toLocaleString() }}</span>
              </div>
              <div class="border-t-2 border-grey-dark pt-4 flex justify-between">
                <span class="text-lg font-semibold text-grey-dark">Total</span>
                <div class="text-right">
                  <p class="text-lg font-semibold text-grey-dark">${{ cartStore.total.toLocaleString() }}</p>
                  <p v-if="paymentsReceived === 0" class="text-xs text-gray-500">GST included</p>
                </div>
              </div>
              <template v-if="paymentsReceived !== 0">
                <div class="flex justify-between text-base">
                  <span class="text-gray-600">Payments received</span>
                  <span class="font-medium text-green-600">${{ paymentsReceived.toLocaleString() }}</span>
                </div>
                <div class="border-t-2 border-grey-dark pt-4 flex justify-between">
                  <span class="text-lg font-semibold text-grey-dark">Balance owing</span>
                  <div class="text-right">
                    <p class="text-lg font-semibold text-grey-dark">${{ balanceOwing.toLocaleString() }}</p>
                    <p class="text-xs text-gray-500">GST included</p>
                  </div>
                </div>
              </template>
            </div>

            <div class="lg:hidden mt-8">

              <div 
              v-if="selectedPaymentMethod === 'paypal'"
              id="paypal-button-container2" class="mt-2">
              </div>

              <button
              v-else
              @click="submitOrder"
              type="button"
              class="block w-full btn btn-blue btn-hover btn-large"
              >
                Pay now
              </button>

              <div
              v-if="submitError"
              class="bg-red p-2 lg:p-4 rounded-lg text-black text-sm mt-3 text-center">
                {{ submitError }}
              </div>

              <!-- Security Notice -->
              <div class="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Secure checkout powered by {{ selectedPaymentMethod === 'paypal' ? 'PayPal' : 'Stripe' }}</span>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  </div>

  <TransitionRoot as="template" :show="stripeErrorModal">
    <Dialog as="div" class="relative z-10">
      <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-[rgba(0,0,0,0.7)] transition-opacity" @click="stripeErrorModal = false" />
      </TransitionChild>
      <TransitionChild 
      as="template" 
      enter="ease-out duration-300" 
      enter-from="opacity-0" 
      enter-to="opacity-100" 
      leave="ease-in duration-200" 
      leave-from="opacity-100" 
      leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-[rgba(0,0,0,0.3)] transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto max-w-[450px] mx-auto">
        <div class="flex min-h-full justify-center p-4 text-center items-center text-center">
          <TransitionChild 
          as="template" 
          enter="ease-out duration-300" 
          enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" 
          enter-to="opacity-100 translate-y-0 sm:scale-100" 
          leave="ease-in duration-200" 
          leave-from="opacity-100 translate-y-0 sm:scale-100" 
          leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl">
              <div class="bg-white px-3 py-6 sm:px-6 sm:py-6 lg:px-8 lg:py-10 text-center flex flex-col items-center">
                <div class="mb-4">
                  <DialogTitle as="h2" class="text-2xl font-bold my-4">
                    Payment error
                  </DialogTitle>
                  <button @click="stripeErrorModal = false" class="absolute top-4 right-4 text-grey-dark hover:text-gray-500 focus-visible:none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p class="mb-6">
                  Please check to make sure your credit card details have been entered correctly and try again.
                </p>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>

</template>

<script setup lang="ts">
import { z } from 'zod'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'

import stripeImg from '~/assets/images/stripe.png'
import paypalImg from '~/assets/images/paypal.png'
import zipImg from '~/assets/images/zipco.png'

import { loadStripe } from '@stripe/stripe-js'
import { loadScript } from '@paypal/paypal-js'

// Zod validation schema
const createSchema = () => {
  const baseSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
    first_name: z.string().min(1, 'First name is required'),
    last_name: z.string().min(1, 'Last name is required'),
    phone: z.string().min(1, 'Phone number is required'),
    shipping_address_line1: z.string().min(1, 'Address is required'),
    shipping_address_line2: z.string().optional(),
    shipping_address_city: z.string().min(1, 'City is required'),
    shipping_address_state: z.string().min(1, 'State is required'),
    shipping_address_postal_code: z.string().min(1, 'Postcode is required'),
  })

  if (customer.different_billing) {
    return baseSchema.extend({
      billing_address_line1: z.string().min(1, 'Billing address is required'),
      billing_address_line2: z.string().optional(),
      billing_address_city: z.string().min(1, 'Billing city is required'),
      billing_address_state: z.string().min(1, 'Billing state is required'),
      billing_address_postal_code: z.string().min(1, 'Billing postcode is required'),
    })
  }

  return baseSchema
}

const { getItems } = useDirectusItems()
const { capitalizeFirstLetter } = useHelpers()
const settingsStore = useSettingsStore()
const cartStore = useCartStore()

// Hide loading modal
settingsStore.hideLoadingModal()

const {
  cart,
  cartValid,
  invoiceId,
  discount,
  paymentsReceived,
  balanceOwing
} = storeToRefs(cartStore)

const config = useRuntimeConfig()
const router = useRouter()
const route = useRoute()

// Payment method selection
const selectedPaymentMethod = ref('stripe')
const stripeError = ref('')
const isProcessing = ref(false)
const submitError = ref(null)

// Stripe
const stripe = ref(null)
const elements = ref(null)
const cardElement = ref(null)
const stripeErrorModal = ref(false)

// PayPal
const paypalPaymentId = ref(null)
const paypalButtons = ref(null)
const paypalInitialized = ref(false)

const deliveryError = ref(null)
const deliveryInfo = reactive({
  cost: null,
  message: null,
  twoManDeliveryAvailable: false,
  twoManTotal: null
})

const customerNotes = ref('')

const isAddressComplete = computed(() => {
  return customer.first_name && customer.last_name && customer.phone && customer.shipping_address_line1 && customer.shipping_address_city && customer.shipping_address_state && customer.shipping_address_postal_code
})

const twoManDelivery = ref('1 person')

const updateDeliveryMen = () => {
  if (twoManDelivery.value === '2 person') {
    cartStore.updateDeliveryCost(deliveryInfo.twoManTotal)
  } else {
    cartStore.updateDeliveryCost(deliveryInfo.cost)
  }
}

// Customer data
const customer = reactive({
  id: cartStore.customer.id || null,
  first_name: cartStore.customer.first_name || '',
  last_name: cartStore.customer.last_name || '',
  email: cartStore.customer.email || '',
  phone: cartStore.customer.phone || '',
  shipping_address_line1: cartStore.customer.shipping_address_line1 || '',
  shipping_address_line2: cartStore.customer.shipping_address_line2 || '',
  shipping_address_city: cartStore.customer.shipping_address_city || '',
  shipping_address_state: cartStore.customer.shipping_address_state || '',
  shipping_address_postal_code: cartStore.customer.shipping_address_postal_code || '',
  shipping_address_country: 'AU',
  different_billing: cartStore.customer.different_billing || false,
  billing_address_line1: cartStore.customer.billing_address_line1 || '',
  billing_address_line2: cartStore.customer.billing_address_line2 || '',
  billing_address_city: cartStore.customer.billing_address_city || '',
  billing_address_state: cartStore.customer.billing_address_state || '',
  billing_address_postal_code: cartStore.customer.billing_address_postal_code || '',
  billing_address_country: 'AU',
  abn: cartStore.customer.abn || ''
})


// get route query
// http://localhost:3000/checkout?invoice_id=3012&email=alex.t.murray%40gmail.com&first_name=Alex&last_name=Murray&phone=0468477667&shipping_address_line1=21+Vincents+Rd&shipping_address_line2=&shipping_address_city=Kurrajong&shipping_address_state=NSW&shipping_address_postal_code=2758&different_billing=false&billing_address_line1=&billing_address_line2=&billing_address_city=&billing_address_state=&billing_address_postal_code=&abn=&two_man_delivery=true&cart=%5B%7B%22sku%22%3A%22cooper10kingsingle%22%2C%22quantity%22%3A1%7D%2C%7B%22sku%22%3A%22basekingsingle%22%2C%22quantity%22%3A1%7D%5D
const query = route.query
if (query?.invoice_id && query?.email) {
  // Invoice checkout - process URL params
  const decodedInvoiceId = decodeURIComponent(query.invoice_id)
  const decodedCart = query.cart ? decodeURIComponent(query.cart) : []
  cartStore.saleSource = 'invoice'
  
  if (decodedCart.length) {
    cartStore.clearCart()
    const parsedCart = JSON.parse(decodedCart)
    // Fetch products with linked SKUs
    const productsData = await getItems({
      collection: 'products',
      params: {
        filter: {
          skus: {
            sku: {
              _in: parsedCart.map(item => item.sku)
            }
          }
        },
        fields: [
          'slug',
          'image.id',
          'image.filename_download',
          'skus.id',
          'skus.sku',
          'skus.price',
          'skus.size',
          'skus.firmness',
          'skus.model',
          'skus.name'
        ]
      }
    })

    // Find which SKUs were found via products
    const foundSkus = new Set()
    productsData.forEach(product => {
      product.skus.forEach(sku => foundSkus.add(sku.sku))
    })

    // Find SKUs that weren't linked to any product
    const missingSkuCodes = parsedCart
      .map(item => item.sku)
      .filter(sku => !foundSkus.has(sku))

    // Fetch unlinked SKUs directly from the skus collection via Directus REST API
    let unlinkedSkus = []
    if (missingSkuCodes.length > 0) {
      const directusUrl = config.public.directus.url
      const skusResponse = await $fetch(`${directusUrl}/items/skus`, {
        params: {
          'filter[sku][_in]': missingSkuCodes.join(','),
          'fields': 'id,sku,price,size,firmness,model,name'
        }
      })
      unlinkedSkus = skusResponse?.data || []
    }

    cartStore.clearCart()

    // Default fallback image for unlinked SKUs
    const defaultFallbackImage = 'https://cdn.ausbeds.com.au/37345a30-766b-4ff7-81cc-a7b4be97e1b4.png'
    const mattressRemovalImage = 'https://cdn.ausbeds.com.au/3860d12d-a964-4cd3-90e5-e15b6ffeeb13.png'

    parsedCart.forEach(cartItem => {
      // First, try to find in products with linked SKUs
      const product = productsData.find(p => p.skus.some(sku => sku.sku === cartItem.sku))

      if (product) {
        const selectedSku = product.skus.find(sku => sku.sku === cartItem.sku)
        if (selectedSku) {
          cartStore.addToCart([{
            id: selectedSku.id || '',
            slug: product.slug || '',
            sku: selectedSku.sku || '',
            price: selectedSku.price || 0,
            size: selectedSku.size || '',
            firmness: selectedSku.firmness || '',
            model: selectedSku.model || null,
            title: selectedSku.name || '',
            image: useCdn(product.image?.id, product.image?.filename_download, 200, 200) || null,
            category: product.slug === 'base' ? 'Base' : 'Mattress',
            quantity: cartItem.quantity
          }])
        }
      } else {
        // Try to find in unlinked SKUs
        const unlinkedSku = unlinkedSkus.find(sku => sku.sku === cartItem.sku)
        if (unlinkedSku) {
          // Determine fallback image
          let productImage = defaultFallbackImage
          if (unlinkedSku.sku.includes('mattressremoval')) {
            productImage = mattressRemovalImage
          }

          cartStore.addToCart([{
            id: unlinkedSku.id || '',
            slug: '',
            sku: unlinkedSku.sku || '',
            price: unlinkedSku.price || 0,
            size: unlinkedSku.size || '',
            firmness: unlinkedSku.firmness || '',
            model: unlinkedSku.model || null,
            title: unlinkedSku.name || '',
            image: productImage,
            category: 'Other',
            quantity: cartItem.quantity
          }])
        }
      }
    })

    cartStore.updateDiscount(0)

    const getDiscount = await $fetch('/api/getDiscountFromOrder', {
      method: 'POST',
      body: {
        orderId: decodedInvoiceId
      }
    })

    if (getDiscount && getDiscount > 0) {
      cartStore.updateDiscount(getDiscount)
    }

    // Fetch existing payments for this order
    const decodedEmail = decodeURIComponent(query.email)
    const orderPayments = await $fetch('/api/getOrderPayments', {
      method: 'POST',
      body: {
        orderId: decodedInvoiceId,
        email: decodedEmail
      }
    })

    if (orderPayments?.success && orderPayments.paymentsReceived > 0) {
      cartStore.updatePaymentsReceived(orderPayments.paymentsReceived)
    } else {
      cartStore.updatePaymentsReceived(0)
    }

    cartStore.updateInvoiceId(decodedInvoiceId)

    customer.email = decodeURIComponent(query.email) || ''
    customer.first_name = decodeURIComponent(query.first_name) || ''
    customer.last_name = decodeURIComponent(query.last_name) || ''
    customer.phone = decodeURIComponent(query.phone) || ''
    customer.shipping_address_line1 = decodeURIComponent(query.shipping_address_line1) || ''
    customer.shipping_address_line2 = decodeURIComponent(query.shipping_address_line2) || ''
    customer.shipping_address_city = decodeURIComponent(query.shipping_address_city) || ''
    customer.shipping_address_state = decodeURIComponent(query.shipping_address_state) || ''
    customer.shipping_address_postal_code = decodeURIComponent(query.shipping_address_postal_code) || ''
    customer.different_billing = decodeURIComponent(query.different_billing) === 'true'
    customer.billing_address_line1 = decodeURIComponent(query.billing_address_line1) || ''
    customer.billing_address_line2 = decodeURIComponent(query.billing_address_line2) || ''
    customer.billing_address_city = decodeURIComponent(query.billing_address_city) || ''
    customer.billing_address_state = decodeURIComponent(query.billing_address_state) || ''
    customer.billing_address_postal_code = decodeURIComponent(query.billing_address_postal_code) || ''
    customer.abn = decodeURIComponent(query.abn) || ''

    cartStore.updateCustomer({
      email: decodeURIComponent(query.email) || '',
      first_name: decodeURIComponent(query.first_name) || '',
      last_name: decodeURIComponent(query.last_name) || '',
      phone: decodeURIComponent(query.phone) || '',
      shipping_address_line1: decodeURIComponent(query.shipping_address_line1) || '',
      shipping_address_line2: decodeURIComponent(query.shipping_address_line2) || '',
      shipping_address_city: decodeURIComponent(query.shipping_address_city) || '',
      shipping_address_state: decodeURIComponent(query.shipping_address_state) || '',
      shipping_address_postal_code: decodeURIComponent(query.shipping_address_postal_code) || '',
      different_billing: decodeURIComponent(query.different_billing) === 'true',
      billing_address_line1: decodeURIComponent(query.billing_address_line1) || '',
      billing_address_line2: decodeURIComponent(query.billing_address_line2) || '',
      billing_address_city: decodeURIComponent(query.billing_address_city) || '',
      billing_address_state: decodeURIComponent(query.billing_address_state) || '',
      billing_address_postal_code: decodeURIComponent(query.billing_address_postal_code) || '',
      abn: decodeURIComponent(query.abn) || ''
    })

    twoManDelivery.value = decodeURIComponent(query.two_man_delivery) !== false ? '2 person' : '1 person'

  }
} else {
  // Normal checkout - reset invoice-related state
  cartStore.updateDiscount(0)
  cartStore.updatePaymentsReceived(0)
  cartStore.updateInvoiceId(null)
  cartStore.saleSource = 'website'
}


// Form validation errors
const formErrors = reactive({})

const validateField = (fieldName: string) => {
  const schema = createSchema()
  const fieldSchema = schema.shape[fieldName]

  if (!fieldSchema) {
    return
  }

  const fieldValue = customer[fieldName]
  const result = fieldSchema.safeParse(fieldValue)

  if (result.success) {
    delete formErrors[fieldName]
  } else {
    // Use issues array (not errors array)
    if (result.error && result.error.issues && result.error.issues.length > 0) {
      // For empty values, show the "required" message
      // For non-empty invalid values, show the format message
      if (!fieldValue || fieldValue === '') {
        // Find the "required" error message
        const requiredError = result.error.issues.find(issue => issue.code === 'too_small')
        formErrors[fieldName] = requiredError ? requiredError.message : result.error.issues[0].message
      } else {
        // Show the first error that's not the "required" error
        const formatError = result.error.issues.find(issue => issue.code !== 'too_small')
        formErrors[fieldName] = formatError ? formatError.message : result.error.issues[0].message
      }
    } else {
      formErrors[fieldName] = 'Invalid value'
    }
  }
}

// Validate entire form
const validateForm = () => {
  const schema = createSchema()

  // Clear all previous errors
  Object.keys(formErrors).forEach(key => delete formErrors[key])

  const result = schema.safeParse(customer)
  const issues = result?.error?.issues

  if (result.success) {
    return true
  } else if (issues && issues.length > 0) {
    submitError.value = 'Please correct the errors in the form before proceeding.'
    // issues.forEach((err) => {
    //   const fieldName = err.path[0] as string
    //   formErrors[fieldName] = err.message
    // })
    return false
  }
}

// Handle field blur event
const handleBlur = (fieldName) => {
  try {
    validateField(fieldName)
  } catch (error) {
    console.error('Blur handler error:', error)
  }
}

// Computed property to check if form can be submitted
const canSubmit = computed(() => {
  if (customer.different_billing) {
    return cart.value.length > 0 && customer.email && customer.phone && customer.first_name && customer.last_name && customer.shipping_address_line1 && customer.shipping_address_city && customer.shipping_address_state && customer.shipping_address_postal_code && customer.billing_address_line1 && customer.billing_address_city && customer.billing_address_state && customer.billing_address_postal_code && !isProcessing.value
  }
  return cart.value.length > 0 && customer.email && customer.phone && customer.first_name && customer.last_name && customer.shipping_address_line1 && customer.shipping_address_city && customer.shipping_address_state && customer.shipping_address_postal_code && !isProcessing.value
})

// Initialize Stripe when component mounts
onMounted(async () => {
  cartStore.updateDeliveryCost(null) // reset delivery cost on page load
  await initializeStripe()
  if (isAddressComplete.value) {
    const addressString = `${customer.shipping_address_line1}, ${customer.shipping_address_city}, ${customer.shipping_address_state} ${customer.shipping_address_postcode}`
    await calculateShipping(addressString)
  }
  
  // On Zip callback, process the order
  if (
    route.query?.result === 'approved' && 
    route.query?.checkoutId
  ) {
    await createZipOrder(route.query.checkoutId)
  }
})

// Watch for payment method changes
watch(selectedPaymentMethod, async (newMethod) => {
  if (newMethod === 'stripe') {
    await nextTick()
    await useDelay(200)
    await initializeStripe()
  } else if (newMethod === 'paypal') {
    await nextTick()
    await useDelay(200)
    await initializePayPal()
  }
})

// Initialize Stripe
const initializeStripe = async () => {
  try {
    // Replace with your Stripe public key
    stripe.value = await loadStripe(config.public.stripePublishableKey)
    
    if (stripe.value) {
      elements.value = stripe.value.elements()
      
      // Create and mount card element
      cardElement.value = elements.value.create('card', {
        style: {
          base: {
            fontSize: '16px',
            color: '#32325d',
            fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
            '::placeholder': {
              color: '#aab7c4'
            }
          },
          invalid: {
            color: '#fa755a',
            iconColor: '#fa755a'
          }
        }
      })
      
      // Mount the element
      await nextTick()
      const cardElementDiv = document.getElementById('stripe-card-element')
      if (cardElementDiv) {
        cardElement.value.mount('#stripe-card-element')
        
        // Handle real-time validation errors
        // cardElement.value.on('change', (event) => {
        //   stripeError.value = event.error ? event.error.message : ''
        // })
      }
    }
  } catch (error) {
    console.error('Error initializing Stripe:', error)
    stripeError.value = 'Failed to load payment system. Please refresh and try again.'
  }
}

// Initialize PayPal
const initializePayPal = async () => {
  try {
    const paypalClientId = config.public.paypalClientId
    
    const paypal = await loadScript({
      clientId: paypalClientId,
      currency: 'AUD',
      disableFunding: ['card', 'credit', 'paylater', 'venmo'],
      enableFunding: ['paypal'],
      // height: 60
    })

    console.log('PayPal script loaded:', paypal)
    
    if (paypal) {
      await nextTick()
      const container = document.getElementById('paypal-button-container')
      
      if (container) {
        paypalButtons.value = paypal.Buttons({
          createOrder: (data, actions) => {
            if (!canSubmit.value) {
              console.log('Please complete all required fields before proceeding with PayPal.')
              return false
            }
            // Use balanceOwing if there are existing payments, otherwise use total
            const amountToCharge = cartStore.paymentsReceived > 0 ? cartStore.balanceOwing : cartStore.total
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: amountToCharge.toFixed(2),
                  currency_code: 'AUD'
                },
                description: `Order from ${customer.email}`
              }],
              payer: {
                email_address: customer.email,
                name: {
                  given_name: customer.first_name,
                  surname: customer.last_name
                },
                address: {
                  address_line_1: customer.shipping_address_line1,
                  address_line_2: customer.shipping_address_line2,
                  admin_area_2: customer.shipping_address_city,
                  admin_area_1: customer.shipping_address_state,
                  postal_code: customer.shipping_address_postal_code,
                  country_code: 'AU'
                }
              }
            })
          },
          onApprove: async (data, actions) => {
            const order = await actions.order.capture()
            paypalPaymentId.value = order.id
            await processPayPalOrder(order)
          },
          onError: (err) => {
            console.error('PayPal Error:', err)
            alert('Payment failed. Please try again.')
          }
        })
        
        paypalButtons.value.render('#paypal-button-container')
        paypalButtons.value.render('#paypal-button-container2')
        paypalInitialized.value = true
      }
    }
  } catch (error) {
    console.error('Error initializing PayPal:', error)
  }
}

// Process Stripe payment
const processStripePayment = async () => {

  console.log('Processing Stripe payment...')

  if (!stripe.value || !cardElement.value) {
    stripeError.value = 'Payment system not ready. Please refresh and try again.'
    console.log('Payment system not ready. Please refresh and try again.')
    return
  }
  
  try {
    settingsStore.showLoadingModal()
    
    // Create payment intent on your server
    // Use balanceOwing if there are existing payments, otherwise use total
    const amountToCharge = cartStore.paymentsReceived > 0 ? cartStore.balanceOwing : cartStore.total
    const paymentIntent = await $fetch('/api/stripe/createPaymentIntent', {
      method: 'POST',
      body: {
        amount: Math.round(amountToCharge),
        currency: 'aud',
        customer: customer
      }
    })
    
    // Confirm the payment with Stripe
    const { error } = await stripe.value.confirmCardPayment(
      paymentIntent.client_secret,
      {
        payment_method: {
          card: cardElement.value,
          billing_details: {
            name: `${customer.first_name} ${customer.last_name}`,
            email: customer.email,
            phone: customer.phone,
            address: {
              line1: customer.different_billing ? customer.billing_address_line1 : customer.shipping_address_line1,
              line2: customer.different_billing ? customer.billing_address_line2 : customer.shipping_address_line2,
              city: customer.different_billing ? customer.billing_address_city : customer.shipping_address_city,
              state: customer.different_billing ? customer.billing_address_state : customer.shipping_address_state,
              postal_code: customer.different_billing ? customer.billing_address_postal_code : customer.shipping_address_postal_code,
              country: customer.different_billing ? customer.billing_address_country : customer.shipping_address_country
            }
          }
        }
      }
    )

    // console.log('Payment confirmation result:', error )

    if (error !== undefined) {
      // console.error('Stripe payment error:', error.message)
      stripeErrorModal.value = true
      error.message || 'Payment failed. Please try again.'
      return
    }

    console.log('Payment succeeded:', paymentIntent)

    if (paymentIntent.id) {
     await completeOrder({
        amount: paymentIntent.amount / 100,
        method: 'stripe',
        transaction_id: paymentIntent.id,
      })
    }
    
  } catch (error) {
    console.error('Payment error:', error)
    stripeError.value = 'Payment failed. Please try again.'
  } finally {
    settingsStore.hideLoadingModal()
  }
}

// Process PayPal order
const processPayPalOrder = async (order) => {
  try {
    settingsStore.showLoadingModal()

    console.log('Processing PayPal order...', order)

    await completeOrder({ 
      amount: order.purchase_units[0].amount.value,
      method: 'paypal',
      transaction_id: order.id,
    })

  } catch (error) {
    console.error('Error processing PayPal order:', error)
    alert('Failed to process order. Please contact support.')
  } finally {
    settingsStore.hideLoadingModal()
  }
}

// Complete the order
const completeOrder = async (paymentData) => {

  try {
    // Send order to your backend
    const data = await $fetch('/api/completeOrder', {
      method: 'POST',
      body: {
        customer,
        customer_notes: customerNotes.value,
        cart: cart.value,
        total: cartStore.total,
        subtotal: cartStore.subtotal,
        shipping: cartStore.delivery,
        tax: cartStore.tax,
        deliveryType: twoManDelivery.value,
        saleSource: cartStore.saleSource,
        existingInvoiceId: invoiceId.value || null,
        ...paymentData
      }
    })
    
    if (!data?.orderNumber) {
      throw new Error('Order completion failed. No order number returned.')
    }

    // create PDF invoice and link to order
    try {
      await $fetch('/api/generateInvoice', {
        method: 'POST',
        body: {
          orderId: data.orderId
        }
      })
    } catch (invoiceError) {
      console.error('Error generating invoice:', invoiceError)
    }

    // if user email exists in carts table, remove entry
    try {
      await $fetch('/api/cart-reminder/deleteCart', {
        method: 'POST',
        body: {
          email: customer.email
        }
      })
    } catch (e) {
      console.error('Error clearing saved cart:', e)
    }

    try {
      await $fetch('/api/mailjet/sendOrderConfirmation', {
        method: 'POST',
        body: {
          orderId: data.orderId
        }
      })
    } catch (e) {
      console.error('Error sending order confirmation email:', e)
    }

    try {
      await $fetch('/api/mailjet/sendAdminConfirmation', {
        method: 'POST',
        body: {
          orderId: data.orderId
        }
      })
    } catch (e) {
      console.error('Error sending admin confirmation email:', e)
    }

    try {

      // GTM data layer
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push({
        event: 'purchase',
        ecommerce: {
          transaction_id: data.orderId,
          value: cartStore.total,
          currency: 'AUD',
        },
        user_data: {
          email: customer.email,
          phone_number: customer.phone
        }
      })

      umTrackEvent('cart-checkout')

      umTrackEvent('purchase', {
        revenue: cartStore.total,
        currency: 'AUD',
        orderId: data.orderId
      })

      cartStore.conversion()

    } catch (e) {
      console.error('Error with conversion:', e)
    }

    cartStore.clearCart()
    router.push(`/checkout/success?order=${data.orderNumber}`)

  } catch (error) {
    console.error('Error completing order:', error)
    alert('Order processing failed. Please contact support.')
  } finally {
    isProcessing.value = false
  }
}

// Create Zip checkout session
const createZipCheckout = async () => {
  settingsStore.showLoadingModal()
  try {
    const zipCartItems = cart.value.map(item => ({
      name: item.title,
      amount: Math.round(item.price * 100),
      quantity: item.quantity,
      type: 'sku',
      reference: item.sku,
      image_uri: item.image || '',
      item_uri: `https://ausbeds.com.au/mattresses/${item.slug || ''}`
    }))

    // Use balanceOwing if there are existing payments, otherwise use total
    const amountToCharge = cartStore.paymentsReceived > 0 ? cartStore.balanceOwing : cartStore.total
    const zipCheckout = await $fetch(`/api/zip/createCheckout`, {
      method: 'POST',
      body: {
        customer,
        zipCartItems,
        total: Math.round(amountToCharge)
      }
    })

    if (zipCheckout.uri) {
      window.location.href = zipCheckout.uri
    }

  } catch (error) {
    console.error('Error creating Zip checkout:', error)
    // alert('Failed to process Zip payment. Please try again.')
  } finally {
    settingsStore.hideLoadingModal()
  }
}

const createZipOrder = async (orderId) => {
  settingsStore.showLoadingModal()
  try {
    
    const checkIfPaymentExists = await $fetch(`/api/zip/checkPaymentExists`, {
      method: 'POST',
      body: {
        transaction_id: orderId,
        method: 'zip'
      }
    })

    if (checkIfPaymentExists) {
      console.log('Zip payment already processed.')
      return
    }

    const validateZipCheckout = await $fetch(`/api/zip/validateCheckout`, {
      method: 'POST',
      body: {
        orderId
      }
    })

    if (validateZipCheckout?.state === 'approved') {
      await completeOrder({
        amount: validateZipCheckout.order.amount,
        method: 'zip',
        transaction_id: validateZipCheckout.id,
      })
    }

  } catch (error) {
    console.error('Error creating Zip order:', error)
    // alert('Failed to process order. Please contact support.')
  } finally {
    settingsStore.hideLoadingModal()
  }
}

const resetSubmitError = () => {
  setTimeout(() => {
    submitError.value = null
  }, 10000)
}


// Submit order handler
const submitOrder = async (e) => {
  e.preventDefault()
  submitError.value = null

  if (cartValid.value !== true) {
    submitError.value = 'You cannot buy a bed base on its own. Please add a mattress to your cart.'
    resetSubmitError()
    return
  }

  // Validate form before submitting
  const isValid = validateForm()
  if (!isValid) {
    // Scroll to first error
    const firstErrorKey = Object.keys(formErrors).find(key => formErrors[key])
    if (firstErrorKey) {
      const element = document.getElementById(firstErrorKey)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        element.focus()
      }
    }
    submitError.value = 'Your form contains errors. Please make sure your name, phone number, email, and address are filled out correctly.'
    resetSubmitError()
    return
  }

  if (!canSubmit.value) {
    submitError.value = 'Your form contains errors. Please make sure your name, phone number, email, and address are filled out correctly.'
    return
  }

  if (!customer.different_billing) {
    customer.billing_address_line1 = customer.shipping_address_line1
    customer.billing_address_line2 = customer.shipping_address_line2
    customer.billing_address_city = customer.shipping_address_city
    customer.billing_address_state = customer.shipping_address_state
    customer.billing_address_postal_code = customer.shipping_address_postal_code
  }

  try {
    if (selectedPaymentMethod.value === 'stripe') {
      await processStripePayment()
    }
    else if (selectedPaymentMethod.value === 'zip') {
      await createZipCheckout()
    }
    else if (selectedPaymentMethod.value === 'paypal') {
      await initializePayPal()
    }
  } catch(e) {
    console.error('Error submitting order:', e)
    alert('An error occurred. Please try again.')
  }
}

const calculateShipping = async (addressString) => {
  if (!isAddressComplete.value) {
    return
  }
  const { data, error } = await $fetch('/api/delivery/calculateDelivery', {
    method: 'POST',
    body: { 
      address: addressString
    }
  })
  if (route.query?.two_man_delivery && invoiceId.value) {
    twoManDelivery.value = decodeURIComponent(route.query?.two_man_delivery) === 'true' ? '2 person' : '1 person'

  } else {
    twoManDelivery.value = '1 person'
  }
  if (error) {
    deliveryError.value = error.message
    deliveryInfo.cost = null
    deliveryInfo.twoManDeliveryAvailable = false
    deliveryInfo.twoManTotal = null
    cartStore.updateDeliveryCost(null)
  } else if (data) {
    deliveryError.value = null
    deliveryInfo.cost = data.totalPrice
    deliveryInfo.message = data.message
    deliveryInfo.twoManDeliveryAvailable = data.twoManDeliveryAvailable
    deliveryInfo.twoManTotal = data.twoManTotal
    cartStore.updateDeliveryCost(data.totalPrice)
  }
  updateDeliveryMen()
}

watch(
  () => ({
    line1: customer.shipping_address_line1,
    city: customer.shipping_address_city,
    state: customer.shipping_address_state,
    postcode: customer.shipping_address_postal_code
  }),
  async (newAddress) => {
    cartStore.updateCustomer({ ...customer }) // keep store in sync
    if (isAddressComplete.value) {
      const addressString = `${newAddress.line1}, ${newAddress.city}, ${newAddress.state} ${newAddress.postcode}`
      await calculateShipping(addressString)
    }
  },
  { deep: true }
)

// Watch for changes to different_billing to clear billing errors when unchecked
watch(
  () => customer.different_billing,
  (newValue) => {
    if (!newValue) {
      // Clear billing address errors when billing fields are not required
      delete formErrors.billing_address_line1
      delete formErrors.billing_address_city
      delete formErrors.billing_address_state
      delete formErrors.billing_address_postal_code
    }
  }
)


const saveCart = async () => {
  const email = customer.email.trim().toLowerCase()
  const cartId = cartStore.cartId
  if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    try {
      const postCart = await $fetch('/api/cart-reminder/saveCart', {
        method: 'POST',
        body: {
          email,
          cart: cart.value,
          cartId
        }
      })

      console.log('Cart saved:', postCart)

      if (postCart?.cartId) {
        cartStore.updateCartId(postCart.cartId)
      }

    } catch (error) {
      console.error('Error saving cart:', error)
    }
  }
}

</script>