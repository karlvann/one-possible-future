<template>

  <Section margins="reset-top" class="mt-8">
    <Container>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8 relative">
        
        <!-- Left column: Product image -->
        <div>
          <img
          v-if="page.image?.filename_download"
          :src="useCdn(page.image.id, page.image.filename_download)"
          :alt="page.image.alt || page.title"
          class="w-full h-auto rounded-lg"
          />
        </div>
  
        <div>
          <h1 class="text-3xl font-bold">{{ page.title }}</h1>
          <div v-if="page.description" class="prose max-w-none mt-3">
            {{ page.description }}
          </div>
          <div v-else-if="page.subtitle" class="prose max-w-none mt-3">
            {{ page.subtitle }}
          </div>
          <div class="space-y-6 mt-8">
            <!-- Size Selection -->
            <div v-if="sizes.length > 0">
              <label class="block text-base font-bold mb-2">Select a size</label>
              <select
              v-model="selectedSize"
              class="hidden md:inline-block w-full px-4 py-3 text-lg border-2 border-grey rounded-md appearance-none bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600"
              style="background-image: url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27currentColor%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e'); background-repeat: no-repeat; background-position: right 1rem center; background-size: 1.5em;"
              >
                <option v-for="size in sizes" :key="size.name" :value="size.name">
                  {{ size.name }} ({{ dimensions[size.name] }}) – ${{ size.price.toLocaleString() }}
                </option>
              </select>
              <select
              v-model="selectedSize"
              class="md:hidden w-full px-4 py-3 text-lg border-2 border-grey rounded-md appearance-none bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600"
              style="background-image: url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27currentColor%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e'); background-repeat: no-repeat; background-position: right 1rem center; background-size: 1.5em;"
              >
                <option v-for="size in sizes" :key="size.name" :value="size.name">
                  {{ size.name }} - ${{ size.price.toLocaleString() }}
                </option>
              </select>
            </div>

            <!-- Firmness Selection (Feel) -->
            <div v-if="hasFirmness">
              <label class="block text-base font-bold mb-2">Choose the feel</label>
              <select
              v-model="selectedFeelLevel"
              class="w-full px-4 py-3 text-lg border-2 border-grey rounded-md appearance-none bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600"
              style="background-image: url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27currentColor%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e'); background-repeat: no-repeat; background-position: right 1rem center; background-size: 1.5em;"
              >
                <option v-for="feel in availableFeelLevels" :key="feel.value" :value="feel.value">
                  {{ feel.label }}
                </option>
              </select>
              <div v-if="selectedFeelLevel" class="text-sm text-grey-dark mt-2">
                {{ feelLevels.find(f => f.value === selectedFeelLevel)?.weight }}
              </div>
            </div>

            <!-- Showroom Dropdown (Granular Options) -->
            <div v-if="hasFirmness && granularModels.length > 1" class="bg-yellow rounded-md">
              <button
              @click="showroomOpen = !showroomOpen"
              class="w-full px-4 py-3 text-left font-bold text-lg leading-6 flex items-center justify-between"
              >
                <span>Tried the mattress in our showroom?</span>
                <span class="text-2xl">{{ showroomOpen ? '−' : '+' }}</span>
              </button>
              
              <div v-show="showroomOpen" class="px-4 py-3 pt-2 pb-4">
                <p class="text-base mb-4">
                  The {{ currentFeelName.toLowerCase() }} has {{ granularModels.length }} firmness options built in. We send it in the {{ selectedDefaultModel }} setting by default. If you have tried a softer or firmer model in our showroom, please select it below.
                </p>
                
                <select
                v-model="selectedModel"
                class="w-full px-4 py-3 text-base border-2 border-grey rounded-md appearance-none bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600"
                style="background-image: url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27currentColor%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e'); background-repeat: no-repeat; background-position: right 1rem center; background-size: 1.5em;"
                >
                  <option v-for="model in granularModels" :key="model" :value="model">
                    Mattress firmness {{ model }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Very Firm Message -->
            <div v-if="selectedFeelLevel === 'very firm'" class="text-base text-grey-dark">
              Looking for something even firmer? Please call us or pop into our showroom so we can show you the firmest mattresses we make.
            </div>

            <!-- Add-ons Section -->
            <div v-if="hasFirmness" class="space-y-3">
              <h3 class="block text-base font-bold mb-2">Add-ons</h3>
              
              <!-- Bed Base Add-on -->
              <label
              v-if="matchingBase"
              class="flex items-center gap-4 px-4 py-4 border-2 border-grey rounded-md cursor-pointer hover:border-gray-400 transition-colors"
              >
                <input
                type="checkbox"
                v-model="addBase"
                class="w-6 h-6 rounded border-2 border-grey text-blue-600 focus:ring-blue-600 cursor-pointer"
                />
                <span class="text-lg">
                  Add {{ selectedSize.toLowerCase() }} base (+${{ matchingBase.price }})
                </span>
              </label>

              <!-- Old Mattress Removal Add-on -->
              <label
              class="flex items-center gap-4 px-4 py-4 border-2 border-grey rounded-md cursor-pointer hover:border-gray-400 transition-colors"
              >
                <input
                type="checkbox"
                v-model="addMattressRemoval"
                class="w-6 h-6 rounded border-2 border-grey text-blue-600 focus:ring-blue-600 cursor-pointer"
                />
                <span class="text-lg">
                  Old mattress removal (+$60)
                </span>
              </label>

              <!-- Half-half mattress feel -->
              <!-- <label
              v-if="selectedSize === 'King' || selectedSize === 'Queen'"
              class="flex items-center gap-4 px-4 py-4 border-2 border-grey rounded-md cursor-pointer hover:border-gray-400 transition-colors"
              >
                <input
                type="checkbox"
                v-model="halfHalfFeel"
                class="w-6 h-6 rounded border-2 border-grey text-blue-600 focus:ring-blue-600 cursor-pointer"
                />
                <span class="text-lg">
                  Half-half mattress feel
                </span>
              </label> -->

            </div>

            <!-- Shipping estimator -->
            <ClientOnly>
              <ProductShippingEstimator />
            </ClientOnly>

            <ProductUsps />

            <!-- In-Product Total Summary -->
            <div v-if="selectedSku" class="text-base">
              <div class="flex justify-between mb-2">
                <span>{{ page.title }} {{ selectedSize }}</span>
                <span>${{ selectedSku.price.toLocaleString() }}</span>
              </div>
              <div v-if="addBase && matchingBase" class="flex justify-between mb-2">
                <span>+ {{ selectedSize }} Base</span>
                <span>${{ matchingBase.price.toLocaleString() }}</span>
              </div>
              <div v-if="addMattressRemoval" class="flex justify-between mb-2">
                <span>+ Mattress Removal</span>
                <span>$60</span>
              </div>
              <hr class="my-2" />
              <div class="font-bold flex justify-between">
                <div>Subtotal</div>
                <div>${{ 
                  (
                    selectedSku.price + 
                    (addBase && matchingBase ? matchingBase.price : 0) + 
                    (addMattressRemoval ? 60 : 0)
                  ).toLocaleString() 
                }}</div>
              </div>
            </div>

            <!-- Add to Cart Button -->
            <button
            @click="addToCartBtn"
            class="block w-full btn btn-purple-dark btn-hover btn-large"
            >
              Add to cart
            </button>
          </div>

          <div class="w-full pt-8" v-if="page.slug === 'base'">
            <strong>Please note:</strong> The Slimline Mattress Base is only available when buying a mattress. If you would like to purchase a base, please add a mattress to your cart first.
          </div>

          <div class="w-full pt-8">
            <div class="mx-auto w-full text-grey-dark">
              <Disclosure 
              as="div" 
              v-slot="{ open }"
              class="bg-grey-light rounded-lg mb-4"
              v-if="page.dimensions_weight">
                <DisclosureButton
                v-umami="{ name: 'info_panel', info: 'Dimension and weight' }"
                class="flex w-full justify-between px-4 py-3 text-left font-medium text-black hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500/75"
                >
                  <div>
                    <h4 class="my-0">Dimensions and weight</h4>
                  </div>
                  <div class="h-6 w-6">
                    <Icon 
                    name="ic:outline-keyboard-arrow-down" 
                    class="h-6 w-6"
                    :class="open ? 'rotate-180 transform' : ''"
                    />
                  </div>
                </DisclosureButton>
                <DisclosurePanel class="px-4 pb-2 text-grey-dark p-reset">
                  <div v-html="page.dimensions_weight" class="prose"></div>
                </DisclosurePanel>
              </Disclosure>
              <Disclosure
              v-if="page.materials_sustainability"
              v-slot="{ open }"
              as="div"
              class="bg-grey-light rounded-lg mb-4"
              >
                <DisclosureButton
                class="flex w-full justify-between px-4 py-3 text-left font-medium text-black hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500/75"
                v-umami="{ name: 'info_panel', info: 'Materials and care' }"
                >
                  <div>
                    <h4 class="my-0">Materials, sustainability and care</h4>
                  </div>
                  <div class="h-6 w-6">
                    <Icon
                    name="ic:outline-keyboard-arrow-down" 
                    class="h-6 w-6"
                    :class="open ? 'rotate-180 transform' : ''"
                    />
                  </div>
                </DisclosureButton>
                <DisclosurePanel class="px-4 pb-2 text-grey-dark p-reset">
                  <div v-html="page.materials_sustainability" class="prose"></div>
                </DisclosurePanel>
              </Disclosure>
            </div>
          </div>

        </div>
      </div>
    </Container>
  </Section>

  <template v-if="page?.blocks && page?.blocks.length">
    <template v-for="(section, index) in page?.blocks">
      <component 
      :is="getSectionComponent(section.collection)" 
      :section-index="index"
      :data="section.item"
      />
    </template>
  </template>

</template>

<script setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
const contentSections = useContentSections()
const fields = useFields()
const route = useRoute()
const cartStore = useCartStore()
const { getItems } = useDirectusItems()

const slug = route.params.slug

const { data } = await useAsyncData(
  `product-${slug}`,
  async () => {

    const productData = await getItems({
      collection: 'products',
      params: {
        filter: {
          slug: {
            _eq: slug
          },
        },
        fields: [
          ...fields,
          'skus.*',
          'hero_image.id', 'hero_image.filename_download', 'hero_image.description', 'hero_image.width', 'hero_image.height',
        ]
      }
    })

    const basesData = await getItems({
      collection: 'skus',
      params: {
        filter: {
          range: {
            _eq: 'Base'
          }
        },
        fields: [
          '*'
        ]
      },
    })

    return {
      product: productData[0] || null,
      bases: basesData || []
    }
  }
)

if (!data.value?.product) {
  throw createError({
    statusCode: 404,
    message: 'Page not found',
    fatal: true
  })
}

const page = computed(() => data.value?.product)
const bases = computed(() => data.value?.bases || [])

// Filter out super firm and firmest SKUs
const filteredSkus = computed(() => {
  return page.value.skus.filter(sku => !sku.firmness || (sku.firmness !== 'super firm' && sku.firmness !== 'firmest'))
})

// Check if product has firmness options
const hasFirmness = computed(() => {
  return filteredSkus.value.some(sku => sku.firmness)
})

const halfHalfFeel = ref(false)

const dimensions = {
  'King': '203cm x 183cm',
  'Queen': '203cm x 152cm',
  'Double': '187cm x 137cm',
  'King Single': '203cm x 107cm',
  'Single': '187cm x 93cm',
}

const reviews = {
  aurora: {
    ratingValue: "5",
    ratingCount: "141",
    reviewCount: "141",
  },
  cloud: {
    ratingValue: "5",
    ratingCount: "39",
    reviewCount: "39",
  },
  cooper: {
    ratingValue: "4.9",
    ratingCount: "232",
    reviewCount: "232",
  }
}

// Product schema data
const productSchemaData = {
  aurora: {
    brand: "Ausbeds",
    sku: "aurora",
    category: "Home & Garden > Furniture > Bedroom Furniture > Mattresses",
    material: "Pocket spring coils, natural latex, single microspring layer",
    warranty: {
      durationMonths: 120,
      description: "10-year warranty covering manufacturing defects"
    },
    mpn: "AUSBEDS-AURORA"
  },
  cloud: {
    brand: "Ausbeds",
    sku: "cloud",
    category: "Home & Garden > Furniture > Bedroom Furniture > Mattresses",
    material: "Pocket spring coils, natural latex, dual microspring layers",
    warranty: {
      durationMonths: 120,
      description: "10-year warranty covering manufacturing defects"
    },
    mpn: "AUSBEDS-CLOUD"
  },
  cooper: {
    brand: "Ausbeds",
    sku: "cooper",
    category: "Home & Garden > Furniture > Bedroom Furniture > Mattresses",
    material: "Pocket spring coils, poly foam, microsprings",
    warranty: {
      durationMonths: 120,
      description: "10-year warranty covering manufacturing defects"
    },
    mpn: "AUSBEDS-COOPER"
  },
  base: {
    brand: "Ausbeds",
    sku: "base",
    category: "Home & Garden > Furniture > Bedroom Furniture > Bed Frames & Bases",
    material: "Solid pine timber, plywood slats",
    warranty: {
      durationMonths: 60,
      description: "5-year warranty covering manufacturing defects"
    },
    mpn: "AUSBEDS-BASE"
  }
}

// Get unique sizes with their prices
const sizes = computed(() => {
  const sizeMap = new Map()
  filteredSkus.value.forEach(sku => {
    if (!sizeMap.has(sku.size)) {
      sizeMap.set(sku.size, sku.price)
    }
  })
  
  const order = ['King', 'Queen', 'Double', 'King Single', 'Single']
  return Array.from(sizeMap.entries())
    .map(([name, price]) => ({ name, price }))
    .sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name))
})

