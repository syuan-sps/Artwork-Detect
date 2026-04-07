import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors, Typography } from '../theme';

interface Props {
  label: string;
  active?: boolean;
  onPress: () => void;
}

export const FilterChip: React.FC<Props> = ({ label, active, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    style={[styles.chip, active && styles.active]}
  >
    <Text style={[styles.text, active && styles.activeText]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  chip: {
    borderWidth: 1,
    borderColor: Colors.border1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 6,
    marginBottom: 6,
  },
  active: {
    borderColor: Colors.textSecondary,
    backgroundColor: Colors.bg3,
  },
  text: {
    fontSize: Typography.size.xs,
    color: Colors.textTertiary,
    fontFamily: Typography.monoFamily,
    letterSpacing: Typography.letterSpacing.wide,
  },
  activeText: {
    color: Colors.textPrimary,
  },
});
