import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts as useSoraFonts, Sora_600SemiBold, Sora_700Bold } from '@expo-google-fonts/sora';
import {
  useFonts as useSpaceGroteskFonts,
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_700Bold,
} from '@expo-google-fonts/space-grotesk';

import { AppProvider, useApp } from './src/context/AppContext';
import { MainTabs } from './src/navigation/MainTabs';
import { AuthScreen } from './src/screens/AuthScreen';
import { AppBackdrop } from './src/ui/AppBackdrop';
import { colors, fonts } from './src/ui/theme';

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.bg,
    card: colors.card,
    text: colors.text,
    border: colors.border,
    primary: colors.sky,
  },
};

function RootRouter() {
  const { ready, session } = useApp();

  if (!ready) {
    return (
      <View style={styles.loadingWrap}>
        <AppBackdrop />
        <ActivityIndicator size="large" color={colors.gold} />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  return session ? <MainTabs /> : <AuthScreen />;
}

export default function App() {
  const [soraLoaded] = useSoraFonts({
    Sora_600SemiBold,
    Sora_700Bold,
  });
  const [spaceLoaded] = useSpaceGroteskFonts({
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_700Bold,
  });

  const fontsReady = soraLoaded && spaceLoaded;

  if (!fontsReady) {
    return (
      <View style={styles.loadingWrap}>
        <AppBackdrop />
        <ActivityIndicator size="large" color={colors.gold} />
        <Text style={styles.loadingText}>Chargement des polices...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppProvider>
          <NavigationContainer theme={navTheme}>
            <StatusBar style="dark" />
            <RootRouter />
          </NavigationContainer>
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  loadingText: {
    color: colors.textMuted,
    fontFamily: fonts.bodyMedium,
  },
});
