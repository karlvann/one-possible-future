<template>
  <article class="flex flex-col items-start" v-if="article?.slug">
    <div class="relative w-full">
      <NuxtLink 
      :to="`/guides/${article.slug}`"
      :aria-label="article.title"
      >
        <ImageResponsive
        v-if="article?.image"
        classes="rounded-lg"
        :lazy="true"
        :data="article?.image"
        :xs="12"
        :sm="12"
        :md="6"
        :lg="4"
        :xl="4"
        />
      </NuxtLink>
    </div>
    <div class="max-w-xl mt-2 sm:mt-4">
      <div class="group relative">
        <NuxtLink :to="`/guides/${article.slug}`">
          <h3 
          class="text-md font-semibold leading-6 md:leading-6 text-grey-dark"
          :class="[ size == 'feature' ? 'md:text-xl' : 'md:text-md lg:text-lg' ]"
          >
            {{ article.title }}
          </h3>
          <div class="mt-2 flex items-center gap-x-4 text-xs">
            <time :datetime="article.date" class="text-gray-500">{{ useFormattedDate(article.date) }}<template v-if="article.time">, {{ article.time }} AEST</template></time>
          </div>
        </NuxtLink>
      </div>
    </div>
  </article>
</template>

<script setup>
const props = defineProps({
  article: {
    type: Object,
    required: true
  },
  size: {
    type: String,
    default: null
  },
  type: {
    type: String,
    required: false,
    default: 'blog'
  }
})

</script>