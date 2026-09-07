/**
 * Bill Detail & Proof Upload Modal
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
import * as ImagePicker from 'expo-image-picker';
import {
  X,
  CreditCard,
  Camera,
  Image as ImageIcon,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Clock,
  Send,
} from 'lucide-react-native';

import { Colors, Spacing, BorderRadius, Typography } from '../../../core/theme';
import { Card, Badge, Button, Input } from '../../components/common';
import { TenantBill } from '../../../domain/models/bill';
import { formatRupiah, formatDate } from '../../../core/utils/formatters';
import { compressPaymentProof } from '../../utils/image_compressor';
import { useUploadProof } from '../../hooks/useBilling';

export interface BillDetailModalProps {
  visible: boolean;
  bill: TenantBill | null;
  onClose: () => void;
}

export const BillDetailModal: React.FC<BillDetailModalProps> = ({
  visible,
  bill,
  onClose,
}) => {
  const { uploadProof, isUploading, uploadError } = useUploadProof();

  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [notes, setNotes] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!bill) return null;

  const handlePickFromGallery = async () => {
    try {
      setErrorMessage(null);
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          'Izin Diperlukan',
          'Mohon izinkan akses galeri untuk mengunggah bukti pembayaran.'
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
        setSelectedImageUri(compressed.uri);
      }
    } catch (error) {
      setErrorMessage('Gagal membuka galeri foto.');
      console.warn(error);
    }
  };

  const handleTakePhoto = async () => {
    try {
      setErrorMessage(null);
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          'Izin Diperlukan',
          'Mohon izinkan akses kamera untuk mengambil foto bukti transfer.'
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]?.uri) {
        const compressed = await compressPaymentProof(result.assets[0].uri);
        setSelectedImageUri(compressed.uri);
      }
    } catch (error) {
      setErrorMessage('Gagal membuka kamera perangkat.');
      console.warn(error);
    }
  };

  const handleSubmitProof = async () => {
    if (!selectedImageUri) {
      setErrorMessage('Silakan pilih foto bukti transfer terlebih dahulu.');
      return;
    }

    try {
      setErrorMessage(null);
      await uploadProof({
        billId: bill.id,
        imageUri: selectedImageUri,
        notes: notes.trim() || undefined,
      });

      Alert.alert(
        'Bukti Terkirim',
        'Bukti pembayaran berhasil diunggah. Staf cabang akan segera memverifikasi.',
        [{ text: 'OK', onPress: onClose }]
      );
      setSelectedImageUri(null);
      setNotes('');
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Gagal mengunggah bukti transfer';
      setErrorMessage(msg);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    if (status === 'paid') return 'success';
    if (status === 'pending_verification') return 'info';
    if (status === 'rejected') return 'danger';
    return 'warning';
  };

  const isUploadAllowed = bill.status === 'unpaid' || bill.status === 'rejected';

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
            <Text style={styles.modalTitle}>Rincian Tagihan</Text>
            <Text style={styles.modalInvoice}>{bill.invoice_number}</Text>
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
          showsVerticalScrollIndicator={false}
        >
          {/* Bill Status & Period Card */}
          <Card variant="elevated" style={styles.mainCard}>
            <View style={styles.periodRow}>
              <View>
                <Text style={styles.periodLabel}>Periode Sewa</Text>
                <Text style={styles.periodValue}>{bill.billing_period}</Text>
              </View>
              <Badge
                label={bill.status_label}
                variant={getStatusBadgeVariant(bill.status)}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.amountContainer}>
              <Text style={styles.amountLabel}>Total Tagihan:</Text>
              <Text style={styles.amountValue}>{formatRupiah(bill.amount)}</Text>
            </View>

            <View style={styles.metaInfoRow}>
              <Text style={styles.metaLabel}>Properti:</Text>
              <Text style={styles.metaValue}>{bill.property_name}</Text>
            </View>

            <View style={styles.metaInfoRow}>
              <Text style={styles.metaLabel}>Nomor Kamar:</Text>
              <Text style={styles.metaValue}>{bill.room_number}</Text>
            </View>
          </Card>

          {/* Official Bank Account Information */}
          <Card variant="outlined" style={styles.bankCard}>
            <View style={styles.bankHeader}>
              <CreditCard size={18} color={Colors.primary.DEFAULT} />
              <Text style={styles.bankTitle}>Rekening Resmi Pembayaran</Text>
            </View>
            <Text style={styles.bankInfoText}>{bill.bank_account_info}</Text>
            <Text style={styles.bankNotice}>
              Wajib transfer ke rekening resmi di atas. Pengelola tidak bertanggung jawab atas pembayaran di luar rekening resmi.
            </Text>
          </Card>

          {/* Rejection Alert if bill was rejected */}
          {bill.status === 'rejected' && bill.rejection_reason && (
            <View style={styles.rejectedBanner}>
              <AlertCircle size={18} color={Colors.status.danger.dot} />
              <View style={styles.rejectedBannerContent}>
                <Text style={styles.rejectedTitle}>Bukti Sebelumnya Ditolak Staf</Text>
                <Text style={styles.rejectedMessage}>{bill.rejection_reason}</Text>
              </View>
            </View>
          )}

          {/* Pending Verification Notice */}
          {bill.status === 'pending_verification' && (
            <View style={styles.pendingBanner}>
              <Clock size={18} color={Colors.status.info.dot} />
              <View style={styles.pendingBannerContent}>
                <Text style={styles.pendingTitle}>Menunggu Verifikasi Staf</Text>
                <Text style={styles.pendingMessage}>
                  Bukti transfer Anda telah tersimpan dan sedang divalidasi oleh pengelola cabang kos.
                </Text>
              </View>
            </View>
          )}

          {/* Paid Notice */}
          {bill.status === 'paid' && (
            <View style={styles.paidBanner}>
              <CheckCircle2 size={18} color={Colors.status.success.dot} />
              <View style={styles.paidBannerContent}>
                <Text style={styles.paidTitle}>Pembayaran Telah Diverifikasi</Text>
                <Text style={styles.paidMessage}>
                  Tagihan lunas.
                  {bill.verified_at ? ` Diverifikasi pada ${formatDate(bill.verified_at)}.` : ''}
                </Text>
              </View>
            </View>
          )}

          {/* Upload Proof Section */}
          {isUploadAllowed ? (
            <Card variant="outlined" style={styles.uploadCard}>
              <Text style={styles.uploadSectionTitle}>Unggah Bukti Transfer Bank</Text>
              <Text style={styles.uploadSectionDesc}>
                Lampirkan tangkapan layar (screenshot) bukti transfer m-Banking atau struk ATM.
              </Text>

              {errorMessage && (
                <View style={styles.errorBanner}>
                  <AlertCircle size={16} color={Colors.status.danger.dot} />
                  <Text style={styles.errorText}>{errorMessage}</Text>
                </View>
              )}

              {selectedImageUri ? (
                <View style={styles.previewContainer}>
                  <Image
                    source={{ uri: selectedImageUri }}
                    style={styles.previewImage}
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => setSelectedImageUri(null)}
                  >
                    <Trash2 size={16} color={Colors.text.inverse} />
                    <Text style={styles.removeImageText}>Hapus Foto</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.pickerButtonGroup}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.pickerButton}
                    onPress={handleTakePhoto}
                  >
                    <Camera size={24} color={Colors.primary.DEFAULT} />
                    <Text style={styles.pickerButtonTitle}>Kamera</Text>
                    <Text style={styles.pickerButtonSubtitle}>Ambil langsung</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.pickerButton}
                    onPress={handlePickFromGallery}
                  >
                    <ImageIcon size={24} color={Colors.primary.DEFAULT} />
                    <Text style={styles.pickerButtonTitle}>Galeri</Text>
                    <Text style={styles.pickerButtonSubtitle}>Pilih berkas</Text>
                  </TouchableOpacity>
                </View>
              )}

              <Input
                label="Catatan Pengirim (Opsional)"
                placeholder="Contoh: Transfer via BCA an Putri Ayu"
                value={notes}
                onChangeText={setNotes}
                containerStyle={styles.notesInput}
              />

              <Button
                title="Kirim Bukti Pembayaran"
                leftIcon={<Send size={16} color="#FFFFFF" />}
                onPress={handleSubmitProof}
                loading={isUploading}
                disabled={!selectedImageUri || isUploading}
                fullWidth
                style={styles.submitProofButton}
              />
            </Card>
          ) : bill.proof_image ? (
            <Card variant="outlined" style={styles.proofDisplayCard}>
              <Text style={styles.proofDisplayTitle}>Bukti Transfer Terlampir</Text>
              <Text style={styles.proofNoteText}>
                {bill.notes ? `Catatan: ${bill.notes}` : 'Tidak ada catatan tambahan.'}
              </Text>
            </Card>
          ) : null}
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
  modalInvoice: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.muted,
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
  mainCard: {
    padding: Spacing.base,
    marginBottom: Spacing.base,
  },
  periodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  periodLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.muted,
  },
  periodValue: {
    fontSize: Typography.fontSize.base,
    fontWeight: '700',
    color: Colors.text.primary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border.subtle,
    marginVertical: Spacing.md,
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  amountLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  amountValue: {
    fontSize: Typography.fontSize.xl,
    fontWeight: '700',
    color: Colors.primary.DEFAULT,
  },
  metaInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  metaLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.muted,
  },
  metaValue: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  bankCard: {
    padding: Spacing.base,
    marginBottom: Spacing.base,
  },
  bankHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  bankTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  bankInfoText: {
    fontSize: Typography.fontSize.base,
    fontWeight: '700',
    color: Colors.text.primary,
    letterSpacing: 0.5,
    marginVertical: Spacing.xs,
  },
  bankNotice: {
    fontSize: Typography.fontSize.xs - 1,
    color: Colors.text.muted,
    lineHeight: 16,
  },
  rejectedBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.status.danger.bg,
    borderWidth: 1,
    borderColor: Colors.status.danger.border,
    borderRadius: BorderRadius.base,
    padding: Spacing.md,
    marginBottom: Spacing.base,
    gap: Spacing.sm,
  },
  rejectedBannerContent: {
    flex: 1,
  },
  rejectedTitle: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '700',
    color: Colors.status.danger.text,
  },
  rejectedMessage: {
    fontSize: Typography.fontSize.xs,
    color: Colors.status.danger.text,
    marginTop: 2,
  },
  pendingBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.status.info.bg,
    borderWidth: 1,
    borderColor: Colors.status.info.border,
    borderRadius: BorderRadius.base,
    padding: Spacing.md,
    marginBottom: Spacing.base,
    gap: Spacing.sm,
  },
  pendingBannerContent: {
    flex: 1,
  },
  pendingTitle: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '700',
    color: Colors.status.info.text,
  },
  pendingMessage: {
    fontSize: Typography.fontSize.xs,
    color: Colors.status.info.text,
    marginTop: 2,
  },
  paidBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.status.success.bg,
    borderWidth: 1,
    borderColor: Colors.status.success.border,
    borderRadius: BorderRadius.base,
    padding: Spacing.md,
    marginBottom: Spacing.base,
    gap: Spacing.sm,
  },
  paidBannerContent: {
    flex: 1,
  },
  paidTitle: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '700',
    color: Colors.status.success.text,
  },
  paidMessage: {
    fontSize: Typography.fontSize.xs,
    color: Colors.status.success.text,
    marginTop: 2,
  },
  uploadCard: {
    padding: Spacing.base,
    marginBottom: Spacing.base,
  },
  uploadSectionTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  uploadSectionDesc: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    marginTop: 2,
    marginBottom: Spacing.md,
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
  pickerButtonGroup: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
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
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    color: Colors.text.primary,
    marginTop: Spacing.xs,
  },
  pickerButtonSubtitle: {
    fontSize: Typography.fontSize.xs - 1,
    color: Colors.text.muted,
  },
  previewContainer: {
    marginBottom: Spacing.md,
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: 220,
    borderRadius: BorderRadius.base,
    backgroundColor: Colors.background.subtle,
  },
  removeImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.status.danger.dot,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
    marginTop: Spacing.sm,
    gap: Spacing.xs,
  },
  removeImageText: {
    color: Colors.text.inverse,
    fontSize: Typography.fontSize.xs,
    fontWeight: '600',
  },
  notesInput: {
    marginBottom: Spacing.md,
  },
  submitProofButton: {
    marginTop: Spacing.xs,
  },
  proofDisplayCard: {
    padding: Spacing.base,
    marginBottom: Spacing.base,
  },
  proofDisplayTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  proofNoteText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
  },
});
