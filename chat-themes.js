/**
 * Chat Widget Themes
 *
 * All themes use the blue brushstroke header/footer.
 * Each theme has a unique geometric background pattern.
 *
 * Pattern types: waves, diagonals, dots, grid
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

// Shared purple/lavender color palette
const purpleColors = {
  ...brushstrokeHeader,
  ...brushstrokeFooter,

  // Background base
  bgBase: 'rgba(250, 248, 255, 0.95)',
  bgPatternColor: '%237249C3', // URL encoded purple

  // User messages - Soft lavender
  userBubbleBg: '#E8E0F0',
  userBubbleText: '#1E1E1E',
  userLinkColor: '#7249C3',

  // Assistant messages - Soft violet
  assistantBubbleBg: '#D6C5F7',
  assistantBubbleText: '#1E1E1E',
  assistantLinkColor: '#5A3A9A',

  // Input
  inputBorder: '#7249C3',
  inputBorderWidth: '2px',
  inputFocusBorder: '#7249C3',
  inputFocusShadow: 'rgba(114, 73, 195, 0.2)',

  // Send button - Purple
  sendBg: '#7249C3',
  sendHoverBg: '#5f3ba6',
  sendText: '#ffffff',
  sendDisabledBg: '#d4c8e8',
  sendDisabledText: '#9080b0',

  // Avatar border
  avatarBorder: '#D6C5F7',
  avatarBorderWidth: '3px',

  // Drawer
  drawerBg: '#faf8ff',
  drawerBorder: 'none',
  drawerShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
  drawerRadius: '16px',

  // Footer
  clearButtonHover: '#E8E0F0',

  // Floating trigger button
  triggerBg: '#E8E0F0',
  triggerShadow: 'rgba(114, 73, 195, 0.3)',
  triggerPulse: 'rgba(114, 73, 195, 0.2)',
  notificationDot: '#5A3A9A',
  notificationBorder: '#E8E0F0',

  // Popup
  popupBg: '#faf8ff',
  popupText: '#1E1E1E',
  popupCta: '#7249C3',
  popupDismissBg: '#E8E0F0',
  popupDismissHover: '#d8d0e8',
}

export const THEMES = {
  // Dusk - Flowing waves (Default)
  dusk: {
    name: 'Dusk',
    id: 'dusk',
    pattern: 'waves',
    colors: { ...purpleColors }
  },

  // Twilight - Diagonal lines
  twilight: {
    name: 'Twilight',
    id: 'twilight',
    pattern: 'diagonals',
    colors: { ...purpleColors }
  },

  // Starlight - Dot pattern
  starlight: {
    name: 'Starlight',
    id: 'starlight',
    pattern: 'dots',
    colors: { ...purpleColors }
  },

  // Eclipse - Grid pattern
  eclipse: {
    name: 'Eclipse',
    id: 'eclipse',
    pattern: 'grid',
    colors: { ...purpleColors }
  },
}

// SVG patterns for each theme type
export const PATTERNS = {
  waves: {
    svg: (color) => `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 20'%3E%3Cpath d='M0 10 Q25 0 50 10 T100 10' fill='none' stroke='${color}' stroke-width='0.5' opacity='0.15'/%3E%3C/svg%3E")`,
    size: '100px 20px'
  },
  diagonals: {
    svg: (color) => `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Cpath d='M0 40 L40 0' fill='none' stroke='${color}' stroke-width='0.5' opacity='0.12'/%3E%3C/svg%3E")`,
    size: '40px 40px'
  },
  dots: {
    svg: (color) => `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='1.5' fill='${color}' opacity='0.15'/%3E%3C/svg%3E")`,
    size: '24px 24px'
  },
  grid: {
    svg: (color) => `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3E%3Cpath d='M0 15 H30 M15 0 V30' fill='none' stroke='${color}' stroke-width='0.4' opacity='0.1'/%3E%3C/svg%3E")`,
    size: '30px 30px'
  }
}

// Default theme
export const ACTIVE_THEME = 'dusk'

// Export the current theme
export const currentTheme = THEMES[ACTIVE_THEME]

// Helper to get CSS variables from theme
export function getThemeCSS(theme = currentTheme) {
  return {
    // Background pattern
    '--chat-bg-base': theme.colors.bgBase || 'rgba(255, 255, 255, 0.95)',
    '--chat-bg-pattern-color': theme.colors.bgPatternColor || '%237249C3',
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
