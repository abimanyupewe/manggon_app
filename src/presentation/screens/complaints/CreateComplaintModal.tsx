/**
 * Create Complaint Modal (Formulir Lapor Kerusakan Fasilitas)
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
  Image,
  Alert,
  Platform,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import {
  X,
  Wrench,
  Camera,
  Image as ImageIcon,
  Trash2,
  AlertCircle,
  Send,
  Info,
} from 'lucide-react-native';

import { Colors, Spacing, BorderRadius, Typography } from '../../../core/theme';
import { Button, Input, Card } from '../../components/common';
import {
  createComplaintSchema,
  CreateComplaintFormData,
} from '../../../domain/validation/complaint_schemas';
import { useCreateComplaint } from '../../hooks/useComplaints';
import { compressPaymentProof } from '../../utils/image_compressor';

export interface CreateComplaintModalProps {
  visible: boolean;
  onClose: () => void;
}

export const CreateComplaintModal: React.FC<CreateComplaintModalProps> = ({
  visible,
  onClose,
}) => {
  const { createComplaint, isSubmitting } = useCreateComplaint();

  const [selectedPhotoUri, setSelectedPhotoUri] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateComplaintFormData>({
    resolver: zodResolver(createComplaintSchema),
    defaultValues: {
      title: '',
      description: '',
      photo_uri: undefined,
    },
  });

  const categoryPresets = [
    'AC Kurang Dingin / Bocor',
    'Kran Air Patah / Bocor',
    'Lampu Kamar Mandi Mati',
    'Kunci Pintu Rusak',
    'Saluran Air Mampet',
  ];

  const handlePickFromGallery = async () => {
    try {
      setErrorMessage(null);
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          'Izin Diperlukan',
          'Mohon izinkan akses galeri untuk mengunggah foto bukti kerusakan.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]?.uri) {
        const compressed = await compressPaymentProof(result.assets[0].uri);
        setSelectedPhotoUri(compressed.uri);
        setValue('photo_uri', compressed.uri);
      }
    } catch {
      setErrorMessage('Gagal membuka galeri foto.');
    }
  };

  const handleTakePhoto = async () => {
    try {
      setErrorMessage(null);
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          'Izin Diperlukan',
          'Mohon izinkan akses kamera untuk memotret fasilitas yang rusak.'
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]?.uri) {
        const compressed = await compressPaymentProof(result.assets[0].uri);
        setSelectedPhotoUri(compressed.uri);
        setValue('photo_uri', compressed.uri);
      }
    } catch {
      setErrorMessage('Gagal membuka kamera perangkat.');
    }
  };

  const handleRemovePhoto = () => {
    setSelectedPhotoUri(null);
    setValue('photo_uri', undefined);
  };

  const onSubmit = async (data: CreateComplaintFormData) => {
    try {
      setErrorMessage(null);
      await createComplaint({
        title: data.title.trim(),
        description: data.description.trim(),
        photoUri: selectedPhotoUri || undefined,
      });

      Alert.alert(
        'Laporan Terkirim',
        'Keluhan fasilitas Anda telah masuk ke sistem dan akan segera ditindaklanjuti oleh staf teknisi kos.',
        [
          {
            text: 'OK',
            onPress: () => {
              reset();
              setSelectedPhotoUri(null);
              onClose();
            },
          },
        ]
      );
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : 'Gagal mengirimkan laporan keluhan.';
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
        {/* Modal Header */}
        <View style={styles.modalHeader}>
          <View style={styles.modalHeaderLeft}>
            <Text style={styles.modalTitle}>Lapor Kerusakan Fasilitas</Text>
            <Text style={styles.modalSubtitle}>
              Sampaikan kendala kamar kos untuk penanganan teknisi.
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
          {/* Quick Preset Chips */}
          <Text style={styles.presetSectionTitle}>Kategori Masalah Umum:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.presetScroll}
          >
            {categoryPresets.map((preset) => (
              <TouchableOpacity
                key={preset}
                activeOpacity={0.7}
                style={styles.presetChip}
                onPress={() => setValue('title', preset, { shouldValidate: true })}
              >
                <Text style={styles.presetChipText}>{preset}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {errorMessage && (
            <View style={styles.errorBanner}>
              <AlertCircle size={16} color={Colors.status.danger.dot} />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}

          {/* Title Input */}
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Judul Keluhan / Fasilitas Rusak"
                placeholder="Contoh: AC Kamar A01 Kurang Dingin"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.title?.message}
                leftAccessory={
                  <Wrench size={18} color={Colors.text.muted} strokeWidth={1.75} />
                }
              />
            )}
          />

          {/* Description Input */}
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Rincian Kerusakan & Lokasi Spesifik"
                placeholder="Jelaskan kendala fasilitas yang Anda alami secara detail..."
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                multiline
                numberOfLines={4}
                error={errors.description?.message}
                inputStyle={styles.descriptionTextArea}
              />
            )}
          />

          {/* Photo Attachment Section */}
          <Card variant="outlined" style={styles.attachmentCard}>
            <Text style={styles.attachmentTitle}>Foto Bukti Kerusakan (Opsional)</Text>
            <Text style={styles.attachmentSubtitle}>
              Foto yang jelas membantu staf teknisi menyiapkan suku cadang yang tepat.
            </Text>

            {selectedPhotoUri ? (
              <View style={styles.previewContainer}>
                <Image
                  source={{ uri: selectedPhotoUri }}
                  style={styles.previewImage}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  style={styles.removePhotoButton}
                  onPress={handleRemovePhoto}
                >
                  <Trash2 size={16} color={Colors.text.inverse} />
                  <Text style={styles.removePhotoText}>Hapus Foto</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.pickerButtonGroup}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.pickerButton}
                  onPress={handleTakePhoto}
                >
                  <Camera size={22} color={Colors.primary.DEFAULT} />
                  <Text style={styles.pickerButtonTitle}>Ambil Foto</Text>
                  <Text style={styles.pickerButtonSubtitle}>Gunakan kamera</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.pickerButton}
                  onPress={handlePickFromGallery}
                >
                  <ImageIcon size={22} color={Colors.primary.DEFAULT} />
                  <Text style={styles.pickerButtonTitle}>Galeri</Text>
                  <Text style={styles.pickerButtonSubtitle}>Pilih dari foto</Text>
                </TouchableOpacity>
              </View>
            )}
          </Card>

          <Button
            title="Kirim Laporan Kerusakan"
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
  presetSectionTitle: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '600',
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  presetScroll: {
    gap: Spacing.xs,
    paddingBottom: Spacing.md,
  },
  presetChip: {
    backgroundColor: Colors.background.subtle,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
  },
  presetChipText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.primary,
    fontWeight: '500',
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
  descriptionTextArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  attachmentCard: {
    padding: Spacing.base,
    marginBottom: Spacing.base,
  },
  attachmentTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  attachmentSubtitle: {
    fontSize: Typography.fontSize.xs - 1,
    color: Colors.text.muted,
    marginTop: 2,
    marginBottom: Spacing.md,
  },
  pickerButtonGroup: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  pickerButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.background.subtle,
    borderRadius: BorderRadius.base,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
  },
  pickerButtonTitle: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '600',
    color: Colors.text.primary,
    marginTop: Spacing.xs,
  },
  pickerButtonSubtitle: {
    fontSize: Typography.fontSize.xs - 1,
    color: Colors.text.muted,
  },
  previewContainer: {
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: BorderRadius.base,
    backgroundColor: Colors.background.subtle,
  },
  removePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.status.danger.dot,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
    marginTop: Spacing.sm,
    gap: Spacing.xs,
  },
  removePhotoText: {
    color: Colors.text.inverse,
    fontSize: Typography.fontSize.xs,
    fontWeight: '600',
  },
  submitButton: {
    marginTop: Spacing.sm,
  },
});
