/**
 * Complaints Screen (Tiket Keluhan & Pemeliharaan Fasilitas Kamar)
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
  Wrench,
  Plus,
  Calendar,
  ChevronRight,
  Clock,
  User,
} from 'lucide-react-native';

import { Colors, Spacing, BorderRadius, Typography } from '../../../core/theme';
import { Card, Badge, Button, LoadingIndicator } from '../../components/common';
import { TenantComplaint, ComplaintStatus } from '../../../domain/models/complaint';
import { formatDate } from '../../../core/utils/formatters';
import { useComplaints } from '../../hooks/useComplaints';
import { CreateComplaintModal } from './CreateComplaintModal';
import { ComplaintDetailModal } from './ComplaintDetailModal';

type FilterType = 'all' | ComplaintStatus;

export const ComplaintsScreen: React.FC = () => {
  const { data: complaints, isLoading, isRefetching, refetch } = useComplaints();

  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<TenantComplaint | null>(
    null
  );
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  const filteredComplaints = useMemo(() => {
    if (!complaints) return [];
    if (activeFilter === 'all') return complaints;
    return complaints.filter((item) => item.status === activeFilter);
  }, [complaints, activeFilter]);

  const filterOptions: { label: string; value: FilterType }[] = [
    { label: 'Semua', value: 'all' },
    { label: 'Menunggu', value: 'pending' },
    { label: 'Diproses', value: 'in_progress' },
    { label: 'Selesai', value: 'resolved' },
    { label: 'Ditolak', value: 'rejected' },
  ];

  const getStatusBadgeVariant = (status: ComplaintStatus) => {
    if (status === 'resolved') return 'success';
    if (status === 'in_progress') return 'info';
    if (status === 'rejected') return 'danger';
    return 'warning';
  };

  const handleOpenDetail = (complaint: TenantComplaint) => {
    setSelectedComplaint(complaint);
    setDetailModalVisible(true);
  };

  const renderComplaintItem = ({ item }: { item: TenantComplaint }) => {
    return (
      <Card
        variant="elevated"
        style={styles.card}
        onPress={() => handleOpenDetail(item)}
      >
        <View style={styles.cardHeader}>
          <View style={styles.ticketMeta}>
            <Text style={styles.ticketNumber}>{item.ticket_number}</Text>
            <Text style={styles.ticketDate}>{formatDate(item.created_at)}</Text>
          </View>
          <Badge
            label={item.status_label}
            variant={getStatusBadgeVariant(item.status)}
          />
        </View>

        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDesc} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.cardFooter}>
          <View style={styles.handlerContainer}>
            {item.handler_name ? (
              <View style={styles.handlerRow}>
                <User size={13} color={Colors.text.muted} />
                <Text style={styles.handlerText}>Teknisi: {item.handler_name}</Text>
              </View>
            ) : (
              <View style={styles.handlerRow}>
                <Clock size={13} color={Colors.text.muted} />
                <Text style={styles.handlerText}>Menunggu penugasan teknisi</Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={styles.detailButton}
            onPress={() => handleOpenDetail(item)}
          >
            <Text style={styles.detailButtonText}>Lihat Progres</Text>
            <ChevronRight size={14} color={Colors.primary.DEFAULT} />
          </TouchableOpacity>
        </View>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerTitles}>
            <Text style={styles.title}>Tiket Keluhan Kamar</Text>
            <Text style={styles.subtitle}>
              Lapor kerusakan fasilitas dan pantau progres perbaikan.
            </Text>
          </View>
          <Button
            title="Lapor Kerusakan"
            size="sm"
            leftIcon={<Plus size={16} color="#FFFFFF" />}
            onPress={() => setCreateModalVisible(true)}
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

      {/* Complaints List */}
      {isLoading ? (
        <LoadingIndicator message="Memuat daftar keluhan..." />
      ) : (
        <FlatList
          data={filteredComplaints}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderComplaintItem}
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
              <Wrench size={48} color={Colors.text.muted} strokeWidth={1.5} />
              <Text style={styles.emptyTitle}>Belum Ada Tiket Keluhan</Text>
              <Text style={styles.emptySubtitle}>
                {activeFilter === 'all'
                  ? 'Fasilitas kamar kos Anda dalam kondisi baik. Tekan "Lapor Kerusakan" jika ada kendala.'
                  : 'Tidak ada tiket keluhan dengan status ini.'}
              </Text>
            </View>
          }
        />
      )}

      {/* Create Complaint Modal */}
      <CreateComplaintModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
      />

      {/* Complaint Detail Modal */}
      <ComplaintDetailModal
        visible={detailModalVisible}
        complaint={selectedComplaint}
        onClose={() => {
          setDetailModalVisible(false);
          setSelectedComplaint(null);
        }}
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
  card: {
    padding: Spacing.base,
    marginBottom: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  ticketMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  ticketNumber: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  ticketDate: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.muted,
  },
  cardTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: Spacing.xxs,
  },
  cardDesc: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    lineHeight: 18,
    marginBottom: Spacing.sm,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border.subtle,
  },
  handlerContainer: {
    flex: 1,
  },
  handlerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  handlerText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.muted,
  },
  detailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: Colors.primary.light,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  detailButtonText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '600',
    color: Colors.primary.DEFAULT,
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
