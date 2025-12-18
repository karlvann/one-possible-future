<template>
  <Transition name="popup">
    <div class="chat-popup" @click="$emit('click')">
      <!-- Dismiss button -->
      <button
        class="popup-dismiss"
        @click.stop="$emit('dismiss')"
        aria-label="Dismiss"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      <!-- Avatar -->
      <div class="popup-avatar">
        <img :src="avatarUrl" alt="Karl" @error="handleAvatarError" />
      </div>

      <!-- Content -->
      <div class="popup-content">
        <p class="popup-message">{{ message }}</p>
        <span class="popup-cta">Chat now</span>
      </div>

      <!-- Arrow pointing to bubble -->
      <div class="popup-arrow"></div>
    </div>
  </Transition>
</template>

<script setup>
/**
 * ChatPopup - Notification popup that appears after 20 seconds
 *
 * Shows a truncated preview of the intro message to
 * encourage users to open the chat.
 */

import { ref } from 'vue'

defineProps({
  message: {
    type: String,
    default: "Years of fitting people to mattresses, now instant..."
  }
})

defineEmits(['click', 'dismiss'])

const avatarUrl = ref('/images/karl-avatar.jpg')

function handleAvatarError(e) {
  e.target.style.display = 'none'
  e.target.parentElement.innerHTML = '<span class="popup-avatar-fallback">K</span>'
}
</script>

<style scoped>
.chat-popup {
  position: absolute;
  bottom: 75px;
  right: 0;
  width: 280px;
  background: var(--chat-popup-bg, white);
  border-radius: 12px;
  padding: 16px;
  padding-right: 36px;
  box-shadow:
    0 10px 25px rgba(0, 0, 0, 0.15),
    0 4px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  display: flex;
  gap: 12px;
  align-items: flex-start;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.chat-popup:hover {
  transform: translateY(-2px);
  box-shadow:
    0 12px 30px rgba(0, 0, 0, 0.18),
    0 6px 12px rgba(0, 0, 0, 0.12);
}

/* Dismiss button */
.popup-dismiss {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background: var(--chat-popup-dismiss-bg, #f3f4f6);
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.popup-dismiss:hover {
  background: var(--chat-popup-dismiss-hover, #e5e7eb);
  color: #374151;
}

/* Avatar */
.popup-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  border: 2px solid var(--chat-avatar-border, #7c3aed);
}

.popup-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.popup-avatar :deep(.popup-avatar-fallback) {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  background: var(--chat-send-bg, #7c3aed);
}

/* Content */
.popup-content {
  flex: 1;
  min-width: 0;
}

.popup-message {
  margin: 0 0 8px 0;
  font-size: 0.875rem;
  line-height: 1.4;
  color: var(--chat-popup-text, #374151);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.popup-cta {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--chat-popup-cta, #7c3aed);
}

/* Arrow pointing down-right to bubble */
.popup-arrow {
  position: absolute;
  bottom: -8px;
  right: 24px;
  width: 16px;
  height: 16px;
  background: var(--chat-popup-bg, white);
  transform: rotate(45deg);
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.1);
}

/* Animation */
.popup-enter-active,
.popup-leave-active {
  transition: all 0.3s ease;
}

.popup-enter-from,
.popup-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.95);
}
</style>