// Feel levels with weight recommendations and default models
const feelLevels = [
  { value: 'very firm', label: 'Very firm', defaultModel: 12, min: 11, max: 13, weight: 'Are you over 110kgs? This should work for you.' },
  { value: 'firmer', label: 'Firm', defaultModel: 9, min: 8, max: 10, weight: 'Are you between 80kgs and 110kgs? This should work for you.' },
  { value: 'medium', label: 'Medium', defaultModel: 6, min: 5, max: 7, weight: 'Are you between 65kgs and 80kgs? This should work for you.' },
  { value: 'softer', label: 'Soft', defaultModel: 3, min: 2, max: 4, weight: 'Are you under 65kgs? This should work for you' }
]

// State
const selectedSize = ref(sizes.value.find(s => s.name === 'Queen')?.name || sizes.value[0]?.name)
const selectedFeelLevel = ref('medium')
const selectedModel = ref(6)
const showroomOpen = ref(false)
const addBase = ref(false)
const addMattressRemoval = ref(false)

// Find matching base for selected size
const matchingBase = computed(() => {
  return bases.value.find(base => base.size === selectedSize.value)
})

// Watch for size changes to reset base selection if no matching base
watch(selectedSize, () => {
  if (!matchingBase.value) {
    addBase.value = false
  }
})

