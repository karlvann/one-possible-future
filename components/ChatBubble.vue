<template>
  <button
    class="chat-bubble-trigger"
    :class="{ 'has-notification': hasNotification }"
    @click="$emit('click')"
    aria-label="Open chat"
  >
    <!-- Mascot image -->
    <img
      :src="mascotUrl"
      alt="Chat with us"
      class="chat-mascot"
      @error="handleMascotError"
    />
    <!-- Fallback icon when image missing -->
    <svg
      v-if="showFallback"
      class="chat-icon-fallback"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="#7c3aed"
    >
      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
      <circle cx="8" cy="10" r="1.5"/>
      <circle cx="12" cy="10" r="1.5"/>
      <circle cx="16" cy="10" r="1.5"/>
    </svg>

    <!-- Notification dot -->
    <span v-if="hasNotification" class="notification-dot"></span>
  </button>
</template>

<script setup>
/**
 * ChatBubble - Floating action button to open chat
 *
 * Shows a chat icon with optional notification indicator.
 * Positioned fixed at bottom-right of viewport.
 */

import { ref } from 'vue'

defineProps({
  hasNotification: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])

const mascotUrl = ref('/images/chat-mascot.png')
const showFallback = ref(false)

function handleMascotError(e) {
  e.target.style.display = 'none'
  showFallback.value = true
}
</script>

<style scoped>
.chat-bubble-trigger {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--chat-trigger-bg, white);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 4px 14px var(--chat-trigger-shadow, rgba(0, 0, 0, 0.15)),
    0 2px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  padding: 8px;
}

.chat-bubble-trigger:hover {
  transform: scale(1.05);
  box-shadow:
    0 6px 20px var(--chat-trigger-shadow, rgba(0, 0, 0, 0.2)),
    0 4px 10px rgba(0, 0, 0, 0.1);
}

.chat-bubble-trigger:active {
  transform: scale(0.98);
}

.chat-bubble-trigger.has-notification {
  animation: pulse 2s infinite;
}

.chat-mascot {
  width: 44px;
  height: 44px;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.chat-bubble-trigger:hover .chat-mascot,
.chat-bubble-trigger:hover .chat-icon-fallback {
  transform: scale(1.1);
}

.chat-icon-fallback {
  transition: transform 0.3s ease;
}

/* Notification dot */
.notification-dot {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 14px;
  height: 14px;
  background: var(--chat-notification-dot, #ef4444);
  border-radius: 50%;
  border: 2px solid var(--chat-notification-border, white);
  animation: bounce-dot 1s infinite;
}

@keyframes pulse {
  0%, 100% {
    box-shadow:
      0 4px 14px var(--chat-trigger-shadow, rgba(0, 0, 0, 0.15)),
      0 2px 6px rgba(0, 0, 0, 0.1);
  }
  50% {
    box-shadow:
      0 4px 14px var(--chat-trigger-shadow, rgba(0, 0, 0, 0.15)),
      0 2px 6px rgba(0, 0, 0, 0.1),
      0 0 0 8px var(--chat-trigger-pulse, rgba(0, 0, 0, 0.1));
  }
}

@keyframes bounce-dot {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
}
</style>
