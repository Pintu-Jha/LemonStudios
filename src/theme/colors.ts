/**
 * FlowKit Color Palette
 * Dark-mode-first fitness aesthetic with vibrant accents
 */

export const colors = {
  // Backgrounds
  bg: {
    primary: '#0B0F1A',      // Deep navy
    secondary: '#121829',    // Slightly lighter navy
    card: '#1A2138',         // Card surfaces
    cardHover: '#222B45',    // Card hover / selected
    elevated: '#253052',     // Elevated surfaces
  },

  // Accent / Brand
  accent: {
    primary: '#00E99E',      // Vibrant green
    primaryDim: 'rgba(0, 233, 158, 0.15)',
    secondary: '#6C5CE7',    // Purple
    secondaryDim: 'rgba(108, 92, 231, 0.15)',
    gradient: ['#00E99E', '#00C9FF'] as const, // Teal gradient
    gradientPurple: ['#6C5CE7', '#A855F7'] as const,
  },

  // Text
  text: {
    primary: '#FFFFFF',
    secondary: '#8F9BB3',    // Muted blue-gray
    tertiary: '#5E6A82',     // Very muted
    inverse: '#0B0F1A',      // For accent backgrounds
    accent: '#00E99E',
    error: '#FF6B6B',
  },

  // Semantic
  semantic: {
    success: '#00E99E',
    warning: '#FFAA00',
    error: '#FF6B6B',
    info: '#00C9FF',
  },

  // Borders
  border: {
    default: 'rgba(255, 255, 255, 0.08)',
    active: '#00E99E',
    subtle: 'rgba(255, 255, 255, 0.04)',
  },

  // Overlays
  overlay: {
    light: 'rgba(255, 255, 255, 0.05)',
    medium: 'rgba(0, 0, 0, 0.4)',
    heavy: 'rgba(0, 0, 0, 0.7)',
  },
} as const
