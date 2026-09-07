/**
 * Change Password Modal (Ganti Kata Sandi Berkala)
 * Clean Minimalist UI
 */

import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Lock, Eye, EyeOff, AlertCircle, KeyRound, CheckCircle2 } from 'lucide-react-native';

import { Colors, Spacing, BorderRadius, Typography } from '../../../core/theme';
import { Button, Input } from '../../components/common';
import {
  changePasswordSchema,
  ChangePasswordFormData,
} from '../../../domain/validation/auth_schemas';
import { useChangePassword } from '../../hooks/useProfile';

export interface ChangePasswordModalProps {
  visible: boolean;
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  visible,
  onClose,
}) => {
  const { changePassword, isChanging } = useChangePassword();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      current_password: '',
      password: '',
      password_confirmation: '',
    },
  });

  const newPasswordValue = watch('password') || '';
  const hasMinLength = newPasswordValue.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(newPasswordValue);
  const hasNumber = /[0-9]/.test(newPasswordValue);

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      setErrorMessage(null);
      await changePassword({
        current_password: data.current_password,
        password: data.password,
        password_confirmation: data.password_confirmation,
      });

      Alert.alert(
        'Kata Sandi Diperbarui',
        'Kata sandi akun Anda berhasil diganti.',
        [
          {
            text: 'OK',
            onPress: () => {
              reset();
              onClose();
            },
          },
        ]
      );
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : 'Gagal memperbarui kata sandi akun.';
      setErrorMessage(msg);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : 'overFullScreen'}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        {/* Header */}
        <View style={styles.modalHeader}>
          <View style={styles.modalHeaderLeft}>
            <Text style={styles.modalTitle}>Ganti Kata Sandi</Text>
            <Text style={styles.modalSubtitle}>
              Perbarui kata sandi akun secara berkala demi keamanan.
            </Text>
          </View>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <X size={20} color={Colors.text.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {errorMessage && (
            <View style={styles.errorBanner}>
              <AlertCircle size={16} color={Colors.status.danger.dot} />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}

          {/* Current Password */}
          <Controller
            control={control}
            name="current_password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Kata Sandi Saat Ini"
                placeholder="Masukkan kata sandi lama Anda"
                secureTextEntry={!showCurrentPassword}
                autoCapitalize="none"
                autoCorrect={false}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.current_password?.message}
                leftAccessory={
                  <Lock size={18} color={Colors.text.muted} strokeWidth={1.75} />
                }
                rightAccessory={
                  <TouchableOpacity
                    onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    {showCurrentPassword ? (
                      <EyeOff size={18} color={Colors.text.muted} strokeWidth={1.75} />
                    ) : (
                      <Eye size={18} color={Colors.text.muted} strokeWidth={1.75} />
                    )}
                  </TouchableOpacity>
                }
              />
            )}
          />

          {/* New Password */}
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Kata Sandi Baru"
                placeholder="Minimal 8 karakter (huruf & angka)"
                secureTextEntry={!showNewPassword}
                autoCapitalize="none"
                autoCorrect={false}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
                leftAccessory={
                  <KeyRound size={18} color={Colors.text.muted} strokeWidth={1.75} />
                }
                rightAccessory={
                  <TouchableOpacity
                    onPress={() => setShowNewPassword(!showNewPassword)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    {showNewPassword ? (
                      <EyeOff size={18} color={Colors.text.muted} strokeWidth={1.75} />
                    ) : (
                      <Eye size={18} color={Colors.text.muted} strokeWidth={1.75} />
                    )}
                  </TouchableOpacity>
                }
              />
            )}
          />

          {/* Password checklist */}
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

          {/* Confirm Password */}
          <Controller
            control={control}
            name="password_confirmation"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Konfirmasi Kata Sandi Baru"
                placeholder="Ulangi kata sandi baru Anda"
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
            title="Simpan Kata Sandi Baru"
            onPress={handleSubmit(onSubmit)}
            loading={isChanging}
            fullWidth
            style={styles.submitButton}
          />
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background.app,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingTop: Platform.OS === 'ios' ? Spacing['2xl'] : Spacing.xl,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.background.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.DEFAULT,
  },
  modalHeaderLeft: {
    flex: 1,
  },
  modalTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  modalSubtitle: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background.subtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: Spacing.base,
    paddingBottom: Spacing['4xl'],
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
  errorText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.status.danger.text,
    flex: 1,
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
    marginTop: Spacing.md,
  },
});