// Get granular models for current feel level
const granularModels = computed(() => {
  if (!hasFirmness.value) return []
  const skusForFeel = filteredSkus.value.filter(sku => sku.firmness === selectedFeelLevel.value)
  const models = [...new Set(skusForFeel.map(sku => sku.model))].sort((a, b) => a - b)
  return models
})

// Get current feel name
const currentFeelName = computed(() => {
  const feel = feelLevels.find(f => f.value === selectedFeelLevel.value)
  return feel?.label.split(' (')[0] || ''
})

const selectedDefaultModel = computed(() => {
  const feel = feelLevels.find(f => f.value === selectedFeelLevel.value)
  return feel ? `${feel.defaultModel}` : ''
})

// Watch for feel level changes to update model
watch(selectedFeelLevel, (newFeel) => {
  const feel = feelLevels.find(f => f.value === newFeel)
  if (feel) {
    selectedModel.value = feel.defaultModel
  }
})

onMounted(async() => {
  const query = route.query
  if (query.firmness) {
    const firmness = query.firmness.toString().toLowerCase()
    const matchedFeel = feelLevels.find(f => f.label.toLowerCase().startsWith(firmness))
    if (matchedFeel) {
      selectedFeelLevel.value = matchedFeel.value
    }
  }
  if (query.model) {
    const model = Number.parseInt(query.model.toString(), 10)
    if (Number.isNaN(model)) return
    const feel = feelLevels.find(f => model >= f.min && model <= f.max)
    if (feel) {
      selectedFeelLevel.value = feel.value
    }
    if (!granularModels.value.includes(model)) return
    await nextTick()
    selectedModel.value = model
  }
  if (query.size) {
    const size = query.size.toString().replace(/-/g, ' ')
    if (sizes.value.some(s => s.name.toLowerCase() === size.toLowerCase())) {
      selectedSize.value = sizes.value.find(s => s.name.toLowerCase() === size.toLowerCase()).name
    }
  }
})

