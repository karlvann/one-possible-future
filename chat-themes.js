/**
 * Chat Widget Themes
 *
 * All themes use the blue brushstroke header/footer.
 * Colors sourced from tailwind.config.js:
 * - Blue: #97D7ED (light), #0857A6 (dark)
 * - Green: #B4F8CC (light), #4F8F45 (dark)
 * - Purple: #D6C5F7 (light), #7249C3 (dark)
 * - Red/Pink: #FFC2CB (light), #A53D4C (dark)
 * - Yellow: #FFE5A8 (light), #DD8B11 (dark)
 * - Grey: #2E2E2E (default), #1E1E1E (dark), #787878 (medium), #e8e5de (med-light), #f7f7f7 (light)
 */

const BRUSHSTROKE_URL = 'url(https://cdn.ausbeds.com.au/e77ba6ec-02c5-4892-9310-2291e1ac1987/brush-stroke-blue.svg)'

// Shared brushstroke config for header and footer
const brushstrokeHeader = {
  headerBg: 'transparent',
  headerBgImage: BRUSHSTROKE_URL,
  headerBgSize: '100% 100%',
  headerBgPosition: 'center center',
  headerText: '#1E1E1E',
  headerBorder: 'none',
}

const brushstrokeFooter = {
  footerBg: 'transparent',
  footerBgImage: BRUSHSTROKE_URL,
  footerBgSize: '100% 100%',
  footerBgPosition: 'center center',
  footerText: '#1E1E1E',
}

export const THEMES = {
  // Sunset - Warm Welcome (Default)
  sunset: {
    name: 'Sunset',
    id: 'sunset',
    colors: {
      ...brushstrokeHeader,
      ...brushstrokeFooter,

      // User messages - Yellow pastel
      userBubbleBg: '#FFE5A8',
      userBubbleText: '#1E1E1E',
      userLinkColor: '#DD8B11',

      // Assistant messages - Pink pastel
      assistantBubbleBg: '#FFC2CB',
      assistantBubbleText: '#1E1E1E',
      assistantLinkColor: '#A53D4C',

      // Input
      inputBorder: '#DD8B11',
      inputBorderWidth: '2px',
      inputFocusBorder: '#DD8B11',
      inputFocusShadow: 'rgba(221, 139, 17, 0.2)',

      // Send button - Amber/orange
      sendBg: '#DD8B11',
      sendHoverBg: '#c47a0f',
      sendText: '#ffffff',
      sendDisabledBg: '#e8d4a8',
      sendDisabledText: '#a89060',

      // Avatar border
      avatarBorder: '#FFE5A8',
      avatarBorderWidth: '3px',

      // Drawer - Light cream
      drawerBg: '#f7f7f7',
      drawerBorder: 'none',
      drawerShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.2)',
      drawerRadius: '16px',

      // Footer
      clearButtonHover: '#FFE5A8',

      // Floating trigger button - Warm amber
      triggerBg: '#FFE5A8',
      triggerShadow: 'rgba(221, 139, 17, 0.3)',
      triggerPulse: 'rgba(221, 139, 17, 0.2)',
      notificationDot: '#A53D4C',
      notificationBorder: '#FFE5A8',

      // Popup - Cream with warm accents
      popupBg: '#f7f7f7',
      popupText: '#1E1E1E',
      popupCta: '#DD8B11',
      popupDismissBg: '#FFE5A8',
      popupDismissHover: '#ffd97a',
    }
  },
}

// Default theme
export const ACTIVE_THEME = 'sunset'

// Export the current theme
export const currentTheme = THEMES[ACTIVE_THEME]

// Helper to get CSS variables from theme
export function getThemeCSS(theme = currentTheme) {
  return {
    // Header
    '--chat-header-bg': theme.colors.headerBg,
    '--chat-header-bg-image': theme.colors.headerBgImage || 'none',
    '--chat-header-bg-size': theme.colors.headerBgSize || 'auto',
    '--chat-header-bg-position': theme.colors.headerBgPosition || 'center',
    '--chat-header-text': theme.colors.headerText,
    '--chat-header-border': theme.colors.headerBorder,
    // User bubbles
    '--chat-user-bubble-bg': theme.colors.userBubbleBg,
    '--chat-user-bubble-text': theme.colors.userBubbleText,
    '--chat-user-bubble-border': theme.colors.userBubbleBorder || 'none',
    '--chat-user-link': theme.colors.userLinkColor,
    // Assistant bubbles
    '--chat-assistant-bubble-bg': theme.colors.assistantBubbleBg,
    '--chat-assistant-bubble-text': theme.colors.assistantBubbleText,
    '--chat-assistant-bubble-border': theme.colors.assistantBubbleBorder || 'none',
    '--chat-assistant-link': theme.colors.assistantLinkColor,
    // Input
    '--chat-input-bg': theme.colors.inputBg || '#ffffff',
    '--chat-input-text': theme.colors.inputText || '#1E1E1E',
    '--chat-input-border': theme.colors.inputBorder,
    '--chat-input-border-width': theme.colors.inputBorderWidth || '1px',
    '--chat-input-focus-border': theme.colors.inputFocusBorder,
    '--chat-input-focus-shadow': theme.colors.inputFocusShadow,
    // Send button
    '--chat-send-bg': theme.colors.sendBg,
    '--chat-send-hover-bg': theme.colors.sendHoverBg,
    '--chat-send-text': theme.colors.sendText,
    '--chat-send-border': theme.colors.sendBorder || 'none',
    '--chat-send-disabled-bg': theme.colors.sendDisabledBg || '#d1d5db',
    '--chat-send-disabled-text': theme.colors.sendDisabledText || '#9ca3af',
    // Avatar
    '--chat-avatar-border': theme.colors.avatarBorder,
    '--chat-avatar-border-width': theme.colors.avatarBorderWidth || '2px',
    // Drawer
    '--chat-drawer-bg': theme.colors.drawerBg || '#ffffff',
    '--chat-drawer-border': theme.colors.drawerBorder,
    '--chat-drawer-shadow': theme.colors.drawerShadow,
    '--chat-drawer-radius': theme.colors.drawerRadius || '16px',
    // Footer
    '--chat-footer-bg': theme.colors.footerBg || 'transparent',
    '--chat-footer-bg-image': theme.colors.footerBgImage || 'none',
    '--chat-footer-bg-size': theme.colors.footerBgSize || 'auto',
    '--chat-footer-bg-position': theme.colors.footerBgPosition || 'center',
    '--chat-footer-text': theme.colors.footerText,
    '--chat-clear-hover': theme.colors.clearButtonHover,
    // Floating trigger button
    '--chat-trigger-bg': theme.colors.triggerBg || '#ffffff',
    '--chat-trigger-shadow': theme.colors.triggerShadow || 'rgba(0, 0, 0, 0.15)',
    '--chat-trigger-pulse': theme.colors.triggerPulse || 'rgba(0, 0, 0, 0.1)',
    '--chat-notification-dot': theme.colors.notificationDot || '#ef4444',
    '--chat-notification-border': theme.colors.notificationBorder || '#ffffff',
    // Popup
    '--chat-popup-bg': theme.colors.popupBg || '#ffffff',
    '--chat-popup-text': theme.colors.popupText || '#374151',
    '--chat-popup-cta': theme.colors.popupCta || theme.colors.sendBg,
    '--chat-popup-dismiss-bg': theme.colors.popupDismissBg || '#f3f4f6',
    '--chat-popup-dismiss-hover': theme.colors.popupDismissHover || '#e5e7eb',
  }
}

export default THEMES
