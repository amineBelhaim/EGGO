import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useApp } from '../context/AppContext';
import { AppBackdrop } from '../ui/AppBackdrop';
import { resolveArt } from '../ui/art';
import { GlassCard } from '../ui/GlassCard';
import { GradientButton } from '../ui/GradientButton';
import { colors, fonts, radii } from '../ui/theme';

export function ProfileScreen() {
  const { profile, session, signOut, refreshData, loading } = useApp();

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <AppBackdrop />
      <View style={styles.container}>
        <Text style={styles.screenTitle}>Profil</Text>

        <GlassCard style={styles.heroCard}>
          <Image source={resolveArt('pet_mochi_adult')} style={styles.avatarArt} resizeMode="contain" />
          <Text style={styles.username}>{profile?.username ?? 'Utilisateur'}</Text>
          <Text style={styles.email}>{session?.user?.email ?? 'email inconnu'}</Text>
        </GlassCard>

        <GlassCard style={styles.statsCard}>
          <InfoRow label="Pieces" value={`${profile?.coins ?? 0}`} />
          <InfoRow label="Streak actif" value={`${profile?.streak ?? 0}`} />
          <InfoRow label="Best streak" value={`${profile?.bestStreak ?? 0}`} />
          <InfoRow label="Focus total" value={`${profile?.totalFocusMinutes ?? 0} min`} />
          <InfoRow label="Sessions squad" value={`${profile?.squadSessions ?? 0}`} />
        </GlassCard>

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color={colors.text} />
          </View>
        ) : (
          <>
            <GradientButton label="Rafraichir les donnees" onPress={() => void refreshData()} />
            <GradientButton label="Se deconnecter" onPress={() => void signOut()} danger />
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.key}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  container: {
    flex: 1,
    paddingTop: 18,
    paddingHorizontal: 14,
    paddingBottom: 110,
    gap: 12,
  },
  screenTitle: {
    color: colors.text,
    fontSize: 37,
    fontFamily: fonts.displaySemi,
    letterSpacing: -0.8,
  },
  heroCard: {
    borderRadius: radii.lg,
    padding: 16,
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(244, 233, 218, 0.8)',
  },
  avatarArt: {
    width: 88,
    height: 88,
  },
  username: {
    color: colors.text,
    fontFamily: fonts.displaySemi,
    fontSize: 24,
    letterSpacing: -0.3,
  },
  email: {
    color: colors.textMuted,
    fontSize: 13,
    fontFamily: fonts.bodyMedium,
  },
  statsCard: {
    borderRadius: radii.lg,
    padding: 14,
    gap: 9,
    backgroundColor: 'rgba(245, 236, 224, 0.78)',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  key: {
    color: colors.textMuted,
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
  },
  value: {
    color: colors.text,
    fontFamily: fonts.bodyBold,
    fontSize: 13,
  },
  loadingWrap: {
    minHeight: 50,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
