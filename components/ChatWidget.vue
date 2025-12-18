<template>
  <div class="chat-widget" :style="themeStyles">
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
              <img :src="avatarUrl" alt="Karl" @error="handleAvatarError" />
            </div>
            <div class="chat-header-text">
              <h3 class="chat-title">Chat with Karl's Brain</h3>
              <span class="chat-status">Every mattress question he's ever answered, searchable</span>
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

          <!-- Loading indicator with thinking phrases -->
          <div v-if="isLoading" class="chat-message chat-message--assistant">
            <div class="chat-bubble chat-bubble--loading">
              <span class="thinking-text">{{ currentThinkingPhrase }}</span>
            </div>
          </div>
        </div>

        <!-- Quick Reply Buttons -->
        <div v-if="quickReplies.length > 0 && !isLoading" class="chat-quick-replies">
          <button
            v-for="(reply, index) in quickReplies"
            :key="index"
            class="quick-reply-btn"
            @click="handleQuickReply(reply)"
          >
            {{ reply.label }}
          </button>
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
          <span>Powered by Karl's brain</span>
          <div class="chat-footer-actions">
            <select
              v-model="selectedTheme"
              class="chat-theme-select"
              aria-label="Select theme"
            >
              <option v-for="theme in themeOptions" :key="theme.id" :value="theme.id">
                {{ theme.name }}
              </option>
            </select>
            <button @click="clearChat" class="chat-clear">Clear chat</button>
          </div>
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

import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useChat } from '~/composables/useChat'
import { POPUP } from '~/chat-config.js'
import { THEMES, ACTIVE_THEME, getThemeCSS } from '~/chat-themes.js'
import ChatBubble from '~/components/ChatBubble.vue'
import ChatPopup from '~/components/ChatPopup.vue'

// Quick phrases - for scripted responses (1.5-2.5 sec delay)
const QUICK_PHRASES = [
  'Got it...',
  'Yep...',
  'Right...',
  'Easy one...',
  'One sec...',
  'Here we go...',
  'Sure thing...',
  'On it...',
]

// Deep phrases - for AI/RAG responses (longer searches)
const DEEP_PHRASES = [
  'Digging through the archives...',
  'Good question, let me look that up properly...',
  'Searching the knowledge base...',
  'Hmm, let me check my notes on that...',
  'Rummaging through 20 years of stuff...',
  'That\'s in here somewhere...',
  'Let me find the right answer for that...',
  'Give me a sec, want to get this right...',
  'Checking the files...',
  'Pulling up the details...',
  'One of those questions... hang on...',
  'Need to dig for that one...',
]

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
  loadingType,
  showPopup,
  messages,
  currentState,
  quickReplies,
  popupPreview,
  sendMessage,
  openChat,
  closeChat,
  clearChat,
  dismissPopup,
  startPopupTimer,
  initChat
} = useChat()

// Handle quick reply button click
function handleQuickReply(reply) {
  // Send the label for display, but the value for processing
  // For "learn more" buttons, show the label; for others, show the value
  const displayText = reply.value.startsWith('learn_') ? reply.label : reply.value
  sendMessage(reply.value, displayText)
}

// Local state
const inputText = ref('')
const inputRef = ref(null)
const messagesContainer = ref(null)
const avatarUrl = ref('/images/karl-avatar.jpg')

// Thinking phrases rotation
const thinkingPhraseIndex = ref(0)
const thinkingInterval = ref(null)
const currentPhrases = computed(() => loadingType.value === 'quick' ? QUICK_PHRASES : DEEP_PHRASES)
const currentThinkingPhrase = computed(() => currentPhrases.value[thinkingPhraseIndex.value % currentPhrases.value.length])

// Theme
const selectedTheme = ref(ACTIVE_THEME)
const themeOptions = Object.values(THEMES)
const themeStyles = computed(() => getThemeCSS(THEMES[selectedTheme.value]))

// Handle missing avatar image
function handleAvatarError(e) {
  e.target.style.display = 'none'
  e.target.parentElement.innerHTML = '<span class="chat-avatar-fallback">K</span>'
}

