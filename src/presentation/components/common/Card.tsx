/**
 * Clean Minimalist Card Component
 */

import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  StyleProp,
  TouchableOpacityProps,
} from 'react-native';
import { Colors, BorderRadius, Spacing, Shadows } from '../../../core/theme';

export interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: TouchableOpacityProps['onPress'];
  variant?: 'elevated' | 'outlined' | 'flat';
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  variant = 'outlined',
}) => {
  const getCardStyle = (): StyleProp<ViewStyle> => {
    return [
      styles.base,
      variant === 'elevated' && styles.elevated,
      variant === 'outlined' && styles.outlined,
      variant === 'flat' && styles.flat,
      style,
    ];
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
