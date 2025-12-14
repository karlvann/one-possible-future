/**
 * Notion Integration Utility for Shadow Pages
 *
 * This utility handles fetching content from Notion and converting it to HTML
 * for the shadow pages system. Shadow pages are noindex pages that provide
 * comprehensive content for LLMs (ChatGPT, Perplexity) while keeping Google
 * rankings focused on the pretty marketing pages.
 */

import { Client } from '@notionhq/client'

// Initialize Notion client (will be initialized lazily)
let notionClient = null

export function getNotionClient() {
  if (!notionClient) {
    const apiKey = process.env.NOTION_API_KEY?.trim()
    if (!apiKey) {
      throw new Error('NOTION_API_KEY environment variable is not set')
    }
    notionClient = new Client({ auth: apiKey })
  }
  return notionClient
}

/**
 * Page ID Mapping
 * Maps URL slugs to Notion page IDs
 *
 * Operations pages (Fin-optimized, Q&A format):
 * - delivery-details (legacy) -> delivery (new)
 * - trial-details (legacy) -> trial (new)
 * - warranty-details (legacy) -> warranty (new)
 * - adjustments-details (legacy) -> adjustments (new)
 *
 * Voice pages (Narrative format):
 * - voice/cloud
 * - voice/aurora
 * - voice/cooper
 * - voice/why-ausbeds
 *
 * URL Structure:
 * - Legacy: /delivery-details, /trial-details, etc.
 * - New: /help/delivery, /help/trial, etc.
 */
export const notionPages = {
  // Operations SSOT pages (legacy URLs)
  'delivery-details': '2c6bd057-a789-81d6-b551-f6e5bebce61b',
  'trial-details': '2c6bd057-a789-81bc-b86d-c5aeb2094098',
  'warranty-details': '2c6bd057-a789-814c-801b-d893a535c5d4',
  'adjustments-details': '2c6bd057-a789-816c-bf7c-eba63efa9823',

  // ===========================================
  // POLICIES & OPERATIONS (for /help/* routes)
  // ===========================================
  'delivery': '2c6bd057-a789-81d6-b551-f6e5bebce61b',
  'trial': '2c6bd057-a789-81bc-b86d-c5aeb2094098',
  'warranty': '2c6bd057-a789-814c-801b-d893a535c5d4',
  'adjustments': '2c6bd057-a789-816c-bf7c-eba63efa9823',
  'payments': '2c8bd057-a789-8115-a846-e20f2085f1c2',

  // ===========================================
  // PRODUCTS & SIZING
  // ===========================================
  'products': '2c6bd057-a789-819c-bb41-fb875075c23a',
  'dimensions': '2c8bd057-a789-81e7-954b-eb16377d5f0e',
  'half-half': '2c6bd057-a789-8111-8506-e43e4b14f80e',
  'bed-bases': '2c8bd057-a789-8164-9ca5-d8326dbd541c',
  'accessories': '2c8bd057-a789-81bd-b892-d1ad96018a1b',
  'recommendations': '2c8bd057-a789-8184-a02e-fdc38733164f',

  // ===========================================
  // CONTACT
  // ===========================================
  'showroom': '2c6bd057-a789-8176-a125-cbca4893b4ab',

  // ===========================================
  // PHASE 2 - WHY AUSBEDS (sales-focused, add later)
  // ===========================================
  // 'comparisons': '2c6bd057-a789-81ae-ba0d-e931679556d3',
  // 'last-mattress': '2c8bd057-a789-81a8-8f4e-e5e24a1d9fc3',
  // 'prices': '2c8bd057-a789-8168-b842-e7045802d619',

  // ===========================================
  // VOICE & PROOF SSOT (narrative format, add when created)
  // ===========================================
  // 'voice/cloud': 'xxx',
  // 'voice/aurora': 'xxx',
  // 'voice/cooper': 'xxx',
  // 'voice/why-ausbeds': 'xxx',
}

/**
 * Convert Notion rich text to HTML
 */
