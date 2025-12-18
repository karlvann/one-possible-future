/**
 * Scripted Response Templates
 *
 * Pulls all text from chat-config.js - edit that file to change your script.
 */

import { SCRIPT, PRODUCTS, BUSINESS, CLAUDE } from '../chat-config.js'

/**
 * Get a response with placeholders filled in
 */
export function getResponse(responseKey, context = {}) {
  let response = SCRIPT[responseKey]

  if (!response) {
    console.error(`Unknown response key: ${responseKey}`)
    return ''
  }

  // Fill in firmness placeholders
  if (context.firmness) {
    response = response
      .replace(/{weight}/g, context.weight || context.firmness.weight)
      .replace(/{level}/g, context.firmness.level)
      .replace(/{levelName}/g, context.firmness.name)
      .replace(/{percentage}/g, context.firmness.percentage)
  }

  // Fill in product placeholders
  if (context.selectedProduct) {
    const product = PRODUCTS[context.selectedProduct.id] || context.selectedProduct

    response = response
      .replace(/{productId}/g, context.selectedProduct.id)
      .replace(/{productName}/g, product.name)
      .replace(/{productPrice}/g, product.priceFormatted || `$${product.price.toLocaleString()}`)
      .replace(/{productFeature}/g, product.feature || product.tagline)
      .replace(/{productBestFor}/g, product.bestFor || 'quality sleep')
      .replace(/{productUrl}/g, product.url)
  }

  return response
}

/**
 * Get system prompt for Claude when going off-script
 */
export function getOffScriptSystemPrompt(context = {}) {
  // Build product list
  const productList = Object.values(PRODUCTS)
    .map(p => `• ${p.name} - ${p.priceFormatted} - ${p.tagline}`)
    .join('\n')

  // Build selling points
  const sellingPoints = CLAUDE.sellingPoints.map(p => `• ${p}`).join('\n')

  let prompt = `${CLAUDE.personality}

PRODUCT LINEUP (Queen prices):
${productList}

KEY SELLING POINTS:
${sellingPoints}

SHOWROOM: ${BUSINESS.showroom.address} (${BUSINESS.showroom.note})
PHONE: ${BUSINESS.phone}
WHATSAPP: ${BUSINESS.whatsapp}`

  // Add conversation context
  if (context.weight) {
    prompt += `\n\nCONVERSATION CONTEXT:
- Customer weight: ${context.weight}kg
- Recommended firmness: Level ${context.firmness?.level} (${context.firmness?.name})`
  }

  if (context.selectedProduct) {
    prompt += `\n- Selected product: ${context.selectedProduct.name}`
  }

  return prompt
}

// Re-export for convenience
export { SCRIPT as RESPONSES, PRODUCTS as PRODUCT_DETAILS }

export default {
  RESPONSES: SCRIPT,
  getResponse,
  getOffScriptSystemPrompt,
  PRODUCT_DETAILS: PRODUCTS
}
