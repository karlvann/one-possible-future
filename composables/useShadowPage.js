/**
 * Shadow Page Composable
 *
 * Fetches and manages Notion content for shadow pages.
 * Now uses the new FAQ API instead of the deprecated notion-knowledge API.
 *
 * Shadow pages use slugs like "delivery-details" which map to FAQ slugs like "delivery".
 */

export function useShadowPage(slug) {
  // Map shadow page slugs to FAQ slugs (remove -details suffix)
  const faqSlug = slug.replace(/-details$/, '').replace(/^voice\//, '')

  const { data, pending, error, refresh } = useFetch(`/api/notion-faq/${faqSlug}`, {
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
  const lastEdited = computed(() => data.value?.lastEditedTime || null)
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
