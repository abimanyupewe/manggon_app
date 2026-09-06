/**
 * Clean Minimalist Button Component
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { Colors, BorderRadius, Spacing, Typography } from '../../../core/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  disabled,
  style,
  textStyle,
  ...rest
}) => {
  const isDisabled = disabled || loading;

  const getContainerStyle = (): ViewStyle[] => {
    const list: ViewStyle[] = [styles.base];

    // Size
    if (size === 'sm') list.push(styles.sizeSm);
    if (size === 'md') list.push(styles.sizeMd);
    if (size === 'lg') list.push(styles.sizeLg);

    // Variant
    if (variant === 'primary') list.push(styles.primary);
    if (variant === 'secondary') list.push(styles.secondary);
    if (variant === 'outline') list.push(styles.outline);
    if (variant === 'ghost') list.push(styles.ghost);
    if (variant === 'danger') list.push(styles.danger);

    // Modifiers
    if (fullWidth) list.push(styles.fullWidth);
    if (isDisabled) list.push(styles.disabled);
    if (style) list.push(style);

    return list;
  };

  const getTextStyle = (): TextStyle[] => {
    const list: TextStyle[] = [styles.textBase];

    // Size
    if (size === 'sm') list.push(styles.textSm);
    if (size === 'md') list.push(styles.textMd);
    if (size === 'lg') list.push(styles.textLg);

    // Variant
    if (variant === 'primary') list.push(styles.textPrimary);
    if (variant === 'secondary') list.push(styles.textSecondary);
    if (variant === 'outline') list.push(styles.textOutline);
    if (variant === 'ghost') list.push(styles.textGhost);
    if (variant === 'danger') list.push(styles.textDanger);

    if (isDisabled) list.push(styles.textDisabled);
    if (textStyle) list.push(textStyle);

    return list;
  };

  const getSpinnerColor = (): string => {
    if (variant === 'primary' || variant === 'danger') return '#FFFFFF';
    if (variant === 'secondary') return Colors.primary.DEFAULT;
    return Colors.text.primary;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={isDisabled}
      style={getContainerStyle()}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getSpinnerColor()} />
      ) : (
        <>
          {leftIcon && <>{leftIcon}</>}
          <Text style={getTextStyle()}>{title}</Text>
          {rightIcon && <>{rightIcon}</>}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.base,
    gap: Spacing.sm,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },

  // Sizes
  sizeSm: {
    paddingVertical: Spacing.xs + 2,
    paddingHorizontal: Spacing.md,
    minHeight: 36,
  },
  sizeMd: {
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.base,
    minHeight: 46,
  },
  sizeLg: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    minHeight: 52,
  },

  // Variants
  primary: {
    backgroundColor: Colors.primary.DEFAULT,
  },
  secondary: {
    backgroundColor: Colors.primary.light,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  danger: {
    backgroundColor: Colors.status.danger.dot,
  },

  // Typography
  textBase: {
    fontFamily: Typography.fontFamily.medium,
    textAlign: 'center',
  },
  textSm: {
    fontSize: Typography.fontSize.sm,
    lineHeight: Typography.lineHeight.sm,
  },
  textMd: {
    fontSize: Typography.fontSize.base,
    lineHeight: Typography.lineHeight.base,
    fontWeight: '600',
  },
  textLg: {
    fontSize: Typography.fontSize.lg,
    lineHeight: Typography.lineHeight.lg,
    fontWeight: '600',
  },

  textPrimary: {
    color: Colors.text.inverse,
  },
  textSecondary: {
    color: Colors.primary.dark,
  },
  textOutline: {
    color: Colors.text.primary,
  },
  textGhost: {
    color: Colors.primary.DEFAULT,
  },
  textDanger: {
    color: Colors.text.inverse,
  },
  textDisabled: {
    color: Colors.text.muted,
  },
});
