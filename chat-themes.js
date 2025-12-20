/**
 * Chat Widget Theme
 *
 * Single theme with blue brushstroke header.
 */

const BRUSHSTROKE_URL = 'url(https://cdn.ausbeds.com.au/e77ba6ec-02c5-4892-9310-2291e1ac1987/brush-stroke-blue.svg)'

// Theme configuration
export const THEME = {
  // Header brushstroke
  headerBg: 'transparent',
  headerBgImage: BRUSHSTROKE_URL,
  headerBgSize: '125% 125%',
  headerBgPosition: 'center bottom',
  headerText: '#1E1E1E',

  // User messages - Light blue
  userBubbleBg: '#97D7ED',
  userBubbleText: '#1E1E1E',
  userLinkColor: '#0857A6',

  // Assistant messages - Yellow
  assistantBubbleBg: '#FFE5A8',
  assistantBubbleText: '#1E1E1E',
  assistantLinkColor: '#DD8B11',

  // Input
  inputBorder: '#0857A6',
  inputBorderWidth: '2px',
  inputFocusBorder: '#0857A6',
  inputFocusShadow: 'rgba(8, 87, 166, 0.2)',

  // Send button - Dark blue
  sendBg: '#0857A6',
  sendHoverBg: '#064785',
  sendText: '#ffffff',
  sendDisabledBg: '#a8c8e8',
  sendDisabledText: '#6090b0',

  // Avatar border
  avatarBorder: '#FFE5A8',
  avatarBorderWidth: '3px',

  // Drawer
  drawerBg: '#ffffff',
  drawerRadius: '16px',

  // Footer
  footerText: '#9ca3af',
  clearButtonHover: '#FFE5A8',

  // Floating trigger button
  triggerBg: '#FFE5A8',
  triggerShadow: 'rgba(221, 139, 17, 0.3)',
  triggerPulse: 'rgba(221, 139, 17, 0.2)',
  notificationDot: '#0857A6',
  notificationBorder: '#FFE5A8',

  // Popup
  popupBg: '#ffffff',
  popupText: '#1E1E1E',
  popupCta: '#0857A6',
  popupDismissBg: '#FFE5A8',
  popupDismissHover: '#ffd97a',
}

// Helper to get CSS variables
export function getThemeCSS() {
  return {
    // Header
    '--chat-header-bg': THEME.headerBg,
    '--chat-header-bg-image': THEME.headerBgImage,
    '--chat-header-bg-size': THEME.headerBgSize,
    '--chat-header-bg-position': THEME.headerBgPosition,
    '--chat-header-text': THEME.headerText,
    // User bubbles
    '--chat-user-bubble-bg': THEME.userBubbleBg,
    '--chat-user-bubble-text': THEME.userBubbleText,
    '--chat-user-link': THEME.userLinkColor,
    // Assistant bubbles
    '--chat-assistant-bubble-bg': THEME.assistantBubbleBg,
    '--chat-assistant-bubble-text': THEME.assistantBubbleText,
    '--chat-assistant-link': THEME.assistantLinkColor,
    // Input
    '--chat-input-bg': '#ffffff',
    '--chat-input-text': '#1E1E1E',
    '--chat-input-border': THEME.inputBorder,
    '--chat-input-border-width': THEME.inputBorderWidth,
    '--chat-input-focus-border': THEME.inputFocusBorder,
    '--chat-input-focus-shadow': THEME.inputFocusShadow,
    // Send button
    '--chat-send-bg': THEME.sendBg,
    '--chat-send-hover-bg': THEME.sendHoverBg,
    '--chat-send-text': THEME.sendText,
    '--chat-send-disabled-bg': THEME.sendDisabledBg,
    '--chat-send-disabled-text': THEME.sendDisabledText,
    // Avatar
    '--chat-avatar-border': THEME.avatarBorder,
    '--chat-avatar-border-width': THEME.avatarBorderWidth,
    // Drawer
    '--chat-drawer-bg': THEME.drawerBg,
    '--chat-drawer-radius': THEME.drawerRadius,
    // Footer
    '--chat-footer-text': THEME.footerText,
    '--chat-clear-hover': THEME.clearButtonHover,
    // Floating trigger button
    '--chat-trigger-bg': THEME.triggerBg,
    '--chat-trigger-shadow': THEME.triggerShadow,
    '--chat-trigger-pulse': THEME.triggerPulse,
    '--chat-notification-dot': THEME.notificationDot,
    '--chat-notification-border': THEME.notificationBorder,
    // Popup
    '--chat-popup-bg': THEME.popupBg,
    '--chat-popup-text': THEME.popupText,
    '--chat-popup-cta': THEME.popupCta,
    '--chat-popup-dismiss-bg': THEME.popupDismissBg,
    '--chat-popup-dismiss-hover': THEME.popupDismissHover,
  }
}

export default THEME
