import { ImageBackground, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { colors, gradients } from './theme';

const backdropArt = require('../../assets/art/fond1_forge.jpg');

export function AppBackdrop() {
  return (
    <>
      <ImageBackground source={backdropArt} resizeMode="cover" style={StyleSheet.absoluteFill} />
      <LinearGradient colors={gradients.appBackground} style={styles.toneLayer} />
      <LinearGradient colors={gradients.spotlight} style={styles.topGlow} />
      <LinearGradient colors={['rgba(212, 185, 156, 0.15)', 'rgba(212, 185, 156, 0)']} style={styles.bottomGlow} />
      <View style={styles.noise} />
    </>
  );
}

const styles = StyleSheet.create({
  toneLayer: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.4,
  },
  topGlow: {
    position: 'absolute',
    width: 430,
    height: 430,
    borderRadius: 215,
    top: -165,
    right: -150,
    opacity: 0.65,
  },
  bottomGlow: {
    position: 'absolute',
    width: 360,
    height: 360,
    borderRadius: 180,
    bottom: -30,
    left: -100,
    opacity: 0.5,
  },
  noise: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.blackOverlay,
    opacity: 0.12,
  },
});
