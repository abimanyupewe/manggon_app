/**
 * SafeScreen - Wrapper component that applies safe area insets
 * Ensures content is not obscured by status bar, notch, or navigation bar
 */

import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../core/theme';

interface SafeScreenProps {
  /** Child content to render within safe boundaries */
  children: React.ReactNode;
  /** Optional custom styles to apply to the container */
  style?: StyleProp<ViewStyle>;
  /** Whether to apply top inset (default: true) */
  applyTop?: boolean;
  /** Whether to apply bottom inset (default: false — handled by tab bar) */
  applyBottom?: boolean;
  /** Background color override */
  backgroundColor?: string;
}

export const SafeScreen: React.FC<SafeScreenProps> = ({
  children,
  style,
  applyTop = true,
  applyBottom = false,
  backgroundColor = Colors.background.app,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor,
          paddingTop: applyTop ? insets.top : 0,
          paddingBottom: applyBottom ? insets.bottom : 0,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
