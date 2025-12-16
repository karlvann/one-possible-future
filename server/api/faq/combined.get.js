/**
 * Combined FAQ Knowledge Base API
 *
 * Returns ALL FAQ articles combined into a single markdown document.
 * Optimized for LLM ingestion (NotebookLM, ChatGPT, Perplexity, etc.)
 *
 * GET /api/faq/combined
 */

import { getAllFaqArticles, getFaqBySlug } from '../../utils/notionFaq'

/**
 * Convert HTML content to clean markdown
 * Handles the common elements from blocksToHtml()
 */
function htmlToMarkdown(html) {
  if (!html) return ''

  let md = html

  // Headings
  md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
  md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
  md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')

  // Bold and italic
  md = md.replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
  md = md.replace(/<em>(.*?)<\/em>/gi, '*$1*')
  md = md.replace(/<del>(.*?)<\/del>/gi, '~~$1~~')
  md = md.replace(/<u>(.*?)<\/u>/gi, '$1') // Markdown doesn't have underline

  // Code
  md = md.replace(/<code>(.*?)<\/code>/gi, '`$1`')
  md = md.replace(/<pre><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, '```\n$1\n```\n\n')

  // Links
  md = md.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')

  // Lists - handle list items first, then list containers
  md = md.replace(/<li>(.*?)<\/li>/gi, '- $1\n')
  md = md.replace(/<\/?[uo]l[^>]*>/gi, '\n')

  // Blockquotes
  md = md.replace(/<blockquote>(.*?)<\/blockquote>/gi, '> $1\n\n')

  // Paragraphs and divs
  md = md.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
  md = md.replace(/<div[^>]*>(.*?)<\/div>/gi, '$1\n')

  // Horizontal rules
  md = md.replace(/<hr\s*\/?>/gi, '\n---\n\n')

  // Images - keep as markdown images
  md = md.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, '![$2]($1)\n\n')
  md = md.replace(/<figure>[\s\S]*?<img[^>]*src="([^"]*)"[^>]*>[\s\S]*?<figcaption>(.*?)<\/figcaption>[\s\S]*?<\/figure>/gi, '![$2]($1)\n\n')

  // Tables - convert to markdown tables
  md = md.replace(/<table>([\s\S]*?)<\/table>/gi, (match, tableContent) => {
    const rows = []
    const rowRegex = /<tr>([\s\S]*?)<\/tr>/gi
    let rowMatch
    while ((rowMatch = rowRegex.exec(tableContent)) !== null) {
      const cells = []
      const cellRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi
      let cellMatch
      while ((cellMatch = cellRegex.exec(rowMatch[1])) !== null) {
        cells.push(cellMatch[1].trim())
      }
      rows.push(cells)
    }

    if (rows.length === 0) return ''

    let tableMarkdown = ''
    rows.forEach((row, i) => {
      tableMarkdown += '| ' + row.join(' | ') + ' |\n'
      if (i === 0) {
        tableMarkdown += '| ' + row.map(() => '---').join(' | ') + ' |\n'
      }
    })
    return tableMarkdown + '\n'
  })

  // Remove remaining HTML tags
  md = md.replace(/<[^>]+>/g, '')

  // Decode HTML entities
  md = md.replace(/&amp;/g, '&')
  md = md.replace(/&lt;/g, '<')
  md = md.replace(/&gt;/g, '>')
  md = md.replace(/&quot;/g, '"')
  md = md.replace(/&#039;/g, "'")
  md = md.replace(/&nbsp;/g, ' ')

  // Clean up whitespace
  md = md.replace(/\n{3,}/g, '\n\n')
  md = md.trim()

  return md
}

/**
 * Format date for display
 */
function formatDate(isoDate) {
  if (!isoDate) return 'Unknown'
  return new Date(isoDate).toISOString().split('T')[0]
}

export default defineEventHandler(async (event) => {
  try {
    // Get all FAQ articles metadata
    const articles = await getAllFaqArticles()

    // Fetch full content for each article (in parallel with concurrency limit)
    const fullArticles = []
    const batchSize = 5 // Avoid hitting Notion rate limits

    for (let i = 0; i < articles.length; i += batchSize) {
      const batch = articles.slice(i, i + batchSize)
      const batchResults = await Promise.all(
        batch.map(async (article) => {
          const full = await getFaqBySlug(article.slug)
          return {
            ...article,
            content: full?.content || ''
          }
        })
      )
      fullArticles.push(...batchResults)
    }

    // Group articles by category
    const categories = {}
    for (const article of fullArticles) {
      const cat = article.category || 'Other'
      if (!categories[cat]) categories[cat] = []
      categories[cat].push(article)
    }

    // Determine category order
    const categoryOrder = ['Policies', 'Products', 'Contact', 'Other']
    const sortedCategories = categoryOrder.filter(cat => categories[cat]?.length > 0)

    // Build the markdown document
    const now = new Date().toISOString()
    let markdown = ''

    // Header
    markdown += `# Ausbeds FAQ\n\n`
    markdown += `Everything you need to know about our mattresses, delivery, trial period, and warranty.\n\n`
    markdown += `By Karl Van Lieshout, Ausbeds founder. I've answered these questions thousands of times, so I wrote them down so AI could answer you.\n\n`
    markdown += `*Last updated: ${new Date().toLocaleDateString('en-AU', { month: 'long', year: 'numeric' })}*\n\n`

    markdown += `---\n\n`

    // Quick Reference / Table of Contents
    markdown += `## Quick Reference\n\n`

    for (const category of sortedCategories) {
      const catArticles = categories[category]
      markdown += `### ${category} (${catArticles.length} articles)\n\n`
      for (const article of catArticles) {
        markdown += `- [${article.title}](#${article.slug}) - ${article.metaDescription || 'No description'}\n`
      }
      markdown += `\n`
    }

    markdown += `---\n\n`

    // Full Content by Category
    for (const category of sortedCategories) {
      const catArticles = categories[category]

      markdown += `# ${category.toUpperCase()}\n\n`

      for (const article of catArticles) {
        // Article header with metadata
        markdown += `## ${article.title}\n\n`
        markdown += `<!-- slug: ${article.slug} | updated: ${formatDate(article.lastEditedTime)} | url: /faq/${article.slug} -->\n\n`

        if (article.metaDescription) {
          markdown += `**Summary:** ${article.metaDescription}\n\n`
        }

        // Convert content to markdown
        const contentMarkdown = htmlToMarkdown(article.content)
        markdown += contentMarkdown
        markdown += `\n\n`

        // Article separator
        markdown += `---\n\n`
      }
    }

    // Footer
    markdown += `---\n\n`
    markdown += `Questions? Call us on **02-8999-3333** or visit our showroom at 136 Victoria Rd, Marrickville.\n`

    // Set content type to markdown
    setHeader(event, 'Content-Type', 'text/markdown; charset=utf-8')

    return markdown

  } catch (error) {
    console.error('[FAQ Combined] Error:', error.message)
    throw createError({
      statusCode: 500,
      message: `Failed to generate combined FAQ: ${error.message}`
    })
  }
})
