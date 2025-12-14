<template>
  <Section class="relative" :id="data.anchor_id || null">
    
    <Container>

      <div class="max-w-[480px] mx-auto text-center mb-4 md:mb-8 lg:mb-12">
        <ElementPretitle
        v-if="data.pretitle"
        :text="data.pretitle" 
        :color="data.color" 
        size="large"
        />
        <h2 class="text-2xl md:text-2xl lg:text-3xl font-bold mt-4">{{ data.title }}</h2>
        <p v-if="data.subtitle" class="text-base mt-2 lg:mt-4">{{ data.subtitle }}</p>
      </div>

      <div 
      v-if="data.two_column"
      class="md:grid md:grid-cols-2 md:gap-8">
        <div>
          <Disclosure
          v-for="faq in faqsCol1"
          as="div" 
          v-slot="{ open }"
          :default-open="data.open_by_default ? true : false"
          class="rounded-lg mb-4"
          :class="`bg-[${data.color || '#E9D5FF'}]`"
          >
            <DisclosureButton class="flex w-full justify-between px-4 py-3 text-left font-medium text-black focus:outline-none focus-visible:ring">
              <div class="">
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
        <div>
          <Disclosure
          v-for="faq in faqsCol2"
          as="div" 
          v-slot="{ open }"
          :default-open="data.open_by_default ? true : false"
          class="rounded-lg mb-4"
          :class="`bg-[${data.color || '#E9D5FF'}]`"
          >
            <DisclosureButton class="flex w-full justify-between px-4 py-3 text-left font-medium text-black focus:outline-none focus-visible:ring">
              <div class="">
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
      </div>
      <div
      v-else
      class="max-w-3xl mx-auto"
      >
        <Disclosure
        v-for="faq in data.faqs"
        as="div" 
        v-slot="{ open }"
        :default-open="data.open_by_default ? true : false"
        class="rounded-lg mb-4"
        :class="`bg-[${data.color || '#E9D5FF'}]`"
        >
          <DisclosureButton class="flex w-full justify-between px-4 py-3 text-left font-medium text-black focus:outline-none focus-visible:ring">
            <div class="">
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

      <div 
      v-if="data?.cta"
      class="mt-12 text-center">
        <NuxtLink
        :to="data?.cta.url"
        :style="{ backgroundColor: useColors(data.color).dark }"
        class="btn text-white"
        >
          {{ data?.cta.title }} <Icon name="ic:baseline-arrow-forward" class="w-5 h-5 inline-block relative top-1" />
        </NuxtLink>
      </div>

    </Container>
  </Section>
</template>

<script setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

const faqsCol1 = computed(() => {
  return props.data.faqs.filter((faq, index) => index % 2 === 0)
})

const faqsCol2 = computed(() => {
  return props.data.faqs.filter((faq, index) => index % 2 !== 0)
})
</script>