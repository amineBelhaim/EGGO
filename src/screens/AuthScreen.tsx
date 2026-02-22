import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { useApp } from '../context/AppContext';
import { AppBackdrop } from '../ui/AppBackdrop';
import { resolveArt } from '../ui/art';
import { GradientButton } from '../ui/GradientButton';
import { GlassCard } from '../ui/GlassCard';
import { colors, fonts, gradients, radii } from '../ui/theme';

type AuthMode = 'signIn' | 'signUp';

export function AuthScreen() {
  const { signIn, signUp, loading, error, clearError } = useApp();
  const [mode, setMode] = useState<AuthMode>('signIn');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isValid =
    email.trim().includes('@') && password.length >= 6 && (mode === 'signIn' || username.trim().length >= 2);

  const submit = async () => {
    clearError();
    if (mode === 'signIn') {
      await signIn(email.trim(), password);
      return;
    }
    await signUp(email.trim(), password, username.trim());
  };

  return (
    <SafeAreaView style={styles.safe}>
      <AppBackdrop />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboard}>
        <View style={styles.wrap}>
          <View style={styles.hero}>
            <LinearGradient colors={gradients.amber} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.logoHalo}>
              <Image source={resolveArt('pet_flamby_egg')} style={styles.logoArt} resizeMode="contain" />
            </LinearGradient>
            <Text style={styles.title}>Focus Hatch</Text>
            <Text style={styles.subtitle}>Un rituel de focus chill, social et visuel.</Text>
          </View>

          <GlassCard style={styles.card}>
            <View style={styles.switchRow}>
              <Pressable
                style={[styles.switchButton, mode === 'signIn' && styles.switchButtonActive]}
                onPress={() => setMode('signIn')}
              >
                <Text style={[styles.switchLabel, mode === 'signIn' && styles.switchLabelActive]}>Connexion</Text>
              </Pressable>
              <Pressable
                style={[styles.switchButton, mode === 'signUp' && styles.switchButtonActive]}
                onPress={() => setMode('signUp')}
              >
                <Text style={[styles.switchLabel, mode === 'signUp' && styles.switchLabelActive]}>Inscription</Text>
              </Pressable>
            </View>

            {mode === 'signUp' && (
              <Field
                icon="person-outline"
                placeholder="Pseudo"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            )}

            <Field
              icon="mail-outline"
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Field
              icon="key-outline"
              placeholder="Mot de passe (6+)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            {!!error && <Text style={styles.error}>{error}</Text>}

            {loading ? (
              <View style={styles.loadingBar}>
                <ActivityIndicator color={colors.text} />
              </View>
            ) : (
              <GradientButton
                label={mode === 'signIn' ? 'Entrer dans la hatchery' : 'Creer mon compte'}
                onPress={() => void submit()}
                disabled={!isValid}
              />
            )}
          </GlassCard>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type FieldProps = {
  icon: keyof typeof Ionicons.glyphMap;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  keyboardType?: 'default' | 'email-address';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  secureTextEntry?: boolean;
};

function Field({
  icon,
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  autoCapitalize = 'none',
  secureTextEntry,
}: FieldProps) {
  return (
    <View style={styles.inputShell}>
      <Ionicons name={icon} size={18} color={colors.textMuted} style={styles.inputIcon} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        secureTextEntry={secureTextEntry}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  keyboard: {
    flex: 1,
  },
  wrap: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 16,
  },
  hero: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  logoHalo: {
    width: 82,
    height: 82,
    borderRadius: 41,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoArt: {
    width: 64,
    height: 64,
  },
  title: {
    fontSize: 34,
    fontFamily: fonts.displayBold,
    letterSpacing: -0.8,
    color: colors.text,
  },
  subtitle: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    textAlign: 'center',
    paddingHorizontal: 22,
    lineHeight: 20,
    fontSize: 14,
  },
  card: {
    padding: 14,
    borderRadius: radii.lg,
    gap: 10,
    backgroundColor: 'rgba(244, 233, 218, 0.78)',
  },
  switchRow: {
    flexDirection: 'row',
    borderRadius: radii.sm,
    backgroundColor: 'rgba(246, 238, 228, 0.82)',
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: 4,
  },
  switchButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  switchButtonActive: {
    backgroundColor: colors.cardSoft,
  },
  switchLabel: {
    color: colors.textMuted,
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
  },
  switchLabelActive: {
    color: colors.text,
    fontFamily: fonts.bodyBold,
  },
  inputShell: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(250, 245, 238, 0.96)',
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    paddingVertical: 11,
  },
  loadingBar: {
    minHeight: 48,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardSoft,
  },
  error: {
    color: colors.red,
    fontSize: 12,
    fontFamily: fonts.bodyMedium,
  },
});
