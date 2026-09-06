/**
 * Clean Minimalist Card Component
 */

import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TouchableOpacityProps,
} from 'react-native';
import { Colors, BorderRadius, Spacing, Shadows } from '../../../core/theme';

export interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: TouchableOpacityProps['onPress'];
  variant?: 'elevated' | 'outlined' | 'flat';
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  variant = 'outlined',
}) => {
  const getCardStyle = (): ViewStyle[] => {
    const list: ViewStyle[] = [styles.base];

    if (variant === 'elevated') {
      list.push(styles.elevated);
    } else if (variant === 'outlined') {
      list.push(styles.outlined);
    } else if (variant === 'flat') {
      list.push(styles.flat);
    }

    if (style) list.push(style);
    return list;
  };

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        style={getCardStyle()}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={getCardStyle()}>{children}</View>;
};

const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.base,
    padding: Spacing.base,
  },
  outlined: {
    backgroundColor: Colors.background.surface,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
    ...Shadows.subtle,
  },
  elevated: {
    backgroundColor: Colors.background.surface,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
    ...Shadows.card,
  },
  flat: {
    backgroundColor: Colors.background.subtle,
  },
});
