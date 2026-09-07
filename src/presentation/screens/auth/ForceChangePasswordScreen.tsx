/**
 * Force Change Password Screen
 * Mandatory password update for first-time login
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { KeyRound, Lock, Eye, EyeOff, AlertTriangle, CheckCircle2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';

import { Colors, Spacing, BorderRadius, Typography } from '../../../core/theme';
import { Button, Input, Card } from '../../components/common';
import {
  forceChangePasswordSchema,
  ForceChangePasswordFormData,
} from '../../../domain/validation/auth_schemas';
import { useAuth } from '../../hooks/useAuth';

export const ForceChangePasswordScreen: React.FC = () => {
  const router = useRouter();
  const { forceChangePassword, isSubmitting, authError, setAuthError } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Prevent hardware back button on Android
  useEffect(() => {
    const backAction = () => {
      // Return true to prevent default back action
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, []);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ForceChangePasswordFormData>({
    resolver: zodResolver(forceChangePasswordSchema),
    defaultValues: {
      password: '',
      password_confirmation: '',
    },
  });

  const passwordValue = watch('password');
  const hasMinLength = passwordValue.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(passwordValue);
  const hasNumber = /[0-9]/.test(passwordValue);

  const onSubmit = async (data: ForceChangePasswordFormData) => {
    try {
      setAuthError(null);
      await forceChangePassword(data.password, data.password_confirmation);
      router.replace('/');
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
          <View style={styles.iconContainer}>
            <KeyRound size={32} color={Colors.primary.DEFAULT} strokeWidth={2} />
          </View>
          <Text style={styles.title}>Ganti Kata Sandi Perdana</Text>
          <Text style={styles.subtitle}>
            Akun Anda masih menggunakan kata sandi bawaan sistem. Demi keamanan dan privasi kamar kos Anda, wajib membuat kata sandi baru sebelum masuk.
          </Text>
        </View>

        <Card variant="elevated" style={styles.formCard}>
          {authError && (
            <View style={styles.errorBanner}>
              <AlertTriangle size={18} color={Colors.status.danger.dot} />
              <Text style={styles.errorBannerText}>{authError}</Text>
            </View>
          )}

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Kata Sandi Baru"
                placeholder="Minimal 8 karakter (huruf & angka)"
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

          {/* Password requirement checklist */}
          <View style={styles.requirementContainer}>
            <View style={styles.requirementItem}>
              <CheckCircle2
                size={14}
                color={hasMinLength ? Colors.status.success.dot : Colors.text.muted}
              />
              <Text
                style={[
                  styles.requirementText,
                  hasMinLength && styles.requirementTextActive,
                ]}
              >
                Minimal 8 karakter
              </Text>
            </View>
            <View style={styles.requirementItem}>
              <CheckCircle2
                size={14}
                color={hasLetter ? Colors.status.success.dot : Colors.text.muted}
              />
              <Text
                style={[
                  styles.requirementText,
                  hasLetter && styles.requirementTextActive,
                ]}
              >
                Mengandung huruf
              </Text>
            </View>
            <View style={styles.requirementItem}>
              <CheckCircle2
                size={14}
                color={hasNumber ? Colors.status.success.dot : Colors.text.muted}
              />
              <Text
                style={[
                  styles.requirementText,
                  hasNumber && styles.requirementTextActive,
                ]}
              >
                Mengandung angka
              </Text>
            </View>
          </View>

          <Controller
            control={control}
            name="password_confirmation"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Konfirmasi Kata Sandi Baru"
                placeholder="Ulangi kata sandi baru"
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password_confirmation?.message}
                leftAccessory={
                  <Lock size={18} color={Colors.text.muted} strokeWidth={1.75} />
                }
                rightAccessory={
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    {showConfirmPassword ? (
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
            title="Simpan & Lanjutkan ke Beranda"
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
            fullWidth
            style={styles.submitButton}
          />
        </Card>
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
    marginBottom: Spacing.xl,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.primary.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: Typography.fontSize.xl,
    lineHeight: Typography.lineHeight.xl,
    fontWeight: '700',
    color: Colors.text.primary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Typography.fontSize.xs,
    lineHeight: Typography.lineHeight.xs + 4,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginTop: Spacing.xs,
    maxWidth: 320,
  },
  formCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
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
  requirementContainer: {
    backgroundColor: Colors.background.subtle,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    marginBottom: Spacing.base,
    gap: Spacing.xs,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  requirementText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.muted,
  },
  requirementTextActive: {
    color: Colors.status.success.text,
    fontWeight: '500',
  },
  submitButton: {
    marginTop: Spacing.sm,
  },
});
