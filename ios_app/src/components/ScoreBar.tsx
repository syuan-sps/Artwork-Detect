import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing } from '../theme';

interface Props {
  label: string;
  score: number;  // 0–1
}

export const ScoreBar: React.FC<Props> = ({ label, score }) => {
  const pct = Math.round(score * 100);
  const width = `${Math.max(2, pct)}%` as `${number}%`;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label.toUpperCase()}</Text>
        <Text style={styles.value}>{pct}%</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  label: {
    fontSize: Typography.size.xxs,
    letterSpacing: Typography.letterSpacing.wider,
    color: Colors.textTertiary,
    fontFamily: Typography.monoFamily,
  },
  value: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    fontFamily: Typography.monoFamily,
  },
  track: {
    height: 2,
    backgroundColor: Colors.barTrack,
    borderRadius: 1,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: Colors.barFill,
    borderRadius: 1,
  },
});
