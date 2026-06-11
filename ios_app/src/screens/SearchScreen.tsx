import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Keyboard,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useSearch } from '../hooks/useSearch';
import { ArtworkCard } from '../components/ArtworkCard';
import { EmptyState } from '../components/EmptyState';
import { Colors, Typography, Spacing } from '../theme';
import { RootStackParamList, ActiveFilters, SimilarResult } from '../types';

const QUICK_PICKS = [
  'Starry Night',
  'Mona Lisa',
  'The Scream',
  'Guernica',
  'Water Lilies',
  'The Great Wave',
  'Nighthawks',
  'The Kiss',
];

type Nav = NativeStackNavigationProp<RootStackParamList>;

export const SearchScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<ActiveFilters>({});
  const inputRef = useRef<TextInput>(null);
  const { result, loading, error, search, clear } = useSearch();

  const handleSearch = useCallback((q: string) => {
    if (q.trim()) search(q, 8, filters);
    else clear();
  }, [filters, search, clear]);

  const handleQuickPick = useCallback((title: string) => {
    setQuery(title);
    Keyboard.dismiss();
    search(title, 8, filters);
  }, [filters, search]);

  const openFilters = () => {
    navigation.navigate('Filter', {
      filters,
      onApply: (f: ActiveFilters) => {
        setFilters(f);
        if (query.trim()) search(query, 8, f);
      },
    });
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const renderResult = ({ item, index }: { item: SimilarResult; index: number }) => (
    <ArtworkCard
      artwork={item.artwork}
      rank={index + 1}
      score={item.overall_score}
      styleScore={item.style_score}
      themeScore={item.theme_score}
      contextScore={item.context_score}
      onPress={() => navigation.navigate('Detail', { artwork: item.artwork, fromResults: true })}
    />
  );

  const hasResults = result && !result.error && result.results.length > 0;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.root}
    >
      <StatusBar style="light" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Artwork Search</Text>
        <Text style={styles.headerSub}>1,026 WORKS · STYLE · THEME · HISTORY</Text>
      </View>

      {/* ── Search bar row ── */}
      <View style={styles.searchRow}>
        <View style={styles.inputWrap}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={() => handleSearch(query)}
            placeholder='title or artist name…'
            placeholderTextColor={Colors.textMuted}
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
            selectionColor={Colors.accentDim}
          />
          {query.length > 0 && (
            <TouchableOpacity
              style={styles.clearBtn}
              onPress={() => { setQuery(''); clear(); }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.clearBtnText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Filter button */}
        <TouchableOpacity style={styles.filterBtn} onPress={openFilters} activeOpacity={0.7}>
          <Text style={styles.filterBtnText}>
            {activeFilterCount > 0 ? `FILTER · ${activeFilterCount}` : 'FILTER'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Active filter chips summary */}
      {activeFilterCount > 0 && (
        <View style={styles.filterSummary}>
          {Object.entries(filters)
            .filter(([, v]) => v)
            .map(([k, v]) => (
              <View key={k} style={styles.activeChip}>
                <Text style={styles.activeChipText}>
                  {k.toUpperCase()}: {v}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    const next = { ...filters, [k]: undefined };
                    setFilters(next);
                    if (query.trim()) search(query, 8, next);
                  }}
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                >
                  <Text style={styles.activeChipRemove}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
        </View>
      )}

      {/* ── Content ── */}
      <Pressable style={styles.flex} onPress={Keyboard.dismiss}>
        {loading && (
          <View style={styles.centered}>
            <ActivityIndicator color={Colors.textSecondary} />
          </View>
        )}

        {!loading && error && (
          <View style={styles.centered}>
            <Text style={styles.errorText}>{error}</Text>
            <Text style={styles.errorHint}>
              Make sure the backend is running at localhost:8000
            </Text>
          </View>
        )}

        {!loading && !error && !query && (
          <View style={styles.quickWrap}>
            <Text style={styles.quickLabel}>QUICK SEARCH</Text>
            <View style={styles.quickGrid}>
              {QUICK_PICKS.map((t) => (
                <TouchableOpacity
                  key={t}
                  style={styles.quickBtn}
                  onPress={() => handleQuickPick(t)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.quickBtnText}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <EmptyState
              title="Search any artwork"
              subtitle={`Type a title or artist name\nFuzzy matching handles misspellings`}
            />
          </View>
        )}

        {!loading && !error && query && !hasResults && result && (
          <EmptyState
            icon="◻"
            title="No results"
            subtitle="Try a different title or remove some filters"
          />
        )}

        {!loading && !error && hasResults && result && (
          <FlatList
            data={result.results}
            keyExtractor={(item) => String(item.artwork.id)}
            renderItem={renderResult}
            ListHeaderComponent={
              <View>
                {/* Query artwork card */}
                {result.query_artwork && (
                  <ArtworkCard
                    artwork={result.query_artwork}
                    isQuery
                    onPress={() =>
                      navigation.navigate('Detail', { artwork: result.query_artwork! })
                    }
                  />
                )}
                <Text style={styles.resultsHeader}>
                  {result.results.length} SIMILAR ARTWORKS
                  {result.match_score < 100
                    ? `  ·  MATCH ${result.match_score}%`
                    : ''}
                </Text>
              </View>
            }
            contentContainerStyle={styles.list}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          />
        )}
      </Pressable>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.bg0,
  },
  flex: { flex: 1 },
  header: {
    paddingTop: 60,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border0,
  },
  headerTitle: {
    fontFamily: Typography.titleFamily,
    fontSize: Typography.size.xxl,
    fontWeight: Typography.weight.light,
    color: Colors.textPrimary,
    lineHeight: 40,
  },
  headerSub: {
    fontFamily: Typography.monoFamily,
    fontSize: Typography.size.xxs,
    color: Colors.textTertiary,
    letterSpacing: Typography.letterSpacing.widest,
    marginTop: 3,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border0,
  },
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border1,
    backgroundColor: Colors.bg2,
    paddingHorizontal: Spacing.sm,
  },
  input: {
    flex: 1,
    height: 44,
    color: Colors.textPrimary,
    fontFamily: Typography.monoFamily,
    fontSize: Typography.size.base,
  },
  clearBtn: {
    padding: 4,
  },
  clearBtnText: {
    color: Colors.textTertiary,
    fontSize: Typography.size.xs,
    fontFamily: Typography.monoFamily,
  },
  filterBtn: {
    borderWidth: 1,
    borderColor: Colors.border1,
    paddingHorizontal: Spacing.sm,
    height: 44,
    justifyContent: 'center',
    backgroundColor: Colors.bg2,
  },
  filterBtnText: {
    fontSize: Typography.size.xxs,
    letterSpacing: Typography.letterSpacing.widest,
    color: Colors.textSecondary,
    fontFamily: Typography.monoFamily,
  },
  filterSummary: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    gap: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border0,
  },
  activeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border2,
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 6,
  },
  activeChipText: {
    fontSize: Typography.size.xxs,
    color: Colors.textSecondary,
    fontFamily: Typography.monoFamily,
    letterSpacing: Typography.letterSpacing.wide,
  },
  activeChipRemove: {
    fontSize: Typography.size.xxs,
    color: Colors.textTertiary,
    fontFamily: Typography.monoFamily,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xxl,
  },
  errorText: {
    fontFamily: Typography.monoFamily,
    fontSize: Typography.size.sm,
    color: '#666',
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  errorHint: {
    fontFamily: Typography.monoFamily,
    fontSize: Typography.size.xs,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  quickWrap: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
  },
  quickLabel: {
    fontSize: Typography.size.xxs,
    letterSpacing: Typography.letterSpacing.widest,
    color: Colors.textTertiary,
    fontFamily: Typography.monoFamily,
    marginBottom: Spacing.sm,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: Spacing.xl,
  },
  quickBtn: {
    borderWidth: 1,
    borderColor: Colors.border0,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  quickBtnText: {
    fontSize: Typography.size.xs,
    color: Colors.textTertiary,
    fontFamily: Typography.monoFamily,
  },
  list: {
    padding: Spacing.md,
  },
  resultsHeader: {
    fontSize: Typography.size.xxs,
    letterSpacing: Typography.letterSpacing.widest,
    color: Colors.textTertiary,
    fontFamily: Typography.monoFamily,
    marginBottom: Spacing.sm,
  },
});
