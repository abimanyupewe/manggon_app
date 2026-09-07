/**
 * Profile Screen (Ready for Phase 6, with Logout functionality)
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Typography } from '../../../core/theme';
import { Card, Button } from '../../components/common';
import { useAuth } from '../../hooks/useAuth';

export const ProfileScreen: React.FC = () => {
  const router = useRouter();
  const { user, logout, isSubmitting } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Konfirmasi Keluar',
      'Apakah Anda yakin ingin keluar dari aplikasi Manggon?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Keluar',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Profil & Pengaturan</Text>
      <Text style={styles.subtitle}>Informasi sewa kamar dan data kontak darurat.</Text>

      <Card variant="outlined" style={styles.card}>
        <Text style={styles.tenantName}>{user?.name || 'Anak Kos'}</Text>
        <Text style={styles.tenantMeta}>
          Username: {user?.username} • Kamar {user?.room?.room_number || '-'}
        </Text>
        <Text style={styles.propertyInfo}>
          {user?.property?.name || 'Kos Putri Manggon'}
        </Text>
      </Card>

      <Button
        title="Keluar dari Akun"
        variant="danger"
        onPress={handleLogout}
        loading={isSubmitting}
        style={styles.logoutButton}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.app,
  },
  content: {
    padding: Spacing.base,
    paddingTop: Spacing.xl,
  },
  title: {
    fontSize: Typography.fontSize.xl,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  subtitle: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  card: {
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  tenantName: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  tenantMeta: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginTop: Spacing.xxs,
  },
  propertyInfo: {
    fontSize: Typography.fontSize.xs,
    color: Colors.primary.DEFAULT,
    fontWeight: '600',
    marginTop: Spacing.xs,
  },
  logoutButton: {
    marginTop: Spacing.md,
  },
});
