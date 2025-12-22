/**
 * Get quote by ID
 * GET /api/quote/:id
 *
 * Fetches a quote for checkout pre-fill.
 */

import { readFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const quoteId = getRouterParam(event, 'id')

  const dataDir = join(process.cwd(), '.data')
  const quotesDir = join(dataDir, 'quotes')
  const filePath = join(quotesDir, `${quoteId}.json`)

  try {
    const data = await readFile(filePath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('[Quote] Not found:', quoteId)
    throw createError({
      statusCode: 404,
      message: 'Quote not found'
    })
  }
})
