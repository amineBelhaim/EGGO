import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  AppState,
  Easing,
  Image,
  ImageBackground,
  Modal,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useApp } from '../context/AppContext';
import type { EggDefinition, EggPetTemplate, FocusMode, SessionReward } from '../types/domain';
import { eggCatalog } from '../types/domain';
import { AppBackdrop } from '../ui/AppBackdrop';
import { resolveArt } from '../ui/art';
import { colors, fonts } from '../ui/theme';

const thresholds = [0.12, 0.38, 0.68, 1.0];
const sparklePositions = [
  { top: 30, left: 58 },
  { top: 72, right: 66 },
  { top: 188, left: 38 },
  { top: 156, right: 32 },
] as const;
import LottieView from 'lottie-react-native';

const mainBackground = require('../../assets/art/fond1_forge.jpg');
const eggLottieSource = require('../../assets/art/egg_lottie.json');
const LOTTIE_DURATION_SEC = 3;

export function FocusScreen() {
  const { profile, unlockedEggIds, completeSession, applyPenalty } = useApp();
  const { height } = useWindowDimensions();
  const compact = height < 820;

  const [mode, setMode] = useState<FocusMode>('solo');
  const [demoMode, setDemoMode] = useState(false);
  const [selectedEggId, setSelectedEggId] = useState(eggCatalog[0].id);
  const [showEggPicker, setShowEggPicker] = useState(false);
  const [running, setRunning] = useState(false);
  const [remainingSec, setRemainingSec] = useState(eggCatalog[0].requiredMinutes * 60);
  const [totalSec, setTotalSec] = useState(eggCatalog[0].requiredMinutes * 60);
  const [petTemplate, setPetTemplate] = useState<EggPetTemplate | null>(null);
  const [evoStage, setEvoStage] = useState(-1);
  const [displayName, setDisplayName] = useState('Selectionne un oeuf');
  const [displayStage, setDisplayStage] = useState('Puis lance ta session');
  const [displayArtKey, setDisplayArtKey] = useState<string>(eggCatalog[0].artKey);
  const [info, setInfo] = useState<string | null>(null);

  const selectedEgg = useMemo<EggDefinition>(() => {
    return eggCatalog.find((egg) => egg.id === selectedEggId) ?? eggCatalog[0];
  }, [selectedEggId]);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const runningRef = useRef(false);
  const evoRef = useRef(-1);
  const lottieRef = useRef<LottieView>(null);
  const hatchStarted = useRef(false);

  const timerOpacity = useRef(new Animated.Value(1)).current;
  const eggShake = useRef(new Animated.Value(0)).current;
  const idleFloat = useRef(new Animated.Value(0)).current;
  const sparkleOpacity = useRef([0, 1, 2, 3].map(() => new Animated.Value(0))).current;
  const sparkleY = useRef([0, 1, 2, 3].map(() => new Animated.Value(0))).current;

  const timeLabel = `${String(Math.floor(remainingSec / 60)).padStart(2, '0')}:${String(
    remainingSec % 60,
  ).padStart(2, '0')}`;

  useEffect(() => {
    runningRef.current = running;
    if (!running) {
      hatchStarted.current = false;
      lottieRef.current?.reset();
    }
  }, [running]);

  useEffect(() => {
    const loops: Animated.CompositeAnimation[] = [];

    if (running) {
      idleFloat.setValue(0);

      const timerPulse = Animated.loop(
        Animated.sequence([
          Animated.timing(timerOpacity, {
            toValue: 0.72,
            duration: 1100,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(timerOpacity, {
            toValue: 1,
            duration: 1100,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      );
      timerPulse.start();
      loops.push(timerPulse);

      const shakeLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(eggShake, { toValue: -1, duration: 120, easing: Easing.linear, useNativeDriver: true }),
          Animated.timing(eggShake, { toValue: 1, duration: 120, easing: Easing.linear, useNativeDriver: true }),
          Animated.timing(eggShake, { toValue: 0, duration: 120, easing: Easing.linear, useNativeDriver: true }),
        ]),
      );
      shakeLoop.start();
      loops.push(shakeLoop);

      sparkleOpacity.forEach((opacity, index) => {
        const y = sparkleY[index];
        const sparkleLoop = Animated.loop(
          Animated.sequence([
            Animated.delay(index * 170),
            Animated.parallel([
              Animated.timing(opacity, {
                toValue: 1,
                duration: 300,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
              }),
              Animated.timing(y, {
                toValue: -10,
                duration: 300,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
              }),
            ]),
            Animated.parallel([
              Animated.timing(opacity, {
                toValue: 0,
                duration: 540,
                easing: Easing.in(Easing.ease),
                useNativeDriver: true,
              }),
              Animated.timing(y, {
                toValue: -22,
                duration: 540,
                easing: Easing.in(Easing.ease),
                useNativeDriver: true,
              }),
            ]),
            Animated.timing(y, { toValue: 0, duration: 0, useNativeDriver: true }),
          ]),
        );
        sparkleLoop.start();
        loops.push(sparkleLoop);
      });
    } else {
      timerOpacity.setValue(1);
      eggShake.setValue(0);
      sparkleOpacity.forEach((value) => value.setValue(0));
      sparkleY.forEach((value) => value.setValue(0));

      const floatLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(idleFloat, {
            toValue: 1,
            duration: 1800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(idleFloat, {
            toValue: 0,
            duration: 1800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      );
      floatLoop.start();
      loops.push(floatLoop);
    }

    return () => {
      loops.forEach((loop) => loop.stop());
    };
  }, [running, eggShake, idleFloat, sparkleOpacity, sparkleY, timerOpacity]);

  useEffect(() => {
    const appSubscription = AppState.addEventListener('change', (state) => {
      if (state !== 'active' && runningRef.current) {
        void triggerPenalty();
      }
    });

    return () => {
      appSubscription.remove();
    };
  }, [mode, demoMode, selectedEgg.id]);

  useEffect(() => {
    if (running) {
      return;
    }

    const duration = demoMode ? 30 : selectedEgg.requiredMinutes * 60;
    setTotalSec(duration);
    setRemainingSec(duration);
    evoRef.current = -1;
    setEvoStage(-1);
    setPetTemplate(null);
    setDisplayArtKey(selectedEgg.artKey);
    setDisplayName(selectedEgg.name);
    setDisplayStage(demoMode ? '30s mode demo' : `${selectedEgg.requiredMinutes} min requis`);
  }, [selectedEgg.id, selectedEgg.artKey, selectedEgg.name, selectedEgg.requiredMinutes, demoMode, running]);

  useEffect(() => {
    return () => clearTimer();
  }, []);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const setEvolution = (stage: number, template: EggPetTemplate) => {
    evoRef.current = stage;
    setEvoStage(stage);
    setDisplayArtKey(template.stageArtKeys[stage] ?? template.stageArtKeys[template.stageArtKeys.length - 1]);
    setDisplayName(template.name);
    setDisplayStage(template.stageLabels[stage] ?? template.stageLabels[template.stageLabels.length - 1]);
  };

  const updateEvolution = (nextRemaining: number, duration: number, template: EggPetTemplate) => {
    const currentProgress = Math.max(0, Math.min(1, (duration - nextRemaining) / duration));
    const from = evoRef.current + 1;
    for (let index = from; index < thresholds.length; index += 1) {
      if (currentProgress >= thresholds[index]) {
        setEvolution(index, template);
      }
    }
  };

  const startSession = () => {
    const unlocked = unlockedEggIds.has(selectedEgg.id) || selectedEgg.price === 0;
    if (!unlocked) {
      setInfo("Oeuf verrouille. Achete-le d'abord dans Shop.");
      return;
    }

    const template = selectedEgg.pets[Math.floor(Math.random() * selectedEgg.pets.length)];
    const duration = demoMode ? 30 : selectedEgg.requiredMinutes * 60;

    setInfo(mode === 'squad' ? 'Pacte groupe actif: ne quitte pas l app.' : null);
    setPetTemplate(template);
    setTotalSec(duration);
    setRemainingSec(duration);
    setDisplayArtKey(selectedEgg.artKey);
    setDisplayName('Incubation...');
    setDisplayStage("L'oeuf absorbe ton focus...");
    evoRef.current = -1;
    setEvoStage(-1);
    setRunning(true);

    clearTimer();
    timerRef.current = setInterval(() => {
      setRemainingSec((previous) => {
        const next = previous - 1;
        if (next <= 0) {
          clearTimer();
          void completeCurrentSession(template, duration);
          return 0;
        }
        if (next <= LOTTIE_DURATION_SEC && !hatchStarted.current) {
          hatchStarted.current = true;
          lottieRef.current?.play();
        }
        updateEvolution(next, duration, template);
        return next;
      });
    }, 1000);
  };

  const completeCurrentSession = async (template: EggPetTemplate, duration: number) => {
    setRunning(false);
    setEvolution(3, template);

    const rewardCoins = demoMode ? 10 : mode === 'squad' ? 75 : 50;
    const reward: SessionReward = {
      eggId: selectedEgg.id,
      name: template.name,
      emoji: template.stageArtKeys[3] ?? 'pet_flamby_adult',
      stage: template.stageLabels[3] ?? 'Adulte',
      rarity: selectedEgg.rarity,
      rewardCoins,
      focusMinutes: Math.max(1, Math.floor(duration / 60)),
      mode,
    };

    await completeSession(reward);
    setInfo(`Session terminee: +${reward.rewardCoins} coins`);
  };

  const triggerPenalty = async () => {
    clearTimer();
    setRunning(false);
    evoRef.current = -1;
    setEvoStage(-1);
    setPetTemplate(null);
    setDisplayArtKey(selectedEgg.artKey);
    setDisplayName(selectedEgg.name);
    setDisplayStage(demoMode ? '30s mode demo' : `${selectedEgg.requiredMinutes} min requis`);
    await applyPenalty(mode);

    Alert.alert(
      mode === 'squad' ? 'Catastrophe Squad' : 'Pet malade',
      mode === 'squad'
        ? "Tu as quitte l'app: le pet collectif est mort pour le groupe."
        : "Tu as quitte l'app en session: streak reduit.",
    );
  };

  const onEggPress = () => {
    if (running) {
      void triggerPenalty();
      return;
    }
    startSession();
  };

  const openEggPicker = () => {
    if (running) {
      return;
    }
    setShowEggPicker(true);
  };

  const pickEgg = (egg: EggDefinition) => {
    if (running) {
      return;
    }
    const unlocked = unlockedEggIds.has(egg.id) || egg.price === 0;
    if (!unlocked) {
      setInfo(`Oeuf verrouille (${egg.price} coins)`);
      return;
    }
    setSelectedEggId(egg.id);
    setShowEggPicker(false);
  };

  const eggTransform = {
    transform: [
      {
        translateY: idleFloat.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -10],
        }),
      },
      {
        translateX: eggShake.interpolate({
          inputRange: [-1, 1],
          outputRange: [-3, 3],
        }),
      },
      {
        rotate: eggShake.interpolate({
          inputRange: [-1, 1],
          outputRange: ['-1.8deg', '1.8deg'],
        }),
      },
    ],
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <AppBackdrop />
      <View style={styles.container}>
        <ImageBackground source={mainBackground} resizeMode="cover" style={styles.stageCard} imageStyle={styles.stageCardImage}>
          <View style={styles.stageVeil} />
          <View style={[styles.panelContent, compact && styles.panelContentCompact]}>
            <View style={styles.topRow}>
              <View style={styles.topSpacer} />
              <Text style={styles.screenTitle}>Focus HatchLe</Text>
              <Pressable style={styles.bellButton}>
                <Ionicons name="notifications-outline" size={24} color="#8E929A" />
              </Pressable>
            </View>

            <Animated.Text style={[styles.timerText, compact && styles.timerTextCompact, { opacity: timerOpacity }]}>
              {timeLabel}
            </Animated.Text>

            <View style={styles.currencyRow}>
              <View style={styles.currencyBadge}>
                <View style={styles.coinDot}>
                  <Text style={styles.coinDotText}>$</Text>
                </View>
                <Text style={styles.currencyText}>{profile?.coins ?? 0}</Text>
              </View>
              <View style={styles.currencyBadge}>
                <Ionicons name="sparkles" size={14} color={colors.sky} />
                <Text style={styles.currencyText}>{profile?.streak ?? 0}</Text>
              </View>
            </View>

            <View style={[styles.eggZone, compact && styles.eggZoneCompact]}>
              {sparklePositions.map((position, index) => (
                <Animated.View
                  key={`spark-${index}`}
                  style={[
                    styles.sparkle,
                    position,
                    {
                      opacity: sparkleOpacity[index],
                      transform: [{ translateY: sparkleY[index] }],
                    },
                  ]}
                />
              ))}

              <Pressable onPress={onEggPress} style={styles.eggPress}>
                <Animated.View style={eggTransform}>
                  <LottieView
                    ref={lottieRef}
                    source={eggLottieSource}
                    autoPlay={false}
                    loop={false}
                    speed={1}
                    style={[styles.petArt, compact && styles.petArtCompact]}
                  />
                </Animated.View>
              </Pressable>
            </View>

            {!!info && <Text style={styles.infoText}>{info}</Text>}

            <View style={styles.actionRow}>
              <Pressable
                onPress={() => setMode(mode === 'solo' ? 'squad' : 'solo')}
                style={[styles.actionButton, mode === 'squad' && styles.actionButtonActive]}
              >
                <View style={styles.actionIconWrap}>
                  <Ionicons name="people" size={40} color={colors.sky} style={styles.actionIcon} />
                </View>
              </Pressable>

              <Pressable onPress={openEggPicker} style={[styles.actionButton, styles.actionButtonCenter]}>
                <View style={styles.actionIconWrap}>
                  <Ionicons name="egg-outline" size={40} color={colors.sky} style={styles.actionIcon} />
                </View>
              </Pressable>

              <Pressable
                onPress={() => {
                  if (running) {
                    void triggerPenalty();
                    return;
                  }
                  startSession();
                }}
                style={[styles.actionButton, running && styles.actionButtonActive]}
              >
                <View style={styles.actionIconWrap}>
                  <Ionicons
                    name={running ? 'stop' : 'play'}
                    size={40}
                    color={colors.sky}
                    style={[styles.actionIcon, !running && styles.playIcon]}
                  />
                </View>
              </Pressable>
            </View>

            <View style={styles.sessionRow}>
              <Text style={styles.demoLabel}>Mode demo (30s)</Text>
              <Switch
                value={demoMode}
                onValueChange={(value) => {
                  if (!running) {
                    setDemoMode(value);
                  }
                }}
                disabled={running}
                thumbColor={demoMode ? colors.sky : '#fff'}
                trackColor={{ false: '#C7B8A6', true: '#A2B7E4' }}
              />
            </View>
          </View>
        </ImageBackground>
      </View>

      <Modal visible={showEggPicker} transparent animationType="fade" onRequestClose={() => setShowEggPicker(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setShowEggPicker(false)}>
          <Pressable style={styles.modalCard} onPress={(event) => event.stopPropagation()}>
            <Text style={styles.modalTitle}>Choose Your Egg</Text>
            {eggCatalog.map((egg) => {
              const unlocked = unlockedEggIds.has(egg.id) || egg.price === 0;
              const selected = egg.id === selectedEgg.id;
              return (
                <Pressable
                  key={egg.id}
                  style={[styles.eggItem, selected && styles.eggItemSelected, !unlocked && styles.eggItemLocked]}
                  onPress={() => pickEgg(egg)}
                >
                  <Image source={resolveArt(egg.artKey)} style={styles.eggItemArt} resizeMode="contain" />
                  <View style={styles.eggItemTextWrap}>
                    <Text style={styles.eggItemTitle}>{egg.name}</Text>
                    <Text style={styles.eggItemSub}>{egg.requiredMinutes} min</Text>
                  </View>
                  <Text style={styles.eggItemPrice}>{unlocked ? egg.rarity : `${egg.price} coins`}</Text>
                </Pressable>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  container: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 0,
    paddingBottom: 0,
  },
  stageCard: {
    flex: 1,
    borderRadius: 0,
    overflow: 'hidden',
    borderWidth: 0,
    shadowOpacity: 0,
    elevation: 0,
  },
  stageCardImage: {
    borderRadius: 0,
  },
  stageVeil: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(245, 235, 224, 0.42)',
  },
  panelContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 104,
  },
  panelContentCompact: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 90,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  topSpacer: {
    width: 48,
  },
  bellButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 0,
    borderColor: 'transparent',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenTitle: {
    color: colors.text,
    fontSize: 32,
    fontFamily: fonts.displaySemi,
    letterSpacing: -0.6,
  },
  timerText: {
    color: '#2F3140',
    fontSize: 68,
    textAlign: 'center',
    fontFamily: fonts.body,
    letterSpacing: -0.8,
    lineHeight: 72,
    marginBottom: 2,
  },
  timerTextCompact: {
    fontSize: 58,
    lineHeight: 62,
  },
  currencyRow: {
    marginTop: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  currencyBadge: {
    minWidth: 96,
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    borderWidth: 0,
    borderColor: 'transparent',
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  coinDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinDotText: {
    color: '#fff',
    fontFamily: fonts.bodyBold,
    fontSize: 11,
  },
  currencyText: {
    color: '#3F4454',
    fontFamily: fonts.bodyBold,
    fontSize: 14,
  },
  eggZone: {
    flex: 1,
    minHeight: 340,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eggZoneCompact: {
    minHeight: 300,
  },
  sparkle: {
    position: 'absolute',
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(154, 190, 221, 0.85)',
  },
  eggPress: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  petArt: {
    width: 382,
    height: 382,
  },
  petArtCompact: {
    width: 334,
    height: 334,
  },
  infoText: {
    marginTop: 8,
    color: colors.textMuted,
    fontSize: 12,
    fontFamily: fonts.bodyMedium,
    textAlign: 'center',
  },
  actionRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 36,
  },
  actionButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
    borderColor: 'transparent',
    backgroundColor: '#FFFFFF',
    shadowColor: '#8F7A63',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 3,
  },
  actionButtonActive: {
    backgroundColor: '#F3F7FF',
    borderWidth: 1,
    borderColor: 'rgba(95, 127, 200, 0.32)',
  },
  actionIconWrap: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIcon: {
    textAlign: 'center',
  },
  playIcon: {
    marginLeft: 3,
  },
  actionButtonCenter: {
    marginTop: 14,
  },
  sessionRow: {
    marginTop: 14,
    marginBottom: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  demoLabel: {
    color: colors.textMuted,
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(35, 28, 19, 0.35)',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  modalCard: {
    borderRadius: 24,
    backgroundColor: 'rgba(247, 240, 229, 0.98)',
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 8,
  },
  modalTitle: {
    color: colors.text,
    fontFamily: fonts.displaySemi,
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 4,
  },
  eggItem: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(243, 233, 220, 0.85)',
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  eggItemSelected: {
    borderColor: colors.strongBorder,
    borderWidth: 1.5,
  },
  eggItemLocked: {
    opacity: 0.48,
  },
  eggItemArt: {
    width: 52,
    height: 52,
  },
  eggItemTextWrap: {
    flex: 1,
  },
  eggItemTitle: {
    color: colors.text,
    fontFamily: fonts.bodyBold,
    fontSize: 13,
  },
  eggItemSub: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 11,
  },
  eggItemPrice: {
    color: colors.textMuted,
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    textTransform: 'uppercase',
  },
});
