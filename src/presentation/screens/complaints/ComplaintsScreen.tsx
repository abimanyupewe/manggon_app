/**
 * Complaints Screen Placeholder (Ready for Phase 5)
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors, Spacing, Typography } from '../../../core/theme';
import { Card } from '../../components/common';

export const ComplaintsScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Tiket Keluhan Kamar</Text>
      <Text style={styles.subtitle}>Pelaporan kerusakan fasilitas dan live progress perbaikan.</Text>
      <Card variant="outlined" style={styles.card}>
        <Text style={styles.cardText}>
          Modul Tiket Keluhan akan diintegrasikan secara menyeluruh pada Fase 5.
        </Text>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.app,
  },
  content: {
    padding: Spacing.base,
    paddingTop: Spacing.xl,
  },
  title: {
    fontSize: Typography.fontSize.xl,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  subtitle: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  card: {
    padding: Spacing.lg,
  },
  cardText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
});
