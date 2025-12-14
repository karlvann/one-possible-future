<template>
  <Container>
    <nav class="flex border-t-1 border-b-1 border-solid border-[#E4E2DF] py-1" aria-label="Breadcrumb">
      <ol role="list" class="flex items-center space-x-2">
        <li>
          <div>
            <a href="#" class="text-xs font-medium text-gray-500 hover:text-grey-dark">
              Home
            </a>
          </div>
        </li>
        <li v-for="page in breadcrumbs" :key="page.title">
          <div class="flex items-center">
            <Icon name="iconoir:nav-arrow-right" class="h-5 w-5 flex-shrink-0 text-gray-400" />
            <a :href="page.url" class="ml-2 text-xs font-medium text-gray-500 hover:text-grey-dark">{{ page.title }}</a>
          </div>
        </li>
      </ol>
    </nav>
  </Container>
</template>

<script setup>
const props = defineProps({
  breadcrumbs: {
    type: Array,
    required: true
  }
})
</script>