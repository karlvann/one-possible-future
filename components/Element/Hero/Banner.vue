<template>

  <div class="w-full relative h-[180px]">
    <div 
    class="absolute w-[200%] -left-[50%] h-[100%] -top-[35px] text-center z-[8] flex items-center justify-center"
    :style="spanStyle"
    >
      <span class="text-grey-dark font-bold text-base md:text-lg lg:text-xl pb-4">
        <span class="block md:inline-block">1,200+ happy customers</span><span class="hidden md:inline-block px-2"> • </span><span class="block md:inline-block">4.9+ stars on <a href="https://www.productreview.com.au/b/ausbeds" target="_blank" class="underline">ProductReview.com.au</a></span>
      </span>
    </div>
    <img
    class="absolute top-[90px] right-[40px] z-[9] w-[110px] sm:w-[120px] md:top-[60px] xl:top-[40px] xl:right-[80px] md:w-[130px] lg:w-[130px] xl:w-[150px]"
    loading="lazy"
    :src="useCdn('4bbf8f92-d337-4612-8201-53fad1a84820', 'skull.png', 384, 384)"
    alt="'No more mattress trauma' badge"
    />
  </div>

</template>

<script setup>
const spanStyle = computed(() => {
  return {
    backgroundImage: `url(${useCdn('e77ba6ec-02c5-4892-9310-2291e1ac1987', 'brush-stroke-blue.svg')})`,
    backgroundSize: `100% 100%`,
    backgroundRepeat: `no-repeat`,
    backgroundPosition: `center center`
  }
})
</script>