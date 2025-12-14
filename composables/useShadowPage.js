/**
 * Shadow Page Composable
 *
 * Fetches and manages Notion content for shadow pages.
 * Shadow pages are noindex pages optimized for LLM readability
 * that provide comprehensive content for ChatGPT, Perplexity, etc.
 */

export function useShadowPage(slug) {
  const { data, pending, error, refresh } = useFetch(`/api/notion/${slug}`, {
    key: `shadow-page-${slug}`,
    // Transform the response to extract the content
    transform: (response) => {
      if (response?.success && response?.data) {
        return response.data
      }
      return null
    }
  })

  // Computed helpers
  const title = computed(() => data.value?.title || 'Loading...')
  const content = computed(() => data.value?.content || '')
  const lastEdited = computed(() => data.value?.lastEdited || null)
  const isLoading = computed(() => pending.value)
  const hasError = computed(() => !!error.value)

  // Format the last edited date
  const lastEditedFormatted = computed(() => {
    if (!lastEdited.value) return null
    try {
      return new Date(lastEdited.value).toLocaleDateString('en-AU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return null
    }
  })

  return {
    data,
    title,
    content,
    lastEdited,
    lastEditedFormatted,
    isLoading,
    hasError,
    error,
    refresh
  }
}
