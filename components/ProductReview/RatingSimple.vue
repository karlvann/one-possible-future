<template>
  <div class="max-w-3xl">
    <div 
    data-id="554a5ae2-e351-363c-9323-39af08c0529b" 
    class="pr-inline-rating"
    :class="[
      type === 'badge-rating' ? 'flex inline-flex p-2 justify-center bg-white rounded mx-auto' : '',
      type === 'inline-rating-white' ? 'bg-white inline-block p-2 rounded' : ''
    ]"
    >
    &nbsp;</div>
  </div>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'inline-rating' // or 'badge-rating'
  }
})
onMounted(() => {
  window.__productReviewCallbackQueue = window.__productReviewCallbackQueue || []
  setTimeout(() => {
    window.__productReviewCallbackQueue.push(function(ProductReview) {
      ProductReview.use('inline-rating', {
        "identificationStrategy": "from-internal-entry-id"
      })
    })
  }, 3000)
})
</script>
