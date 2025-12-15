/**
 * Notion Integration Utilities
 *
 * Shared utilities for fetching content from Notion and converting it to HTML.
 * Used by both the Blog (notion-blog) and FAQ (notion-faq) systems.
 *
 * Key exports:
 * - getNotionClient() - Lazily initialized Notion API client
 * - richTextToHtml() - Convert Notion rich text to HTML
 * - blocksToHtml() - Convert Notion blocks to HTML
 * - fetchAllBlocks() - Fetch all blocks from a page (handles pagination)
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
  let inTable = false

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
    // Close table if we're not in a table row anymore
    if (block.type !== 'table_row' && inTable) {
      html += '</table>\n'
      inTable = false
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
        // Check for featured review pattern (⭐ or 💬 emoji)
        const calloutIcon = block.callout?.icon?.emoji
        if (calloutIcon === '⭐' || calloutIcon === '💬') {
          // Render as featured review with special styling
          html += `<div class="featured-review">${richTextToHtml(block.callout?.rich_text)}</div>\n`
        } else {
          // Regular callout - flatten to paragraph
          html += `<p class="callout">${richTextToHtml(block.callout?.rich_text)}</p>\n`
        }
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
        // The inTable flag ensures we close the table after all rows
        html += '<table>\n'
        inTable = true
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

      case 'video':
        // Handle YouTube videos with lite-youtube-embed
        const videoData = block.video
        let videoUrl = ''

        if (videoData?.type === 'external') {
          videoUrl = videoData.external?.url || ''
        }

        const youtubeId = extractYouTubeId(videoUrl)
        if (youtubeId) {
          const videoCaption = richTextToHtml(videoData.caption)
          html += `<div class="video-container">\n`
          html += `<lite-youtube videoid="${youtubeId}" playlabel="Play video"></lite-youtube>\n`
          if (videoCaption) {
            html += `<p class="video-caption">${videoCaption}</p>\n`
          }
          html += `</div>\n`
        }
        break

      // Unsupported blocks - skip silently
      case 'embed':
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

  // Close any open lists or tables
  if (inBulletedList) {
    html += '</ul>\n'
  }
  if (inNumberedList) {
    html += '</ol>\n'
  }
  if (inTable) {
    html += '</table>\n'
  }

  // Post-process: Convert standalone YouTube links to embeds
  html = convertYouTubeLinksToEmbeds(html)

  return html
}

/**
 * Convert standalone YouTube links in HTML to lite-youtube embeds
 * Matches links where the link text is the URL itself (not descriptive text)
 */
export function convertYouTubeLinksToEmbeds(html) {
  // Match <a> tags where href is a YouTube URL and the link text is also the URL
  const youtubeRegex = /<a[^>]*href="(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})[^"]*)"[^>]*>([^<]*)<\/a>/gi

  return html.replace(youtubeRegex, (match, fullUrl, videoId, linkText) => {
    // Only convert if the link text looks like a URL (not descriptive text)
    if (linkText.includes('youtube.com') || linkText.includes('youtu.be') || linkText === fullUrl) {
      return `<div class="video-container">
<lite-youtube videoid="${videoId}" playlabel="Play video"></lite-youtube>
</div>`
    }
    // Keep descriptive links as-is (e.g., "Watch the video here")
    return match
  })
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
 * Extract YouTube video ID from various URL formats
 * Supports: youtube.com/watch?v=, youtu.be/, youtube.com/embed/
 */
export function extractYouTubeId(url) {
  if (!url) return null

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/ // Just the ID
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }

  return null
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

