import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { useApp } from '../context/AppContext';
import { eggCatalog } from '../types/domain';
import { AppBackdrop } from '../ui/AppBackdrop';
import { resolveArt } from '../ui/art';
import { GlassCard } from '../ui/GlassCard';
import { colors, fonts, gradients, radii } from '../ui/theme';

const shopItems = [
  { id: 'revive', title: 'Potion de Resurrection', subtitle: 'Sauve un pet apres echec', cost: 500, icon: 'sparkles-outline' },
  { id: 'boost', title: 'Booster XP x2', subtitle: 'XP double pendant 24h', cost: 200, icon: 'flash-outline' },
  { id: 'cyber', title: 'Skin Cyberpunk', subtitle: 'Aura neon holographique', cost: 350, icon: 'color-palette-outline' },
  { id: 'forest', title: 'Habitat Enchante', subtitle: 'Lucioles + brume', cost: 300, icon: 'leaf-outline' },
] as const;

export function ShopScreen() {
  const { unlockedEggIds, unlockEgg, buyCoinsItem, clearError, error } = useApp();

  const buyEgg = async (eggId: string) => {
    const egg = eggCatalog.find((entry) => entry.id === eggId);
    if (!egg) {
      return;
    }
    clearError();
    const success = await unlockEgg(egg);
    Alert.alert('Boutique', success ? `${egg.name} debloque` : error ?? 'Achat refuse');
  };

  const buyItem = async (itemTitle: string, cost: number) => {
    clearError();
    const success = await buyCoinsItem(cost);
    Alert.alert('Boutique', success ? `${itemTitle} achete` : error ?? 'Achat refuse');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <AppBackdrop />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.screenTitle}>Shop</Text>

        <LinearGradient colors={gradients.cta} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.banner}>
          <Text style={styles.bannerTitle}>Saison Chill - Hatch Garden</Text>
          <Text style={styles.bannerSub}>Debloque des oeufs visuels et personnalise ton habitat.</Text>
        </LinearGradient>

        <Text style={styles.sectionTitle}>Oeufs speciaux</Text>
        {eggCatalog
          .filter((egg) => egg.price > 0)
          .map((egg) => {
            const unlocked = unlockedEggIds.has(egg.id);
            return (
              <GlassCard key={egg.id} style={styles.line}>
                <Image source={resolveArt(egg.artKey)} style={styles.eggArt} resizeMode="contain" />
                <View style={styles.lineContent}>
                  <Text style={styles.lineTitle}>{egg.name}</Text>
                  <Text style={styles.lineSub}>
                    {egg.requiredMinutes} min · {egg.rarity}
                  </Text>
                </View>
                {unlocked ? (
                  <View style={styles.unlockedPill}>
                    <Text style={styles.unlocked}>DEBLOQUE</Text>
                  </View>
                ) : (
                  <Pressable style={styles.buyButton} onPress={() => void buyEgg(egg.id)}>
                    <Text style={styles.buyLabel}>{egg.price} coins</Text>
                  </Pressable>
                )}
              </GlassCard>
            );
          })}

        <Text style={styles.sectionTitle}>Consommables & cosmetiques</Text>
        {shopItems.map((item) => (
          <GlassCard key={item.id} style={styles.line}>
            <View style={styles.iconPill}>
              <Ionicons name={item.icon} size={20} color={colors.text} />
            </View>
            <View style={styles.lineContent}>
              <Text style={styles.lineTitle}>{item.title}</Text>
              <Text style={styles.lineSub}>{item.subtitle}</Text>
            </View>
            <Pressable style={styles.buyButtonGhost} onPress={() => void buyItem(item.title, item.cost)}>
              <Text style={styles.buyLabelGhost}>{item.cost} coins</Text>
            </Pressable>
          </GlassCard>
        ))}
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
    paddingBottom: 110,
    gap: 10,
  },
  screenTitle: {
    color: colors.text,
    fontSize: 37,
    fontFamily: fonts.displaySemi,
    letterSpacing: -0.7,
  },
  banner: {
    borderRadius: radii.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(246, 239, 231, 0.64)',
    gap: 3,
  },
  bannerTitle: {
    color: '#FDFCFB',
    fontSize: 19,
    fontFamily: fonts.displaySemi,
    letterSpacing: -0.2,
  },
  bannerSub: {
    color: 'rgba(252, 250, 248, 0.92)',
    fontSize: 12,
    fontFamily: fonts.bodyMedium,
  },
  sectionTitle: {
    marginTop: 6,
    color: colors.textMuted,
    fontFamily: fonts.bodyBold,
    fontSize: 14,
  },
  line: {
    borderRadius: radii.md,
    padding: 11,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(245, 236, 224, 0.82)',
  },
  eggArt: {
    width: 58,
    height: 58,
  },
  iconPill: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardSoft,
  },
  lineContent: {
    flex: 1,
  },
  lineTitle: {
    color: colors.text,
    fontFamily: fonts.bodyBold,
    fontSize: 13,
  },
  lineSub: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 11,
    marginTop: 2,
  },
  unlockedPill: {
    backgroundColor: 'rgba(131,201,173,0.26)',
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  unlocked: {
    color: '#4D8B72',
    fontSize: 10,
    fontFamily: fonts.bodyBold,
    letterSpacing: 0.3,
  },
  buyButton: {
    backgroundColor: '#DFA56C',
    borderRadius: 11,
    paddingHorizontal: 11,
    paddingVertical: 8,
  },
  buyButtonGhost: {
    borderWidth: 1,
    borderColor: '#DFA56C',
    borderRadius: 11,
    paddingHorizontal: 11,
    paddingVertical: 8,
  },
  buyLabel: {
    color: '#FAF7F2',
    fontFamily: fonts.bodyBold,
    fontSize: 12,
  },
  buyLabelGhost: {
    color: '#A06C3E',
    fontFamily: fonts.bodyBold,
    fontSize: 12,
  },
});
