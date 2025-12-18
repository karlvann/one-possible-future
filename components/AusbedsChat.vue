<template>
  <div class="ausbeds-chat">
    <!-- Chat Messages -->
    <div ref="messagesContainer" class="chat-messages">
      <!-- Welcome message -->
      <div v-if="messages.length === 0" class="chat-welcome">
        <p class="text-gray-500 text-center">
          Ask me anything about Ausbeds mattresses, delivery, trials, or warranties.
        </p>
      </div>

      <!-- Message history -->
      <div
        v-for="(msg, index) in messages"
        :key="index"
        class="chat-message"
        :class="msg.role === 'user' ? 'chat-message--user' : 'chat-message--assistant'"
      >
        <div class="chat-bubble">
          <div v-if="msg.role === 'assistant'" v-html="formatMessage(msg.content)"></div>
          <div v-else>{{ msg.content }}</div>
        </div>
      </div>

      <!-- Loading indicator -->
      <div v-if="loading" class="chat-message chat-message--assistant">
        <div class="chat-bubble chat-bubble--loading">
          <span class="loading-dot"></span>
          <span class="loading-dot"></span>
          <span class="loading-dot"></span>
        </div>
      </div>
    </div>

    <!-- Input -->
    <form @submit.prevent="sendMessage" class="chat-input-form">
      <input
        v-model="input"
        type="text"
        placeholder="Ask a question..."
        class="chat-input"
        :disabled="loading"
      />
      <button
        type="submit"
        class="chat-send"
        :disabled="loading || !input.trim()"
      >
        <Icon name="ic:baseline-send" class="w-5 h-5" />
      </button>
    </form>
  </div>
</template>

<script setup>
/**
 * AusbedsChat Component
 *
 * AI chatbot that uses the full /kb knowledge base to answer questions.
 * Can be placed anywhere on the site - no configuration needed.
 *
 * Architecture:
 * 1. Fetches /api/faq/combined (full KB markdown)
 * 2. Sends user question + KB context to /api/chat
 * 3. Displays streamed response
 */

const props = defineProps({
  placeholder: {
    type: String,
    default: 'Ask a question...'
  }
})

const input = ref('')
const messages = reactive([])
const loading = ref(false)
const messagesContainer = ref(null)

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const formatMessage = (content) => {
  // Convert markdown-style formatting to HTML
  let html = content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>')
  return html
}

const sendMessage = async () => {
  const question = input.value.trim()
  if (!question || loading.value) return

  // Add user message
  messages.push({ role: 'user', content: question })
  input.value = ''
  loading.value = true
  scrollToBottom()

  try {
    const response = await $fetch('/api/chat', {
      method: 'POST',
      body: { question }
    })

    messages.push({ role: 'assistant', content: response.answer })
  } catch (error) {
    messages.push({
      role: 'assistant',
      content: 'Sorry, I had trouble answering that. Please try again or call us on (02) 8999 3333.'
    })
  } finally {
    loading.value = false
    scrollToBottom()
  }
}
</script>

<style scoped>
.ausbeds-chat {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 500px;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  min-height: 200px;
  max-height: 350px;
}

.chat-welcome {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 150px;
}

.chat-message {
  margin-bottom: 12px;
  display: flex;
}

.chat-message--user {
  justify-content: flex-end;
}

.chat-message--assistant {
  justify-content: flex-start;
}

.chat-bubble {
  max-width: 80%;
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 0.9375rem;
  line-height: 1.5;
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

.chat-bubble--loading {
  display: flex;
  gap: 4px;
  padding: 14px 18px;
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

.chat-input-form {
  display: flex;
  gap: 8px;
  padding: 12px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}

.chat-input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.9375rem;
  outline: none;
  transition: border-color 0.2s;
}

.chat-input:focus {
  border-color: #7c3aed;
}

.chat-input:disabled {
  background: #f3f4f6;
}

.chat-send {
  padding: 10px 14px;
  background: #7c3aed;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.chat-send:hover:not(:disabled) {
  background: #6d28d9;
}

.chat-send:disabled {
  background: #d1d5db;
  cursor: not-allowed;
}
</style>
