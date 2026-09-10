/**
 * Home Screen (Beranda Dashboard)
 * Clean Minimalist UI for Tenant Portal
 */

import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Home,
  Receipt,
  ShieldCheck,
  Clock,
  Users,
  Wrench,
  ChevronRight,
  MapPin,
  Building2,
  PhoneCall,
  CreditCard,
} from 'lucide-react-native';

import { Colors, Spacing, BorderRadius, Typography } from '../../../core/theme';
import { Card, Badge, Button, LoadingIndicator } from '../../components/common';
import { formatRupiah, formatDate } from '../../../core/utils/formatters';
import {
  useTenantProfile,
  useTenantBills,
  useTenantSecurityLogs,
  useTenantComplaints,
} from '../../hooks/useTenant';

export const HomeScreen: React.FC = () => {
  const router = useRouter();

  const {
    data: profile,
    isLoading: isProfileLoading,
    refetch: refetchProfile,
  } = useTenantProfile();

  const {
    data: bills,
    isLoading: isBillsLoading,
    refetch: refetchBills,
  } = useTenantBills();

  const {
    data: securityLogs,
    isLoading: isSecurityLoading,
    refetch: refetchSecurity,
  } = useTenantSecurityLogs();

  const {
    data: complaints,
    isLoading: isComplaintsLoading,
    refetch: refetchComplaints,
  } = useTenantComplaints();

  const isRefreshing =
    isProfileLoading || isBillsLoading || isSecurityLoading || isComplaintsLoading;

  const onRefresh = useCallback(() => {
    refetchProfile();
    refetchBills();
    refetchSecurity();
    refetchComplaints();
  }, [refetchProfile, refetchBills, refetchSecurity, refetchComplaints]);

  // Find latest active bill (unpaid takes priority, then pending_verification, then latest)
  const currentBill =
    bills?.find((b) => b.status === 'unpaid') ||
    bills?.find((b) => b.status === 'pending_verification') ||
    bills?.[0];

  // Latest security log & complaint
  const latestSecurityLog = securityLogs?.[0];
  const activeComplaint = complaints?.find(
    (c) => c.status === 'in_progress' || c.status === 'pending'
  );

  const getBillBadgeVariant = (status?: string) => {
    if (status === 'paid') return 'success';
    if (status === 'pending_verification') return 'info';
    if (status === 'rejected') return 'danger';
    return 'warning';
  };

  const getSecurityBadgeVariant = (status?: string) => {
    if (status === 'approved') return 'success';
    if (status === 'rejected') return 'danger';
    return 'warning';
  };

  const getComplaintBadgeVariant = (status?: string) => {
    if (status === 'resolved') return 'success';
    if (status === 'in_progress') return 'info';
    if (status === 'rejected') return 'danger';
    return 'warning';
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          colors={[Colors.primary.DEFAULT]}
          tintColor={Colors.primary.DEFAULT}
        />
      }
    >
      {/* 1. Header Profile & Location */}
      <View style={styles.headerSection}>
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingSubtitle}>Selamat Datang,</Text>
          <Text style={styles.tenantName}>{profile?.name || 'Anak Kos'}</Text>
        </View>

        <Card variant="flat" style={styles.propertyCard}>
          <View style={styles.propertyRow}>
            <Building2 size={16} color={Colors.primary.DEFAULT} />
            <Text style={styles.propertyName} numberOfLines={1}>
              {profile?.property?.name || 'Kos Putri Manggon'}
            </Text>
          </View>
          <View style={styles.propertyMetaRow}>
            <View style={styles.metaBadge}>
              <Text style={styles.metaBadgeText}>
                Kamar {profile?.room?.room_number || '-'} (Lt. {profile?.room?.floor || '1'})
              </Text>
            </View>
            <View style={styles.locationContainer}>
              <MapPin size={13} color={Colors.text.muted} />
              <Text style={styles.propertyAddress} numberOfLines={1}>
                {profile?.property?.address || 'Alamat cabang'}
              </Text>
            </View>
          </View>
        </Card>
      </View>

      {/* 2. Billing Status Banner */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Status Tagihan Sewa</Text>
        <Card variant="elevated" style={styles.billCard}>
          {currentBill ? (
            <>
              <View style={styles.billHeader}>
                <View>
                  <Text style={styles.billPeriod}>{currentBill.billing_period}</Text>
                  <Text style={styles.billInvoice}>{currentBill.invoice_number}</Text>
                </View>
                <Badge
                  label={currentBill.status_label}
                  variant={getBillBadgeVariant(currentBill.status)}
                />
              </View>

              <View style={styles.billAmountRow}>
                <Text style={styles.billAmountLabel}>Nominal Tagihan:</Text>
                <Text style={styles.billAmountValue}>
                  {formatRupiah(currentBill.amount)}
                </Text>
              </View>

              {currentBill.status === 'unpaid' && (
                <Button
                  title="Bayar & Unggah Bukti"
                  size="sm"
                  onPress={() => router.push('/(tabs)/bills')}
                  style={styles.billActionButton}
                />
              )}

              {currentBill.status === 'pending_verification' && (
                <Text style={styles.billNoticeText}>
                  Bukti transfer bank sedang dalam proses verifikasi oleh staf cabang.
                </Text>
              )}

              {currentBill.status === 'paid' && (
                <Text style={styles.billSuccessText}>
                  Pembayaran sewa bulan ini telah lunas. Terima kasih atas ketertiban Anda.
                </Text>
              )}

              {currentBill.status === 'rejected' && currentBill.rejection_reason && (
                <View style={styles.rejectionNotice}>
                  <Text style={styles.rejectionNoticeText}>
                    Alasan penolakan: {currentBill.rejection_reason}
                  </Text>
                  <Button
                    title="Unggah Ulang Bukti"
                    size="sm"
                    variant="danger"
                    onPress={() => router.push('/(tabs)/bills')}
                    style={styles.billActionButton}
                  />
                </View>
              )}
            </>
          ) : (
            <Text style={styles.emptyText}>Belum ada data tagihan sewa tercatat.</Text>
          )}
        </Card>
      </View>

      {/* 3. Quick Actions Grid */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Akses Cepat</Text>
        <View style={styles.quickGrid}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.quickItem}
            onPress={() => router.push('/(tabs)/bills')}
          >
            <View style={[styles.quickIconWrapper, { backgroundColor: '#E0F2FE' }]}>
              <Receipt size={22} color={Colors.primary.DEFAULT} />
            </View>
            <Text style={styles.quickTitle}>Bayar Kos</Text>
            <Text style={styles.quickSubtitle}>Bukti transfer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.quickItem}
            onPress={() => router.push('/(tabs)/security')}
          >
            <View style={[styles.quickIconWrapper, { backgroundColor: '#FEF3C7' }]}>
              <Clock size={22} color="#D97706" />
            </View>
            <Text style={styles.quickTitle}>Izin Malam</Text>
            <Text style={styles.quickSubtitle}>Pulang telat</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.quickItem}
            onPress={() => router.push('/(tabs)/security')}
          >
            <View style={[styles.quickIconWrapper, { backgroundColor: '#D1FAE5' }]}>
              <Users size={22} color="#059669" />
            </View>
            <Text style={styles.quickTitle}>Lapor Tamu</Text>
            <Text style={styles.quickSubtitle}>Tamu wanita</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.quickItem}
            onPress={() => router.push('/(tabs)/complaints')}
          >
            <View style={[styles.quickIconWrapper, { backgroundColor: '#FEE2E2' }]}>
              <Wrench size={22} color="#DC2626" />
            </View>
            <Text style={styles.quickTitle}>Komplain</Text>
            <Text style={styles.quickSubtitle}>Kerusakan kamar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 4. Recent Activities Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Aktivitas & Log Terkini</Text>

        {/* Latest Security Log */}
        <Card variant="outlined" style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <View style={styles.summaryHeaderLeft}>
              <ShieldCheck size={18} color={Colors.primary.DEFAULT} />
              <Text style={styles.summaryTitle}>Satpam Digital</Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/security')}
              style={styles.viewMoreButton}
            >
              <Text style={styles.viewMoreText}>Semua</Text>
              <ChevronRight size={14} color={Colors.primary.DEFAULT} />
            </TouchableOpacity>
          </View>

          {latestSecurityLog ? (
            <View style={styles.summaryContent}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{latestSecurityLog.type_label}</Text>
                <Badge
                  label={latestSecurityLog.status_label}
                  variant={getSecurityBadgeVariant(latestSecurityLog.status)}
                />
              </View>
              <Text style={styles.summaryDetail}>
                Tanggal: {formatDate(latestSecurityLog.date)} • Jam: {latestSecurityLog.planned_time}
              </Text>
              {latestSecurityLog.notes && (
                <Text style={styles.summaryNote} numberOfLines={1}>
                  Alasan: {latestSecurityLog.notes}
                </Text>
              )}
            </View>
          ) : (
            <Text style={styles.emptyText}>Belum ada permohonan izin pulang malam atau tamu.</Text>
          )}
        </Card>

        {/* Active Complaint */}
        {activeComplaint && (
          <Card variant="outlined" style={[styles.summaryCard, { marginTop: Spacing.md }]}>
            <View style={styles.summaryHeader}>
              <View style={styles.summaryHeaderLeft}>
                <Wrench size={18} color="#D97706" />
                <Text style={styles.summaryTitle}>Tiket Kerusakan Sedang Diproses</Text>
              </View>
              <TouchableOpacity
                onPress={() => router.push('/(tabs)/complaints')}
                style={styles.viewMoreButton}
              >
                <Text style={styles.viewMoreText}>Detail</Text>
                <ChevronRight size={14} color={Colors.primary.DEFAULT} />
              </TouchableOpacity>
            </View>

            <View style={styles.summaryContent}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{activeComplaint.title}</Text>
                <Badge
                  label={activeComplaint.status_label}
                  variant={getComplaintBadgeVariant(activeComplaint.status)}
                />
              </View>
              <Text style={styles.summaryDetail} numberOfLines={2}>
                {activeComplaint.description}
              </Text>
              {activeComplaint.handler_name && (
                <Text style={styles.summaryNote}>
                  Ditangani oleh: {activeComplaint.handler_name}
                </Text>
              )}
            </View>
          </Card>
        )}
      </View>

      {/* 5. Rekening Resmi & Kontak Darurat */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informasi Cabang & Darurat</Text>
        <Card variant="outlined" style={styles.infoCard}>
          <View style={styles.infoRow}>
            <CreditCard size={18} color={Colors.text.secondary} />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Rekening Resmi Pembayaran Kos:</Text>
              <Text style={styles.infoValue}>
                {profile?.property?.bank_account_info
                  ? `${profile.property.bank_account_info.bank} - ${profile.property.bank_account_info.account_number} (a.n. ${profile.property.bank_account_info.account_holder})`
                  : 'Hubungi pengelola kos'}
              </Text>
            </View>
          </View>

          <View style={styles.infoDivider} />

          <View style={styles.infoRow}>
            <PhoneCall size={18} color={Colors.text.secondary} />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Nomor Kontak Staf Cabang:</Text>
              <Text style={styles.infoValue}>
                {profile?.property?.phone_number || 'Tidak tersedia'}
              </Text>
            </View>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.app,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing['4xl'],
  },
  headerSection: {
    marginBottom: Spacing.lg,
  },
  greetingContainer: {
    marginBottom: Spacing.sm,
  },
  greetingSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  tenantName: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  propertyCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.base,
    backgroundColor: Colors.background.surface,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
  },
  propertyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  propertyName: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    color: Colors.text.primary,
    flex: 1,
  },
  propertyMetaRow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  metaBadge: {
    backgroundColor: Colors.primary.light,
    paddingVertical: Spacing.xxs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  metaBadgeText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '600',
    color: Colors.primary.dark,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    flex: 1,
    justifyContent: 'flex-end',
  },
  propertyAddress: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.muted,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.base,
    lineHeight: Typography.lineHeight.base,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  billCard: {
    padding: Spacing.base,
    borderRadius: BorderRadius.base,
  },
  billHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  billPeriod: {
    fontSize: Typography.fontSize.base,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  billInvoice: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.muted,
  },
  billAmountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.border.subtle,
  },
  billAmountLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  billAmountValue: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '700',
    color: Colors.primary.DEFAULT,
  },
  billActionButton: {
    marginTop: Spacing.md,
  },
  billNoticeText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.status.info.text,
    marginTop: Spacing.xs,
  },
  billSuccessText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.status.success.text,
    marginTop: Spacing.xs,
  },
  rejectionNotice: {
    marginTop: Spacing.xs,
  },
  rejectionNoticeText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.status.danger.text,
    marginBottom: Spacing.xs,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  quickItem: {
    width: '48%',
    backgroundColor: Colors.background.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.base,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
    alignItems: 'center',
  },
  quickIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  quickTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  quickSubtitle: {
    fontSize: Typography.fontSize.xs - 1,
    color: Colors.text.muted,
  },
  summaryCard: {
    padding: Spacing.base,
    borderRadius: BorderRadius.base,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  summaryHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  summaryTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewMoreText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '600',
    color: Colors.primary.DEFAULT,
  },
  summaryContent: {
    backgroundColor: Colors.background.subtle,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xxs,
  },
  summaryLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  summaryDetail: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    marginBottom: Spacing.xxs,
  },
  summaryNote: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.muted,
    fontStyle: 'italic',
  },
  infoCard: {
    padding: Spacing.base,
    borderRadius: BorderRadius.base,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.muted,
  },
  infoValue: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    color: Colors.text.primary,
    marginTop: 2,
  },
  infoDivider: {
    height: 1,
    backgroundColor: Colors.border.subtle,
    marginVertical: Spacing.sm,
  },
  emptyText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.muted,
    fontStyle: 'italic',
  },
});
