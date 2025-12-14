<template>
  <div 
  class="hidden md:block md:col-span-3 lg:col-span-3 py-8 pr-8 sticky top-[80px] self-start"
  :class="isPolicyPage ? 'lg:pt-[90px]' : 'lg:py-12'"
  >
    <ClientOnly>
      <div 
      :class="{ 
        'tocs--scroll hide-scrollbar': tocsScroll
      }"
      >
        <ul v-if="tocs" ref="tocsRef">
          <li class="text-grey-dark mt-4 text-sm font-bold">
            Contents
          </li>
          <li 
          v-for="(toc, index) in tocs" 
          :key="'toc'+index"
          class="text-gray-500 mt-4 font-normal text-sm cursor-pointer"
          @click="goToSection(toc.id)"
          >
            {{ toc.innerText }}
          </li>
        </ul>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup>
const tocs = ref([])
const tocsRef = ref(null)
const tocsScroll = ref(null)
const route = useRoute()

onMounted(async () => {
  let toc = []
  const elementsH = document.querySelectorAll('h2')
  if (elementsH.length) {
    elementsH.forEach((element, index) => {
      const id = `toc_${index}`
      const type = element.tagName.toLowerCase()
      element.setAttribute('id', id)
      if (element.textContent !== 'You might also like') {
        toc.push({
          id,
          type,
          innerText: element.textContent
        })
      }
    })
    tocs.value = toc
  }

  await nextTick()
  const ulHeight = tocsRef.value.clientHeight;
  if (window.innerWidth > 1000 && ulHeight > window.innerHeight - 100) {
    tocsScroll.value = true
  }
})

const isPolicyPage = () => {
  return route.path.includes('/policies/')
}

const goToSection = id => {
  const el = document.getElementById(id)
  const yPos = getOffset(el).top - 140
  window.scrollTo({ top: yPos, behavior: 'smooth' })
}

const getOffset = el => {
  const rect = el.getBoundingClientRect()
  return {
    left: rect.left + window.scrollX,
    top: isPolicyPage ? rect.top + window.scrollY : rect.top + window.scrollY
  }
}

</script>