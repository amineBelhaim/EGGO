import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';

import { CollectionScreen } from '../screens/CollectionScreen';
import { FocusScreen } from '../screens/FocusScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { ShopScreen } from '../screens/ShopScreen';
import { colors, fonts } from '../ui/theme';

const Tab = createBottomTabNavigator();

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.red,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontFamily: fonts.bodyMedium,
          fontSize: 12,
          marginBottom: Platform.select({ ios: 0, android: 5 }),
        },
        tabBarStyle: {
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: Platform.select({ ios: 88, android: 82 }),
          borderRadius: 0,
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
          borderTopWidth: 1,
          backgroundColor: '#FFFFFF',
          borderColor: colors.border,
          borderWidth: 0,
          paddingHorizontal: 10,
          paddingTop: 6,
          paddingBottom: Platform.select({ ios: 10, android: 8 }),
        },
        sceneStyle: { backgroundColor: 'transparent' },
        tabBarIcon: ({ color, size, focused }) => {
          const iconByRoute: Record<string, keyof typeof Ionicons.glyphMap> = {
            Home: 'home',
            Collection: 'grid',
            Shop: 'cart',
            Settings: 'settings',
          };
          return (
            <Ionicons
              name={iconByRoute[route.name] ?? 'ellipse'}
              color={color}
              size={focused ? size + 2 : size}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={FocusScreen} />
      <Tab.Screen name="Collection" component={CollectionScreen} />
      <Tab.Screen name="Shop" component={ShopScreen} />
      <Tab.Screen name="Settings" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
