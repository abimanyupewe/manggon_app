/**
 * Clean Minimalist TextInput Component
 */

import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Colors, BorderRadius, Spacing, Typography } from '../../../core/theme';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftAccessory?: React.ReactNode;
  rightAccessory?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftAccessory,
  rightAccessory,
  containerStyle,
  inputStyle,
  onFocus,
  onBlur,
  editable = true,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const getBorderColor = (): string => {
    if (error) return Colors.status.danger.dot;
    if (isFocused) return Colors.primary.DEFAULT;
    return Colors.border.DEFAULT;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          { borderColor: getBorderColor() },
          !editable && styles.disabled,
          isFocused && styles.focused,
        ]}
      >
        {leftAccessory && <View style={styles.accessoryLeft}>{leftAccessory}</View>}
        <TextInput
          style={[styles.input, inputStyle]}
          placeholderTextColor={Colors.text.muted}
          editable={editable}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />
        {rightAccessory && <View style={styles.accessoryRight}>{rightAccessory}</View>}
      </View>
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: Spacing.base,
  },
  label: {
    fontSize: Typography.fontSize.sm,
    lineHeight: Typography.lineHeight.sm,
    fontWeight: '500',
    color: Colors.text.primary,
    marginBottom: Spacing.xs + 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.surface,
    borderWidth: 1,
    borderRadius: BorderRadius.base,
    minHeight: 48,
    paddingHorizontal: Spacing.md,
  },
  focused: {
    backgroundColor: Colors.background.surface,
  },
  disabled: {
    backgroundColor: Colors.background.subtle,
    opacity: 0.7,
  },
  input: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
    paddingVertical: Spacing.sm,
  },
  accessoryLeft: {
    marginRight: Spacing.sm,
  },
  accessoryRight: {
    marginLeft: Spacing.sm,
  },
  errorText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.status.danger.dot,
    marginTop: Spacing.xs,
    fontWeight: '500',
  },
  helperText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
  },
});
