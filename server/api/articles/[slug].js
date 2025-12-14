/**
 * Single Article API
 *
 * GET /api/articles/:slug
 * Returns a single article by slug with full content
 *
 * Response:
 * {
 *   success: true,
 *   data: {
 *     id, title, slug, metaTitle, metaDescription,
 *     publishDate, featuredImage, category, content
 *   }
 * }
 */

import { getArticleBySlug } from '../../utils/notionBlog'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing slug parameter'
    })
  }

  try {
    const article = await getArticleBySlug(slug)

    if (!article) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Article not found',
        message: `No published article found with slug: ${slug}`
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

    console.error(`[Articles API] Error fetching article ${slug}:`, error.message)

    // Check if it's a missing env var error
    if (error.message.includes('NOTION_BLOG_DATABASE_ID')) {
      throw createError({
        statusCode: 503,
        statusMessage: 'Blog database not configured',
        message: 'NOTION_BLOG_DATABASE_ID environment variable is not set'
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch article',
      message: error.message
    })
  }
})
