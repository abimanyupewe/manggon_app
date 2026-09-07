/**
 * Root Layout & Authentication Routing Guard
 */

import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

import { QueryProvider } from '../presentation/providers/QueryProvider';
import { useAuthStore } from '../presentation/store/auth_store';
import { LoadingIndicator } from '../presentation/components/common';

SplashScreen.preventAutoHideAsync();

function AuthGuardNavigator() {
  const router = useRouter();
  const segments = useSegments() as unknown as string[];
  const { isAuthenticated, mustChangePassword, isLoading, initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (isLoading) return;

    // Hide native splash screen once initial auth check is finished
    SplashScreen.hideAsync().catch(() => {});

    const inAuthGroup = segments[0] === '(auth)';

    if (mustChangePassword) {
      // Must stay on force-change-password screen until resolved
      if (segments[1] !== 'force-change-password') {
        router.replace('/(auth)/force-change-password');
      }
    } else if (!isAuthenticated) {
      // Unauthenticated users must be redirected to login
      if (!inAuthGroup) {
        router.replace('/(auth)/login');
      }
    } else if (inAuthGroup) {
      // Authenticated users should not be inside (auth) screens
      router.replace('/');
    }
  }, [isAuthenticated, mustChangePassword, isLoading, segments, router]);

  if (isLoading) {
    return <LoadingIndicator fullScreen message="Memuat Manggon Mobile..." />;
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      >
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="explore" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <QueryProvider>
      <AuthGuardNavigator />
    </QueryProvider>
  );
}
