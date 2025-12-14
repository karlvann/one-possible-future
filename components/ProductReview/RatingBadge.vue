<template>
  <Container>
    <div class="max-w-[300px] mx-auto">
      <div id="pr-rich-rating-badge-widget">&nbsp;</div>
    </div>
  </Container>
</template>

<script setup>
onMounted(() => {
  window.__productReviewCallbackQueue = window.__productReviewCallbackQueue || []
  setTimeout(() => {
    window.__productReviewCallbackQueue.push(function(ProductReview) {
      ProductReview.use('rich-rating-badge', {
        "container": "#pr-rich-rating-badge-widget",
        "identificationDetails": {
          "type": "single",
          "strategy": "from-internal-entry-id",
          "identifier": "554a5ae2-e351-363c-9323-39af08c0529b"
        }
      })
    })
  }, 3000)
})
</script>
