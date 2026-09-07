/**
 * Create Security Log Modal (Formulir Pengajuan Izin Satpam Digital)
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
import {
  X,
  Clock,
  Users,
  Calendar,
  AlertCircle,
  ShieldCheck,
  Send,
} from 'lucide-react-native';

import { Colors, Spacing, BorderRadius, Typography } from '../../../core/theme';
import { Button, Input, Card } from '../../components/common';
import { SecurityLogType } from '../../../domain/models/security_log';
import {
  createSecurityLogSchema,
  CreateSecurityLogFormData,
} from '../../../domain/validation/security_schemas';
import { useCreateSecurityLog } from '../../hooks/useSecurity';

export interface CreateSecurityLogModalProps {
  visible: boolean;
  onClose: () => void;
}

export const CreateSecurityLogModal: React.FC<CreateSecurityLogModalProps> = ({
  visible,
  onClose,
}) => {
  const { createSecurityLog, isSubmitting } = useCreateSecurityLog();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const getTodayString = (): string => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const getTomorrowString = (): string => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateSecurityLogFormData>({
    resolver: zodResolver(createSecurityLogSchema),
    defaultValues: {
      type: 'late_return',
      date: getTodayString(),
      planned_time: '',
      guest_name: '',
      notes: '',
    },
  });

  const selectedType = watch('type');

  const handleSelectType = (type: SecurityLogType) => {
    setValue('type', type);
    if (type === 'late_return') {
      setValue('guest_name', '');
    }
  };

  const onSubmit = async (data: CreateSecurityLogFormData) => {
    try {
      setErrorMessage(null);
      await createSecurityLog({
        type: data.type,
        date: data.date,
        planned_time: data.planned_time.trim(),
        guest_name: data.guest_name ? data.guest_name.trim() : undefined,
        notes: data.notes ? data.notes.trim() : undefined,
      });

      Alert.alert(
        'Pengajuan Berhasil',
        'Permohonan izin Anda berhasil dikirim ke staf cabang untuk verifikasi.',
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
        error instanceof Error ? error.message : 'Gagal mengirimkan pengajuan izin.';
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
            <Text style={styles.modalTitle}>Pengajuan Izin Satpam</Text>
            <Text style={styles.modalSubtitle}>
              Izin pulang malam dan buku tamu digital kos putri.
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
          {/* Segmented Type Selector */}
          <View style={styles.typeSelectorContainer}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleSelectType('late_return')}
              style={[
                styles.typeOption,
                selectedType === 'late_return' && styles.typeOptionActive,
              ]}
            >
              <Clock
                size={18}
                color={
                  selectedType === 'late_return'
                    ? Colors.primary.DEFAULT
                    : Colors.text.muted
                }
              />
              <Text
                style={[
                  styles.typeOptionText,
                  selectedType === 'late_return' && styles.typeOptionTextActive,
                ]}
              >
                Izin Pulang Malam
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleSelectType('guest_visit')}
              style={[
                styles.typeOption,
                selectedType === 'guest_visit' && styles.typeOptionActive,
              ]}
            >
              <Users
                size={18}
                color={
                  selectedType === 'guest_visit'
                    ? Colors.primary.DEFAULT
                    : Colors.text.muted
                }
              />
              <Text
                style={[
                  styles.typeOptionText,
                  selectedType === 'guest_visit' && styles.typeOptionTextActive,
                ]}
              >
                Tamu Menginap
              </Text>
            </TouchableOpacity>
          </View>

          {/* Context Notice Card */}
          <Card variant="flat" style={styles.noticeCard}>
            <View style={styles.noticeRow}>
              <ShieldCheck size={16} color={Colors.primary.DEFAULT} />
              <Text style={styles.noticeText}>
                {selectedType === 'late_return'
                  ? 'Gunakan formulir ini jika Anda berencana pulang melewati batas jam malam resmi cabang.'
                  : 'Ketentuan Kos Putri: Tamu menginap wajib sesama wanita atau keluarga kandung yang sah.'}
              </Text>
            </View>
          </Card>

          {errorMessage && (
            <View style={styles.errorBanner}>
              <AlertCircle size={16} color={Colors.status.danger.dot} />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}

          {/* Date Input */}
          <Controller
            control={control}
            name="date"
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <Input
                  label="Tanggal Izin (YYYY-MM-DD)"
                  placeholder="Contoh: 2026-09-07"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.date?.message}
                  leftAccessory={
                    <Calendar size={18} color={Colors.text.muted} strokeWidth={1.75} />
                  }
                />
                <View style={styles.quickDatePills}>
                  <TouchableOpacity
                    style={styles.datePill}
                    onPress={() => setValue('date', getTodayString())}
                  >
                    <Text style={styles.datePillText}>Hari Ini</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.datePill}
                    onPress={() => setValue('date', getTomorrowString())}
                  >
                    <Text style={styles.datePillText}>Besok</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />

          {/* Planned Time Input */}
          <Controller
            control={control}
            name="planned_time"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.fieldWrapper}>
                <Input
                  label="Rencana Jam Tiba / Jam Berkunjung"
                  placeholder={
                    selectedType === 'late_return'
                      ? 'Contoh: 23:30 WIB'
                      : 'Contoh: 19:00 - 08:00 WIB'
                  }
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.planned_time?.message}
                  leftAccessory={
                    <Clock size={18} color={Colors.text.muted} strokeWidth={1.75} />
                  }
                />
                {selectedType === 'late_return' && (
                  <View style={styles.quickDatePills}>
                    <TouchableOpacity
                      style={styles.datePill}
                      onPress={() => setValue('planned_time', '22:30 WIB')}
                    >
                      <Text style={styles.datePillText}>22:30 WIB</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.datePill}
                      onPress={() => setValue('planned_time', '23:00 WIB')}
                    >
                      <Text style={styles.datePillText}>23:00 WIB</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.datePill}
                      onPress={() => setValue('planned_time', '23:45 WIB')}
                    >
                      <Text style={styles.datePillText}>23:45 WIB</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
          />

          {/* Conditional Guest Name for guest_visit */}
          {selectedType === 'guest_visit' && (
            <Controller
              control={control}
              name="guest_name"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Nama Tamu Wanita & Relasi"
                  placeholder="Contoh: Rina Lestari (Adik Kandung)"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.guest_name?.message}
                  leftAccessory={
                    <Users size={18} color={Colors.text.muted} strokeWidth={1.75} />
                  }
                  helperText="Khusus wanita (saudari kandung, ibu, atau teman wanita)."
                />
              )}
            />
          )}

          {/* Notes Input */}
          <Controller
            control={control}
            name="notes"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Alasan / Keterangan Izin"
                placeholder={
                  selectedType === 'late_return'
                    ? 'Contoh: Kerja kelompok tugas akhir di kampus B'
                    : 'Contoh: Menginap selama libur akhir pekan'
                }
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                multiline
                numberOfLines={3}
                inputStyle={styles.notesTextArea}
              />
            )}
          />

          <Button
            title="Kirim Pengajuan Izin"
            leftIcon={<Send size={16} color="#FFFFFF" />}
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
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
  typeSelectorContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  typeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background.surface,
    borderRadius: BorderRadius.base,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
  },
  typeOptionActive: {
    backgroundColor: Colors.primary.light,
    borderColor: Colors.primary.DEFAULT,
  },
  typeOptionText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  typeOptionTextActive: {
    color: Colors.primary.dark,
    fontWeight: '700',
  },
  noticeCard: {
    padding: Spacing.sm,
    marginBottom: Spacing.base,
    backgroundColor: Colors.background.surface,
    borderColor: Colors.border.subtle,
    borderWidth: 1,
  },
  noticeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  noticeText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    flex: 1,
    lineHeight: 16,
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
  fieldWrapper: {
    marginBottom: Spacing.xs,
  },
  quickDatePills: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginTop: -Spacing.xs,
    marginBottom: Spacing.base,
  },
  datePill: {
    backgroundColor: Colors.background.subtle,
    paddingVertical: Spacing.xxs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
  },
  datePillText: {
    fontSize: Typography.fontSize.xs - 1,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  notesTextArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    marginTop: Spacing.md,
  },
});