// Find the matching SKU based on selections
const selectedSku = computed(() => {
  if (hasFirmness.value) {
    return filteredSkus.value.find(sku => sku.size === selectedSize.value && sku.firmness === selectedFeelLevel.value && sku.model === selectedModel.value)
  } else {
    return filteredSkus.value.find(sku => sku.size === selectedSize.value)
  }
})

const availableFeelLevels = computed(() => {
  const availableFirmnesses = [...new Set(filteredSkus.value.map(sku => sku.firmness).filter(Boolean))]
  return feelLevels.filter(feel => availableFirmnesses.includes(feel.value))
})

// Add to cart function
const addToCartBtn = () => {
  if (selectedSku.value) {
    
    const cartItems = [{
      id: selectedSku.value.id,
      slug: page.value.slug,
      sku: selectedSku.value.sku,
      price: selectedSku.value.price,
      size: selectedSku.value.size,
      firmness: selectedSku.value.firmness,
      model: selectedSku.value.model,
      title: selectedSku.value.name,
      image: useCdn(page.value.image?.id, page.value.image?.filename_download, 200, 200) || null,
      category: 'Mattress'
    }]

    umTrackEvent('add_to_cart', {
      productId: selectedSku.value.sku,
      productName: selectedSku.value.name,
      price: selectedSku.value.price,
      variant_size: selectedSku.value.size,
      variant_feel: selectedSku.value.firmness
    })

    // click_add_to_cart event for GTM
    //Add to basket
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({
      event: 'add_to_cart'
    })

    // Add base if selected
    if (addBase.value && matchingBase.value) {
      cartItems.push({
        id: matchingBase.value.id,
        slug: 'base',
        sku: matchingBase.value.sku,
        price: matchingBase.value.price,
        size: matchingBase.value.size,
        title: matchingBase.value.name,
        image: useCdn('f57a3199-c1c1-49f8-ae32-84e95b19319f', 'bed-base-sm.jpg'),
        category: 'Base'
      })
      umTrackEvent('add_to_cart', {
        productId: matchingBase.value.sku,
        productName: matchingBase.value.name,
        price: matchingBase.value.price,
        variant_size: matchingBase.value.size
      })
    }

    // Add mattress removal if selected
    if (addMattressRemoval.value) {
      cartItems.push({
        id: '366',
        sku: 'mattressremoval',
        price: 60,
        title: 'Mattress Removal',
        category: 'Service'
      })
      umTrackEvent('add_to_cart', {
        productId: 'mattressremoval',
        productName: 'Mattress Removal',
        price: 60
      })
    }

    cartStore.addToCart(cartItems)
    cartStore.toggleCartOpen()

  }
}

