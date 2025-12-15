/**
 * FAQ Articles List API
 *
 * GET /api/notion-faq
 * Returns all published FAQ articles from the Notion database
 *
 * Query params:
 * - category: Filter by category (optional) - "Policies", "Products", "Contact"
 * - grouped: Return articles grouped by category (optional) - "true"
 *
 * Response (flat list):
 * {
 *   success: true,
 *   count: 12,
 *   data: [
 *     { id, title, slug, metaDescription, category, icon, order }
 *   ]
 * }
 *
 * Response (grouped):
 * {
 *   success: true,
 *   data: {
 *     Policies: [...],
 *     Products: [...],
 *     Contact: [...]
 *   }
 * }
 */

import { getAllFaqArticles, getFaqByCategory, getAllFaqGroupedByCategory } from '../../utils/notionFaq'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const category = query.category
    const grouped = query.grouped === 'true'

    let result

    if (grouped) {
      // Return articles grouped by category (for FAQ index page)
      result = await getAllFaqGroupedByCategory()

      return {
        success: true,
        data: result
      }
    }

    // Flat list - optionally filtered by category
    let articles
    if (category) {
      articles = await getFaqByCategory(category)
    } else {
      articles = await getAllFaqArticles()
    }

    return {
      success: true,
      count: articles.length,
      data: articles
    }
  } catch (error) {
    console.error('[FAQ API] Error fetching FAQ articles:', error.message)

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
      statusMessage: 'Failed to fetch FAQ articles',
      message: error.message
    })
  }
})
