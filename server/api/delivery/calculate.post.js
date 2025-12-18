/**
 * POST /api/delivery/calculate
 *
 * Proxies to the real Ausbeds delivery calculator API.
 * Falls back to zone-based estimate if the real API fails.
 */

import { DELIVERY } from '~/chat-config.js'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { postcode, suburb, state } = body

  // Accept either postcode or suburb
  const location = postcode || suburb

  if (!location) {
    throw createError({
      statusCode: 400,
      message: 'Postcode or suburb is required'
    })
  }

  // Format address for the real API
  // Postcodes are more accurate than suburb names
  const address = state
    ? `${location}, ${state}, Australia`
    : `${location}, Australia`

  try {
    // Call the real Ausbeds delivery API
    const response = await $fetch('https://ausbeds.com.au/api/delivery/calculateDelivery', {
      method: 'POST',
      body: { address },
      timeout: 5000 // 5 second timeout
    })

    // Real API returns { data: { totalPrice, message, twoManDeliveryAvailable, twoManTotal } }
    if (response?.data) {
      const { totalPrice, message, twoManDeliveryAvailable, twoManTotal } = response.data

      return {
        success: true,
        source: 'live',
        cost: totalPrice,
        formatted: totalPrice === 0 ? 'FREE' : `$${totalPrice}`,
        message,
        twoManAvailable: twoManDeliveryAvailable,
        twoManCost: twoManTotal,
        location
      }
    }

    // API returned error
    if (response?.error?.message) {
      return {
        success: false,
        source: 'live',
        error: response.error.message,
        location
      }
    }

    // Unexpected response - fall through to fallback
    throw new Error('Unexpected API response')

  } catch (error) {
    console.warn(`[Delivery] Real API failed for "${location}":`, error.message)

    // Fall back to zone-based estimate
    return calculateFallback(location)
  }
})

/**
 * Fallback zone-based calculation when real API is unavailable
 */
function calculateFallback(location) {
  const locationLower = location.toLowerCase().trim()

  // Check each zone for matching suburbs
  if (DELIVERY?.zones) {
    for (const [zoneId, zone] of Object.entries(DELIVERY.zones)) {
      if (zone.suburbs?.length > 0) {
        const matched = zone.suburbs.some(s =>
          locationLower.includes(s.toLowerCase()) || s.toLowerCase().includes(locationLower)
        )
        if (matched) {
          return {
            success: true,
            source: 'fallback',
            cost: zone.cost,
            formatted: zone.cost === 0 ? 'FREE' : `$${zone.cost}`,
            message: `${zone.name} delivery`,
            zone: zoneId,
            location
          }
        }
      }
    }
  }

  // Default to Sydney metro estimate
  const defaultCost = DELIVERY?.zones?.sydney_metro?.cost || 79

  return {
    success: true,
    source: 'fallback',
    cost: defaultCost,
    formatted: `~$${defaultCost}`,
    message: 'Sydney metro estimate (exact cost calculated at checkout)',
    zone: 'sydney_metro',
    location,
    isEstimate: true
  }
}
