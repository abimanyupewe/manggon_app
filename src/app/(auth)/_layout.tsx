/**
 * Auth Layout
 */

import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen
        name="force-change-password"
        options={{
          gestureEnabled: false,
        }}
      />
    </Stack>
  );
}
