/**
 * Manggon Mobile Design System - Typography Tokens
 */

import { TextStyle } from 'react-native';

export const Typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
  },
  lineHeight: {
    xs: 16,
    sm: 20,
    base: 24,
    lg: 28,
    xl: 28,
    '2xl': 32,
    '3xl': 36,
  },
  heading1: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700',
  } as TextStyle,
  heading2: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
  } as TextStyle,
  heading3: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
  } as TextStyle,
  bodyLarge: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  } as TextStyle,
  bodyMedium: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  } as TextStyle,
  bodySmall: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
  } as TextStyle,
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  } as TextStyle,
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
  } as TextStyle,
} as const;
