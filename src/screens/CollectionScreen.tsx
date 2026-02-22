import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { useApp } from '../context/AppContext';
import { resolveArt } from '../ui/art';
import { AppBackdrop } from '../ui/AppBackdrop';
import { colors, fonts, radii } from '../ui/theme';

const rarityColors: Record<string, string> = {
  common: '#8CA87A',
  rare: '#6A9FD8',
  epic: '#B07ED8',
  legendary: '#E4A845',
  mythic: '#E86A8A',
};

const rarityLabels: Record<string, string> = {
  common: 'Commun',
  rare: 'Rare',
  epic: 'Epique',
  legendary: 'Legendaire',
  mythic: 'Mythique',
};

export function CollectionScreen() {
  const { profile, pets } = useApp();

  const stats = [
    { icon: 'paw' as const, value: `${pets.length}`, label: 'Pets', color: '#B07ED8' },
    { icon: 'time' as const, value: `${profile?.totalFocusMinutes ?? 0}m`, label: 'Focus', color: colors.sky },
    { icon: 'flame' as const, value: `${profile?.bestStreak ?? 0}`, label: 'Streak', color: '#E4A845' },
    { icon: 'people' as const, value: `${profile?.squadSessions ?? 0}`, label: 'Squad', color: colors.red },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <AppBackdrop />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.screenTitle}>Collection</Text>
          <View style={styles.countBadge}>
            <Ionicons name="paw" size={14} color="#fff" />
            <Text style={styles.countText}>{pets.length}</Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          {stats.map((item) => (
            <View key={item.label} style={styles.statCard}>
              <View style={[styles.statIconWrap, { backgroundColor: item.color + '20' }]}>
                <Ionicons name={item.icon} size={18} color={item.color} />
              </View>
              <Text style={styles.statValue}>{item.value}</Text>
              <Text style={styles.statLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* Section Title */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Bestiaire</Text>
          <Text style={styles.sectionSub}>
            {pets.length > 0
              ? `${pets.length} creature${pets.length > 1 ? 's' : ''} decouverte${pets.length > 1 ? 's' : ''}`
              : 'Aucune creature pour le moment'}
          </Text>
        </View>

        {/* Pets Grid */}
        <View style={styles.petsGrid}>
          {pets.length > 0 ? (
            pets.map((pet) => {
              const rColor = rarityColors[pet.rarity] ?? colors.textMuted;
              return (
                <View key={pet.id} style={styles.petCard}>
                  <LinearGradient
                    colors={[rColor + '18', rColor + '08']}
                    style={styles.petCardGradient}
                  >
                    {/* Rarity badge */}
                    <View style={[styles.rarityBadge, { backgroundColor: rColor + '22' }]}>
                      <Text style={[styles.rarityText, { color: rColor }]}>
                        {rarityLabels[pet.rarity] ?? pet.rarity}
                      </Text>
                    </View>

                    {/* Pet image */}
                    <View style={styles.petArtWrap}>
                      <Image source={resolveArt(pet.emoji)} style={styles.petArt} resizeMode="contain" />
                    </View>

                    {/* Pet info */}
                    <Text style={styles.petName} numberOfLines={1}>{pet.name}</Text>
                    <Text style={styles.petStage}>{pet.stage}</Text>
                  </LinearGradient>
                </View>
              );
            })
          ) : (
            /* Empty state */
            <>
              {[...Array(6)].map((_, index) => (
                <View key={`empty-${index}`} style={[styles.petCard, styles.emptyCard]}>
                  <View style={styles.petCardGradient}>
                    <View style={styles.emptyArtWrap}>
                      <Ionicons name="help" size={32} color={colors.border} />
                    </View>
                    <Text style={styles.emptyText}>???</Text>
                  </View>
                </View>
              ))}
              <View style={styles.emptyBanner}>
                <Ionicons name="egg-outline" size={28} color={colors.sky} />
                <Text style={styles.emptyBannerText}>
                  Lance ta premiere session Focus pour faire eclore ton premier compagnon !
                </Text>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  container: {
    paddingTop: 18,
    paddingHorizontal: 14,
    paddingBottom: 120,
    gap: 16,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  screenTitle: {
    color: colors.text,
    fontSize: 34,
    fontFamily: fonts.displaySemi,
    letterSpacing: -0.8,
  },
  countBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.sky,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  countText: {
    color: '#fff',
    fontFamily: fonts.bodyBold,
    fontSize: 14,
  },

  /* Stats */
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    borderRadius: radii.md,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  statValue: {
    color: colors.text,
    fontSize: 18,
    fontFamily: fonts.displaySemi,
    letterSpacing: -0.3,
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: 10,
    fontFamily: fonts.bodyMedium,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  /* Section */
  sectionHeader: {
    gap: 2,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontFamily: fonts.displaySemi,
    letterSpacing: -0.3,
  },
  sectionSub: {
    color: colors.textMuted,
    fontSize: 12,
    fontFamily: fonts.body,
  },

  /* Pets Grid */
  petsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  petCard: {
    width: '47.5%',
    borderRadius: radii.lg,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#A08E7A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 3,
  },
  petCardGradient: {
    padding: 12,
    alignItems: 'center',
    gap: 4,
  },
  rarityBadge: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  rarityText: {
    fontSize: 9,
    fontFamily: fonts.bodyBold,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  petArtWrap: {
    width: 90,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  petArt: {
    width: 84,
    height: 84,
  },
  petName: {
    color: colors.text,
    fontSize: 14,
    fontFamily: fonts.displaySemi,
    letterSpacing: -0.2,
  },
  petStage: {
    color: colors.textMuted,
    fontSize: 11,
    fontFamily: fonts.bodyMedium,
  },

  /* Empty state */
  emptyCard: {
    opacity: 0.5,
  },
  emptyArtWrap: {
    width: 90,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 45,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 13,
    fontFamily: fonts.bodyMedium,
    marginTop: 4,
  },
  emptyBanner: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(127, 157, 219, 0.12)',
    borderRadius: radii.md,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(127, 157, 219, 0.2)',
  },
  emptyBannerText: {
    flex: 1,
    color: colors.text,
    fontSize: 12,
    fontFamily: fonts.body,
    lineHeight: 17,
  },
});
