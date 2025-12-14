<template>
  <div class="space-y-3">
    <h3 class="block text-base font-bold mb-2">Estimate shipping</h3>
    <!-- <select
    v-model="shippingRegion"
    class="w-full px-4 py-3 text-lg border-2 border-grey rounded-md appearance-none bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600"
    style="background-image: url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27currentColor%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e'); background-repeat: no-repeat; background-position: right 1rem center; background-size: 1.5em;"
    >
      <option v-for="region in shippingRegions" :value="region.value">
        {{ region.label }}
      </option>
    </select> -->
    <div
    class="flex items-center gap-4">
      <input
      type="text"
      id="place"
      placeholder="Type your address"
      class=" w-full px-4 py-4 flex-grow border-2 border-grey rounded-md hover:border-gray-400 transition-colors"
      />
    </div>
    <div class="flex gap-4">
      <button 
      @click="estimateShipping()"
      class="bg-grey border-2 border-grey text-white px-6 py-4 rounded-md font-semibold cursor-pointer">
        Estimate
      </button>
      <DeliveryInfoModal class="inline-block" />
    </div>
    <div v-if="loading" class="text-base text-grey-dark mt-2">
      Calculating route...
    </div>
    <div
    v-else-if="shippingEstimation"
    class="text-base p-4 rounded-lg"
    :class="shippingEstimation.success ? 'bg-green' : 'bg-red'"
    >
      <div class="text-base text-grey-dark">
        <div v-if="shippingEstimation.cost" class="mb-2">
          Estimated cost of shipping: <strong>{{ shippingEstimation.cost > 0 ? '$' + shippingEstimation.cost : 'Free' }}</strong>
        </div>
        <div v-else-if="shippingEstimation.cost === 0" class="mb-2">
          Free shipping!
        </div>
        <div v-if="shippingEstimation.message">
          {{ shippingEstimation.message }}
        </div>
      </div>
    </div>
    <div
    v-if="shippingEstimation && shippingEstimation.status === 'error'"
    class="text-base text-red-dark"
    >
      {{ shippingEstimation.message }}
    </div>
  </div>

</template>

<script setup>
import { setOptions, importLibrary } from "@googlemaps/js-api-loader"

const shippingEstimation = ref(null)
const shippingRegion = ref('Sydney Metro')
const address = ref('')
const loading = ref(false)

const shippingRegions = [
  { label: 'Sydney Metro', value: 'Sydney Metro' },
  { label: 'Melbourne Metro', value: 'Melbourne Metro' },
  { label: 'Brisbane Metro', value: 'Brisbane Metro' },
  { label: 'Canberra Metro', value: 'Canberra Metro' },
  { label: 'NSW Regional (Delivery within 30km of Mel-Bri highway)', value: 'NSW Regional' },
  { label: 'VIC Regional (Delivery within 30km of Syd-Mel highway)', value: 'VIC Regional' },
  { label: 'QLD Regional (Delivery within 30km of Syd-Bri highway)', value: 'QLD Regional' },
  { label: 'Western Australia (No delivery option)', value: 'WA' },
  { label: 'South Australia (No delivery option)', value: 'SA' },
  { label: 'Tasmania (No delivery option)', value: 'TAS' },
  { label: 'Northern Territory (No delivery option)', value: 'NT' }
]

const customerAddress = reactive({
  line1: '',
  city: '',
  state: '',
  postal_code: '',
  country: 'AU',
})

setOptions({ key: 'AIzaSyCAn-JvV4sTaGP5P4zFb0PlzFYOinzH1A8' })

const loadGoogleMapsInput = async () => {
  await nextTick()
  if (document.getElementById("place") === null) return
  
  const Places = await importLibrary('places')
  const input = document.getElementById("place")
  const options = {
    componentRestrictions: { 
      country: "au"
    },
    fields: ["address_components", "name"],
  }

  const autocomplete = new Places.Autocomplete(input, options)

  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace()
    if (place?.address_components) {
      const components = place.address_components
      let subpremise = components.find(c => c.types.includes('subpremise'))?.long_name || ''
      if (subpremise.length > 1) {
        subpremise = String(subpremise).charAt(0).toUpperCase() + String(subpremise).slice(1)
      }
      const streetNumber = components.find(c => c.types.includes('street_number'))?.long_name || ''
      const route = components.find(c => c.types.includes('route'))?.long_name || ''
      const locality = components.find(c => c.types.includes('locality'))?.long_name || ''
      const state = components.find(c => c.types.includes('administrative_area_level_1'))?.short_name || ''
      const postalCode = components.find(c => c.types.includes('postal_code'))?.long_name || ''
      address.value = `${subpremise ? subpremise + '/': ''}${streetNumber} ${route}, ${locality} ${state} ${postalCode}`
      customerAddress.line1 = `${subpremise ? subpremise + '/': ''}${streetNumber} ${route}`
      customerAddress.city = locality
      customerAddress.state = state
      customerAddress.postal_code = postalCode
    }
  })
}

const estimateShipping = async () => {
  loading.value = true
  try {

    const { data, error } = await $fetch('/api/delivery/calculateDelivery', {
      method: 'POST',
      body: { address: address.value }
    })

    if (error) {
      shippingEstimation.value = {
        error: true,
        cost: null,
        message: error.message,
        twoManDeliveryAvailable: false
      }
    } else {
      shippingEstimation.value = {
        success: true,
        cost: data.totalPrice,
        message: data.message,
        twoManDeliveryAvailable: data.twoManDeliveryAvailable
      }
    }

  } catch (error) {
    console.error('Error estimating shipping:', error)
    shippingEstimation.value = {
      error: true,
      cost: null,
      message: 'There was an error estimating shipping. Please try again or contact us for assistance.'
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadGoogleMapsInput()
})

</script>