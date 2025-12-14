export const useCartStore = defineStore('cart-store', {

  persist: true,

  // state
  state: () => ({ 
    loading: false,
    invoiceId: null,
    cart: [],
    cartOpen: false,
    deliveryCost: null,
    conversionTagFired: false,
    saleSource: 'website',
    customer: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      shipping_address_line1: '',
      shipping_address_line2: '',
      shipping_address_city: '',
      shipping_address_state: '',
      shipping_address_postal_code: '',
      shipping_address_country: 'AU',
      different_billing: false,
      billing_address_line1: '',
      billing_address_line2: '',
      billing_address_city: '',
      billing_address_state: '',
      billing_address_postal_code: '',
      billing_address_country: 'AU',
      abn: ''
    },
    cartId: null,
    discount: 0,
    paymentsReceived: 0
  }),

  // computed properties
  getters: {
    subtotal: (state) => state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    tax: (state) => Math.round(state.total * 0.1),
    total: (state) => state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + state.deliveryCost - state.discount,
    balanceOwing: (state) => {
      const orderTotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + state.deliveryCost - state.discount
      return Math.max(0, orderTotal - state.paymentsReceived)
    },
    delivery: (state) => {
      if (state.deliveryCost !== null) {
        return state.deliveryCost
      }
      return null
    },
    itemCount: (state) => state.cart.reduce((sum, item) => sum + item.quantity, 0),
    cartValid: (state) => {
      const cartContainsBase = state.cart.some(item => item.category === 'Base')
      const cartContainsMattress = state.cart.some(item => item.category === 'Mattress')

      // Validation rule: If a base is in the cart, a mattress must also be present
      if (cartContainsBase && !cartContainsMattress) {
        return false
      }

      return true
    }
  },

  // actions
  actions: {
    addToCart(items) {
      items.forEach(item => {
        const existingItem = this.cart.find(cartItem => cartItem.sku === item.sku)
        if (existingItem) {
          existingItem.quantity += 1
        } else {
          this.cart.push({
            ...item,
            quantity: 1
          })
        }
      })
    },

    updateDiscount(amount) {
      this.discount = amount
    },

    updateInvoiceId(id) {
      this.invoiceId = id
    },

    conversion() {
      this.conversionTagFired = true
    },

    updateCartId(id) {
      this.cartId = id
    },

    updateDeliveryCost(cost) {
      this.deliveryCost = cost
    },
    
    removeFromCart(sku) {
      const index = this.cart.findIndex(item => item.sku === sku)
      if (index > -1) {
        this.cart.splice(index, 1)
      }
    },

    updateQuantity(sku, quantity) {
      const item = this.cart.find(cartItem => cartItem.sku === sku)
      if (item) {
        if (quantity <= 0) {
          this.removeFromCart(sku)
        } else {
          item.quantity = quantity
        }
      }
    },

    clearCart() {
      this.cart.splice(0, this.cart.length)
      this.paymentsReceived = 0
      this.invoiceId = null
    },

    toggleCartOpen() {
      this.cartOpen = !this.cartOpen
    },

    updateCustomer(payload) {
      this.customer = { ...this.customer, ...payload }
    },

    updatePaymentsReceived(amount) {
      this.paymentsReceived = amount
    }

  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCartStore, import.meta.hot))
}