/**
 * Single FAQ Article API
 *
 * GET /api/notion-faq/:slug
 * Returns a single FAQ article by slug with full content
 *
 * Response:
 * {
 *   success: true,
 *   data: {
 *     id, title, slug, metaDescription, category,
 *     icon, canonicalUrl, order, content
 *   }
 * }
 */

import { getFaqBySlug } from '../../utils/notionFaq'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing slug parameter'
    })
  }

  try {
    const article = await getFaqBySlug(slug)

    if (!article) {
      throw createError({
        statusCode: 404,
        statusMessage: 'FAQ article not found',
        message: `No published FAQ found with slug: ${slug}`
      })
    }

    // Set cache headers for ISR (1 hour)
    setHeader(event, 'Cache-Control', 's-maxage=3600, stale-while-revalidate=86400')

    return {
      success: true,
      data: article
    }
  } catch (error) {
    // Re-throw HTTP errors
    if (error.statusCode) {
      throw error
    }

    console.error(`[FAQ API] Error fetching FAQ ${slug}:`, error.message)

    // Check if it's a missing env var error
    if (error.message.includes('NOTION_FAQ_DATABASE_ID')) {
      throw createError({
        statusCode: 503,
        statusMessage: 'FAQ database not configured',
        message: 'NOTION_FAQ_DATABASE_ID environment variable is not set'
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch FAQ article',
      message: error.message
    })
  }
})
