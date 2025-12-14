<template>
  <div class="flex flex-col flex-1 w-full overflow-x-hidden pb-12 md:pb-8">

    <div
    class="items-center flex-col flex"
    v-if="data?.type === 'Image'"
    >
      <ElementHeroImage :data="data" />
    </div>

    <div
    class="items-center flex-col flex"
    v-else-if="data?.type === 'Video'"
    >
      <ElementHeroVideo :data="data" />
    </div>

    <div
    class="items-center flex-col flex"
    v-else-if="data?.type === 'Stats'"
    >
      <ElementHeroStats :data="data" />
    </div>

    <div
    class="items-center flex-col flex"
    v-else-if="data?.type === 'Centre slogan'"
    >
      <ElementHeroSlogan :data="data" />
      <ElementHeroBanner :data="data" />
    </div>

  </div>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})
</script>