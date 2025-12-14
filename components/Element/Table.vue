<template>
  <div 
  class="blog-table overflow-scroll md:overflow-visible -my-8 rounded-lg py-8"
  :class="data.width ? '-mr-8 -ml-8 pl-8 pr-8 md:mr-0' : ''"
  v-html="data.table"
  >
  </div>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Object,
    required: true,
  }
})
</script>

<style lang="scss">
.blog-table {
  table {
    @apply w-[700px] md:w-[100%] md:w-[-webkit-fill-available] min-w-fit md:-mx-[80px] xl:-mx-[120px] bg-[#e6f0f4] border ring-blue ring-[1px] ring-inset rounded overflow-hidden;
    font-size: 0.875em;
    line-height: 1.7142857;
    table-layout: fixed;
  }
  th, td {
    @apply border border-blue px-4 py-2 text-left align-top;
  }
  td {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
  ul {
    padding-inline-start: 12px!important;
    list-style: disc;
    li {
      padding-inline-start: 0!important;
    }
  }
  p {
    margin-top: 5px!important;
    margin-bottom: 5px!important;
  }
  li {
    margin-top: 1px!important;
    margin-bottom: 1px!important;
  }
}
</style>