<template>
  <Section 
  :id="data.anchor_id || null"
  class="bg-grey"
  >
    <Container v-if="data.type === '1'">
      <div class="grid grid-cols-12 gap-8 lg:gap-12 items-start">
        <div class="col-span-12 md:col-span-4">
          <div aria-hidden="true" class="tracking-tight md:w-full inline-flex flex-col text-left relative mb-4">
            <span
            v-for="line in ['<div>Need <em>HELP?</em></div>']"
            class="text-white inline-block font-bold -skew-5 -mb-2 text-left md:text-left text-3xl md:text-2xl xl:text-3xl pl-10 pr-10 pt-2 pb-5 w-fit"
            v-html="line"
            :style="spanStyle"
            >
            </span>
          </div>
        </div>
        <div class="col-span-12 md:col-span-5">
          <div class="hidden md:block text-2xl font-marker" :style="{ color: props.data.color ? props.data.color : '#97D7ED' }">
            Still deciding?
          </div>
          <p class="mt-3 text-white">
            Not sure which mattress is right for you? Contact our friendly team for recommendations to help you sleep better.
          </p>
        </div>
        <div class="col-span-12 md:col-span-3">
          <div class="text-2xl font-marker" :style="{ color: props.data.color ? props.data.color : '#97D7ED' }">
            Questions?
          </div>
          <p class="mt-3 text-white">
            Contact us:<br><a href="mailto:sales@ausbeds.com.au" class="underline">sales@ausbeds.com.au</a>
          </p>
        </div>
      </div>
    </Container>
    <Container v-else>
      <div class="grid grid-cols-12 gap-4 items-start">
        <div class="col-span-12 md:col-span-7 lg:col-span-8 xl:col-span-9">
          <div class="text-[#D6C5F7] text-[2.1rem] lg:text-[2.8rem] xl:text-[3.5rem] leading-10 font-marker">
            Try it. Tweak it. Sleep better.
          </div>
        </div>
        <div class="col-span-12 md:col-span-5 md:justify-end lg:col-span-4 xl:col-span-3 flex gap-4 mt-3 md:mt-0">
          <a 
          class="btn btn-hover"
          :style="{ backgroundColor: props.data.color ? props.data.color : '#97D7ED' }"
          v-umami="'contact_whatsapp'"
          href="https://wa.me/61450606589?text=Hello%2C%20I%27d%20like%20some%20more%20info%20about%20your%20mattresses%20please">
            WhatsApp us
          </a>
          <a 
          class="btn btn-hover"
          :style="{ backgroundColor: props.data.color ? props.data.color : '#97D7ED' }"
          v-umami="'contact_call'"
          href="tel:0289993333">
            Call us
          </a>
        </div>
      </div>
    </Container>
  </Section>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Object,
    required: true,
  }
})

const spanStyle = computed(() => {
  return {
    backgroundImage: `url(${useCdn('1cff1f31-6612-4613-859d-9cce2b16ee0b', 'brush-stroke-black.svg')})`,
    backgroundSize: `100% 100%`,
    backgroundRepeat: `no-repeat`,
    backgroundPosition: `center center`,
    '--emColor': props.data.color ? props.data.color : '#97D7ED'
  }
})
</script>