/**
 * Complaint Detail Modal (Rincian Tiket & Timeline Perbaikan)
 * Clean Minimalist UI
 */

import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import {
  X,
  Wrench,
  CheckCircle2,
  Clock,
  User,
  AlertCircle,
  Calendar,
} from 'lucide-react-native';

import { Colors, Spacing, BorderRadius, Typography } from '../../../core/theme';
import { Card, Badge } from '../../components/common';
import { TenantComplaint, ComplaintStatus } from '../../../domain/models/complaint';
import { formatDate } from '../../../core/utils/formatters';

export interface ComplaintDetailModalProps {
  visible: boolean;
  complaint: TenantComplaint | null;
  onClose: () => void;
}

export const ComplaintDetailModal: React.FC<ComplaintDetailModalProps> = ({
  visible,
  complaint,
  onClose,
}) => {
  if (!complaint) return null;

  const getStatusBadgeVariant = (status: ComplaintStatus) => {
    if (status === 'resolved') return 'success';
    if (status === 'in_progress') return 'info';
    if (status === 'rejected') return 'danger';
    return 'warning';
  };

  const isStep1Done = true;
  const isStep2Done =
    complaint.status === 'in_progress' || complaint.status === 'resolved';
  const isStep3Done = complaint.status === 'resolved';
  const isRejected = complaint.status === 'rejected';

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
            <Text style={styles.modalTitle}>Detail Tiket Kerusakan</Text>
            <Text style={styles.modalSubtitle}>{complaint.ticket_number}</Text>
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
          {/* Main Summary Card */}
          <Card variant="elevated" style={styles.mainCard}>
            <View style={styles.cardTopRow}>
              <Text style={styles.ticketTitle}>{complaint.title}</Text>
              <Badge
                label={complaint.status_label}
                variant={getStatusBadgeVariant(complaint.status)}
              />
            </View>

            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Calendar size={13} color={Colors.text.muted} />
                <Text style={styles.metaText}>
                  Diajukan: {formatDate(complaint.created_at)}
                </Text>
              </View>
              <Text style={styles.roomTag}>Kamar {complaint.room_number}</Text>
            </View>

            <View style={styles.divider} />

            <Text style={styles.descLabel}>Deskripsi Keluhan:</Text>
            <Text style={styles.descText}>{complaint.description}</Text>
          </Card>

          {/* Timeline Tracking Section */}
          <Card variant="outlined" style={styles.timelineCard}>
            <Text style={styles.timelineSectionTitle}>Progres Penanganan Fasilitas</Text>

            {isRejected ? (
              <View style={styles.rejectedTimelineBox}>
                <AlertCircle size={18} color={Colors.status.danger.dot} />
                <View style={styles.rejectedTimelineContent}>
                  <Text style={styles.rejectedTimelineTitle}>Laporan Ditolak</Text>
                  <Text style={styles.rejectedTimelineDesc}>
                    {complaint.resolution_notes ||
                      'Keluhan tidak dapat diproses atau di luar ketentuan fasilitas kos.'}
                  </Text>
                </View>
              </View>
            ) : (
              <View style={styles.timelineContainer}>
                {/* Step 1: Laporan Diterima */}
                <View style={styles.timelineStep}>
                  <View
                    style={[
                      styles.timelineIndicator,
                      isStep1Done && styles.timelineIndicatorDone,
                    ]}
                  >
                    <CheckCircle2
                      size={16}
                      color={
                        isStep1Done ? Colors.status.success.dot : Colors.text.muted
                      }
                    />
                  </View>
                  <View style={styles.timelineLine} />
                  <View style={styles.timelineBody}>
                    <Text style={styles.timelineStepTitle}>Laporan Diterima</Text>
                    <Text style={styles.timelineStepDesc}>
                      Tiket keluhan tercatat pada {formatDate(complaint.created_at)}.
                    </Text>
                  </View>
                </View>

                {/* Step 2: Penanganan Staf / Teknisi */}
                <View style={styles.timelineStep}>
                  <View
                    style={[
                      styles.timelineIndicator,
                      isStep2Done && styles.timelineIndicatorDone,
                    ]}
                  >
                    <Wrench
                      size={14}
                      color={
                        isStep2Done ? Colors.primary.DEFAULT : Colors.text.muted
                      }
                    />
                  </View>
                  <View style={styles.timelineLine} />
                  <View style={styles.timelineBody}>
                    <Text style={styles.timelineStepTitle}>
                      {isStep2Done ? 'Sedang Ditangani' : 'Menunggu Teknisi'}
                    </Text>
                    <Text style={styles.timelineStepDesc}>
                      {complaint.handler_name
                        ? `Ditugaskan kepada: ${complaint.handler_name}`
                        : 'Menunggu penugasan teknisi cabang kos.'}
                    </Text>
                  </View>
                </View>

                {/* Step 3: Selesai */}
                <View style={styles.timelineStep}>
                  <View
                    style={[
                      styles.timelineIndicator,
                      isStep3Done && styles.timelineIndicatorDone,
                    ]}
                  >
                    <CheckCircle2
                      size={16}
                      color={
                        isStep3Done ? Colors.status.success.dot : Colors.text.muted
                      }
                    />
                  </View>
                  <View style={styles.timelineBody}>
                    <Text style={styles.timelineStepTitle}>
                      {isStep3Done ? 'Perbaikan Selesai' : 'Penyelesaian'}
                    </Text>
                    <Text style={styles.timelineStepDesc}>
                      {isStep3Done && complaint.resolved_at
                        ? `Selesai diperbaiki pada ${formatDate(complaint.resolved_at)}.`
                        : 'Menunggu konfirmasi penyelesaian perbaikan.'}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </Card>

          {/* Resolution Notes from Technician/Staff */}
          {complaint.resolution_notes && !isRejected && (
            <Card variant="outlined" style={styles.notesCard}>
              <View style={styles.notesHeader}>
                <User size={16} color={Colors.primary.DEFAULT} />
                <Text style={styles.notesTitle}>Catatan Penanganan Staf</Text>
              </View>
              <Text style={styles.notesContent}>{complaint.resolution_notes}</Text>
            </Card>
          )}

          {/* Attached Photo Evidence */}
          {complaint.photo_evidence && (
            <Card variant="outlined" style={styles.photoCard}>
              <Text style={styles.photoCardTitle}>Foto Bukti Kerusakan</Text>
              <Image
                source={{ uri: complaint.photo_evidence }}
                style={styles.evidenceImage}
                resizeMode="cover"
              />
            </Card>
          )}
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
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  ticketTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: '700',
    color: Colors.text.primary,
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.muted,
  },
  roomTag: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '600',
    color: Colors.primary.DEFAULT,
    backgroundColor: Colors.primary.light,
    paddingVertical: 2,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.xs,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border.subtle,
    marginVertical: Spacing.sm,
  },
  descLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.muted,
    marginBottom: 2,
  },
  descText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.primary,
    lineHeight: 20,
  },
  timelineCard: {
    padding: Spacing.base,
    marginBottom: Spacing.base,
  },
  timelineSectionTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  timelineContainer: {
    paddingLeft: Spacing.xs,
  },
  timelineStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    position: 'relative',
    marginBottom: Spacing.lg,
  },
  timelineIndicator: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background.subtle,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
    zIndex: 2,
  },
  timelineIndicatorDone: {
    backgroundColor: Colors.background.surface,
    borderColor: Colors.primary.DEFAULT,
  },
  timelineLine: {
    position: 'absolute',
    left: 13,
    top: 28,
    bottom: -Spacing.lg,
    width: 2,
    backgroundColor: Colors.border.DEFAULT,
    zIndex: 1,
  },
  timelineBody: {
    flex: 1,
  },
  timelineStepTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  timelineStepDesc: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  rejectedTimelineBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.status.danger.bg,
    borderWidth: 1,
    borderColor: Colors.status.danger.border,
    borderRadius: BorderRadius.base,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  rejectedTimelineContent: {
    flex: 1,
  },
  rejectedTimelineTitle: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '700',
    color: Colors.status.danger.text,
  },
  rejectedTimelineDesc: {
    fontSize: Typography.fontSize.xs,
    color: Colors.status.danger.text,
    marginTop: 2,
  },
  notesCard: {
    padding: Spacing.base,
    marginBottom: Spacing.base,
  },
  notesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  notesTitle: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  notesContent: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  photoCard: {
    padding: Spacing.base,
    marginBottom: Spacing.base,
  },
  photoCardTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  evidenceImage: {
    width: '100%',
    height: 200,
    borderRadius: BorderRadius.base,
    backgroundColor: Colors.background.subtle,
  },
});
