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
import { SCRIPT } from '../chat-config.js'

// State definitions
export const STATES = {
  INTRO: 'INTRO',
  WEIGHT_RECEIVED: 'WEIGHT_RECEIVED',
  PRODUCT_SELECTED: 'PRODUCT_SELECTED',
  LIFETIME_PITCH: 'LIFETIME_PITCH',
  FREEFORM: 'FREEFORM'
}

// Product name patterns for matching
const PRODUCT_PATTERNS = {
  cooper: /\bcooper\b/i,
  aurora: /\baurora\b/i,
  cloud: /\bcloud\b/i
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

    case STATES.LIFETIME_PITCH:
      return handleLifetimePitch(trimmedInput, context)

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
 * Expecting: product selection (cooper, aurora, cloud)
 */
function handleWeightReceived(input, context) {
  // Check for product selection
  for (const [productId, pattern] of Object.entries(PRODUCT_PATTERNS)) {
    if (pattern.test(input)) {
      const selectedProduct = context.products.find(p => p.id === productId)

      if (selectedProduct) {
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

  // Check for price-related selection (e.g., "the $1500 one", "cheapest", "most expensive")
  if (/cheap|budget|affordable|\$?1,?500/i.test(input)) {
    const selectedProduct = context.products.find(p => p.id === 'cooper')
    const newContext = { ...context, selectedProduct }
    return {
      nextState: STATES.PRODUCT_SELECTED,
      response: getResponse('PRODUCT_SELECTED', newContext),
      context: newContext,
      needsAI: false
    }
  }

  if (/middle|medium|popular|aurora|\$?2,?450/i.test(input)) {
    const selectedProduct = context.products.find(p => p.id === 'aurora')
    const newContext = { ...context, selectedProduct }
    return {
      nextState: STATES.PRODUCT_SELECTED,
      response: getResponse('PRODUCT_SELECTED', newContext),
      context: newContext,
      needsAI: false
    }
  }

  if (/best|top|premium|expensive|cloud|side.*sleep|\$?2,?940/i.test(input)) {
    const selectedProduct = context.products.find(p => p.id === 'cloud')
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
    nextState: STATES.WEIGHT_RECEIVED,
    response: null,
    context,
    needsAI: true,
    reason: 'unclear_selection',
    hint: 'User may be asking about the options. Help them choose between Cooper, Aurora, or Cloud.'
  }
}

/**
 * PRODUCT_SELECTED state handler
 * Expecting: affirmative response to lifetime pitch question
 */
function handleProductSelected(input, context) {
  if (AFFIRMATIVE_PATTERN.test(input)) {
    return {
      nextState: STATES.LIFETIME_PITCH,
      response: getResponse('LIFETIME_PITCH', context),
      context,
      needsAI: false
    }
  }

  // Check for "no" or declining
  if (/^(no|nope|not|skip|just|ready|order|buy|checkout|cart)/i.test(input)) {
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
    reason: 'post_selection_question'
  }
}

/**
 * LIFETIME_PITCH state handler
 * User has seen the full pitch - now freeform
 */
function handleLifetimePitch(input, context) {
  // Any follow-up goes to AI
  return {
    nextState: STATES.FREEFORM,
    response: null,
    context,
    needsAI: true,
    reason: 'post_pitch_followup'
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
      } : null
    }
  }
}

export default {
  STATES,
  processInput,
  getInitialState,
  serializeState
}
