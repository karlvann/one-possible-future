/**
 * FAQ Article API Endpoint
 *
 * Returns a single FAQ article by slug with full HTML content.
 * Used by NotionFaqDropdown component.
 *
 * GET /api/notion-faq/:slug
 */

import { getFaqBySlug } from '../../utils/notionFaq'

export default defineEventHandler(async (event) => {
  const slug = event.context.params?.slug

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Slug parameter is required'
    })
  }

  try {
    const article = await getFaqBySlug(slug)

    if (!article) {
      throw createError({
        statusCode: 404,
        statusMessage: `FAQ article not found: ${slug}`
      })
    }

    return {
      data: article
    }

  } catch (error) {
    if (error.statusCode) throw error

    console.error(`[Notion FAQ] Error fetching ${slug}:`, error.message)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch FAQ article'
    })
  }
})
