<template>
  <button
    class="chat-bubble-trigger"
    :class="{ 'has-notification': hasNotification }"
    @click="$emit('click')"
    aria-label="Open chat"
  >
    <!-- Chat icon -->
    <svg
      class="chat-icon"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="currentColor"
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

defineProps({
  hasNotification: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])
</script>

<style scoped>
.chat-bubble-trigger {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 4px 14px rgba(124, 58, 237, 0.4),
    0 2px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
}

.chat-bubble-trigger:hover {
  transform: scale(1.05);
  box-shadow:
    0 6px 20px rgba(124, 58, 237, 0.5),
    0 4px 10px rgba(0, 0, 0, 0.15);
}

.chat-bubble-trigger:active {
  transform: scale(0.98);
}

.chat-bubble-trigger.has-notification {
  animation: pulse 2s infinite;
}

.chat-icon {
  transition: transform 0.3s ease;
}

.chat-bubble-trigger:hover .chat-icon {
  transform: scale(1.1);
}

/* Notification dot */
.notification-dot {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 14px;
  height: 14px;
  background: #ef4444;
  border-radius: 50%;
  border: 2px solid white;
  animation: bounce-dot 1s infinite;
}

@keyframes pulse {
  0%, 100% {
    box-shadow:
      0 4px 14px rgba(124, 58, 237, 0.4),
      0 2px 6px rgba(0, 0, 0, 0.1);
  }
  50% {
    box-shadow:
      0 4px 14px rgba(124, 58, 237, 0.4),
      0 2px 6px rgba(0, 0, 0, 0.1),
      0 0 0 8px rgba(124, 58, 237, 0.15);
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
