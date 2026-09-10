/**
 * Bottom Tabs Navigation Layout
 * Clean Minimalist UI with Lucide Icons
 */

import React from 'react';
import { Tabs } from 'expo-router';
import { Home, Receipt, ShieldCheck, Wrench, User } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../core/theme';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary.DEFAULT,
        tabBarInactiveTintColor: Colors.text.muted,
        tabBarStyle: {
          backgroundColor: Colors.background.surface,
          borderTopColor: Colors.border.DEFAULT,
          borderTopWidth: 1,
          height: 56 + insets.bottom,
          paddingBottom: insets.bottom + 4,
          paddingTop: 8,
          elevation: 4,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Beranda',
          tabBarIcon: ({ color, size }) => (
            <Home size={size - 2} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="bills"
        options={{
          title: 'Tagihan',
          tabBarIcon: ({ color, size }) => (
            <Receipt size={size - 2} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="security"
        options={{
          title: 'Satpam',
          tabBarIcon: ({ color, size }) => (
            <ShieldCheck size={size - 2} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="complaints"
        options={{
          title: 'Keluhan',
          tabBarIcon: ({ color, size }) => (
            <Wrench size={size - 2} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => (
            <User size={size - 2} color={color} strokeWidth={2} />
          ),
        }}
      />
    </Tabs>
  );
}