export function richTextToHtml(richTextArray) {
  if (!richTextArray || !Array.isArray(richTextArray)) {
    return ''
  }

  return richTextArray.map(item => {
    let text = item.plain_text || ''

    // Handle annotations (bold, italic, strikethrough, underline, code)
    if (item.annotations) {
      if (item.annotations.bold) {
        text = `<strong>${text}</strong>`
      }
      if (item.annotations.italic) {
        text = `<em>${text}</em>`
      }
      if (item.annotations.strikethrough) {
        text = `<del>${text}</del>`
      }
      if (item.annotations.underline) {
        text = `<u>${text}</u>`
      }
      if (item.annotations.code) {
        text = `<code>${text}</code>`
      }
    }

    // Handle links
    if (item.href) {
      text = `<a href="${item.href}" target="_blank" rel="noopener noreferrer">${text}</a>`
    }

    return text
  }).join('')
}

/**
 * Convert Notion blocks to HTML
 * Supports the Shadow-Safe Block Set (v1.1):
 * - Headings (h1, h2, h3)
 * - Paragraphs
 * - Bulleted lists
 * - Numbered lists
 * - Simple tables
 * - Dividers
 * - Callouts (flattened to paragraphs)
 * - Toggle blocks (flattened)
 * - Images (external + Notion-hosted with captions)
 * - Quotes
 * - Code blocks
 */
export function blocksToHtml(blocks) {
  if (!blocks || !Array.isArray(blocks)) {
    return ''
  }

  let html = ''
  let inBulletedList = false
  let inNumberedList = false

  for (const block of blocks) {
    // Close lists if we're not in a list item
    if (block.type !== 'bulleted_list_item' && inBulletedList) {
      html += '</ul>\n'
      inBulletedList = false
    }
    if (block.type !== 'numbered_list_item' && inNumberedList) {
      html += '</ol>\n'
      inNumberedList = false
    }

    switch (block.type) {
      case 'paragraph':
        const pText = richTextToHtml(block.paragraph?.rich_text)
        if (pText) {
          html += `<p>${pText}</p>\n`
        }
        break

      case 'heading_1':
        html += `<h1>${richTextToHtml(block.heading_1?.rich_text)}</h1>\n`
        break

      case 'heading_2':
        html += `<h2>${richTextToHtml(block.heading_2?.rich_text)}</h2>\n`
        break

      case 'heading_3':
        html += `<h3>${richTextToHtml(block.heading_3?.rich_text)}</h3>\n`
        break

      case 'bulleted_list_item':
        if (!inBulletedList) {
          html += '<ul>\n'
          inBulletedList = true
        }
        html += `<li>${richTextToHtml(block.bulleted_list_item?.rich_text)}</li>\n`
        break

      case 'numbered_list_item':
        if (!inNumberedList) {
          html += '<ol>\n'
          inNumberedList = true
        }
        html += `<li>${richTextToHtml(block.numbered_list_item?.rich_text)}</li>\n`
        break

      case 'divider':
        html += '<hr>\n'
        break

      case 'quote':
        html += `<blockquote>${richTextToHtml(block.quote?.rich_text)}</blockquote>\n`
        break

      case 'callout':
        // Flatten callouts to paragraphs (ignore icon)
        html += `<p class="callout">${richTextToHtml(block.callout?.rich_text)}</p>\n`
        break

      case 'toggle':
        // Flatten toggle blocks - render heading + children
        html += `<h3>${richTextToHtml(block.toggle?.rich_text)}</h3>\n`
        // Note: Children would need recursive fetching - handled separately if needed
        break

      case 'code':
        const codeText = richTextToHtml(block.code?.rich_text)
        const language = block.code?.language || 'text'
        html += `<pre><code class="language-${language}">${escapeHtml(codeText)}</code></pre>\n`
        break

      case 'table':
        // Tables are handled separately with table_row children
        html += '<table>\n'
        break

      case 'table_row':
        html += '<tr>\n'
        if (block.table_row?.cells) {
          for (const cell of block.table_row.cells) {
            html += `<td>${richTextToHtml(cell)}</td>\n`
          }
        }
        html += '</tr>\n'
        break

      case 'image':
        // Handle both Notion-hosted and external images
        const imageData = block.image
        let imageUrl = ''

        if (imageData?.type === 'external') {
          // External image URL (permanent)
          imageUrl = imageData.external?.url || ''
        } else if (imageData?.type === 'file') {
          // Notion-hosted image (temporary signed URL, ~1 hour expiry)
          // Works within ISR cache window
          imageUrl = imageData.file?.url || ''
        }

        if (imageUrl) {
          const caption = richTextToHtml(imageData.caption)
          if (caption) {
            html += `<figure>\n<img src="${imageUrl}" alt="${caption}" loading="lazy">\n<figcaption>${caption}</figcaption>\n</figure>\n`
          } else {
            html += `<img src="${imageUrl}" alt="" loading="lazy">\n`
          }
        }
        break

      // Unsupported blocks - skip silently
      case 'embed':
      case 'video':
      case 'file':
      case 'pdf':
      case 'bookmark':
      case 'child_database':
      case 'child_page':
      case 'synced_block':
      case 'template':
      case 'link_to_page':
      case 'table_of_contents':
      case 'breadcrumb':
      case 'column_list':
      case 'column':
        // Skip unsupported blocks (as per Shadow-Safe Block Set v1)
        break

      default:
        // Unknown block type - skip
        console.warn(`[Notion] Unknown block type: ${block.type}`)
        break
    }
  }

  // Close any open lists
  if (inBulletedList) {
    html += '</ul>\n'
  }
  if (inNumberedList) {
    html += '</ol>\n'
  }

  return html
}

