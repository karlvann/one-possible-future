<template>
  <div
  v-if="data"
  class="text-center py-12 md:py-16 lg:py-24">
    <Container>
      <div class="max-w-4xl mx-auto">
        
        <h1 
        v-if="data?.title"
        class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 lg:mb-4 mt-4"
        >
          {{ data.title }}
        </h1>

        <div class="max-w-2xl mx-auto mt-2 sm:mt-4 lg:mt-8">
          <p v-if="data.subtitle">{{ data.subtitle }}</p>
        </div>

        <div
        v-if="data?.stats && data?.stats.length"
        class="mt-8 sm:mt-12 lg:mt-16 md:grid justify-between gap-8 md:gap-12 lg:gap-16"
        :class="[
          data?.stats.length === 2 ? 'md:flex-row md:grid-cols-2 md:max-w-[480px] md:mx-auto' : '',
          data?.stats.length === 3 ? 'md:flex-row md:grid-cols-3' : '',
          data?.stats.length >= 4 ? 'md:flex-row md:grid-cols-4' : ''
        ]"
        >
          <div
          v-for="(stat, index) in data?.stats"
          :key="index"
          class="col-span-1 items-center mt-4 md:mt-0"
          >
            <div 
            class="font-marker"
            :class="[
              `text-[${data?.color || '#000000'}]`,
              titleSize
            ]"
            >
              {{ stat.title }}
            </div>
            <div
            v-if="stat.subtitle"
            :class="subtitleSize"
            class="mt-3 md:mt-6">
              {{ stat.subtitle }}
            </div> 
          </div>
        </div>

      </div>
    </Container>
  </div>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

const titleSize = computed(() => {
  const stats = props.data?.stats || []
  if (!props.data?.stats.length) return ''
  let longest = 0
  stats.forEach(stat => {
    if (stat.title.length > longest) {
      longest = stat.title.length
    }
  })
  if (longest > 16) {
    return 'text-xl sm:text-2xl md:text-4xl'
  } else if (longest > 12) {
    return 'text-2xl sm:text-3xl md:text-4xl'
  } else {
    return 'text-3xl sm:text-4xl md:text-5xl'
  }
})

const subtitleSize = computed(() => {
  const stats = props.data?.stats || []
  if (!props.data?.stats.length) return ''
  let longest = 0
  stats.forEach(stat => {
    if (stat.subtitle && stat.subtitle.length > longest) {
      longest = stat.subtitle.length
    }
  })
  if (longest > 30) {
    return 'text-sm sm:text-base'
  } else if (longest > 20) {
    return 'text-sm sm:text-base'
  } else {
    return 'text-base sm:text-lg'
  }
})

</script>