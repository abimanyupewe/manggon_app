/**
 * Edit Emergency Contact Modal
 * Clean Minimalist UI
 */

import React, { useState, useEffect } from 'react';
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
import { X, Phone, User, HeartHandshake, AlertCircle, Save } from 'lucide-react-native';

import { Colors, Spacing, BorderRadius, Typography } from '../../../core/theme';
import { Button, Input, Card } from '../../components/common';
import { TenantUser } from '../../../domain/models/user';
import {
  updateProfileSchema,
  UpdateProfileFormData,
} from '../../../domain/validation/profile_schemas';
import { useUpdateProfile } from '../../hooks/useProfile';

export interface EditEmergencyContactModalProps {
  visible: boolean;
  user: TenantUser | null;
  onClose: () => void;
}

export const EditEmergencyContactModal: React.FC<EditEmergencyContactModalProps> = ({
  visible,
  user,
  onClose,
}) => {
  const { updateProfile, isUpdating } = useUpdateProfile();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      phone_number: user?.phone_number || '',
      emergency_contact_name: user?.profile?.emergency_contact_name || '',
      emergency_contact_phone: user?.profile?.emergency_contact_phone || '',
      emergency_contact_relation: user?.profile?.emergency_contact_relation || '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        phone_number: user.phone_number || '',
        emergency_contact_name: user.profile?.emergency_contact_name || '',
        emergency_contact_phone: user.profile?.emergency_contact_phone || '',
        emergency_contact_relation: user.profile?.emergency_contact_relation || '',
      });
    }
  }, [user, reset]);

  const relationPresets = [
    'Ibu Kandung',
    'Ayah Kandung',
    'Wali',
    'Kakak Kandung',
  ];

  const onSubmit = async (data: UpdateProfileFormData) => {
    try {
      setErrorMessage(null);
      await updateProfile({
        phone_number: data.phone_number.trim(),
        emergency_contact_name: data.emergency_contact_name.trim(),
        emergency_contact_phone: data.emergency_contact_phone.trim(),
        emergency_contact_relation: data.emergency_contact_relation.trim(),
      });

      Alert.alert(
        'Pembaruan Berhasil',
        'Data nomor telepon dan kontak darurat Anda telah berhasil diperbarui.',
        [{ text: 'OK', onPress: onClose }]
      );
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : 'Gagal memperbarui data profil.';
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
            <Text style={styles.modalTitle}>Kontak & Data Darurat</Text>
            <Text style={styles.modalSubtitle}>
              Pembaruan nomor ponsel dan kontak orang tua/wali.
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

          {/* Tenant Phone Number */}
          <Controller
            control={control}
            name="phone_number"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Nomor HP Aktif Tenant"
                placeholder="Contoh: 081298765432"
                keyboardType="phone-pad"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.phone_number?.message}
                leftAccessory={
                  <Phone size={18} color={Colors.text.muted} strokeWidth={1.75} />
                }
                helperText="Digunakan staf cabang untuk koordinasi darurat."
              />
            )}
          />

          <Card variant="flat" style={styles.sectionDividerCard}>
            <Text style={styles.sectionDividerTitle}>Informasi Kontak Darurat</Text>
            <Text style={styles.sectionDividerDesc}>
              Wajib diisi dengan kontak orang tua atau keluarga terdekat.
            </Text>
          </Card>

          {/* Emergency Contact Name */}
          <Controller
            control={control}
            name="emergency_contact_name"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Nama Kontak Darurat"
                placeholder="Contoh: Bapak Bambang"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.emergency_contact_name?.message}
                leftAccessory={
                  <User size={18} color={Colors.text.muted} strokeWidth={1.75} />
                }
              />
            )}
          />

          {/* Emergency Contact Phone */}
          <Controller
            control={control}
            name="emergency_contact_phone"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Nomor HP Kontak Darurat"
                placeholder="Contoh: 081122334455"
                keyboardType="phone-pad"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.emergency_contact_phone?.message}
                leftAccessory={
                  <Phone size={18} color={Colors.text.muted} strokeWidth={1.75} />
                }
              />
            )}
          />

          {/* Emergency Contact Relation */}
          <Controller
            control={control}
            name="emergency_contact_relation"
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <Input
                  label="Hubungan Keluarga / Relasi"
                  placeholder="Contoh: Orang Tua (Ayah)"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.emergency_contact_relation?.message}
                  leftAccessory={
                    <HeartHandshake
                      size={18}
                      color={Colors.text.muted}
                      strokeWidth={1.75}
                    />
                  }
                />
                <View style={styles.presetRow}>
                  {relationPresets.map((preset) => (
                    <TouchableOpacity
                      key={preset}
                      style={styles.presetChip}
                      onPress={() =>
                        setValue('emergency_contact_relation', preset, {
                          shouldValidate: true,
                        })
                      }
                    >
                      <Text style={styles.presetChipText}>{preset}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          />

          <Button
            title="Simpan Perubahan"
            leftIcon={<Save size={16} color="#FFFFFF" />}
            onPress={handleSubmit(onSubmit)}
            loading={isUpdating}
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
  sectionDividerCard: {
    padding: Spacing.sm,
    marginBottom: Spacing.base,
    backgroundColor: Colors.background.surface,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
  },
  sectionDividerTitle: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  sectionDividerDesc: {
    fontSize: Typography.fontSize.xs - 1,
    color: Colors.text.muted,
    marginTop: 2,
  },
  presetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginTop: -Spacing.xs,
    marginBottom: Spacing.lg,
  },
  presetChip: {
    backgroundColor: Colors.background.subtle,
    paddingVertical: Spacing.xxs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
  },
  presetChipText: {
    fontSize: Typography.fontSize.xs - 1,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  submitButton: {
    marginTop: Spacing.md,
  },
});
