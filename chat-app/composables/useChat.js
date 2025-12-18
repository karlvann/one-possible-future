/**
 * useChat Composable
 *
 * Manages chat state, message history, and the state machine flow.
 * Handles both scripted responses (instant) and AI responses (async).
 */

import { ref, reactive, computed, watch, onMounted } from 'vue'
import { STATES, processInput, getInitialState, serializeState } from '../utils/stateMachine'
import { getOffScriptSystemPrompt, RESPONSES } from '../utils/scriptResponses'
import { POPUP } from '../chat-config.js'

// Storage key for persisting chat state
const STORAGE_KEY = 'ausbeds_chat_state'

export function useChat() {
  // UI State
  const isOpen = ref(false)
  const isLoading = ref(false)
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
   */
  async function sendMessage(content) {
    if (!content?.trim() || isLoading.value) return

    const userMessage = content.trim()
    hasInteracted.value = true

    // Add user message to history
    messages.push({
      role: 'user',
      content: userMessage,
      timestamp: Date.now()
    })

    // Process through state machine
    const result = processInput(currentState.value, userMessage, context)

    // Update state and context
    currentState.value = result.nextState
    Object.assign(context, result.context)

    if (result.needsAI) {
      // Off-script: need to call Claude API
      await handleAIResponse(userMessage, result.hint)
    } else {
      // On-script: instant response
      addAssistantMessage(result.response)
    }

    // Persist state
    saveState()
  }

  /**
   * Handle AI response for off-script questions
   */
  async function handleAIResponse(userMessage, hint = '') {
    isLoading.value = true

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
    showPopup,
    hasInteracted,
    messages,
    currentState,
    context,

    // Computed
    canSend,
    introMessage,
    popupPreview,

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
