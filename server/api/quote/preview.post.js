/**
 * Save quote data for email preview
 * POST /api/quote/preview
 *
 * Stores the quote with a unique ID.
 * Returns the quote ID for checkout links.
 */

import { writeFile, readFile, mkdir } from 'fs/promises'
import { join } from 'path'

// Generate a simple unique ID
function generateQuoteId() {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  return `q_${timestamp}_${random}`
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const quoteId = generateQuoteId()

  const quoteData = {
    id: quoteId,
    email: body.email,
    postcode: body.postcode,
    product: body.product,
    size: body.size,
    sizeName: body.sizeName,
    delivery: body.delivery,
    totalPrice: body.totalPrice,
    totalFormatted: body.totalFormatted,
    returnCost: body.returnCost,
    refundAmount: body.refundAmount,
    firmness: body.firmness,
    weight: body.weight,
    // Refinement fields (filled in later)
    customerName: body.customerName || null,
    address: body.address || null,
    phone: body.phone || null,
    // Metadata
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  // Store in .data folder
  const dataDir = join(process.cwd(), '.data')
  const quotesDir = join(dataDir, 'quotes')
  const filePath = join(quotesDir, `${quoteId}.json`)
  const latestPath = join(dataDir, 'last-quote.json')

  try {
    await mkdir(quotesDir, { recursive: true })

    // Save individual quote file
    await writeFile(filePath, JSON.stringify(quoteData, null, 2))

    // Also save as last-quote for easy preview
    await writeFile(latestPath, JSON.stringify(quoteData, null, 2))

    console.log('[Quote] Saved quote:', quoteId, 'for:', body.email)

    return {
      success: true,
      quoteId,
      message: 'Quote saved',
      previewUrl: '/email',
      checkoutUrl: `/checkout?quote=${quoteId}`
    }
  } catch (error) {
    console.error('[Quote] Failed to save:', error)
    return {
      success: false,
      error: 'Failed to save quote'
    }
  }
})
