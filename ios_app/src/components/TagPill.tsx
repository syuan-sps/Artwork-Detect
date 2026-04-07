import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Typography } from '../theme';

interface Props {
  label: string;
  onPress?: () => void;
}

export const TagPill: React.FC<Props> = ({ label, onPress }) => {
  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} style={styles.pill} activeOpacity={0.6}>
        <Text style={styles.text}>{label}</Text>
      </TouchableOpacity>
    );
  }
  return (
    <View style={styles.pill}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  pill: {
    borderWidth: 1,
    borderColor: Colors.border1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 5,
    marginBottom: 5,
  },
  text: {
    fontSize: Typography.size.xxs,
    color: Colors.textTertiary,
    letterSpacing: Typography.letterSpacing.wide,
    fontFamily: Typography.monoFamily,
  },
});
