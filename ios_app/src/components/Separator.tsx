import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../theme';

export const Separator: React.FC = () => <View style={styles.sep} />;

const styles = StyleSheet.create({
  sep: {
    height: 1,
    backgroundColor: Colors.border0,
    marginVertical: 12,
  },
});