// Dynamic placeholder based on state
const inputPlaceholder = computed(() => {
  switch (currentState.value) {
    case 'INTRO':
      return 'Enter your weight in kg...'
    case 'WEIGHT_RECEIVED':
      return 'Pick a size or type...'
    case 'SIZE_SELECTED':
      return 'Pick a mattress or type...'
    case 'PRODUCT_SELECTED':
      return 'Yes or no...'
    case 'ASK_SUBURB':
      return 'Enter your suburb...'
    case 'SHOW_QUOTE':
      return 'Yes or no...'
    case 'ASK_EMAIL':
      return 'your@email.com...'
    case 'ASK_NAME':
      return 'Your name...'
    case 'ASK_ADDRESS':
      return 'Full delivery address...'
    case 'ASK_PHONE':
      return 'Mobile number or skip...'
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
    // Remove newlines inside lists (prevents <br> between items)
    .replace(/<\/li>\n<li>/g, '</li><li>')
    // Remove extra newline after closing </ul> tag
    .replace(/<\/ul>\n/g, '</ul>')
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

// Rotate thinking phrases while loading
watch(isLoading, (loading) => {
  if (loading) {
    // Start with a random phrase from the appropriate array
    const phrases = loadingType.value === 'quick' ? QUICK_PHRASES : DEEP_PHRASES
    thinkingPhraseIndex.value = Math.floor(Math.random() * phrases.length)
    // Rotate every 2 seconds (only matters for deep searches)
    thinkingInterval.value = setInterval(() => {
      thinkingPhraseIndex.value = thinkingPhraseIndex.value + 1
    }, 2000)
  } else {
    // Stop rotation
    if (thinkingInterval.value) {
      clearInterval(thinkingInterval.value)
      thinkingInterval.value = null
    }
  }
})

// Start popup timer on mount
onMounted(() => {
  startPopupTimer(props.popupDelay)
})

// Cleanup interval on unmount
onUnmounted(() => {
  if (thinkingInterval.value) {
    clearInterval(thinkingInterval.value)
  }
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
  width: 400px;
  max-width: calc(100vw - 40px);
  height: 700px;
  max-height: calc(100vh - 40px);
  background: var(--chat-drawer-bg, white);
  border-radius: var(--chat-drawer-radius, 16px);
  box-shadow: var(--chat-drawer-shadow, 0 25px 50px -12px rgba(0, 0, 0, 0.25));
  border: var(--chat-drawer-border, none);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Header */
.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: var(--chat-header-bg);
  background-image: var(--chat-header-bg-image, none);
  background-size: var(--chat-header-bg-size, auto);
  background-position: var(--chat-header-bg-position, center);
  background-repeat: no-repeat;
  color: var(--chat-header-text);
  border-bottom: var(--chat-header-border, none);
}

.chat-header-info {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
}

.chat-avatar {
  width: 40px;
  height: 40px;
  min-width: 40px;
  border-radius: 50%;
  overflow: hidden;
  border: var(--chat-avatar-border-width, 2px) solid var(--chat-avatar-border);
  flex-shrink: 0;
}

.chat-header-text {
  min-width: 0;
}

.chat-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.chat-avatar :deep(.chat-avatar-fallback) {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  background: rgba(255, 255, 255, 0.2);
}

.chat-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  white-space: nowrap;
}

.chat-status {
  font-size: 0.7rem;
  opacity: 0.8;
  line-height: 1.3;
  display: block;
}

.chat-close {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.2s;
  flex-shrink: 0;
  margin-left: 8px;
}

.chat-close:hover {
  background: rgba(0, 0, 0, 0.1);
}

/* Messages */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Push messages to bottom when few messages, but allow scroll when many */
.chat-messages::before {
  content: '';
  flex: 1;
}

.chat-message {
  display: flex;
  max-width: 88%;
}

.chat-message--user {
  align-self: flex-end;
}

.chat-message--assistant {
  align-self: flex-start;
}

.chat-bubble {
  padding: 10px 14px;
  border-radius: 16px;
  font-size: 0.9375rem;
  line-height: 1.4;
  word-wrap: break-word;
}

.chat-message--user .chat-bubble {
  background: var(--chat-user-bubble-bg);
  color: var(--chat-user-bubble-text);
  border: var(--chat-user-bubble-border, none);
  border-bottom-right-radius: 4px;
}

.chat-message--assistant .chat-bubble {
  background: var(--chat-assistant-bubble-bg);
  color: var(--chat-assistant-bubble-text);
  border: var(--chat-assistant-bubble-border, none);
  border-bottom-left-radius: 4px;
}

/* Links in messages */
.chat-bubble :deep(a) {
  color: inherit;
  text-decoration: underline;
}

.chat-message--user .chat-bubble :deep(a) {
  color: var(--chat-user-link);
}

.chat-message--assistant .chat-bubble :deep(a) {
  color: var(--chat-assistant-link);
}

/* Lists in messages */
.chat-bubble :deep(ul) {
  margin: 4px 0;
  padding-left: 0;
  list-style: none;
}

.chat-bubble :deep(li) {
  position: relative;
  padding-left: 1.25em;
  margin: 2px 0;
}

.chat-bubble :deep(li)::before {
  content: '•';
  position: absolute;
  left: 0;
}

/* Loading / Thinking */
.chat-bubble--loading {
  padding: 12px 16px;
}

.thinking-text {
  font-style: italic;
  opacity: 0.85;
  animation: fade-pulse 2s ease-in-out infinite;
}

@keyframes fade-pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

/* Quick Reply Buttons */
.chat-quick-replies {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px 12px;
  border-top: 1px solid #f0f0f0;
  background: var(--chat-drawer-bg, #f7f7f7);
}

.quick-reply-btn {
  padding: 8px 16px;
  border: 2px solid var(--chat-send-bg, #DD8B11);
  border-radius: 20px;
  background: white;
  color: var(--chat-send-bg, #DD8B11);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.quick-reply-btn:hover {
  background: var(--chat-send-bg, #DD8B11);
  color: white;
}

.quick-reply-btn:active {
  transform: scale(0.97);
}

/* Input */
.chat-input-form {
  display: flex;
  gap: 8px;
  padding: 10px 12px;
  border-top: 1px solid #e5e7eb;
  background: white;
}

.chat-input {
  flex: 1;
  padding: 10px 14px;
  border: var(--chat-input-border-width, 1px) solid var(--chat-input-border);
  border-radius: 24px;
  font-size: 0.9375rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  background: var(--chat-input-bg, #ffffff);
  color: var(--chat-input-text, #1E1E1E);
}

.chat-input:focus {
  border-color: var(--chat-input-focus-border);
  box-shadow: 0 0 0 3px var(--chat-input-focus-shadow);
}

.chat-input:disabled {
  opacity: 0.6;
}

.chat-input::placeholder {
  color: inherit;
  opacity: 0.5;
}

.chat-send {
  width: 40px;
  height: 40px;
  background: var(--chat-send-bg);
  color: var(--chat-send-text);
  border: var(--chat-send-border, none);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.2s, transform 0.1s;
}

.chat-send:hover:not(:disabled) {
  background: var(--chat-send-hover-bg);
}

.chat-send:active:not(:disabled) {
  transform: scale(0.95);
}

.chat-send:disabled {
  background: var(--chat-send-disabled-bg, #d1d5db);
  color: var(--chat-send-disabled-text, #9ca3af);
  cursor: not-allowed;
}

/* Footer */
.chat-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 12px;
  font-size: 0.7rem;
  color: var(--chat-footer-text, #9ca3af);
  background-color: var(--chat-footer-bg, transparent);
  background-image: var(--chat-footer-bg-image, none);
  background-size: var(--chat-footer-bg-size, auto);
  background-position: var(--chat-footer-bg-position, center);
  background-repeat: no-repeat;
  border-top: 1px solid #f3f4f6;
}

.chat-clear {
  background: none;
  border: none;
  color: var(--chat-footer-text, #9ca3af);
  cursor: pointer;
  font-size: 0.7rem;
  padding: 4px 6px;
  border-radius: 4px;
  transition: color 0.2s, background 0.2s;
}

.chat-clear:hover {
  color: #6b7280;
  background: var(--chat-clear-hover, #f3f4f6);
}

.chat-footer-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.chat-theme-select {
  background: transparent;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  color: var(--chat-footer-text, #9ca3af);
  font-size: 0.75rem;
  padding: 2px 6px;
  cursor: pointer;
  outline: none;
}

.chat-theme-select:hover {
  border-color: #9ca3af;
}

.chat-theme-select option {
  background: #fff;
  color: #333;
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
