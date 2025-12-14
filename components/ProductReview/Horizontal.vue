<template>
  <Container type="reviews">
    <div class="bg-grey-light p-6 md:p-12 rounded-[20px]">
      <ClientOnly>
        <div :id="containerId" ref="widgetContainer"></div>
      </ClientOnly>
    </div>
  </Container>
</template>

<script setup>
const props = defineProps({
  product: {
    type: String,
    required: false,
    default: ''
  }
})

const widgetContainer = ref(null)
const instanceId = ref('')
const containerId = computed(() => `pr-widget-${props.product}-${instanceId.value}`)

const mattressId = computed(() => {
  const ids = {
    'Aurora': '4a5e773c-6fcf-4bba-91b9-d6ba8a2dc10d',
    'Cooper': 'f26011d5-fe33-3f94-8e21-2f559770668d',
    'Cloud': '1ae86e89-4976-5ef5-b801-2e3775285e77'
  }
  return ids[props.product] || '554a5ae2-e351-363c-9323-39af08c0529b'
})

const initWidget = async () => {
  // Generate new instance ID
  instanceId.value = Date.now().toString()
  
  // Wait for DOM update
  await nextTick()
  
  // Small additional delay for safety
  setTimeout(() => {
    const element = document.getElementById(containerId.value)
    if (!element) {
      console.error('Container not found:', containerId.value)
      return
    }

    const initFunction = (ProductReview) => {
      try {
        ProductReview.use('reviews-horizontal', {
          container: `#${containerId.value}`,
          alias: 'dark-karl',
          identificationDetails: {
            type: 'single',
            strategy: 'from-internal-entry-id',
            identifier: mattressId.value
          }
        })
      } catch (error) {
        console.error('Error initializing widget:', error)
      }
    }

    if (window.ProductReview && window.ProductReview.use) {
      initFunction(window.ProductReview)
    } else {
      window.__productReviewCallbackQueue = window.__productReviewCallbackQueue || []
      window.__productReviewCallbackQueue.push(initFunction)
    }
  }, 100)
}

onMounted(() => {
  initWidget()
})

onUnmounted(() => {
  if (widgetContainer.value) {
    widgetContainer.value.innerHTML = ''
  }
})
</script>