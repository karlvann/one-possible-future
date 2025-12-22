/**
 * Update quote with refinement data
 * PATCH /api/quote/:id
 *
 * Updates an existing quote with name, address, phone.
 */

import { writeFile, readFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const quoteId = getRouterParam(event, 'id')
  const body = await readBody(event)

  const dataDir = join(process.cwd(), '.data')
  const quotesDir = join(dataDir, 'quotes')
  const filePath = join(quotesDir, `${quoteId}.json`)
  const latestPath = join(dataDir, 'last-quote.json')

  try {
    // Read existing quote
    const existing = await readFile(filePath, 'utf-8')
    const quoteData = JSON.parse(existing)

    // Update with refinement data
    const updated = {
      ...quoteData,
      customerName: body.customerName || quoteData.customerName,
      address: body.address || quoteData.address,
      phone: body.phone || quoteData.phone,
      updatedAt: new Date().toISOString()
    }

    // Save updated quote
    await writeFile(filePath, JSON.stringify(updated, null, 2))
    await writeFile(latestPath, JSON.stringify(updated, null, 2))

    console.log('[Quote] Updated quote:', quoteId)

    return {
      success: true,
      quoteId,
      message: 'Quote updated',
      checkoutUrl: `/checkout?quote=${quoteId}`
    }
  } catch (error) {
    console.error('[Quote] Failed to update:', error)
    return {
      success: false,
      error: 'Quote not found or failed to update'
    }
  }
})
