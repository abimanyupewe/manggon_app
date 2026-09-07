/**
 * Login Screen - Tenant Authentication
 * Clean Minimalist UI
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Lock, Eye, EyeOff, ShieldCheck, AlertCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';

import { Colors, Spacing, BorderRadius, Typography } from '../../../core/theme';
import { Button, Input, Card } from '../../components/common';
import { loginSchema, LoginFormData } from '../../../domain/validation/auth_schemas';
import { useAuth } from '../../hooks/useAuth';

export const LoginScreen: React.FC = () => {
  const router = useRouter();
  const { login, isSubmitting, authError, setAuthError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setAuthError(null);
      const result = await login({
        email: data.email,
        password: data.password,
      });

      if (result?.type === 'MUST_CHANGE_PASSWORD') {
        router.replace('/(auth)/force-change-password');
      } else if (result?.type === 'SUCCESS') {
        router.replace('/');
      }
    } catch {
      // Error handled in useAuth
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSection}>
          <View style={styles.logoBadge}>
            <ShieldCheck size={32} color={Colors.primary.DEFAULT} strokeWidth={2} />
          </View>
          <Text style={styles.brandTitle}>MANGGON</Text>
          <Text style={styles.brandSubtitle}>Portal Anak Kos Putri</Text>
          <Text style={styles.brandTagline}>
            Manajemen Kos Putri Multi-Lokasi, Aman, dan Transparan.
          </Text>
        </View>

        <Card variant="elevated" style={styles.formCard}>
          <Text style={styles.formTitle}>Masuk ke Akun</Text>
          <Text style={styles.formDescription}>
            Gunakan username (huruf kecil) atau email terdaftar Anda.
          </Text>

          {authError && (
            <View style={styles.errorBanner}>
              <AlertCircle size={18} color={Colors.status.danger.dot} />
              <Text style={styles.errorBannerText}>{authError}</Text>
            </View>
          )}

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Username / Email"
                placeholder="Contoh: panda_a01"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                value={value}
                onChangeText={(val) => onChange(val.toLowerCase().trim())}
                onBlur={onBlur}
                error={errors.email?.message}
                leftAccessory={
                  <User size={18} color={Colors.text.muted} strokeWidth={1.75} />
                }
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Kata Sandi"
                placeholder="Masukkan kata sandi akun"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
                leftAccessory={
                  <Lock size={18} color={Colors.text.muted} strokeWidth={1.75} />
                }
                rightAccessory={
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    {showPassword ? (
                      <EyeOff size={18} color={Colors.text.muted} strokeWidth={1.75} />
                    ) : (
                      <Eye size={18} color={Colors.text.muted} strokeWidth={1.75} />
                    )}
                  </TouchableOpacity>
                }
              />
            )}
          />

          <Button
            title="Masuk ke Akun"
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
            fullWidth
            style={styles.submitButton}
          />
        </Card>

        <View style={styles.footerNote}>
          <Text style={styles.footerNoteText}>
            Akun tenant dibuat otomatis oleh pengelola kos. Hubungi pengelola cabang jika Anda belum menerima kredensial akun.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: Colors.background.app,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing['3xl'],
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: Spacing['2xl'],
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.primary.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  brandTitle: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700',
    color: Colors.text.primary,
    letterSpacing: 1.5,
  },
  brandSubtitle: {
    fontSize: Typography.fontSize.sm,
    lineHeight: Typography.lineHeight.sm,
    fontWeight: '600',
    color: Colors.primary.DEFAULT,
    marginTop: Spacing.xxs,
  },
  brandTagline: {
    fontSize: Typography.fontSize.xs,
    lineHeight: Typography.lineHeight.xs + 4,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginTop: Spacing.xs,
    maxWidth: 280,
  },
  formCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
  },
  formTitle: {
    fontSize: Typography.fontSize.lg,
    lineHeight: Typography.lineHeight.lg,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: Spacing.xxs,
  },
  formDescription: {
    fontSize: Typography.fontSize.xs,
    lineHeight: Typography.lineHeight.xs + 2,
    color: Colors.text.secondary,
    marginBottom: Spacing.lg,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.status.danger.bg,
    borderColor: Colors.status.danger.border,
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
    gap: Spacing.xs,
  },
  errorBannerText: {
    flex: 1,
    fontSize: Typography.fontSize.xs,
    lineHeight: Typography.lineHeight.xs + 2,
    color: Colors.status.danger.text,
    fontWeight: '500',
  },
  submitButton: {
    marginTop: Spacing.xs,
  },
  footerNote: {
    marginTop: Spacing.xl,
    alignItems: 'center',
  },
  footerNoteText: {
    fontSize: Typography.fontSize.xs,
    lineHeight: Typography.lineHeight.xs + 4,
    color: Colors.text.muted,
    textAlign: 'center',
    maxWidth: 320,
  },
});
