/**
 * Bills Screen (Daftar Tagihan & Riwayat Pembayaran)
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
import { Receipt, AlertCircle, ChevronRight, Calendar, CreditCard } from 'lucide-react-native';

import { Colors, Spacing, BorderRadius, Typography } from '../../../core/theme';
import { Card, Badge, LoadingIndicator } from '../../components/common';
import { TenantBill, PaymentStatus } from '../../../domain/models/bill';
import { formatRupiah, formatDate } from '../../../core/utils/formatters';
import { useTenantBills } from '../../hooks/useTenant';
import { BillDetailModal } from './BillDetailModal';

type FilterType = 'all' | PaymentStatus;

export const BillsScreen: React.FC = () => {
  const { data: bills, isLoading, isRefetching, refetch } = useTenantBills();

  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [selectedBill, setSelectedBill] = useState<TenantBill | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const filteredBills = useMemo(() => {
    if (!bills) return [];
    if (activeFilter === 'all') return bills;
    return bills.filter((b) => b.status === activeFilter);
  }, [bills, activeFilter]);

  const handleOpenDetail = (bill: TenantBill) => {
    setSelectedBill(bill);
    setModalVisible(true);
  };

  const getStatusBadgeVariant = (status: PaymentStatus) => {
    if (status === 'paid') return 'success';
    if (status === 'pending_verification') return 'info';
    if (status === 'rejected') return 'danger';
    return 'warning';
  };

  const filterOptions: { label: string; value: FilterType }[] = [
    { label: 'Semua', value: 'all' },
    { label: 'Belum Bayar', value: 'unpaid' },
    { label: 'Menunggu', value: 'pending_verification' },
    { label: 'Lunas', value: 'paid' },
    { label: 'Ditolak', value: 'rejected' },
  ];

  const renderBillItem = ({ item }: { item: TenantBill }) => {
    return (
      <Card
        variant="elevated"
        style={styles.billCard}
        onPress={() => handleOpenDetail(item)}
      >
        <View style={styles.billCardHeader}>
          <View style={styles.periodContainer}>
            <Calendar size={15} color={Colors.text.muted} />
            <Text style={styles.periodText}>{item.billing_period}</Text>
          </View>
          <Badge
            label={item.status_label}
            variant={getStatusBadgeVariant(item.status)}
          />
        </View>

        <Text style={styles.invoiceText}>{item.invoice_number}</Text>

        <View style={styles.billCardFooter}>
          <View>
            <Text style={styles.amountLabel}>Total Tagihan</Text>
            <Text style={styles.amountValue}>{formatRupiah(item.amount)}</Text>
          </View>

          <TouchableOpacity
            style={styles.detailButton}
            onPress={() => handleOpenDetail(item)}
          >
            <Text style={styles.detailButtonText}>
              {item.status === 'unpaid' || item.status === 'rejected'
                ? 'Bayar Sekarang'
                : 'Lihat Detail'}
            </Text>
            <ChevronRight size={14} color={Colors.primary.DEFAULT} />
          </TouchableOpacity>
        </View>

        {item.status === 'rejected' && item.rejection_reason && (
          <View style={styles.rejectedPreview}>
            <AlertCircle size={12} color={Colors.status.danger.dot} />
            <Text style={styles.rejectedPreviewText} numberOfLines={1}>
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
        <Text style={styles.title}>Tagihan & Pembayaran</Text>
        <Text style={styles.subtitle}>
          Kelola pembayaran sewa kamar kos dan unggah bukti transfer.
        </Text>
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

      {/* Bills List */}
      {isLoading ? (
        <LoadingIndicator message="Memuat daftar tagihan..." />
      ) : (
        <FlatList
          data={filteredBills}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderBillItem}
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
              <Receipt size={48} color={Colors.text.muted} strokeWidth={1.5} />
              <Text style={styles.emptyTitle}>Tidak Ada Tagihan</Text>
              <Text style={styles.emptySubtitle}>
                {activeFilter === 'all'
                  ? 'Belum ada data tagihan sewa yang tercatat.'
                  : 'Tidak ada tagihan dengan filter status ini.'}
              </Text>
            </View>
          }
        />
      )}

      {/* Bill Detail & Upload Proof Modal */}
      <BillDetailModal
        visible={modalVisible}
        bill={selectedBill}
        onClose={() => {
          setModalVisible(false);
          setSelectedBill(null);
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
  billCard: {
    padding: Spacing.base,
    marginBottom: Spacing.md,
  },
  billCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xxs,
  },
  periodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  periodText: {
    fontSize: Typography.fontSize.base,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  invoiceText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.muted,
    marginBottom: Spacing.md,
  },
  billCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border.subtle,
  },
  amountLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
  },
  amountValue: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '700',
    color: Colors.primary.DEFAULT,
    marginTop: 2,
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
  rejectedPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.status.danger.bg,
    padding: Spacing.xs,
    borderRadius: BorderRadius.xs,
    marginTop: Spacing.sm,
  },
  rejectedPreviewText: {
    fontSize: Typography.fontSize.xs - 1,
    color: Colors.status.danger.text,
    flex: 1,
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
    maxWidth: 240,
  },
});
