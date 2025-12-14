/**
 * Articles List API
 *
 * GET /api/articles
 * Returns all published articles from the Notion database
 *
 * Query params:
 * - category: Filter by category (optional)
 *
 * Response:
 * {
 *   success: true,
 *   data: [
 *     {
 *       id, title, slug, metaTitle, metaDescription,
 *       publishDate, featuredImage, category
 *     }
 *   ]
 * }
 */

import { getAllArticles, getArticlesByCategory } from '../../utils/notionBlog'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const category = query.category

    let articles
    if (category) {
      articles = await getArticlesByCategory(category)
    } else {
      articles = await getAllArticles()
    }

    // Set cache headers for ISR (1 hour)
    setHeader(event, 'Cache-Control', 's-maxage=3600, stale-while-revalidate=86400')

    return {
      success: true,
      count: articles.length,
      data: articles
    }
  } catch (error) {
    console.error('[Articles API] Error fetching articles:', error.message)

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
      statusMessage: 'Failed to fetch articles',
      message: error.message
    })
  }
})
