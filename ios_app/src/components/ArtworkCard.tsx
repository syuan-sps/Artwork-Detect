import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { Colors, Typography, Spacing } from '../theme';
import { Artwork } from '../types';
import { TagPill } from './TagPill';

interface Props {
  artwork: Artwork;
  onPress?: () => void;
  style?: ViewStyle;
  /** Show rank badge (e.g. #01) */
  rank?: number;
  /** Overall similarity score 0–1 */
  score?: number;
  /** Sub-scores */
  styleScore?: number;
  themeScore?: number;
  contextScore?: number;
  /** Whether this is the query artwork (no rank, highlighted border) */
  isQuery?: boolean;
}

export const ArtworkCard: React.FC<Props> = ({
  artwork,
  onPress,
  style,
  rank,
  score,
  styleScore,
  themeScore,
  contextScore,
  isQuery,
}) => {
  const yearStr = artwork.year < 0
    ? `${Math.abs(artwork.year)} BCE`
    : String(artwork.year);

  const movementShort = artwork.movement.split('/')[0].trim();

  const content = (
    <View style={[styles.card, isQuery && styles.queryCard, style]}>
      {/* Header row */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          {/* Movement / rank chip */}
          <Text style={styles.chip}>
            {rank !== undefined ? `#${String(rank).padStart(2, '0')}` : ''}
            {rank !== undefined && movementShort ? '  ' : ''}
            {movementShort.toUpperCase()}
          </Text>
          <Text style={styles.title} numberOfLines={2}>
            {artwork.title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {artwork.artist}
            <Text style={styles.artistMeta}>
              {'  '}·{'  '}{yearStr}
            </Text>
          </Text>
          {(artwork.artist_nationality || artwork.artist_gender) ? (
            <Text style={styles.meta}>
              {[artwork.artist_nationality, artwork.artist_gender]
                .filter(Boolean)
                .join('  ·  ')}
            </Text>
          ) : null}
        </View>

        {/* Score badge */}
        {score !== undefined && (
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreValue}>{Math.round(score * 100)}%</Text>
            <Text style={styles.scoreLabel}>SIMILAR</Text>
          </View>
        )}
        {isQuery && (
          <View style={styles.scoreBadge}>
            <Text style={styles.queryBadgeText}>QUERY</Text>
          </View>
        )}
      </View>

      {/* Score bars (results only) */}
      {score !== undefined && styleScore !== undefined && (
        <View style={styles.barsRow}>
          {([
            ['STYLE', styleScore],
            ['THEME', themeScore ?? 0],
            ['CONTEXT', contextScore ?? 0],
          ] as [string, number][]).map(([lbl, s]) => (
            <View key={lbl} style={styles.barItem}>
              <Text style={styles.barLabel}>{lbl}</Text>
              <Text style={styles.barValue}>{Math.round(s * 100)}%</Text>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { width: `${Math.max(2, Math.round(s * 100))}%` as `${number}%` }]} />
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Description */}
      <Text style={styles.description} numberOfLines={3}>
        {artwork.description}
      </Text>

      {/* Tags */}
      <View style={styles.tagsRow}>
        {artwork.tags.slice(0, 6).map((t) => (
          <TagPill key={t} label={t} />
        ))}
      </View>

      {/* Museum */}
      <Text style={styles.museum} numberOfLines={1}>
        {artwork.museum}
      </Text>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.75}>
        {content}
      </TouchableOpacity>
    );
  }
  return content;
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: Colors.border0,
    backgroundColor: Colors.bg1,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  queryCard: {
    borderColor: Colors.border1,
    backgroundColor: Colors.bg2,
    marginBottom: Spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  headerLeft: {
    flex: 1,
  },
  chip: {
    fontSize: Typography.size.xxs,
    letterSpacing: Typography.letterSpacing.wider,
    color: Colors.textTertiary,
    fontFamily: Typography.monoFamily,
    marginBottom: 5,
  },
  title: {
    fontSize: Typography.size.lg,
    fontFamily: Typography.titleFamily,
    color: Colors.textPrimary,
    fontWeight: Typography.weight.light,
    lineHeight: 26,
    marginBottom: 3,
  },
  artist: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    fontFamily: Typography.monoFamily,
    marginBottom: 2,
  },
  artistMeta: {
    color: Colors.textTertiary,
  },
  meta: {
    fontSize: Typography.size.xxs,
    color: Colors.textTertiary,
    fontFamily: Typography.monoFamily,
    letterSpacing: Typography.letterSpacing.wide,
    marginTop: 2,
  },
  scoreBadge: {
    alignItems: 'flex-end',
    flexShrink: 0,
  },
  scoreValue: {
    fontSize: Typography.size.xl,
    fontFamily: Typography.titleFamily,
    color: Colors.textPrimary,
    fontWeight: Typography.weight.light,
    lineHeight: 28,
  },
  scoreLabel: {
    fontSize: Typography.size.xxs,
    letterSpacing: Typography.letterSpacing.widest,
    color: Colors.textTertiary,
    fontFamily: Typography.monoFamily,
  },
  queryBadgeText: {
    fontSize: Typography.size.xxs,
    letterSpacing: Typography.letterSpacing.widest,
    color: Colors.textTertiary,
    fontFamily: Typography.monoFamily,
    marginTop: 4,
  },
  barsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.border0,
  },
  barItem: {
    flex: 1,
  },
  barLabel: {
    fontSize: 9,
    letterSpacing: Typography.letterSpacing.wider,
    color: Colors.textTertiary,
    fontFamily: Typography.monoFamily,
    marginBottom: 2,
  },
  barValue: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    fontFamily: Typography.monoFamily,
    marginBottom: 3,
  },
  barTrack: {
    height: 2,
    backgroundColor: Colors.barTrack,
    borderRadius: 1,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: Colors.barFill,
  },
  description: {
    fontSize: Typography.size.sm,
    color: Colors.textTertiary,
    lineHeight: 18,
    fontStyle: 'italic',
    marginBottom: Spacing.sm,
    paddingLeft: Spacing.sm,
    borderLeftWidth: 1,
    borderLeftColor: Colors.border0,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Spacing.xs,
  },
  museum: {
    fontSize: Typography.size.xxs,
    color: Colors.textMuted,
    fontFamily: Typography.monoFamily,
    letterSpacing: Typography.letterSpacing.wide,
    marginTop: 2,
  },
});
