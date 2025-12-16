/**
 * Notion FAQ Database Integration
 *
 * This utility handles fetching FAQ articles from a Notion database.
 * Replaces the old system of individual page IDs with a single database
 * that can be queried dynamically.
 *
 * Database Properties:
 * - Title (title): FAQ page headline
 * - Slug (text): URL path (e.g., "delivery", "trial")
 * - Meta Description (text): SEO description
 * - Category (select): "Policies", "Products", or "Contact"
 * - Icon (text): Emoji icon for display
 * - Canonical URL (text): Link to main site page if exists
 * - Published (checkbox): Only show if checked
 * - Order (number): Display order in listings
 */

import { getNotionClient, fetchAllBlocks, blocksToHtml, getPropertyText } from './notion'

/**
 * Get the FAQ database ID from environment
 */
function getFaqDatabaseId() {
  const databaseId = process.env.NOTION_FAQ_DATABASE_ID
  if (!databaseId) {
    throw new Error('NOTION_FAQ_DATABASE_ID environment variable is not set')
  }
  return databaseId
}

/**
 * Parse FAQ article properties from a Notion database row
 */
function parseFaqProperties(page) {
  const props = page.properties || {}

  return {
    id: page.id,
    title: getPropertyText(props.Title || props.title),
    titleTag: getPropertyText(props['Title Tag']),
    slug: getPropertyText(props.Slug || props.slug),
    metaDescription: getPropertyText(props['Meta Description']),
    category: getPropertyText(props.Category || props.category),
    icon: getPropertyText(props.Icon || props.icon),
    canonicalUrl: getPropertyText(props['Canonical URL']),
    published: getPropertyText(props.Published || props.published),
    order: getPropertyText(props.Order || props.order),
    lastEditedTime: page.last_edited_time,
    notionUrl: page.url
  }
}

/**
 * Fetch all published FAQ articles from the database
 * Returns article metadata (not content) for listing pages
 */
export async function getAllFaqArticles() {
  const notion = getNotionClient()
  const databaseId = getFaqDatabaseId()

  const articles = []
  let cursor = undefined

  do {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'Published',
        checkbox: {
          equals: true
        }
      },
      sorts: [
        {
          property: 'Order',
          direction: 'ascending'
        }
      ],
      start_cursor: cursor,
      page_size: 100
    })

    for (const page of response.results) {
      const article = parseFaqProperties(page)
      // Only include articles with a slug
      if (article.slug) {
        articles.push(article)
      }
    }

    cursor = response.has_more ? response.next_cursor : undefined
  } while (cursor)

  return articles
}

/**
 * Fetch a single FAQ article by slug
 * Returns full article with content
 */
export async function getFaqBySlug(slug) {
  const notion = getNotionClient()
  const databaseId = getFaqDatabaseId()

  // Query database for the specific slug
  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      and: [
        {
          property: 'Slug',
          rich_text: {
            equals: slug
          }
        },
        {
          property: 'Published',
          checkbox: {
            equals: true
          }
        }
      ]
    },
    page_size: 1
  })

  if (response.results.length === 0) {
    return null
  }

  const page = response.results[0]
  const article = parseFaqProperties(page)

  // Fetch the page content (blocks)
  const blocks = await fetchAllBlocks(page.id)
  const contentHtml = blocksToHtml(blocks)

  return {
    ...article,
    content: contentHtml
  }
}

/**
 * Get FAQ articles by category
 */
export async function getFaqByCategory(category) {
  const notion = getNotionClient()
  const databaseId = getFaqDatabaseId()

  const articles = []
  let cursor = undefined

  do {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        and: [
          {
            property: 'Published',
            checkbox: {
              equals: true
            }
          },
          {
            property: 'Category',
            select: {
              equals: category
            }
          }
        ]
      },
      sorts: [
        {
          property: 'Order',
          direction: 'ascending'
        }
      ],
      start_cursor: cursor,
      page_size: 100
    })

    for (const page of response.results) {
      const article = parseFaqProperties(page)
      if (article.slug) {
        articles.push(article)
      }
    }

    cursor = response.has_more ? response.next_cursor : undefined
  } while (cursor)

  return articles
}

/**
 * Get all FAQ articles grouped by category
 * Useful for the FAQ index page
 */
export async function getAllFaqGroupedByCategory() {
  const articles = await getAllFaqArticles()

  const grouped = {
    Policies: [],
    Products: [],
    Contact: []
  }

  for (const article of articles) {
    if (grouped[article.category]) {
      grouped[article.category].push(article)
    }
  }

  return grouped
}
