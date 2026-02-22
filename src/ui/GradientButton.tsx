import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { colors, fonts, gradients, radii } from './theme';

type GradientButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  danger?: boolean;
  compact?: boolean;
};

export function GradientButton({ label, onPress, disabled, danger, compact }: GradientButtonProps) {
  return (
    <Pressable onPress={onPress} disabled={disabled} style={[styles.shell, compact && styles.compact, disabled && styles.disabled]}>
      <LinearGradient colors={danger ? gradients.danger : gradients.cta} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradient}>
        <View style={styles.rim}>
          <Text style={styles.label}>{label}</Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shell: {
    borderRadius: radii.sm,
    overflow: 'hidden',
  },
  compact: {
    alignSelf: 'flex-start',
  },
  disabled: {
    opacity: 0.5,
  },
  gradient: {
    borderRadius: radii.sm,
    padding: 1,
  },
  rim: {
    minHeight: 46,
    borderRadius: radii.sm - 1,
    backgroundColor: 'rgba(245, 237, 226, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  label: {
    color: '#ffffff',
    fontFamily: fonts.bodyBold,
    fontSize: 15,
    letterSpacing: 0.2,
  },
});
