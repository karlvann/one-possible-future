/**
 * useChat Composable
 *
 * Manages chat state, message history, and the state machine flow.
 * Handles both scripted responses (instant) and AI responses (async).
 */

import { ref, reactive, computed, watch, onMounted } from 'vue'
import { STATES, processInput, getInitialState, serializeState } from '~/utils/stateMachine'
import { getOffScriptSystemPrompt, getResponse, RESPONSES } from '~/utils/scriptResponses'
import { POPUP, QUICK_REPLIES, PRODUCTS, SIZES } from '~/chat-config.js'

// Storage key for persisting chat state
const STORAGE_KEY = 'ausbeds_chat_state'

export function useChat() {
  // UI State
  const isOpen = ref(false)
  const isLoading = ref(false)
  const loadingType = ref(null) // 'quick' for scripted, 'deep' for AI/RAG
  const showPopup = ref(false)
  const hasInteracted = ref(false)

  // Chat State
  const messages = reactive([])
  const currentState = ref(STATES.INTRO)
  const context = reactive({})

  // Computed
  const canSend = computed(() => !isLoading.value)
  const introMessage = computed(() => RESPONSES.INTRO)
  const popupPreview = computed(() => POPUP.preview)

  // Quick replies based on current state
  const quickReplies = computed(() => {
    // Map state to quick reply key
    const stateToReplies = {
      [STATES.WEIGHT_RECEIVED]: 'WEIGHT_RECEIVED',
      [STATES.SIZE_SELECTED]: 'SIZE_SELECTED',
      [STATES.PRODUCT_SELECTED]: 'PRODUCT_SELECTED',
      [STATES.LIFETIME_PITCH]: 'LIFETIME_PITCH',
      [STATES.SHOW_QUOTE]: 'SHOW_QUOTE',
      [STATES.ASK_PHONE]: 'ASK_PHONE',
      [STATES.FREEFORM]: 'FREEFORM',
      [STATES.QUOTE_SENT]: 'FREEFORM'
    }

    const replyKey = stateToReplies[currentState.value]
    if (!replyKey) return []

    const replies = QUICK_REPLIES[replyKey]

    // Handle dynamic size buttons with firmness-specific "Why X?" button
    if (replies === 'DYNAMIC_SIZES' && context.firmness) {
      const buttons = [
        { label: 'King', value: 'king' },
        { label: 'Queen', value: 'queen' },
        { label: 'Double', value: 'double' },
        { label: "K'Single", value: 'kingSingle' },
        { label: 'Single', value: 'single' }
      ]
      // Only show "Why X?" if not already clicked
      if (!context.learnedFirmness) {
        buttons.push({ label: `Why ${context.firmness.name}?`, value: 'learn_firmness' })
      }
      return buttons
    }

    // Handle dynamic product buttons with size-specific prices
    if (replies === 'DYNAMIC_PRODUCTS' && context.selectedSize) {
      const size = context.selectedSize
      const buttons = [
        {
          label: `Cooper ${PRODUCTS.cooper.prices[size].formatted}`,
          value: 'cooper'
        },
        {
          label: `Aurora ${PRODUCTS.aurora.prices[size].formatted}`,
          value: 'aurora'
        },
        {
          label: `Cloud ${PRODUCTS.cloud.prices[size].formatted}`,
          value: 'cloud'
        }
      ]
      // Only show "What's the difference?" if not already clicked
      if (!context.learnedProducts) {
        buttons.push({ label: "What's the difference?", value: 'learn_products' })
      }
      return buttons
    }

    return Array.isArray(replies) ? replies : []
  })

  /**
   * Initialize chat with intro message
   */
  function initChat() {
    const initial = getInitialState()
    currentState.value = initial.state
    Object.assign(context, initial.context)

    // Add intro message from "assistant"
    if (messages.length === 0) {
      messages.push({
        role: 'assistant',
        content: initial.message,
        timestamp: Date.now()
      })
    }
  }

  /**
   * Send a message (user input)
   * @param {string} content - The content to process through state machine
   * @param {string} displayText - Optional different text to show in chat (for button labels)
   */
  async function sendMessage(content, displayText = null) {
    if (!content?.trim() || isLoading.value) return

    const userMessage = content.trim()
    hasInteracted.value = true

    // Add user message to history (show displayText if provided, otherwise content)
    messages.push({
      role: 'user',
      content: displayText || userMessage,
      timestamp: Date.now()
    })

    // Process through state machine
    const result = processInput(currentState.value, userMessage, context)

    // Update state and context
    currentState.value = result.nextState
    Object.assign(context, result.context)

    // Check if we just transitioned to SHOW_QUOTE - fetch real delivery cost
    if (result.nextState === STATES.SHOW_QUOTE && context.postcode) {
      await fetchRealDeliveryCost()
      // Regenerate response with updated delivery cost
      result.response = getResponse('SHOW_QUOTE', context)
    }

    // Check if we just transitioned to QUOTE_SENT - save the quote
    if (result.nextState === STATES.QUOTE_SENT) {
      await saveQuoteToAPI()
    }

    if (result.needsAI) {
      // Off-script: need to call Claude API (deep search)
      await handleAIResponse(userMessage, result.hint)
    } else {
      // On-script: add artificial delay to feel natural (quick response)
      await handleQuickResponse(result.response)
    }

    // Persist state
    saveState()
  }

  /**
   * Handle quick scripted response with artificial delay
   */
  async function handleQuickResponse(response) {
    isLoading.value = true
    loadingType.value = 'quick'

    // Random delay between 1.5-2.5 seconds
    const delay = 1500 + Math.random() * 1000
    await new Promise(resolve => setTimeout(resolve, delay))

    addAssistantMessage(response)
    isLoading.value = false
    loadingType.value = null
  }

  /**
   * Handle AI response for off-script questions
   */
  async function handleAIResponse(userMessage, hint = '') {
    isLoading.value = true
    loadingType.value = 'deep'

    try {
      const response = await $fetch('/api/chat/scripted', {
        method: 'POST',
        body: {
          question: userMessage,
          context: {
            weight: context.weight,
            firmness: context.firmness,
            selectedProduct: context.selectedProduct,
            currentState: currentState.value,
            hint
          },
          messages: messages.map(m => ({
            role: m.role,
            content: m.content
          }))
        }
      })

      addAssistantMessage(response.answer)
    } catch (error) {
      console.error('[Chat] AI response error:', error)
      addAssistantMessage(
        "Sorry, I had trouble with that. Please try again or call us on (02) 8999 3333."
      )
    } finally {
      isLoading.value = false
      loadingType.value = null
    }
  }

  /**
   * Add assistant message to history
   */
  function addAssistantMessage(content) {
    if (!content) return

    messages.push({
      role: 'assistant',
      content,
      timestamp: Date.now()
    })
  }

  /**
   * Fetch real delivery cost from Ausbeds API
   */
  async function fetchRealDeliveryCost() {
    try {
      const response = await $fetch('/api/delivery/calculate', {
        method: 'POST',
        body: {
          postcode: context.postcode
        }
      })

      if (response.success) {
        // Update context with real delivery cost
        context.delivery = {
          cost: response.cost,
          formatted: response.formatted,
          message: response.message,
          source: response.source,
          twoManAvailable: response.twoManAvailable,
          twoManCost: response.twoManCost
        }

        // Recalculate total
        const product = PRODUCTS[context.selectedProduct?.id]
        const price = product?.prices?.[context.selectedSize]?.price || 0
        context.totalPrice = price + response.cost
        context.totalFormatted = `$${context.totalPrice.toLocaleString()}`

        // Recalculate return costs ($90 processing + delivery cost for pickup)
        const returnCost = 90 + response.cost
        const refundAmount = price - returnCost
        context.returnCost = `$${returnCost}`
        context.refundAmount = `$${refundAmount.toLocaleString()}`

        console.log(`[Chat] Delivery cost for ${context.postcode}: ${response.formatted} (${response.source})`)
      } else {
        console.warn(`[Chat] Delivery not available: ${response.error}`)
        // Keep the fallback estimate from state machine
      }
    } catch (error) {
      console.error('[Chat] Failed to fetch delivery cost:', error)
      // Keep the fallback estimate from state machine
    }
  }

  /**
   * Save quote to API (for email preview)
   */
  async function saveQuoteToAPI() {
    try {
      const product = PRODUCTS[context.selectedProduct?.id]
      const sizeData = product?.prices?.[context.selectedSize]

      await $fetch('/api/quote/preview', {
        method: 'POST',
        body: {
          email: context.email,
          postcode: context.postcode,
          product: {
            id: context.selectedProduct?.id,
            name: product?.name,
            price: sizeData?.price,
            priceFormatted: sizeData?.formatted
          },
          size: context.selectedSize,
          sizeName: SIZES[context.selectedSize],
          delivery: context.delivery,
          totalPrice: context.totalPrice,
          totalFormatted: context.totalFormatted,
          returnCost: context.returnCost,
          refundAmount: context.refundAmount,
          firmness: context.firmness,
          weight: context.weight
        }
      })

      console.log('[Chat] Quote saved to API')
    } catch (error) {
      console.error('[Chat] Failed to save quote:', error)
      // Don't block the flow if this fails
    }
  }

  /**
   * Open the chat widget
   */
  function openChat() {
    isOpen.value = true
    showPopup.value = false
    hasInteracted.value = true

    // Initialize if first open
    if (messages.length === 0) {
      initChat()
    }
  }

  /**
   * Close the chat widget
   */
  function closeChat() {
    isOpen.value = false
  }

  /**
   * Toggle chat open/closed
   */
  function toggleChat() {
    if (isOpen.value) {
      closeChat()
    } else {
      openChat()
    }
  }

  /**
   * Show the popup notification after delay
   */
  function triggerPopup() {
    if (!hasInteracted.value && !isOpen.value) {
      showPopup.value = true
    }
  }

  /**
   * Dismiss the popup
   */
  function dismissPopup() {
    showPopup.value = false
  }

  /**
   * Clear chat and reset to initial state
   */
  function clearChat() {
    messages.length = 0
    currentState.value = STATES.INTRO
    Object.keys(context).forEach(key => delete context[key])
    initChat()
    clearState()
  }

  /**
   * Save state to localStorage
   */
  function saveState() {
    if (typeof window === 'undefined') return

    try {
      const state = {
        messages: messages.slice(-20), // Keep last 20 messages
        currentState: currentState.value,
        context: serializeState(currentState.value, context).context,
        timestamp: Date.now()
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch (e) {
      // localStorage might be unavailable
    }
  }

  /**
   * Load state from localStorage
   */
  function loadState() {
    if (typeof window === 'undefined') return false

    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (!saved) return false

      const state = JSON.parse(saved)

      // Check if state is less than 24 hours old
      const age = Date.now() - (state.timestamp || 0)
      if (age > 24 * 60 * 60 * 1000) {
        clearState()
        return false
      }

      // Restore state
      if (state.messages?.length > 0) {
        messages.push(...state.messages)
      }
      if (state.currentState) {
        currentState.value = state.currentState
      }
      if (state.context) {
        Object.assign(context, state.context)
      }

      return true
    } catch (e) {
      return false
    }
  }

  /**
   * Clear saved state
   */
  function clearState() {
    if (typeof window === 'undefined') return

    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (e) {
      // ignore
    }
  }

  /**
   * Start the popup timer
   */
  function startPopupTimer(delayMs = POPUP.delayMs) {
    setTimeout(() => {
      triggerPopup()
    }, delayMs)
  }

  // Initialize on mount
  onMounted(() => {
    const hasExisting = loadState()
    if (!hasExisting && messages.length === 0) {
      // Don't auto-init - wait for user to open chat
    }
  })

  return {
    // State
    isOpen,
    isLoading,
    loadingType,
    showPopup,
    hasInteracted,
    messages,
    currentState,
    context,

    // Computed
    canSend,
    introMessage,
    popupPreview,
    quickReplies,

    // Actions
    sendMessage,
    openChat,
    closeChat,
    toggleChat,
    clearChat,
    triggerPopup,
    dismissPopup,
    startPopupTimer,
    initChat
  }
}

export default useChat
