/**
 * Security Screen (Satpam Digital)
 * Izin Pulang Malam & Buku Tamu Wanita
 * Clean Minimalist UI
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {
  ShieldCheck,
  Clock,
  Users,
  Plus,
  Calendar,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from 'lucide-react-native';

import { Colors, Spacing, BorderRadius, Typography } from '../../../core/theme';
import { Card, Badge, Button, LoadingIndicator } from '../../components/common';
import {
  TenantSecurityLog,
  SecurityLogType,
  SecurityLogStatus,
} from '../../../domain/models/security_log';
import { formatDate } from '../../../core/utils/formatters';
import { useTenantSecurityLogs } from '../../hooks/useTenant';
import { CreateSecurityLogModal } from './CreateSecurityLogModal';

type FilterCategory = 'all' | SecurityLogType | SecurityLogStatus;

export const SecurityScreen: React.FC = () => {
  const { data: logs, isLoading, isRefetching, refetch } = useTenantSecurityLogs();

  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const [modalVisible, setModalVisible] = useState(false);

  const filteredLogs = useMemo(() => {
    if (!logs) return [];
    if (activeFilter === 'all') return logs;
    if (activeFilter === 'late_return' || activeFilter === 'guest_visit') {
      return logs.filter((item) => item.type === activeFilter);
    }
    return logs.filter((item) => item.status === activeFilter);
  }, [logs, activeFilter]);

  const filterOptions: { label: string; value: FilterCategory }[] = [
    { label: 'Semua', value: 'all' },
    { label: 'Pulang Malam', value: 'late_return' },
    { label: 'Tamu Menginap', value: 'guest_visit' },
    { label: 'Menunggu', value: 'pending' },
    { label: 'Disetujui', value: 'approved' },
    { label: 'Ditolak', value: 'rejected' },
  ];

  const getStatusBadgeVariant = (status: SecurityLogStatus) => {
    if (status === 'approved') return 'success';
    if (status === 'rejected') return 'danger';
    return 'warning';
  };

  const renderLogItem = ({ item }: { item: TenantSecurityLog }) => {
    const isLateReturn = item.type === 'late_return';

    return (
      <Card variant="elevated" style={styles.logCard}>
        <View style={styles.cardHeader}>
          <View style={styles.typeBadge}>
            {isLateReturn ? (
              <Clock size={16} color={Colors.primary.DEFAULT} />
            ) : (
              <Users size={16} color="#059669" />
            )}
            <Text style={styles.typeTitle}>{item.type_label}</Text>
          </View>
          <Badge
            label={item.status_label}
            variant={getStatusBadgeVariant(item.status)}
          />
        </View>

        <View style={styles.timeInfoRow}>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>Tanggal Izin:</Text>
            <Text style={styles.infoValue}>{formatDate(item.date)}</Text>
          </View>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>Rencana Jam:</Text>
            <Text style={styles.infoValue}>{item.planned_time}</Text>
          </View>
        </View>

        {item.guest_name && (
          <View style={styles.guestRow}>
            <Text style={styles.guestLabel}>Tamu Wanita:</Text>
            <Text style={styles.guestName}>{item.guest_name}</Text>
          </View>
        )}

        {item.notes && (
          <View style={styles.notesContainer}>
            <Text style={styles.notesLabel}>Alasan / Keterangan:</Text>
            <Text style={styles.notesText}>{item.notes}</Text>
          </View>
        )}

        {/* Approval / Rejection Metadata */}
        {item.status === 'approved' && item.approved_by_name && (
          <View style={styles.approvalNotice}>
            <CheckCircle2 size={13} color={Colors.status.success.dot} />
            <Text style={styles.approvalText}>
              Disetujui oleh: {item.approved_by_name}
            </Text>
          </View>
        )}

        {item.status === 'rejected' && item.rejection_reason && (
          <View style={styles.rejectionNotice}>
            <XCircle size={13} color={Colors.status.danger.dot} />
            <Text style={styles.rejectionText}>
              Ditolak: {item.rejection_reason}
            </Text>
          </View>
        )}
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerTitles}>
            <Text style={styles.title}>Satpam Digital</Text>
            <Text style={styles.subtitle}>
              Izin pulang malam dan buku tamu khusus anak kos putri.
            </Text>
          </View>
          <Button
            title="Ajukan Izin"
            size="sm"
            leftIcon={<Plus size={16} color="#FFFFFF" />}
            onPress={() => setModalVisible(true)}
            style={styles.addButton}
          />
        </View>
      </View>

      {/* Filter Chips */}
      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={filterOptions}
          keyExtractor={(item) => item.value}
          contentContainerStyle={styles.filterList}
          renderItem={({ item }) => {
            const isActive = activeFilter === item.value;
            return (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setActiveFilter(item.value)}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isActive && styles.filterChipTextActive,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Security Logs List */}
      {isLoading ? (
        <LoadingIndicator message="Memuat riwayat izin satpam..." />
      ) : (
        <FlatList
          data={filteredLogs}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderLogItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              colors={[Colors.primary.DEFAULT]}
              tintColor={Colors.primary.DEFAULT}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <ShieldCheck size={48} color={Colors.text.muted} strokeWidth={1.5} />
              <Text style={styles.emptyTitle}>Belum Ada Pengajuan Izin</Text>
              <Text style={styles.emptySubtitle}>
                {activeFilter === 'all'
                  ? 'Gunakan tombol "Ajukan Izin" untuk membuat permohonan izin pulang malam atau tamu menginap.'
                  : 'Tidak ada data izin dengan filter status ini.'}
              </Text>
            </View>
          }
        />
      )}

      {/* Create Security Log Modal */}
      <CreateSecurityLogModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.app,
  },
  header: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.background.surface,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  headerTitles: {
    flex: 1,
  },
  title: {
    fontSize: Typography.fontSize.xl,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  subtitle: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    marginTop: Spacing.xxs,
  },
  addButton: {
    paddingHorizontal: Spacing.md,
  },
  filterContainer: {
    backgroundColor: Colors.background.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.DEFAULT,
    paddingVertical: Spacing.sm,
  },
  filterList: {
    paddingHorizontal: Spacing.base,
    gap: Spacing.xs,
  },
  filterChip: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background.subtle,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
  },
  filterChipActive: {
    backgroundColor: Colors.primary.DEFAULT,
    borderColor: Colors.primary.DEFAULT,
  },
  filterChipText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
  filterChipTextActive: {
    color: Colors.text.inverse,
    fontWeight: '600',
  },
  listContent: {
    padding: Spacing.base,
    paddingBottom: Spacing['4xl'],
  },
  logCard: {
    padding: Spacing.base,
    marginBottom: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  typeTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  timeInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.background.subtle,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  infoCol: {
    flex: 1,
  },
  infoLabel: {
    fontSize: Typography.fontSize.xs - 1,
    color: Colors.text.muted,
  },
  infoValue: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '600',
    color: Colors.text.primary,
    marginTop: 2,
  },
  guestRow: {
    marginTop: Spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  guestLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
  },
  guestName: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  notesContainer: {
    marginTop: Spacing.xs,
  },
  notesLabel: {
    fontSize: Typography.fontSize.xs - 1,
    color: Colors.text.muted,
  },
  notesText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  approvalNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.border.subtle,
  },
  approvalText: {
    fontSize: Typography.fontSize.xs - 1,
    color: Colors.status.success.text,
    fontWeight: '500',
  },
  rejectionNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.border.subtle,
  },
  rejectionText: {
    fontSize: Typography.fontSize.xs - 1,
    color: Colors.status.danger.text,
    fontWeight: '500',
  },
  emptyContainer: {
    paddingVertical: Spacing['4xl'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: '600',
    color: Colors.text.primary,
    marginTop: Spacing.md,
  },
  emptySubtitle: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.muted,
    textAlign: 'center',
    marginTop: Spacing.xxs,
    maxWidth: 260,
  },
});
