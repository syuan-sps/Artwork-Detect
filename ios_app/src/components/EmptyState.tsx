import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing } from '../theme';

interface Props {
  icon?: string;
  title: string;
  subtitle?: string;
}

export const EmptyState: React.FC<Props> = ({ icon = '◻', title, subtitle }) => (
  <View style={styles.container}>
    <Text style={styles.icon}>{icon}</Text>
    <Text style={styles.title}>{title}</Text>
    {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
  },
  icon: {
    fontSize: 40,
    color: Colors.border1,
    marginBottom: Spacing.md,
  },
  title: {
    fontFamily: Typography.titleFamily,
    fontSize: Typography.size.lg,
    color: Colors.border2,
    textAlign: 'center',
    fontWeight: Typography.weight.light,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontFamily: Typography.monoFamily,
    fontSize: Typography.size.xs,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    letterSpacing: Typography.letterSpacing.wide,
  },
});
