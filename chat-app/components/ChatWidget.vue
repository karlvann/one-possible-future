<template>
  <div class="chat-widget">
    <!-- Popup Notification (appears after 20s) -->
    <ChatPopup
      v-if="showPopup && !isOpen"
      :message="popupPreview"
      @click="openChat"
      @dismiss="dismissPopup"
    />

    <!-- Floating Chat Bubble -->
    <ChatBubble
      v-if="!isOpen"
      :has-notification="showPopup"
      @click="openChat"
    />

    <!-- Chat Drawer -->
    <Transition name="slide">
      <div v-if="isOpen" class="chat-drawer">
        <!-- Header -->
        <div class="chat-header">
          <div class="chat-header-info">
            <div class="chat-avatar">
              <img src="/images/karl-avatar.jpg" alt="Karl" />
            </div>
            <div>
              <h3 class="chat-title">Karl from Ausbeds</h3>
              <span class="chat-status">Usually replies instantly</span>
            </div>
          </div>
          <button class="chat-close" @click="closeChat" aria-label="Close chat">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Messages -->
        <div ref="messagesContainer" class="chat-messages">
          <div
            v-for="(msg, index) in messages"
            :key="index"
            class="chat-message"
            :class="[`chat-message--${msg.role}`]"
          >
            <div class="chat-bubble" v-html="formatMessage(msg.content)"></div>
          </div>

          <!-- Loading indicator -->
          <div v-if="isLoading" class="chat-message chat-message--assistant">
            <div class="chat-bubble chat-bubble--loading">
              <span class="loading-dot"></span>
              <span class="loading-dot"></span>
              <span class="loading-dot"></span>
            </div>
          </div>
        </div>

        <!-- Input -->
        <form @submit.prevent="handleSubmit" class="chat-input-form">
          <input
            ref="inputRef"
            v-model="inputText"
            type="text"
            :placeholder="inputPlaceholder"
            class="chat-input"
            :disabled="isLoading"
            @keydown.enter.prevent="handleSubmit"
          />
          <button
            type="submit"
            class="chat-send"
            :disabled="isLoading || !inputText.trim()"
            aria-label="Send message"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </form>

        <!-- Footer -->
        <div class="chat-footer">
          <span>Powered by Claude</span>
          <button @click="clearChat" class="chat-clear">Clear chat</button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
/**
 * ChatWidget - Main chat component
 *
 * Integrates all chat functionality:
 * - 20-second popup notification
 * - Floating chat bubble trigger
 * - Slide-out chat drawer
 * - Message history with formatting
 * - State machine for scripted flow
 */

import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useChat } from '../composables/useChat'
import { POPUP } from '../chat-config.js'
import ChatBubble from './ChatBubble.vue'
import ChatPopup from './ChatPopup.vue'

const props = defineProps({
  popupDelay: {
    type: Number,
    default: POPUP.delayMs
  }
})

// Chat composable
const {
  isOpen,
  isLoading,
  showPopup,
  messages,
  currentState,
  popupPreview,
  sendMessage,
  openChat,
  closeChat,
  clearChat,
  dismissPopup,
  startPopupTimer,
  initChat
} = useChat()

// Local state
const inputText = ref('')
const inputRef = ref(null)
const messagesContainer = ref(null)

// Dynamic placeholder based on state
const inputPlaceholder = computed(() => {
  switch (currentState.value) {
    case 'INTRO':
      return 'Enter your weight in kg...'
    case 'WEIGHT_RECEIVED':
      return 'Type Cooper, Aurora, or Cloud...'
    case 'PRODUCT_SELECTED':
      return 'Type yes to learn more...'
    default:
      return 'Ask anything...'
  }
})

// Handle form submission
async function handleSubmit() {
  const text = inputText.value.trim()
  if (!text || isLoading.value) return

  inputText.value = ''
  await sendMessage(text)
}

