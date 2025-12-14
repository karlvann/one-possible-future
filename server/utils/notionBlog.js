/**
 * Notion Blog Integration
 *
 * This utility handles fetching blog articles from a Notion database.
 * Unlike shadow pages (which use individual page IDs), the blog uses
 * a database where each row is an article.
 *
 * Database Properties Expected:
 * - Title (title): Article headline
 * - Slug (text): URL path
 * - Meta Title (text): SEO title tag (optional, falls back to Title)
 * - Meta Description (text): SEO description
 * - Published (checkbox): Only show if checked
 * - Publish Date (date): For ordering and display
 * - Featured Image (url or files): Hero image URL
 * - Category (select): Article category (optional)
 */

import { getNotionClient, fetchAllBlocks, blocksToHtml, richTextToHtml } from './notion'

/**
 * Get the blog database ID from environment
 */
function getBlogDatabaseId() {
  const databaseId = process.env.NOTION_BLOG_DATABASE_ID
  if (!databaseId) {
    throw new Error('NOTION_BLOG_DATABASE_ID environment variable is not set')
  }
  return databaseId
}

/**
 * Extract text from a Notion property
 */
function getPropertyText(property) {
  if (!property) return ''

  switch (property.type) {
    case 'title':
      return property.title?.map(t => t.plain_text).join('') || ''
    case 'rich_text':
      return property.rich_text?.map(t => t.plain_text).join('') || ''
    case 'url':
      return property.url || ''
    case 'select':
      return property.select?.name || ''
    case 'multi_select':
      return property.multi_select?.map(s => s.name) || []
    case 'checkbox':
      return property.checkbox || false
    case 'date':
      return property.date?.start || null
    case 'files':
      // Get first file URL
      if (property.files?.length > 0) {
        const file = property.files[0]
        if (file.type === 'external') return file.external?.url || ''
        if (file.type === 'file') return file.file?.url || ''
      }
      return ''
    default:
      return ''
  }
}

/**
 * Parse article properties from a Notion database row
 */
function parseArticleProperties(page) {
  const props = page.properties || {}

  // Get title - try common property names
  const title = getPropertyText(props.Title || props.title || props.Name || props.name)

  // Get other properties
  const slug = getPropertyText(props.Slug || props.slug)
  const metaTitle = getPropertyText(props['Meta Title'] || props.meta_title || props.MetaTitle)
  const metaDescription = getPropertyText(props['Meta Description'] || props.meta_description || props.MetaDescription)
  const published = getPropertyText(props.Published || props.published)
  const publishDate = getPropertyText(props['Publish Date'] || props.publish_date || props.PublishDate || props.Date || props.date)
  const featuredImage = getPropertyText(props['Featured Image'] || props.featured_image || props.FeaturedImage || props.Image || props.image)
  const category = getPropertyText(props.Category || props.category)

  return {
    id: page.id,
    title,
    slug,
    metaTitle: metaTitle || title, // Fall back to title if no meta title
    metaDescription,
    published,
    publishDate,
    featuredImage,
    category,
    createdTime: page.created_time,
    lastEditedTime: page.last_edited_time,
    notionUrl: page.url
  }
}

/**
 * Fetch all published articles from the database
 * Returns article metadata (not content) for listing pages
 */
export async function getAllArticles() {
  const notion = getNotionClient()
  const databaseId = getBlogDatabaseId()

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
          property: 'Publish Date',
          direction: 'descending'
        }
      ],
      start_cursor: cursor,
      page_size: 100
    })

    for (const page of response.results) {
      const article = parseArticleProperties(page)
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
 * Fetch a single article by slug
 * Returns full article with content
 */
export async function getArticleBySlug(slug) {
  const notion = getNotionClient()
  const databaseId = getBlogDatabaseId()

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
  const article = parseArticleProperties(page)

  // Fetch the page content (blocks)
  const blocks = await fetchAllBlocks(page.id)
  const contentHtml = blocksToHtml(blocks)

  return {
    ...article,
    content: contentHtml
  }
}

/**
 * Get articles by category
 */
export async function getArticlesByCategory(category) {
  const notion = getNotionClient()
  const databaseId = getBlogDatabaseId()

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
          property: 'Publish Date',
          direction: 'descending'
        }
      ],
      start_cursor: cursor,
      page_size: 100
    })

    for (const page of response.results) {
      const article = parseArticleProperties(page)
      if (article.slug) {
        articles.push(article)
      }
    }

    cursor = response.has_more ? response.next_cursor : undefined
  } while (cursor)

  return articles
}

/**
 * Get all unique categories from published articles
 */
export async function getAllCategories() {
  const articles = await getAllArticles()
  const categories = new Set()

  for (const article of articles) {
    if (article.category) {
      categories.add(article.category)
    }
  }

  return Array.from(categories).sort()
}
