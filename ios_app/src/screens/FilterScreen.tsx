import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Colors, Typography, Spacing } from '../theme';
import { RootStackParamList, ActiveFilters } from '../types';
import { useFilterOptions } from '../hooks/useFilterOptions';
import { FilterChip } from '../components/FilterChip';

type Route = RouteProp<RootStackParamList, 'Filter'>;

const GENDERS = ['male', 'female', 'non-binary', 'unknown'];

const PERIODS = [
  'Ancient / Medieval',
  'Early Renaissance',
  'High Renaissance / Mannerism',
  'Baroque',
  'Rococo / Neoclassicism',
  'Romanticism',
  'Realism / Impressionism',
  'Modernism',
  'Post-War / Contemporary',
  'Contemporary',
];

interface FilterSectionProps {
  title: string;
  items: string[];
  selected?: string;
  onSelect: (v: string | undefined) => void;
  limit?: number;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  title, items, selected, onSelect, limit = 30,
}) => {
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? items : items.slice(0, limit);

  return (
    <View style={fsStyles.wrap}>
      <Text style={fsStyles.title}>{title.toUpperCase()}</Text>
      <View style={fsStyles.chips}>
        {displayed.map((item) => (
          <FilterChip
            key={item}
            label={item}
            active={selected === item}
            onPress={() => onSelect(selected === item ? undefined : item)}
          />
        ))}
        {items.length > limit && !showAll && (
          <TouchableOpacity onPress={() => setShowAll(true)}>
            <Text style={fsStyles.more}>+{items.length - limit} more</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const fsStyles = StyleSheet.create({
  wrap: { marginBottom: Spacing.lg },
  title: {
    fontFamily: Typography.monoFamily,
    fontSize: Typography.size.xxs,
    color: Colors.textTertiary,
    letterSpacing: Typography.letterSpacing.widest,
    marginBottom: Spacing.sm,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap' },
  more: {
    fontFamily: Typography.monoFamily,
    fontSize: Typography.size.xs,
    color: Colors.textTertiary,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
});

export const FilterScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<Route>();
  const { filters: initial, onApply } = route.params;
  const [filters, setFilters] = useState<ActiveFilters>(initial);
  const { options } = useFilterOptions();

  const set = (key: keyof ActiveFilters) => (value: string | undefined) =>
    setFilters((f) => ({ ...f, [key]: value }));

  const activeCount = Object.values(filters).filter(Boolean).length;

  const apply = () => {
    onApply(filters);
    navigation.goBack();
  };

  const reset = () => setFilters({});

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="light" />

      {/* ── Nav ── */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.cancelBtn}>
          <Text style={styles.cancelText}>CANCEL</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle}>
          FILTERS{activeCount > 0 ? `  ·  ${activeCount} ACTIVE` : ''}
        </Text>
        <TouchableOpacity onPress={reset} style={styles.resetBtn}>
          <Text style={styles.resetText}>RESET</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Period */}
        <FilterSection
          title="Period"
          items={PERIODS}
          selected={filters.period}
          onSelect={set('period')}
          limit={PERIODS.length}
        />

        {/* Artist gender */}
        <FilterSection
          title="Artist Gender"
          items={GENDERS}
          selected={filters.gender}
          onSelect={set('gender')}
          limit={GENDERS.length}
        />

        {/* Movement */}
        {options && (
          <FilterSection
            title="Movement"
            items={options.movements}
            selected={filters.movement}
            onSelect={set('movement')}
            limit={20}
          />
        )}

        {/* Nationality */}
        {options && (
          <FilterSection
            title="Nationality"
            items={options.nationalities}
            selected={filters.nationality}
            onSelect={set('nationality')}
            limit={20}
          />
        )}
      </ScrollView>

      {/* ── Apply bar ── */}
      <View style={styles.applyBar}>
        <TouchableOpacity style={styles.applyBtn} onPress={apply} activeOpacity={0.8}>
          <Text style={styles.applyBtnText}>
            APPLY FILTERS{activeCount > 0 ? ` (${activeCount})` : ''}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg0 },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border0,
  },
  cancelBtn: { padding: 4 },
  cancelText: {
    fontFamily: Typography.monoFamily,
    fontSize: Typography.size.xs,
    color: Colors.textSecondary,
    letterSpacing: Typography.letterSpacing.wider,
  },
  navTitle: {
    fontFamily: Typography.monoFamily,
    fontSize: Typography.size.xs,
    color: Colors.textTertiary,
    letterSpacing: Typography.letterSpacing.widest,
  },
  resetBtn: { padding: 4 },
  resetText: {
    fontFamily: Typography.monoFamily,
    fontSize: Typography.size.xs,
    color: Colors.textSecondary,
    letterSpacing: Typography.letterSpacing.wider,
  },
  scroll: { flex: 1 },
  content: { padding: Spacing.md, paddingBottom: Spacing.xxl },
  applyBar: {
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border0,
    backgroundColor: Colors.bg0,
  },
  applyBtn: {
    borderWidth: 1,
    borderColor: Colors.textSecondary,
    padding: Spacing.md,
    alignItems: 'center',
  },
  applyBtnText: {
    fontFamily: Typography.monoFamily,
    fontSize: Typography.size.sm,
    color: Colors.textPrimary,
    letterSpacing: Typography.letterSpacing.widest,
  },
});
