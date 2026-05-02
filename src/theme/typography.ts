/**
 * FlowKit Typography Scale
 * System font with consistent sizing and weight
 */

import { Platform } from 'react-native'

const fontFamily = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
})

export const typography = {
  fontFamily,

  // Font sizes
  size: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },

  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },

  // Font weights
  weight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    heavy: '800' as const,
  },

  // Pre-composed text styles
  styles: {
    heroTitle: {
      fontSize: 36,
      fontWeight: '800' as const,
      lineHeight: 43,
      letterSpacing: -0.5,
    },
    title: {
      fontSize: 24,
      fontWeight: '700' as const,
      lineHeight: 32,
      letterSpacing: -0.3,
    },
    subtitle: {
      fontSize: 17,
      fontWeight: '600' as const,
      lineHeight: 24,
    },
    body: {
      fontSize: 15,
      fontWeight: '400' as const,
      lineHeight: 22,
    },
    bodyMedium: {
      fontSize: 15,
      fontWeight: '500' as const,
      lineHeight: 22,
    },
    caption: {
      fontSize: 13,
      fontWeight: '400' as const,
      lineHeight: 18,
    },
    label: {
      fontSize: 13,
      fontWeight: '600' as const,
      lineHeight: 18,
      letterSpacing: 0.5,
      textTransform: 'uppercase' as const,
    },
    button: {
      fontSize: 17,
      fontWeight: '600' as const,
      lineHeight: 22,
    },
  },
} as const
