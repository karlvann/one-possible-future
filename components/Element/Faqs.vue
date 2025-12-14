<template>
  <div class="prose py-8 md:py-10 lg:py-12">
    <h2>{{ data.title }}</h2>
    <Disclosure
    v-for="faq in data.faqs"
    as="div" 
    v-slot="{ open }"
    :default-open="data.open_by_default ? true : false"
    class="bg-grey-light rounded-lg mb-4"
    >
      <DisclosureButton
      class="flex w-full justify-between px-4 py-3 text-left font-medium text-black hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500/75"
      >
        <div>
          <h4 class="my-0">{{ faq.faq_id.q }}</h4>
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
        <div v-html="faq.faq_id.a"></div>
      </DisclosurePanel>
    </Disclosure>
      
  </div>
</template>

<script setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

const schema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": props.data.faqs.map(faq => ({
    "@type": "Question",
    "name": faq.faq_id.q,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": usePlainText(faq.faq_id.a)
    }
  }))
}

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(schema)
    }
  ]
})
</script>