const getSectionComponent = key => {
  return contentSections[key]
}

const offers = []
for (const size of sizes.value) {
  offers.push({
    "@type": "Offer",
    "name": size.name,
    "price": size.price.toFixed(2),
    "priceCurrency": "AUD",
    "availability": "https://schema.org/InStock",
  })
}

const sizeString = selectedSize.value ? `${selectedSize.value} (${dimensions[selectedSize.value]})` : ''

const textReviews = []

if (page.value.slug === 'cooper') {
  textReviews.push(
    {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5",
        "worstRating": "1"
      },
      "author": {
        "@type": "Person",
        "name": "Vic S."
      },
      "datePublished": "2024-03-03",
      "reviewBody": "Great tailored mattress and service – Fantastic mattress that can be adjusted to you comfort level making for a tailored sleep. The service and delivery was quick, prompt and friendly. Packaging was taken away, so no rubbish. Great work by Audbeds.",
      "publisher": {
        "@type": "Organization",
        "name": "ProductReview"
      }
    }
  )
  textReviews.push(
    {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5",
        "worstRating": "1"
      },
      "author": {
        "@type": "Person",
        "name": "Winnie"
      },
      "datePublished": "2023-09-10",
      "reviewBody": "Fantastic service and easy to make adjustments – I purchased the Cooper (Firmer) in September 2023 after going to the showroom in Marrickville. The customer service at Ausbeds was excellent - from Karl, the owner to Martin, the delivery guy. In particular, I love the mattress adjustment system. It was so easy to arrange the layers inside the mattress by myself at home to make it softer or firmer and when I wanted to make further adjustments, Karl very quickly arranged for a replacement layer to be delivered to me. I'm very happy with the mattress now - it is the perfect firmness, very supportive and comfortable!",
      "publisher": {
        "@type": "Organization",
        "name": "ProductReview"
      }
    }
  )
} else if (page.value.slug === 'aurora') {
  textReviews.push(
    {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5",
        "worstRating": "1"
      },
      "author": {
        "@type": "Person",
        "name": "Silleakire"
      },
      "datePublished": "2023-04-03",
      "reviewBody": "Out with the old, in with the new! – Ausbeds are the gold standard for mattresses in Sydney, if not Australia. Every step of the way you get the best- customer service, craftsmanship, communication. Everything you could want, but more. What I love most is Karl’s commitment to sustainability- he redesigned the mattresses so they could be adjusted and repaired instead of being replaced. To me, that’s the ultimate reason to support an Australian, home grown, innovative business. And their prices are cheaper than what’s offered in DJ’s etc. how many people can say they had the business owner deliver their mattress to accomodate their disability (I have arthritis in my spine), put the bed together and take their rubbish with them? The mattress itself is wonderful- Karl showed me how I can adjust it to make it firmer again if I want (I got an 8/10 he showed me how to make it a 9, or a 10). He also adjusted the layers inside to ensure they were perfectly aligned before he left.",
      "publisher": {
        "@type": "Organization",
        "name": "ProductReview"
      }
    }
  )
  textReviews.push(
    {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5",
        "worstRating": "1"
      },
      "author": {
        "@type": "Person",
        "name": "Colin D."
      },
      "datePublished": "2023-09-10",
      "reviewBody": "This is my third bed I’ve purchased from Aus Beds. Very comfortable, highly recommend. Great customer service.",
      "publisher": {
        "@type": "Organization",
        "name": "ProductReview"
      }
    }
  )
  textReviews.push(
    {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5",
        "worstRating": "1"
      },
      "author": {
        "@type": "Person",
        "name": "PBZ"
      },
      "datePublished": "2025-08-11",
      "reviewBody": "This is the way to go. Excellent bed, that uses excellent materials. Price is comparable to other thousand dollar beds, but is customisable before and after delivery. I got the Aurora with half/half different sides and could not be happier. I had lower lumbar issues on old mattress and this has helped considerably. The owner's communication is also second to none. Have and would recommend getting your mattress from here, even if you are not from Sydney - like I was in Brisbane.",
      "publisher": {
        "@type": "Organization",
        "name": "ProductReview"
      }
    }
  )
} else if (page.value.slug === 'cloud') {
  textReviews.push(
    {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5",
        "worstRating": "1"
      },
      "author": {
        "@type": "Person",
        "name": "CameraSkyFail"
      },
      "datePublished": "2025-05-03",
      "reviewBody": "2 Man Delivery + Kind Size Bed Mattress + Matching Wooden Base. So far so good. We like a medium hard bed, but this beauty can be anything you desire. Cloud 9 seems to work for both my partner, a face down sleeper, and myself, side sleeper. The mattress is very comfortable, true to size, the base is solid, the delivery was amazing (the boys went above and beyond) The company is very attentive even after payment and delivery, which is nice in this day and age. It seems like nothing is too much trouble. You get what you pay for. Highly recommended.",
      "publisher": {
        "@type": "Organization",
        "name": "ProductReview"
      }
    }
  )
  textReviews.push(
    {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5",
        "worstRating": "1"
      },
      "author": {
        "@type": "Person",
        "name": "Robert"
      },
      "datePublished": "2025-05-10",
      "reviewBody": "We purchased the Cloud 6 from Ausbeds one month ago and couldn't recommend them enough. From the moment we were greeted by Martin at the showroom, to taking delivery. It has been a massive upgrade from our previous mattress, and we're thrilled every night we hop in. Great business, great product. I truely believe you get what you pay for.",
      "publisher": {
        "@type": "Organization",
        "name": "ProductReview"
      }
    }
  )
} else {
  textReviews.push(
    {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5",
        "worstRating": "1"
      },
      "author": {
        "@type": "Person",
        "name": "Joanne L."
      },
      "datePublished": "2025-02-03",
      "reviewBody": "Martin & Karl were brilliant with helping us achieve the perfect mattress. Hubby likes a super firm mattress while I'm the opposite end and would like to sleep on a cloud. They tailored our mattress to a half/half, we are both super happy and loving our new mattress. The delivery guys were brilliant, taking me through how to change the firmness, despite seeing all this in the workshop. Love that it's sustainable and adjustable. Very happy and would highly recommend Ausbeds.",
      "publisher": {
        "@type": "Organization",
        "name": "ProductReview"
      }
    }
  )
}

