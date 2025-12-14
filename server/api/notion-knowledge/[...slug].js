/**
 * Notion Shadow Pages API Route
 *
 * Fetches content from Notion and returns it as HTML for shadow pages.
 * This API is used by the shadow page Vue components to render Notion content.
 *
 * Route: /api/notion-knowledge/:slug
 * Example: /api/notion-knowledge/delivery-details
 *          /api/notion-knowledge/voice/cloud
 */

import { getNotionPage, isValidShadowPage } from '../../utils/notion'

export default defineEventHandler(async (event) => {
  // Get the slug from the URL params
  const slugParts = event.context.params?.slug
  const slug = Array.isArray(slugParts) ? slugParts.join('/') : slugParts

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Slug is required'
    })
  }

  // Check if this is a valid shadow page
  if (!isValidShadowPage(slug)) {
    throw createError({
      statusCode: 404,
      statusMessage: `Shadow page not found: ${slug}`
    })
  }

  try {
    // Fetch content from Notion
    const pageData = await getNotionPage(slug)

    if (!pageData) {
      throw createError({
        statusCode: 404,
        statusMessage: `Could not fetch page: ${slug}`
      })
    }

    // Set cache headers for ISR
    // Note: Vercel will respect these headers for ISR caching
    setResponseHeaders(event, {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
    })

    return {
      success: true,
      data: pageData
    }
  } catch (error) {
    // Handle Notion API errors
    console.error(`[Notion API] Error fetching ${slug}:`, error)

    // Check for specific Notion errors
    if (error.code === 'object_not_found') {
      throw createError({
        statusCode: 404,
        statusMessage: `Notion page not found for: ${slug}`
      })
    }

    if (error.code === 'unauthorized') {
      throw createError({
        statusCode: 500,
        statusMessage: 'Notion API authentication failed. Check NOTION_API_KEY.'
      })
    }

    // Re-throw if it's already a Nuxt error
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: `Failed to fetch shadow page: ${error.message}`
    })
  }
})
