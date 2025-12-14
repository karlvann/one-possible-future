<template>
  <TransitionRoot as="template" :show="cartIsOpen">
    <Dialog as="div" class="relative z-10" @close="cartStore.toggleCartOpen()">
      <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-[rgba(0,0,0,0.7)] transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full justify-center p-4 text-center items-center">
          <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            <DialogPanel class="relative transform overflow-hidden rounded-[10px] md:rounded-[16px] bg-[#f9f8f6] text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
              <div class="bg-faun px-3 py-6 sm:px-6 sm:py-6 lg:px-8 lg:py-10">
                <div>
                  <div class="mb-4">
                    <DialogTitle as="h2" class="text-2xl font-bold mb-4">
                      Cart
                    </DialogTitle>
                    <button @click="cartStore.toggleCartOpen()" class="absolute top-4 right-4 text-grey-dark hover:text-gray-500 focus-visible:none">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <!-- Empty Cart State -->
                  <div v-if="cart.length === 0" class="text-center py-12">
                    <p class="text-gray-600 text-lg mb-6">Your cart is empty</p>
                    <!-- <button
                    @click="cartStore.toggleCartOpen()"
                    class="inline-block bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      Continue Shopping
                    </button> -->
                  </div>

                  <!-- Cart Items -->
                  <div v-else class="space-y-6">
                    <div
                    v-for="item in cart"
                    :key="item.sku"
                    class="bg-white rounded-lg p-4 sm:p-6 shadow-sm"
                    >
                      <div class="flex justify-between gap-4">
                        <div class="flex-1">
                          <NuxtLink
                          v-if="item.slug"
                          :to="`/mattresses/${item.slug}`"
                          class="block text-lg font-semibold text-grey-dark mb-1">
                            {{ item.title }}
                          </NuxtLink>
                          <span v-else class="text-lg font-semibold text-grey-dark mb-1 block">
                            {{ item.title }}
                          </span>
                          <div class="text-sm text-gray-600 mb-2">{{ item.category }}</div>
                          <div class="text-sm text-grey-medium space-y-1">
                            <div v-if="item.size">Size: {{ item.size }}</div>
                            <div v-if="item.firmness">Feel: {{ capitalizeFirstLetter(item.firmness) }}</div>
                            <div v-if="item.model">Model: {{ item.model }}</div>
                          </div>
                        </div>
                        
                        <div class="text-right">
                          <div class="text-lg font-bold text-grey-dark mb-4">
                            ${{ (item.price * item.quantity).toLocaleString() }}
                          </div>
                          
                          <!-- Quantity Controls -->
                          <div class="flex items-center gap-2 justify-end mb-3">
                            <button
                            @click="cartStore.updateQuantity(item.sku, item.quantity - 1)"
                            class="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                            :disabled="item.quantity <= 1"
                            :class="{ 'opacity-50 cursor-not-allowed': item.quantity <= 1 }"
                            >
                              −
                            </button>
                            <span class="w-8 text-center font-medium">{{ item.quantity }}</span>
                            <button
                            @click="cartStore.updateQuantity(item.sku, item.quantity + 1)"
                            class="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                            >
                              +
                            </button>
                          </div>

                          <button
                          @click="removeFromCart(item.sku)"
                          class="text-sm text-grey-medium transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>

                    <!-- Cart Summary -->
                    <div class="bg-white rounded-lg p-4 sm:p-6 shadow-sm space-y-3">
                      <div class="flex justify-between text-lg">
                        <span class="font-bold">Subtotal</span>
                        <span class="font-bold">${{ cartStore.subtotal.toLocaleString() }}</span>
                      </div>
                    </div>

                    <div 
                    v-if="!isCheckout"
                    class="space-y-3"
                    >
                      <NuxtLink
                      to="/checkout"
                      @click="cartStore.toggleCartOpen()"
                      class="block w-full btn btn-blue btn-hover btn-large"
                      >
                        Go to checkout
                      </NuxtLink>
                    </div>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'

const cartStore = useCartStore()
const { cart, cartOpen } = storeToRefs(cartStore)
const { capitalizeFirstLetter } = useHelpers()

const cartIsOpen = computed(() => cartOpen.value)

const route = useRoute()
const isCheckout = computed(() => route.path.includes('checkout'))

const removeFromCart = (sku) => {
  cartStore.removeFromCart(sku)
  umTrackEvent('remove_from_cart')
}
</script>