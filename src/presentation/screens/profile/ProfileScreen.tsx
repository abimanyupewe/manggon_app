/**
 * Profile Screen (Profil Tenant, Fasilitas Kamar & Pengaturan Akun)
 * Clean Minimalist UI
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  User,
  Building2,
  MapPin,
  Calendar,
  Phone,
  Mail,
  Shield,
  KeyRound,
  LogOut,
  Edit3,
  HeartHandshake,
  CreditCard,
  Layers,
} from 'lucide-react-native';

import { Colors, Spacing, BorderRadius, Typography } from '../../../core/theme';
import { Card, Badge, Button, LoadingIndicator } from '../../components/common';
import { formatDate, formatRupiah } from '../../../core/utils/formatters';
import { useTenantProfile } from '../../hooks/useTenant';
import { useAuth } from '../../hooks/useAuth';
import { EditEmergencyContactModal } from './EditEmergencyContactModal';
import { ChangePasswordModal } from './ChangePasswordModal';

export const ProfileScreen: React.FC = () => {
  const router = useRouter();
  const { data: profile, isLoading, isRefetching, refetch } = useTenantProfile();
  const { logout, isSubmitting: isLoggingOut } = useAuth();

  const [editContactVisible, setEditContactVisible] = useState(false);
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);

  const getInitials = (name?: string): string => {
    if (!name) return 'AK';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handleLogout = () => {
    Alert.alert(
      'Konfirmasi Keluar',
      'Apakah Anda yakin ingin keluar dari sesi akun Manggon Mobile?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Keluar',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header Bar */}
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>Profil & Pengaturan</Text>
        <Text style={styles.headerSubtitle}>
          Kelola data pribadi, informasi sewa, dan keamanan akun.
        </Text>
      </View>

      {isLoading ? (
        <LoadingIndicator message="Memuat data profil..." />
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              colors={[Colors.primary.DEFAULT]}
              tintColor={Colors.primary.DEFAULT}
            />
          }
        >
          {/* 1. Tenant Identity Card */}
          <Card variant="elevated" style={styles.userCard}>
            <View style={styles.avatarRow}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>{getInitials(profile?.name)}</Text>
              </View>
              <View style={styles.userNameContainer}>
                <Text style={styles.userName}>{profile?.name || 'Anak Kos'}</Text>
                <Text style={styles.userHandle}>@{profile?.username}</Text>
                <Badge label="Tenant Kos Putri" variant="info" style={styles.roleBadge} />
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.userDetailRow}>
              <Mail size={15} color={Colors.text.muted} />
              <Text style={styles.userDetailText}>
                {profile?.email || 'Email belum diatur'}
              </Text>
            </View>

            <View style={styles.userDetailRow}>
              <Phone size={15} color={Colors.text.muted} />
              <Text style={styles.userDetailText}>
                {profile?.phone_number || 'Nomor HP belum diatur'}
              </Text>
            </View>
          </Card>

          {/* 2. Room & Property Info Card */}
          <Card variant="outlined" style={styles.sectionCard}>
            <View style={styles.sectionCardHeader}>
              <View style={styles.sectionHeaderLeft}>
                <Building2 size={18} color={Colors.primary.DEFAULT} />
                <Text style={styles.sectionCardTitle}>Data Kamar & Properti</Text>
              </View>
            </View>

            <Text style={styles.propertyName}>{profile?.property?.name}</Text>
            <View style={styles.addressRow}>
              <MapPin size={13} color={Colors.text.muted} />
              <Text style={styles.addressText}>{profile?.property?.address}</Text>
            </View>

            <View style={styles.roomSpecsGrid}>
              <View style={styles.roomSpecItem}>
                <Text style={styles.roomSpecLabel}>Nomor Kamar</Text>
                <Text style={styles.roomSpecValue}>
                  {profile?.room?.room_number || '-'} (Lt. {profile?.room?.floor || '1'})
                </Text>
              </View>
              <View style={styles.roomSpecItem}>
                <Text style={styles.roomSpecLabel}>Biaya Sewa / Bulan</Text>
                <Text style={styles.roomSpecValueHighlight}>
                  {profile?.room?.price ? formatRupiah(profile.room.price) : '-'}
                </Text>
              </View>
            </View>

            {profile?.profile?.entry_date && (
              <View style={styles.entryDateRow}>
                <Calendar size={14} color={Colors.text.muted} />
                <Text style={styles.entryDateText}>
                  Tanggal Mulai Sewa: {formatDate(profile.profile.entry_date)}
                </Text>
              </View>
            )}

            {/* Room Facilities */}
            {profile?.room?.facilities && profile.room.facilities.length > 0 && (
              <View style={styles.facilitySection}>
                <Text style={styles.facilityLabel}>Fasilitas Kamar:</Text>
                <View style={styles.chipRow}>
                  {profile.room.facilities.map((fac, idx) => (
                    <View key={idx} style={styles.facilityChip}>
                      <Text style={styles.facilityChipText}>{fac}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Property Facilities */}
            {profile?.property?.facilities && profile.property.facilities.length > 0 && (
              <View style={styles.facilitySection}>
                <Text style={styles.facilityLabel}>Fasilitas Bersama Cabang:</Text>
                <View style={styles.chipRow}>
                  {profile.property.facilities.map((fac, idx) => (
                    <View key={idx} style={styles.propertyFacilityChip}>
                      <Text style={styles.propertyFacilityChipText}>{fac}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </Card>

          {/* 3. Emergency Contact Card */}
          <Card variant="outlined" style={styles.sectionCard}>
            <View style={styles.sectionCardHeader}>
              <View style={styles.sectionHeaderLeft}>
                <HeartHandshake size={18} color="#E11D48" />
                <Text style={styles.sectionCardTitle}>Kontak Darurat Orang Tua/Wali</Text>
              </View>
              <TouchableOpacity
                onPress={() => setEditContactVisible(true)}
                style={styles.editButton}
              >
                <Edit3 size={14} color={Colors.primary.DEFAULT} />
                <Text style={styles.editButtonText}>Ubah</Text>
              </TouchableOpacity>
            </View>

            {profile?.profile?.emergency_contact_name ? (
              <View style={styles.contactDetails}>
                <View style={styles.contactItemRow}>
                  <Text style={styles.contactItemLabel}>Nama Kontak:</Text>
                  <Text style={styles.contactItemValue}>
                    {profile.profile.emergency_contact_name}
                  </Text>
                </View>
                <View style={styles.contactItemRow}>
                  <Text style={styles.contactItemLabel}>Hubungan Relasi:</Text>
                  <Text style={styles.contactItemValue}>
                    {profile.profile.emergency_contact_relation || '-'}
                  </Text>
                </View>
                <View style={styles.contactItemRow}>
                  <Text style={styles.contactItemLabel}>Nomor Telepon:</Text>
                  <Text style={styles.contactItemValueHighlight}>
                    {profile.profile.emergency_contact_phone}
                  </Text>
                </View>
              </View>
            ) : (
              <View style={styles.emptyContactBox}>
                <Text style={styles.emptyContactText}>
                  Kontak darurat belum dilengkapi. Harap isi kontak orang tua/wali demi keselamatan dan penanganan darurat.
                </Text>
                <Button
                  title="Lengkapi Kontak Darurat"
                  size="sm"
                  onPress={() => setEditContactVisible(true)}
                  style={styles.completeContactBtn}
                />
              </View>
            )}
          </Card>

          {/* 4. Security & Account Actions */}
          <Card variant="outlined" style={styles.sectionCard}>
            <View style={styles.sectionCardHeader}>
              <View style={styles.sectionHeaderLeft}>
                <Shield size={18} color={Colors.primary.DEFAULT} />
                <Text style={styles.sectionCardTitle}>Keamanan Akun</Text>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.actionRow}
              onPress={() => setChangePasswordVisible(true)}
            >
              <View style={styles.actionRowLeft}>
                <KeyRound size={18} color={Colors.text.secondary} />
                <View>
                  <Text style={styles.actionRowTitle}>Ganti Kata Sandi</Text>
                  <Text style={styles.actionRowSubtitle}>
                    Perbarui kata sandi akun secara berkala
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </Card>

          {/* 5. Logout Button */}
          <Button
            title="Keluar dari Akun"
            variant="danger"
            leftIcon={<LogOut size={16} color="#FFFFFF" />}
            onPress={handleLogout}
            loading={isLoggingOut}
            fullWidth
            style={styles.logoutButton}
          />
        </ScrollView>
      )}

      {/* Edit Emergency Contact Modal */}
      <EditEmergencyContactModal
        visible={editContactVisible}
        user={profile || null}
        onClose={() => setEditContactVisible(false)}
      />

      {/* Change Password Modal */}
      <ChangePasswordModal
        visible={changePasswordVisible}
        onClose={() => setChangePasswordVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.app,
  },
  headerBar: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.background.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.DEFAULT,
  },
  headerTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  headerSubtitle: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    marginTop: Spacing.xxs,
  },
  scrollContent: {
    padding: Spacing.base,
    paddingBottom: Spacing['4xl'],
  },
  userCard: {
    padding: Spacing.base,
    marginBottom: Spacing.base,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  avatarContainer: {
    width: 54,
    height: 54,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary.DEFAULT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: Colors.text.inverse,
    fontSize: Typography.fontSize.lg,
    fontWeight: '700',
  },
  userNameContainer: {
    flex: 1,
  },
  userName: {
    fontSize: Typography.fontSize.base,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  userHandle: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  roleBadge: {
    marginTop: Spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border.subtle,
    marginVertical: Spacing.md,
  },
  userDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  userDetailText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
  },
  sectionCard: {
    padding: Spacing.base,
    marginBottom: Spacing.base,
  },
  sectionCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  sectionCardTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.primary.light,
    paddingVertical: 3,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  editButtonText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '600',
    color: Colors.primary.DEFAULT,
  },
  propertyName: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
    marginBottom: Spacing.sm,
  },
  addressText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.muted,
  },
  roomSpecsGrid: {
    flexDirection: 'row',
    backgroundColor: Colors.background.subtle,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  roomSpecItem: {
    flex: 1,
  },
  roomSpecLabel: {
    fontSize: Typography.fontSize.xs - 1,
    color: Colors.text.muted,
  },
  roomSpecValue: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '700',
    color: Colors.text.primary,
    marginTop: 2,
  },
  roomSpecValueHighlight: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '700',
    color: Colors.primary.DEFAULT,
    marginTop: 2,
  },
  entryDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  entryDateText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
  },
  facilitySection: {
    marginTop: Spacing.xs,
  },
  facilityLabel: {
    fontSize: Typography.fontSize.xs - 1,
    fontWeight: '600',
    color: Colors.text.muted,
    marginBottom: Spacing.xs,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  facilityChip: {
    backgroundColor: Colors.primary.light,
    paddingVertical: 3,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  facilityChipText: {
    fontSize: Typography.fontSize.xs - 1,
    color: Colors.primary.dark,
    fontWeight: '500',
  },
  propertyFacilityChip: {
    backgroundColor: Colors.background.subtle,
    paddingVertical: 3,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
  },
  propertyFacilityChipText: {
    fontSize: Typography.fontSize.xs - 1,
    color: Colors.text.secondary,
  },
  contactDetails: {
    backgroundColor: Colors.background.subtle,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    gap: Spacing.xs,
  },
  contactItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactItemLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.muted,
  },
  contactItemValue: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  contactItemValueHighlight: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '700',
    color: Colors.primary.DEFAULT,
  },
  emptyContactBox: {
    backgroundColor: Colors.background.subtle,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    alignItems: 'center',
  },
  emptyContactText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
    lineHeight: 18,
  },
  completeContactBtn: {
    alignSelf: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
  },
  actionRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  actionRowTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  actionRowSubtitle: {
    fontSize: Typography.fontSize.xs - 1,
    color: Colors.text.muted,
    marginTop: 2,
  },
  logoutButton: {
    marginTop: Spacing.xs,
    marginBottom: Spacing.xl,
  },
});
