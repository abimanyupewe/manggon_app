/**
 * Security Screen Placeholder (Ready for Phase 4)
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors, Spacing, Typography } from '../../../core/theme';
import { Card } from '../../components/common';

export const SecurityScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Satpam Digital</Text>
      <Text style={styles.subtitle}>Izin pulang malam dan pendataan tamu menginap wanita.</Text>
      <Card variant="outlined" style={styles.card}>
        <Text style={styles.cardText}>
          Modul Satpam Digital akan diintegrasikan secara menyeluruh pada Fase 4.
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
