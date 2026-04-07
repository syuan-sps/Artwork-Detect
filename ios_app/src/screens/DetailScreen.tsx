import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Colors, Typography, Spacing } from '../theme';
import { RootStackParamList, Artwork } from '../types';
import { TagPill } from '../components/TagPill';
import { Separator } from '../components/Separator';
import { api } from '../services/api';
import { useSearch } from '../hooks/useSearch';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'Detail'>;

const Section: React.FC<{ label: string; value: string | string[] }> = ({ label, value }) => {
  const text = Array.isArray(value) ? value.join(', ') : value;
  if (!text) return null;
  return (
    <View style={section.wrap}>
      <Text style={section.label}>{label.toUpperCase()}</Text>
      <Text style={section.value}>{text}</Text>
    </View>
  );
};

const section = StyleSheet.create({
  wrap: { marginBottom: Spacing.md },
  label: {
    fontSize: Typography.size.xxs,
    letterSpacing: Typography.letterSpacing.widest,
    color: Colors.textTertiary,
    fontFamily: Typography.monoFamily,
    marginBottom: 4,
  },
  value: {
    fontSize: Typography.size.base,
    color: Colors.textSecondary,
    lineHeight: 22,
    fontFamily: Typography.monoFamily,
  },
});

export const DetailScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { artwork } = route.params;

  const yearStr = artwork.year < 0
    ? `${Math.abs(artwork.year)} BCE`
    : String(artwork.year);

  const movementShort = artwork.movement.split('/')[0].trim();

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="light" />

      {/* ── Nav bar ── */}
      <View style={styles.navbar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.backText}>← BACK</Text>
        </TouchableOpacity>

        {/* Find similar from this artwork */}
        <TouchableOpacity
          style={styles.similarBtn}
          onPress={() => {
            navigation.navigate('MainTabs');
            // navigate back to search tab and pre-fill query
            // (handled via event or global state; kept simple here)
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.similarBtnText}>FIND SIMILAR</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Title block ── */}
        <Text style={styles.movementChip}>{movementShort.toUpperCase()}</Text>
        <Text style={styles.title}>{artwork.title}</Text>
        <Text style={styles.artist}>{artwork.artist}</Text>
        <Text style={styles.yearMedium}>
          {yearStr}{'  '}·{'  '}{artwork.medium}
        </Text>
        <Text style={styles.museum}>{artwork.museum}</Text>

        <Separator />

        {/* ── Description ── */}
        {artwork.description ? (
          <Text style={styles.description}>{artwork.description}</Text>
        ) : null}

        <Separator />

        {/* ── Metadata grid ── */}
        <Section label="Movement" value={artwork.movement} />
        <Section label="Period" value={artwork.period} />
        <Section label="Style" value={artwork.style} />
        <Section label="Subject" value={artwork.subject} />
        <Section label="Color Palette" value={artwork.color_palette} />
        <Section label="Artist Nationality" value={artwork.artist_nationality} />
        <Section label="Artist Gender" value={artwork.artist_gender} />

        <Separator />

        {/* ── Historical significance ── */}
        {artwork.historical_significance ? (
          <View style={styles.sigBlock}>
            <Text style={styles.sigLabel}>HISTORICAL SIGNIFICANCE</Text>
            <Text style={styles.sigText}>{artwork.historical_significance}</Text>
          </View>
        ) : null}

        <Separator />

        {/* ── Tags ── */}
        <Text style={styles.tagsLabel}>TAGS</Text>
        <View style={styles.tagsRow}>
          {artwork.tags.map((t) => (
            <TagPill key={t} label={t} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.bg0,
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border0,
  },
  backBtn: { padding: 4 },
  backText: {
    fontFamily: Typography.monoFamily,
    fontSize: Typography.size.xs,
    color: Colors.textSecondary,
    letterSpacing: Typography.letterSpacing.wider,
  },
  similarBtn: {
    borderWidth: 1,
    borderColor: Colors.border1,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
  },
  similarBtnText: {
    fontFamily: Typography.monoFamily,
    fontSize: Typography.size.xxs,
    color: Colors.textSecondary,
    letterSpacing: Typography.letterSpacing.widest,
  },
  scroll: { flex: 1 },
  content: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  movementChip: {
    fontFamily: Typography.monoFamily,
    fontSize: Typography.size.xxs,
    color: Colors.textTertiary,
    letterSpacing: Typography.letterSpacing.wider,
    marginBottom: Spacing.sm,
  },
  title: {
    fontFamily: Typography.titleFamily,
    fontSize: Typography.size.xxl,
    fontWeight: Typography.weight.light,
    color: Colors.textPrimary,
    lineHeight: 40,
    marginBottom: Spacing.xs,
  },
  artist: {
    fontFamily: Typography.monoFamily,
    fontSize: Typography.size.md,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  yearMedium: {
    fontFamily: Typography.monoFamily,
    fontSize: Typography.size.sm,
    color: Colors.textTertiary,
    marginBottom: 4,
  },
  museum: {
    fontFamily: Typography.monoFamily,
    fontSize: Typography.size.xs,
    color: Colors.textTertiary,
    letterSpacing: Typography.letterSpacing.wide,
  },
  description: {
    fontFamily: Typography.titleFamily,
    fontSize: Typography.size.md,
    color: Colors.textSecondary,
    lineHeight: 26,
    fontStyle: 'italic',
    fontWeight: Typography.weight.light,
  },
  sigBlock: { marginBottom: Spacing.md },
  sigLabel: {
    fontFamily: Typography.monoFamily,
    fontSize: Typography.size.xxs,
    color: Colors.textTertiary,
    letterSpacing: Typography.letterSpacing.widest,
    marginBottom: Spacing.sm,
  },
  sigText: {
    fontFamily: Typography.monoFamily,
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  tagsLabel: {
    fontFamily: Typography.monoFamily,
    fontSize: Typography.size.xxs,
    color: Colors.textTertiary,
    letterSpacing: Typography.letterSpacing.widest,
    marginBottom: Spacing.sm,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
