/**
 * Firmness Calculator
 *
 * Pulls chart from chat-config.js - edit that file to change weight/firmness mapping.
 */

import { FIRMNESS_CHART, FIRMNESS_LEVELS, PRODUCTS } from '../chat-config.js'

/**
 * Calculate firmness recommendation from weight
 *
 * @param {number} weight - Customer weight in kg
 * @returns {object} - { level, name, description, percentage, weight }
 */
export function calculateFirmness(weight) {
  const w = parseInt(weight, 10)

  if (isNaN(w) || w <= 0) {
    return null
  }

  // Find the matching weight range from config
  const match = FIRMNESS_CHART.find(([min, max]) => w >= min && w <= max)

  if (!match) {
    // Fallback for edge cases
    return {
      level: 9,
      name: 'Firmer',
      percentage: 80,
      weight: w
    }
  }

  const [, , level, percentage] = match
  const name = FIRMNESS_LEVELS[level] || 'Firm'

  return {
    level,
    name,
    percentage,
    weight: w
  }
}

/**
 * Check if a string looks like a weight input
 * Accepts: "90", "90kg", "90 kg", "85.5", "about 90", "I weigh 85"
 *
 * @param {string} input - User input
 * @returns {number|null} - Parsed weight or null if not a weight
 */
export function parseWeight(input) {
  if (!input) return null

  // Try to extract a number from various formats
  const patterns = [
    /^(\d{2,3})(?:\s*kg|kilos?)?$/i,           // "90", "90kg", "90 kg"
    /^about\s*(\d{2,3})/i,                      // "about 90"
    /^around\s*(\d{2,3})/i,                     // "around 85"
    /^i'?m\s*(\d{2,3})/i,                       // "I'm 90kg"
    /^i\s*weigh\s*(\d{2,3})/i,                  // "I weigh 90"
    /(\d{2,3})\s*(?:kg|kilos?)/i,              // "my weight is 90kg"
  ]

  for (const pattern of patterns) {
    const match = input.match(pattern)
    if (match) {
      const num = parseFloat(match[1])
      // Sanity check: weight should be between 30-250kg
      if (num >= 30 && num <= 250) {
        return Math.round(num)
      }
    }
  }

  return null
}

/**
 * Get product recommendations based on firmness level
 *
 * @param {number} level - Firmness level (6-10)
 * @returns {array} - Array of product objects
 */
export function getProductRecommendations(level) {
  // Return all products from config
  return Object.entries(PRODUCTS).map(([id, product]) => ({
    id,
    ...product
  }))
}

export default {
  calculateFirmness,
  parseWeight,
  getProductRecommendations,
  FIRMNESS_LEVELS,
  FIRMNESS_CHART
}
