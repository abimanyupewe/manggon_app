/**
 * Manggon Mobile Design System - Color Palette
 * Clean Minimalist Theme (Modern & Functional)
 */

export const Colors = {
  // Brand & Accent Colors
  primary: {
    DEFAULT: '#0284C7', // Ocean Blue primary
    hover: '#0369A1',
    light: '#E0F2FE',
    dark: '#075985',
  },
  accent: {
    DEFAULT: '#10B981', // Sage Green accent
    hover: '#059669',
    light: '#D1FAE5',
    dark: '#065F46',
  },

  // Background & Surfaces
  background: {
    app: '#FAFAFA', // Light clean gray background
    surface: '#FFFFFF', // Pure white card surface
    subtle: '#F3F4F6', // Subtle container background
  },

  // Typography & Text
  text: {
    primary: '#111827', // Gray 900
    secondary: '#4B5563', // Gray 600
    muted: '#9CA3AF', // Gray 400
    inverse: '#FFFFFF',
  },

  // Borders & Dividers
  border: {
    DEFAULT: '#E5E7EB', // Gray 200
    focused: '#0284C7',
    subtle: '#F3F4F6',
  },

  // Semantic & Feedback Statuses
  status: {
    success: {
      text: '#065F46',
      bg: '#D1FAE5',
      border: '#A7F3D0',
      dot: '#10B981',
    },
    warning: {
      text: '#92400E',
      bg: '#FEF3C7',
      border: '#FDE68A',
      dot: '#F59E0B',
    },
    danger: {
      text: '#991B1B',
      bg: '#FEE2E2',
      border: '#FECACA',
      dot: '#EF4444',
    },
    info: {
      text: '#1E40AF',
      bg: '#DBEAFE',
      border: '#BFDBFE',
      dot: '#3B82F6',
    },
    neutral: {
      text: '#374151',
      bg: '#F3F4F6',
      border: '#E5E7EB',
      dot: '#9CA3AF',
    },
  },
} as const;

export type ColorScheme = typeof Colors;
