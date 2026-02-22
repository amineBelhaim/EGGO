export const colors = {
  bg: '#EFE7DC',
  bgTop: '#F7F1E8',
  bgBottom: '#E7DBCD',
  card: '#F2E8DC',
  cardAlt: '#EADFD1',
  cardSoft: '#E2D5C6',
  text: '#2D2F3A',
  textMuted: '#8E847A',
  gold: '#D6A15E',
  green: '#81B89F',
  red: '#E88F9B',
  cyan: '#9ABEDD',
  sky: '#7F9DDB',
  border: 'rgba(94, 79, 62, 0.14)',
  strongBorder: 'rgba(127, 157, 219, 0.58)',
  blackOverlay: 'rgba(255,255,255,0.08)',
};

export const fonts = {
  displayBold: 'Sora_700Bold',
  displaySemi: 'Sora_600SemiBold',
  body: 'SpaceGrotesk_400Regular',
  bodyMedium: 'SpaceGrotesk_500Medium',
  bodyBold: 'SpaceGrotesk_700Bold',
};

export const radii = {
  sm: 12,
  md: 16,
  lg: 22,
  xl: 28,
};

export const gradients = {
  appBackground: [colors.bgTop, colors.bgBottom] as const,
  spotlight: ['rgba(161, 188, 227, 0.25)', 'rgba(227, 194, 164, 0.05)'] as const,
  cta: ['#6F90D4', '#5378C6'] as const,
  danger: ['#EEA2AC', '#E87986'] as const,
  amber: ['#F0CFB4', '#E8B8A4'] as const,
};