// Format message content (markdown-lite)
function formatMessage(content) {
  if (!content) return ''

  return content
    // Bold: **text**
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic: *text*
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    // Links: [text](url) or plain URLs
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    .replace(/(ausbeds\.com\.au\/[^\s]+)/g, '<a href="https://$1" target="_blank" rel="noopener">$1</a>')
    // Bullet points: • text
    .replace(/^• (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    // Line breaks
    .replace(/\n/g, '<br>')
}

// Auto-scroll to bottom when messages change
watch(messages, () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}, { deep: true })

// Focus input when chat opens
watch(isOpen, (open) => {
  if (open) {
    nextTick(() => {
      inputRef.value?.focus()
    })
  }
})

// Start popup timer on mount
onMounted(() => {
  startPopupTimer(props.popupDelay)
})
</script>

<style scoped>
.chat-widget {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Drawer */
.chat-drawer {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 380px;
  max-width: calc(100vw - 40px);
  height: 600px;
  max-height: calc(100vh - 100px);
  background: white;
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Header */
.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%);
  color: white;
}

.chat-header-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.chat-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.chat-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.chat-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
}

.chat-status {
  font-size: 0.75rem;
  opacity: 0.8;
}

.chat-close {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.2s;
}

.chat-close:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* Messages */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chat-message {
  display: flex;
  max-width: 85%;
}

.chat-message--user {
  align-self: flex-end;
}

.chat-message--assistant {
  align-self: flex-start;
}

.chat-bubble {
  padding: 12px 16px;
  border-radius: 16px;
  font-size: 0.9375rem;
  line-height: 1.5;
  word-wrap: break-word;
}

.chat-message--user .chat-bubble {
  background: #7c3aed;
  color: white;
  border-bottom-right-radius: 4px;
}

.chat-message--assistant .chat-bubble {
  background: #f3f4f6;
  color: #1f2937;
  border-bottom-left-radius: 4px;
}

/* Links in messages */
.chat-bubble :deep(a) {
  color: inherit;
  text-decoration: underline;
}

.chat-message--user .chat-bubble :deep(a) {
  color: white;
}

.chat-message--assistant .chat-bubble :deep(a) {
  color: #7c3aed;
}

/* Lists in messages */
.chat-bubble :deep(ul) {
  margin: 8px 0;
  padding-left: 0;
  list-style: none;
}

.chat-bubble :deep(li) {
  position: relative;
  padding-left: 1.25em;
  margin: 4px 0;
}

.chat-bubble :deep(li)::before {
  content: '•';
  position: absolute;
  left: 0;
}

/* Loading */
.chat-bubble--loading {
  display: flex;
  gap: 4px;
  padding: 16px 20px;
}

.loading-dot {
  width: 8px;
  height: 8px;
  background: #9ca3af;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
}

.loading-dot:nth-child(1) { animation-delay: -0.32s; }
.loading-dot:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

/* Input */
.chat-input-form {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid #e5e7eb;
  background: white;
}

.chat-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 24px;
  font-size: 0.9375rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.chat-input:focus {
  border-color: #7c3aed;
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
}

.chat-input:disabled {
  background: #f9fafb;
}

.chat-send {
  width: 44px;
  height: 44px;
  background: #7c3aed;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, transform 0.1s;
}

.chat-send:hover:not(:disabled) {
  background: #6d28d9;
}

.chat-send:active:not(:disabled) {
  transform: scale(0.95);
}

.chat-send:disabled {
  background: #d1d5db;
  cursor: not-allowed;
}

/* Footer */
.chat-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  font-size: 0.75rem;
  color: #9ca3af;
  border-top: 1px solid #f3f4f6;
}

.chat-clear {
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  font-size: 0.75rem;
  padding: 4px 8px;
  border-radius: 4px;
  transition: color 0.2s, background 0.2s;
}

.chat-clear:hover {
  color: #6b7280;
  background: #f3f4f6;
}

/* Animations */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

/* Mobile responsive */
@media (max-width: 480px) {
  .chat-drawer {
    width: 100%;
    height: 100%;
    max-height: 100%;
    bottom: 0;
    right: 0;
    border-radius: 0;
  }

  .chat-widget {
    bottom: 16px;
    right: 16px;
  }
}
</style>
