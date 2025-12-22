/**
 * Chat State Machine
 *
 * Manages the scripted sales flow for the Ausbeds chatbot.
 * Only defers to Claude AI when the user goes off-script.
 *
 * States:
 * - INTRO: Initial state, waiting for weight input
 * - WEIGHT_RECEIVED: User provided weight, showing product options
 * - PRODUCT_SELECTED: User selected a product, offering lifetime pitch
 * - LIFETIME_PITCH: Explained lifetime value, ready for questions
 * - FREEFORM: Off-script, all messages go to Claude
 */

import { parseWeight, calculateFirmness, getProductRecommendations } from './firmness'
import { getResponse } from './scriptResponses'
import { SCRIPT, DELIVERY, PRODUCTS } from '~/chat-config.js'

// State definitions
// Flow: INTRO → WEIGHT_RECEIVED → SIZE_SELECTED → PRODUCT_SELECTED → LIFETIME_PITCH
//       → ASK_POSTCODE → SHOW_QUOTE → ASK_EMAIL → QUOTE_SENT
//       → (optional refinement) REFINE_NAME → REFINE_ADDRESS → REFINE_PHONE → QUOTE_REFINED
export const STATES = {
  INTRO: 'INTRO',
  WEIGHT_RECEIVED: 'WEIGHT_RECEIVED',   // User gave weight, now pick size
  SIZE_SELECTED: 'SIZE_SELECTED',       // User picked size, now pick product
  PRODUCT_SELECTED: 'PRODUCT_SELECTED', // User picked product, offer pitch
  LIFETIME_PITCH: 'LIFETIME_PITCH',
  // Quote flow states
  ASK_POSTCODE: 'ASK_POSTCODE',         // Ask for postcode to calculate delivery
  SHOW_QUOTE: 'SHOW_QUOTE',             // Show estimate, offer to email
  ASK_EMAIL: 'ASK_EMAIL',               // Get email for quote
  QUOTE_SENT: 'QUOTE_SENT',             // Email sent, offer refinement
  // Refinement flow (optional, after quote sent)
  REFINE_NAME: 'REFINE_NAME',           // Get name for checkout
  REFINE_ADDRESS: 'REFINE_ADDRESS',     // Get full address for exact delivery
  REFINE_PHONE: 'REFINE_PHONE',         // Get phone (optional)
  QUOTE_REFINED: 'QUOTE_REFINED',       // All details collected
  FREEFORM: 'FREEFORM'
}

// Product name patterns for matching
const PRODUCT_PATTERNS = {
  cooper: /\bcooper\b/i,
  aurora: /\baurora\b/i,
  cloud: /\bcloud\b/i
}

