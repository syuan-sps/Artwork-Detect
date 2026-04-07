export const Colors = {
  // Background layers
  bg0: '#080808',
  bg1: '#111111',
  bg2: '#181818',
  bg3: '#222222',

  // Borders and dividers
  border0: '#1a1a1a',
  border1: '#282828',
  border2: '#333333',

  // Text
  textPrimary: '#e8e8e8',
  textSecondary: '#888888',
  textTertiary: '#444444',
  textMuted: '#2e2e2e',

  // Accent (pure white only)
  accent: '#ffffff',
  accentDim: '#aaaaaa',

  // Score bar fill
  barFill: '#555555',
  barTrack: '#1e1e1e',
} as const;

export const Typography = {
  // Serif for titles
  titleFamily: 'Georgia',
  monoFamily: 'Courier New',
  sansFamily: 'System',

  size: {
    xxs: 10,
    xs: 11,
    sm: 12,
    base: 14,
    md: 16,
    lg: 20,
    xl: 26,
    xxl: 34,
  },
  weight: {
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
  },
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.8,
    wider: 1.5,
    widest: 2.5,
  },
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const Radius = {
  none: 0,
  sm: 4,
  md: 8,
} as const;