/**
 * Escape HTML entities for code blocks
 */
export function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

/**
 * Retry helper for handling Notion API rate limits (3 requests/second)
 * Uses exponential backoff: 1s, 2s, 4s
 *
 * @param {Function} fn - Async function to retry
 * @param {number} maxRetries - Maximum number of retry attempts (default: 3)
 * @returns {Promise} Result of the function call
 * @throws {Error} If max retries exceeded or non-rate-limit error occurs
 */
async function withRetry(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      // Check if it's a rate limit error (429 status or rate_limited code)
      const isRateLimited = error.code === 'rate_limited' || error.status === 429

      if (isRateLimited && i < maxRetries - 1) {
        const delay = Math.pow(2, i) * 1000 // 1s, 2s, 4s
        console.warn(`[Notion] Rate limited, retrying in ${delay}ms (attempt ${i + 1}/${maxRetries})`)
        await new Promise(r => setTimeout(r, delay))
        continue
      }

      // If not rate limited or max retries exceeded, throw the error
      throw error
    }
  }
}

/**
 * Fetch all blocks from a Notion page (handles pagination)
 */
export async function fetchAllBlocks(pageId) {
  const notion = getNotionClient()
  const blocks = []
  let cursor = undefined

  do {
    // Wrap each paginated request with retry logic
    const response = await withRetry(async () => {
      return await notion.blocks.children.list({
        block_id: pageId,
        start_cursor: cursor,
        page_size: 100
      })
    })

    blocks.push(...response.results)
    cursor = response.has_more ? response.next_cursor : undefined
  } while (cursor)

  return blocks
}

/**
 * Fetch page metadata from Notion
 */
async function fetchPageMetadata(pageId) {
  const notion = getNotionClient()

  try {
    // Wrap API call with retry logic
    const page = await withRetry(async () => {
      return await notion.pages.retrieve({ page_id: pageId })
    })

    // Extract title from properties
    let title = 'Untitled'
    if (page.properties) {
      // Try common title property names
      const titleProperty = page.properties.title || page.properties.Title || page.properties.Name || page.properties.name
      if (titleProperty && titleProperty.title) {
        title = titleProperty.title.map(t => t.plain_text).join('')
      }
    }

    return {
      id: page.id,
      title,
      createdTime: page.created_time,
      lastEditedTime: page.last_edited_time,
      url: page.url
    }
  } catch (error) {
    console.error(`[Notion] Error fetching page metadata: ${error.message}`)
    return null
  }
}

/**
 * Get Notion page content as HTML
 * Main export function for the API route
 */
export async function getNotionPage(slug) {
  const pageId = notionPages[slug]

  if (!pageId) {
    return null
  }

  try {
    // Fetch page metadata and blocks in parallel
    const [metadata, blocks] = await Promise.all([
      fetchPageMetadata(pageId),
      fetchAllBlocks(pageId)
    ])

    // Convert blocks to HTML
    const contentHtml = blocksToHtml(blocks)

    return {
      slug,
      pageId,
      title: metadata?.title || 'Untitled',
      lastEdited: metadata?.lastEditedTime || null,
      content: contentHtml
    }
  } catch (error) {
    console.error(`[Notion] Error fetching page ${slug}: ${error.message}`)
    throw error
  }
}

/**
 * Check if a slug is a valid shadow page
 */
export function isValidShadowPage(slug) {
  return slug in notionPages
}

/**
 * Get all available shadow page slugs
 */
export function getAllShadowPageSlugs() {
  return Object.keys(notionPages)
}
