import type { PropsWithChildren } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';

import { colors, radii } from './theme';

type GlassCardProps = PropsWithChildren<{
  style?: ViewStyle | ViewStyle[];
}>;

export function GlassCard({ children, style }: GlassCardProps) {
  return (
    <View style={[styles.shell, style]}>
      <BlurView intensity={28} tint="light" style={StyleSheet.absoluteFill} />
      <View style={styles.overlay}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    overflow: 'hidden',
    shadowColor: '#A08E7A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 4,
    backgroundColor: 'rgba(243,232,216,0.55)',
  },
  overlay: {
    padding: 0,
    backgroundColor: 'rgba(246,236,223,0.56)',
  },
});
