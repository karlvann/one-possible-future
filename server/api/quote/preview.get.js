/**
 * Get saved quote data for email preview
 * GET /api/quote/preview
 */

import { readFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const filePath = join(process.cwd(), '.data', 'last-quote.json')

  try {
    const data = await readFile(filePath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('[Quote] No quote found:', error.message)
    return {
      error: 'No quote found. Complete the chat flow first.'
    }
  }
})
