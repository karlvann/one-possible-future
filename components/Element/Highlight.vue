<template>

  <div>
    <FadeIn
    v-if="data.title === 'Frequently asked questions'"
    class="relative bg-[#f9f8f6] mb-16"
    >
      <div 
      class="w-full text-white font-sans shadow-[0_0_30px_10px_rgba(0,0,0,0.1)] overflow-hidden rounded-lg ring-media-focus data-[focus]:ring-4" 
      style="position:relative; padding-top:56.25%;">
        <iframe src="https://iframe.mediadelivery.net/embed/28647/6a97a963-883c-4318-b591-d2233ff634e1?autoplay=false&loop=false&muted=false&preload=true&responsive=true" loading="lazy" style="border:0;position:absolute;top:0;height:100%;width:100%;" allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;" allowfullscreen="true"></iframe>
      </div>
    </FadeIn>

    <FadeIn class="relative overflow-hidden rounded-lg mt-8 mb-4">
      <div 
      v-if="data.dropdown"
      class="bg-[#e8e5de] p-4 prose !max-w-[100%] relative"
      >
        <div @click="panelOpen" class="pointer">
          <div class="flex w-full items-start justify-between text-left">
            <h2 class="text-base font-semibold leading-7 mt-0 mb-0">
              {{ data.title }}
            </h2>
            <span class="ml-6 flex h-7 items-center">
              <Icon name="iconoir:plus" v-if="!panelIsOpen" class="h-6 w-6" />
              <Icon name="iconoir:minus" v-else class="h-6 w-6" />
            </span>
          </div>
        </div>
        <div class="mt-2" v-show="panelIsOpen">
          <div class="text-base leading-7" v-interpolation v-html="useSanitize(data.content)"></div>
        </div>
      </div>

      <div
      v-else
      class="bg-faun p-4 prose mt-6 md:col-start-3 md:col-span-8 lg:col-start-2 lg:col-span-7 relative"
      v-interpolation
      v-html="useSanitize(data.content)"
      >
      </div>

    </FadeIn>
  </div>

</template>

<script setup>
const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

const panelIsOpen = ref(false)

const panelOpen = () => {
  panelIsOpen.value = !panelIsOpen.value
}


</script>