// Size patterns for matching (kingSingle must come before king/single to match first)
const SIZE_PATTERNS = {
  kingSingle: /\b(king\s*single|k'?\s*single|ks)\b/i,
  king: /\bking\b/i,
  queen: /\bqueen\b/i,
  double: /\bdouble\b/i,
  single: /\bsingle\b/i
}

// Affirmative patterns (yes, sure, etc.)
const AFFIRMATIVE_PATTERN = /^(yes|yeah|yep|sure|ok|okay|tell me|interested|why|how|please|go on|continue)\b/i

// Question patterns that indicate off-script
const QUESTION_PATTERNS = [
  /\b(what|how|why|when|where|which|who|can|do|does|is|are|will|would|could|should)\b.*\?/i,
  /\b(delivery|shipping|trial|return|warranty|guarantee|adjustment|swap|exchange)\b/i,
  /\b(difference|compare|versus|vs|better)\b/i,
  /\b(price|cost|discount|finance|afterpay|zip)\b/i,
  /\b(showroom|store|visit|location|address)\b/i
]

/**
 * Process user input through the state machine
 *
 * @param {string} state - Current state
 * @param {string} input - User's message
 * @param {object} context - Conversation context (weight, product, etc.)
 * @returns {object} - { nextState, response, context, needsAI }
 */
export function processInput(state, input, context = {}) {
  const trimmedInput = input.trim()

  // Check if this looks like an off-script question
  if (isOffScript(trimmedInput, state)) {
    return {
      nextState: STATES.FREEFORM,
      response: null,
      context,
      needsAI: true,
      reason: 'off_script_question'
    }
  }

  switch (state) {
    case STATES.INTRO:
      return handleIntro(trimmedInput, context)

    case STATES.WEIGHT_RECEIVED:
      return handleWeightReceived(trimmedInput, context)

    case STATES.PRODUCT_SELECTED:
      return handleProductSelected(trimmedInput, context)

    case STATES.SIZE_SELECTED:
      return handleSizeSelected(trimmedInput, context)

    case STATES.LIFETIME_PITCH:
      return handleLifetimePitch(trimmedInput, context)

    case STATES.ASK_POSTCODE:
      return handleAskPostcode(trimmedInput, context)

    case STATES.SHOW_QUOTE:
      return handleShowQuote(trimmedInput, context)

    case STATES.ASK_EMAIL:
      return handleAskEmail(trimmedInput, context)

    case STATES.QUOTE_SENT:
      return handleQuoteSent(trimmedInput, context)

    case STATES.REFINE_NAME:
      return handleRefineName(trimmedInput, context)

    case STATES.REFINE_ADDRESS:
      return handleRefineAddress(trimmedInput, context)

    case STATES.REFINE_PHONE:
      return handleRefinePhone(trimmedInput, context)

    case STATES.QUOTE_REFINED:
      return handleQuoteRefined(trimmedInput, context)

    case STATES.FREEFORM:
    default:
      // All messages in FREEFORM go to AI
      return {
        nextState: STATES.FREEFORM,
        response: null,
        context,
        needsAI: true,
        reason: 'freeform_mode'
      }
  }
}

/**
 * Check if input appears to be off-script
 */
function isOffScript(input, state) {
  // In FREEFORM, everything is off-script
  if (state === STATES.FREEFORM) return true

  // Check for question patterns
  for (const pattern of QUESTION_PATTERNS) {
    if (pattern.test(input)) {
      return true
    }
  }

  // Long messages (>100 chars) are probably questions
  if (input.length > 100) return true

  return false
}

/**
 * INTRO state handler
 * Expecting: weight input (e.g., "90", "85kg")
 */
function handleIntro(input, context) {
  const weight = parseWeight(input)

  if (weight) {
    const firmness = calculateFirmness(weight)
    const products = getProductRecommendations(firmness.level)

    const newContext = {
      ...context,
      weight,
      firmness,
      products
    }

    return {
      nextState: STATES.WEIGHT_RECEIVED,
      response: getResponse('WEIGHT_RECEIVED', newContext),
      context: newContext,
      needsAI: false
    }
  }

  // Input doesn't look like a weight - could be a question
  // Let AI handle it, but stay in INTRO state
  return {
    nextState: STATES.INTRO,
    response: null,
    context,
    needsAI: true,
    reason: 'unrecognized_input',
    hint: 'User may have a question. After answering, remind them to share their weight.'
  }
}

/**
 * WEIGHT_RECEIVED state handler
 * Expecting: size selection (single, double, queen, king) or learn more
 */
function handleWeightReceived(input, context) {
  // Check for "learn more" about firmness
  if (/learn_firmness|why.*firmness|how.*work/i.test(input)) {
    return {
      nextState: STATES.WEIGHT_RECEIVED, // Stay in same state
      response: getResponse('LEARN_FIRMNESS', context),
      context: { ...context, learnedFirmness: true },
      needsAI: false
    }
  }

  // Check for size selection
  for (const [sizeId, pattern] of Object.entries(SIZE_PATTERNS)) {
    if (pattern.test(input)) {
      const newContext = {
        ...context,
        selectedSize: sizeId
      }

      return {
        nextState: STATES.SIZE_SELECTED,
        response: getResponse('SIZE_SELECTED', newContext),
        context: newContext,
        needsAI: false
      }
    }
  }

  // Not a clear size selection - let AI help
  return {
    nextState: STATES.WEIGHT_RECEIVED,
    response: null,
    context,
    needsAI: true,
    reason: 'unclear_size',
    hint: 'User may be asking about sizes. Help them choose Single, Double, Queen, or King.'
  }
}

/**
 * SIZE_SELECTED state handler
 * Expecting: product selection (cooper, aurora, cloud) or learn more
 */
function handleSizeSelected(input, context) {
  // Check for "learn more" about products
  if (/learn_products|what'?s the difference|compare|difference/i.test(input)) {
    return {
      nextState: STATES.SIZE_SELECTED, // Stay in same state
      response: getResponse('LEARN_PRODUCTS', context),
      context: { ...context, learnedProducts: true },
      needsAI: false
    }
  }

  // Check for product selection
  for (const [productId, pattern] of Object.entries(PRODUCT_PATTERNS)) {
    if (pattern.test(input)) {
      // Look up product directly from config (context.products may be missing after page reload)
      const product = PRODUCTS[productId]

      if (product) {
        const selectedProduct = { id: productId, ...product }
        const newContext = {
          ...context,
          selectedProduct
        }

        return {
          nextState: STATES.PRODUCT_SELECTED,
          response: getResponse('PRODUCT_SELECTED', newContext),
          context: newContext,
          needsAI: false
        }
      }
    }
  }

  // Check for price-related selection
  if (/cheap|budget|affordable/i.test(input)) {
    const selectedProduct = { id: 'cooper', ...PRODUCTS.cooper }
    const newContext = { ...context, selectedProduct }
    return {
      nextState: STATES.PRODUCT_SELECTED,
      response: getResponse('PRODUCT_SELECTED', newContext),
      context: newContext,
      needsAI: false
    }
  }

  if (/middle|medium|popular/i.test(input)) {
    const selectedProduct = { id: 'aurora', ...PRODUCTS.aurora }
    const newContext = { ...context, selectedProduct }
    return {
      nextState: STATES.PRODUCT_SELECTED,
      response: getResponse('PRODUCT_SELECTED', newContext),
      context: newContext,
      needsAI: false
    }
  }

  if (/best|top|premium|expensive|side.*sleep/i.test(input)) {
    const selectedProduct = { id: 'cloud', ...PRODUCTS.cloud }
    const newContext = { ...context, selectedProduct }
    return {
      nextState: STATES.PRODUCT_SELECTED,
      response: getResponse('PRODUCT_SELECTED', newContext),
      context: newContext,
      needsAI: false
    }
  }

  // Not a clear selection - let AI help
  return {
    nextState: STATES.SIZE_SELECTED,
    response: null,
    context,
    needsAI: true,
    reason: 'unclear_product',
    hint: 'User may be asking about the options. Help them choose between Cooper, Aurora, or Cloud.'
  }
}

/**
 * PRODUCT_SELECTED state handler
 * Three paths: quote (get price), pitch (learn more), browse (website)
 */
function handleProductSelected(input, context) {
  // Path 1: Get quote - go straight to postcode
  if (/quote|price|total|delivery|how much|cost/i.test(input)) {
    return {
      nextState: STATES.ASK_POSTCODE,
      response: getResponse('ASK_POSTCODE', context),
      context,
      needsAI: false
    }
  }

  // Path 2: Learn more - go to pitch
  if (/pitch|why|last|more|tell me|yes|yeah|sure/i.test(input)) {
    return {
      nextState: STATES.LIFETIME_PITCH,
      response: getResponse('LIFETIME_PITCH', context),
      context,
      needsAI: false
    }
  }

  // Path 3: Browse - go to website
  if (/browse|check|online|website|no|skip|page/i.test(input)) {
    return {
      nextState: STATES.FREEFORM,
      response: getResponse('READY_TO_ORDER', context),
      context,
      needsAI: false
    }
  }

  // Anything else - let AI handle
  return {
    nextState: STATES.FREEFORM,
    response: null,
    context,
    needsAI: true,
    reason: 'post_product_question'
  }
}

/**
 * LIFETIME_PITCH state handler
 * User has seen the pitch - offer quote or link to website
 */
function handleLifetimePitch(input, context) {
  // Check for "get quote" / "total price" action
  if (/quote|total.*price|price|how much/i.test(input)) {
    return {
      nextState: STATES.ASK_POSTCODE,
      response: getResponse('ASK_POSTCODE', context),
      context,
      needsAI: false
    }
  }

  // Check for "check it out" / going to website
  if (/check|website|online|browse|look/i.test(input)) {
    return {
      nextState: STATES.FREEFORM,
      response: getResponse('READY_TO_ORDER', context),
      context,
      needsAI: false
    }
  }

  // Any other follow-up goes to AI
  return {
    nextState: STATES.FREEFORM,
    response: null,
    context,
    needsAI: true,
    reason: 'post_pitch_followup'
  }
}

/**
 * Calculate delivery cost from suburb
 */
function calculateDelivery(suburb) {
  if (!suburb || !DELIVERY) {
    return { zone: 'sydney_metro', cost: 79, formatted: '$79' }
  }

  const suburbLower = suburb.toLowerCase().trim()

  // Check each zone for matching suburbs
  for (const [zoneId, zone] of Object.entries(DELIVERY.zones)) {
    if (zone.suburbs) {
      const matchedSuburb = zone.suburbs.find(s =>
        suburbLower.includes(s.toLowerCase()) || s.toLowerCase().includes(suburbLower)
      )
      if (matchedSuburb) {
        return {
          zone: zoneId,
          cost: zone.cost,
          formatted: zone.cost === 0 ? 'FREE' : `$${zone.cost}`
        }
      }
    }
  }

  // Default to Sydney metro
  const defaultZone = DELIVERY.zones.sydney_metro || { cost: 79 }
  return {
    zone: 'sydney_metro',
    cost: defaultZone.cost,
    formatted: defaultZone.cost === 0 ? 'FREE' : `$${defaultZone.cost}`
  }
}

/**
 * ASK_POSTCODE state handler
 * Expecting: Australian postcode (4 digits)
 */
function handleAskPostcode(input, context) {
  // Extract 4-digit postcode from input
  const postcodeMatch = input.match(/\b(\d{4})\b/)

  if (postcodeMatch) {
    const postcode = postcodeMatch[1]

    // Use postcode for delivery calculation (will be passed to real API)
    const delivery = calculateDelivery(postcode)
    const product = PRODUCTS[context.selectedProduct?.id]
    const price = product?.prices?.[context.selectedSize]?.price || 0
    const total = price + delivery.cost

    // Calculate return costs ($90 processing + delivery cost for pickup)
    const returnCost = 90 + delivery.cost
    const refundAmount = price - returnCost

    const newContext = {
      ...context,
      postcode,
      delivery,
      totalPrice: total,
      totalFormatted: `$${total.toLocaleString()}`,
      returnCost: `$${returnCost}`,
      refundAmount: `$${refundAmount.toLocaleString()}`
    }

    return {
      nextState: STATES.SHOW_QUOTE,
      response: getResponse('SHOW_QUOTE', newContext),
      context: newContext,
      needsAI: false
    }
  }

  // Not a valid postcode - ask again
  return {
    nextState: STATES.ASK_POSTCODE,
    response: "Just need your 4-digit postcode to calculate delivery (e.g. 2000)",
    context,
    needsAI: false
  }
}

/**
 * SHOW_QUOTE state handler
 * Expecting: yes to email or no thanks
 */
function handleShowQuote(input, context) {
  // Check for "change postcode"
  if (/change_postcode|wrong.*postcode|different.*postcode|change.*postcode/i.test(input)) {
    // Clear the postcode and delivery info so they can re-enter
    const newContext = {
      ...context,
      postcode: null,
      delivery: null,
      totalPrice: null,
      totalFormatted: null
    }
    return {
      nextState: STATES.ASK_POSTCODE,
      response: getResponse('ASK_POSTCODE', context),
      context: newContext,
      needsAI: false
    }
  }

  // Check for "yes, email me"
  if (/yes|email|send|please/i.test(input)) {
    return {
      nextState: STATES.ASK_EMAIL,
      response: getResponse('ASK_EMAIL', context),
      context,
      needsAI: false
    }
  }

  // Check for "no thanks"
  if (/no|thanks|good|fine|browse|website/i.test(input)) {
    return {
      nextState: STATES.FREEFORM,
      response: getResponse('QUOTE_DECLINED', context),
      context,
      needsAI: false
    }
  }

  // Unclear - let AI handle
  return {
    nextState: STATES.SHOW_QUOTE,
    response: null,
    context,
    needsAI: true,
    reason: 'unclear_quote_response',
    hint: 'User was asked if they want the quote emailed. Help them decide or answer their question.'
  }
}

/**
 * ASK_EMAIL state handler
 * Expecting: email address
 */
function handleAskEmail(input, context) {
  // Basic email validation
  const emailMatch = input.match(/[\w.-]+@[\w.-]+\.\w+/)

  if (emailMatch) {
    const email = emailMatch[0].toLowerCase()
    const newContext = { ...context, email }

    return {
      nextState: STATES.QUOTE_SENT,
      response: getResponse('QUOTE_SENT', newContext),
      context: newContext,
      needsAI: false
    }
  }

  // Doesn't look like an email
  return {
    nextState: STATES.ASK_EMAIL,
    response: "That doesn't look quite right. What's your email address?",
    context,
    needsAI: false
  }
}

/**
 * ASK_NAME state handler
 * Expecting: name
 */
function handleAskName(input, context) {
  const name = input.trim()

  if (name.length >= 2 && !/^[\d@]+$/.test(name)) {
    const newContext = { ...context, customerName: name }

    return {
      nextState: STATES.ASK_ADDRESS,
      response: getResponse('ASK_ADDRESS', context),
      context: newContext,
      needsAI: false
    }
  }

  // Doesn't look like a name
  return {
    nextState: STATES.ASK_NAME,
    response: "What name should I put on the quote?",
    context,
    needsAI: false
  }
}

/**
 * ASK_ADDRESS state handler
 * Expecting: full delivery address
 */
function handleAskAddress(input, context) {
  const address = input.trim()

  // Accept any reasonable length address
  if (address.length >= 5) {
    const newContext = { ...context, deliveryAddress: address }

    return {
      nextState: STATES.ASK_PHONE,
      response: getResponse('ASK_PHONE', context),
      context: newContext,
      needsAI: false
    }
  }

  // Too short
  return {
    nextState: STATES.ASK_ADDRESS,
    response: "What's your delivery address? (for exact shipping cost)",
    context,
    needsAI: false
  }
}

/**
 * ASK_PHONE state handler
 * Expecting: phone number or skip
 */
function handleAskPhone(input, context) {
  // Check for skip
  if (/skip|no|prefer not|rather not/i.test(input)) {
    return {
      nextState: STATES.QUOTE_SENT,
      response: getResponse('QUOTE_SENT', context),
      context,
      needsAI: false
    }
  }

  // Basic phone validation (Australian format)
  const phoneMatch = input.match(/[\d\s]{8,}/)

  if (phoneMatch) {
    const phone = phoneMatch[0].replace(/\s/g, '')
    const newContext = { ...context, phone }

    return {
      nextState: STATES.QUOTE_SENT,
      response: getResponse('QUOTE_SENT', newContext),
      context: newContext,
      needsAI: false
    }
  }

  // Doesn't look like a phone
  return {
    nextState: STATES.ASK_PHONE,
    response: "Mobile number for delivery updates? (or say 'skip')",
    context,
    needsAI: false
  }
}

/**
 * QUOTE_SENT state handler
 * Quote sent - offer refinement or go to freeform
 */
function handleQuoteSent(input, context) {
  // Check for "refine" / "yes" / "make it exact"
  if (/refine|yes|exact|accurate|address|sure/i.test(input)) {
    return {
      nextState: STATES.REFINE_NAME,
      response: getResponse('REFINE_NAME', context),
      context,
      needsAI: false
    }
  }

  // Check for "done" / "no" / "fine"
  if (/done|no|fine|good|thanks|ok/i.test(input)) {
    return {
      nextState: STATES.FREEFORM,
      response: "No worries! Check your email when you're ready. Ask me anything else or pick a topic:",
      context,
      needsAI: false
    }
  }

  // Anything else goes to AI
  return {
    nextState: STATES.FREEFORM,
    response: null,
    context,
    needsAI: true,
    reason: 'post_quote_followup'
  }
}

/**
 * REFINE_NAME state handler
 */
function handleRefineName(input, context) {
  const name = input.trim()

  if (name.length >= 2 && !/^[\d@]+$/.test(name)) {
    const newContext = { ...context, customerName: name }
    return {
      nextState: STATES.REFINE_ADDRESS,
      response: getResponse('REFINE_ADDRESS', context),
      context: newContext,
      needsAI: false
    }
  }

  return {
    nextState: STATES.REFINE_NAME,
    response: "What name should I put on the order?",
    context,
    needsAI: false
  }
}

/**
 * REFINE_ADDRESS state handler
 */
function handleRefineAddress(input, context) {
  const address = input.trim()

  if (address.length >= 10) {
    const newContext = { ...context, deliveryAddress: address }
    return {
      nextState: STATES.REFINE_PHONE,
      response: getResponse('REFINE_PHONE', context),
      context: newContext,
      needsAI: false
    }
  }

  return {
    nextState: STATES.REFINE_ADDRESS,
    response: "What's your full delivery address? (street, suburb, state, postcode)",
    context,
    needsAI: false
  }
}

/**
 * REFINE_PHONE state handler
 */
function handleRefinePhone(input, context) {
  // Check for skip
  if (/skip|no|prefer not|rather not/i.test(input)) {
    return {
      nextState: STATES.QUOTE_REFINED,
      response: getResponse('QUOTE_REFINED', context),
      context,
      needsAI: false,
      triggerRefinementUpdate: true
    }
  }

  // Basic phone validation
  const phoneMatch = input.match(/[\d\s]{8,}/)

  if (phoneMatch) {
    const phone = phoneMatch[0].replace(/\s/g, '')
    const newContext = { ...context, phone }
    return {
      nextState: STATES.QUOTE_REFINED,
      response: getResponse('QUOTE_REFINED', newContext),
      context: newContext,
      needsAI: false,
      triggerRefinementUpdate: true
    }
  }

  return {
    nextState: STATES.REFINE_PHONE,
    response: "Phone for delivery updates? (or say 'skip')",
    context,
    needsAI: false
  }
}

/**
 * QUOTE_REFINED state handler
 * All refinement collected - freeform from here
 */
function handleQuoteRefined(input, context) {
  return {
    nextState: STATES.FREEFORM,
    response: null,
    context,
    needsAI: true,
    reason: 'post_refinement'
  }
}

/**
 * Get the initial state and intro message
 */
export function getInitialState() {
  return {
    state: STATES.INTRO,
    context: {},
    message: SCRIPT.INTRO
  }
}

/**
 * Create a serializable state object for storage
 */
export function serializeState(state, context) {
  return {
    state,
    context: {
      weight: context.weight,
      firmness: context.firmness ? {
        level: context.firmness.level,
        name: context.firmness.name,
        percentage: context.firmness.percentage
      } : null,
      selectedProduct: context.selectedProduct ? {
        id: context.selectedProduct.id,
        name: context.selectedProduct.name
      } : null,
      selectedSize: context.selectedSize || null,
      // Quote flow fields
      postcode: context.postcode || null,
      delivery: context.delivery || null,
      totalPrice: context.totalPrice || null,
      totalFormatted: context.totalFormatted || null,
      returnCost: context.returnCost || null,
      refundAmount: context.refundAmount || null,
      email: context.email || null
    }
  }
}

export default {
  STATES,
  processInput,
  getInitialState,
  serializeState
}