const currentProductData = productSchemaData[page.value.slug]

const schema = {
  "@context": "https://schema.org",
  "@type": "Product",

  "name": page.value.title || '',
  "description": page.value.description || '',
  "productID": page.value.title || '',

  // Brand and identifiers
  "brand": {
    "@type": "Brand",
    "name": currentProductData?.brand || "Ausbeds"
  },
  "sku": currentProductData?.sku || '',
  "mpn": currentProductData?.mpn || '',

  // Category
  "category": currentProductData?.category || '',

  // Images - Multiple angles and lifestyle shots
  "image": [
    page.value.image?.filename_download ? useCdn(page.value.image.id, page.value.image.filename_download) : ''
  ],

  // Detailed Product Attributes
  "color": "White/Gray",
  "material": currentProductData?.material || '',
  "size": sizeString,

  // Warranty
  ...(currentProductData?.warranty ? {
    "warranty": {
      "@type": "WarrantyPromise",
      "durationOfWarranty": {
        "@type": "QuantitativeValue",
        "value": currentProductData.warranty.durationMonths,
        "unitCode": "MON"
      },
      "warrantyScope": currentProductData.warranty.description
    }
  } : {}),

  // Aggregate Rating
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": reviews[page.value.slug]?.ratingValue || "5",
    "ratingCount": reviews[page.value.slug]?.ratingCount || "203",
    "reviewCount": reviews[page.value.slug]?.reviewCount || "203",
    "bestRating": "5",
    "worstRating": "1",
  },

  // Offers (Critical for Shopping results)
  "offers": {
    "@type": "AggregateOffer",
    "priceCurrency": "AUD",
    "lowPrice": sizes.value.find(s => s.name === 'Single')?.price.toFixed(2) || '',
    "highPrice": sizes.value.find(s => s.name === 'King')?.price.toFixed(2) || '',
    "availability": "https://schema.org/InStock",
    "availableDeliveryMethod": "https://schema.org/DeliveryModeFreight",
    "deliveryLeadTime": {
      "@type": "QuantitativeValue",
      "minValue": 2,
      "maxValue": 14,
      "unitCode": "DAY"
    },
    "offers": offers,
    "offerCount": offers.length
  },

  // Manufacturer Information
  "manufacturer": {
    "@type": "Organization",
    "name": "Ausbeds",
    "logo": "https://cdn.ausbeds.com.au/b594e9ab-11f8-4524-8a38-cb258c507c7c/ausbeds-logo.png",
    "url": "https://ausbeds.com.au"
  },
  "countryOfOrigin": {
    "@type": "Country",
    "name": "Australia"
  },

  "review": textReviews,

  // URL and Website
  "url": `https://ausbeds.com.au/mattresses/${page.value.slug}`,
  "itemCondition": "https://schema.org/NewCondition"

}

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(schema)
    }
  ]
})

const faqs = []
if (page.value?.blocks && page.value?.blocks.length) {
  for (const section of page.value.blocks) {
    if (section?.collection === 'block_faqs') {
      for (const faq of section.item.faqs) {
        faqs.push(faq.faq_id)
      }
    }
  }
}

if (faqs.length) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": usePlainText(faq.a)
      }
    }))
  }

  useHead({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(faqSchema)
      }
    ]
  })
}
</script>