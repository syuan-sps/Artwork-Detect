import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { api } from '../services/api';
import { Artwork, RootStackParamList } from '../types';
import { Colors, Typography, Spacing } from '../theme';
import { TagPill } from '../components/TagPill';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const PERIODS = [
  { label: 'ALL', value: '' },
  { label: 'ANCIENT', value: 'Ancient / Medieval' },
  { label: 'RENAISSANCE', value: 'Early Renaissance' },
  { label: 'BAROQUE', value: 'Baroque' },
  { label: 'ROMANTIC', value: 'Romanticism' },
  { label: 'IMPRESSIONISM', value: 'Realism / Impressionism' },
  { label: 'MODERN', value: 'Modernism' },
  { label: 'CONTEMPORARY', value: 'Contemporary' },
];

interface BrowseRowProps {
  artwork: Artwork;
  onPress: () => void;
}

const BrowseRow: React.FC<BrowseRowProps> = ({ artwork, onPress }) => {
  const yearStr = artwork.year < 0
    ? `${Math.abs(artwork.year)} BCE`
    : String(artwork.year);

  return (
    <TouchableOpacity style={row.wrap} onPress={onPress} activeOpacity={0.7}>
      <View style={row.left}>
        <Text style={row.title} numberOfLines={1}>{artwork.title}</Text>
        <Text style={row.artist} numberOfLines={1}>
          {artwork.artist}{'  '}
          <Text style={row.year}>{yearStr}</Text>
        </Text>
        <Text style={row.movement} numberOfLines={1}>
          {artwork.movement.split('/')[0].trim().toUpperCase()}
        </Text>
      </View>
      <Text style={row.arrow}>→</Text>
    </TouchableOpacity>
  );
};

const row = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border0,
  },
  left: { flex: 1 },
  title: {
    fontFamily: Typography.titleFamily,
    fontSize: Typography.size.base,
    color: Colors.textPrimary,
    fontWeight: Typography.weight.light,
    marginBottom: 2,
  },
  artist: {
    fontFamily: Typography.monoFamily,
    fontSize: Typography.size.xs,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  year: { color: Colors.textTertiary },
  movement: {
    fontFamily: Typography.monoFamily,
    fontSize: Typography.size.xxs,
    color: Colors.textTertiary,
    letterSpacing: Typography.letterSpacing.wide,
  },
  arrow: {
    fontFamily: Typography.monoFamily,
    fontSize: Typography.size.base,
    color: Colors.textTertiary,
    marginLeft: Spacing.sm,
  },
});

export const BrowseScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('');
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const LIMIT = 40;

  const load = useCallback(async (p: string, o: number, reset = false) => {
    if (reset) setLoading(true);
    else setLoadingMore(true);

    try {
      const data = await api.listArtworks({
        period: p || undefined,
        limit: LIMIT,
        offset: o,
      });
      setArtworks((prev) => (reset ? data : [...prev, ...data]));
      setHasMore(data.length === LIMIT);
      setOffset(o + data.length);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    setOffset(0);
    setHasMore(true);
    load(period, 0, true);
  }, [period, load]);

  const onEndReached = () => {
    if (!loadingMore && hasMore) load(period, offset);
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Browse</Text>
        <Text style={styles.headerSub}>1,026 MASTERWORKS</Text>
      </View>

      {/* Period filter tabs */}
      <FlatList
        data={PERIODS}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(i) => i.value}
        contentContainerStyle={styles.tabs}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.tab, period === item.value && styles.tabActive]}
            onPress={() => setPeriod(item.value)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, period === item.value && styles.tabTextActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
        style={styles.tabScroll}
      />

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={Colors.textSecondary} />
        </View>
      ) : (
        <FlatList
          data={artworks}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <BrowseRow
              artwork={item}
              onPress={() => navigation.navigate('Detail', { artwork: item })}
            />
          )}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.footerLoad}>
                <ActivityIndicator size="small" color={Colors.textTertiary} />
              </View>
            ) : null
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg0 },
  header: {
    paddingTop: 10,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border0,
  },
  headerTitle: {
    fontFamily: Typography.titleFamily,
    fontSize: Typography.size.xxl,
    fontWeight: Typography.weight.light,
    color: Colors.textPrimary,
    lineHeight: 38,
  },
  headerSub: {
    fontFamily: Typography.monoFamily,
    fontSize: Typography.size.xxs,
    color: Colors.textTertiary,
    letterSpacing: Typography.letterSpacing.widest,
    marginTop: 2,
  },
  tabScroll: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border0,
  },
  tabs: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    gap: 6,
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.border0,
  },
  tabActive: {
    borderColor: Colors.textSecondary,
    backgroundColor: Colors.bg2,
  },
  tabText: {
    fontFamily: Typography.monoFamily,
    fontSize: Typography.size.xxs,
    color: Colors.textTertiary,
    letterSpacing: Typography.letterSpacing.wider,
  },
  tabTextActive: {
    color: Colors.textPrimary,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerLoad: {
    padding: Spacing.md,
    alignItems: 'center',
  },
});
