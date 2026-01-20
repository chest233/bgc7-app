import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import DevotionScreen from '../screens/DevotionScreen';
import MoreScreen from '../screens/MoreScreen';
import ProfileScreen from '../screens/ProfileScreen';

import { colors } from '../constants/theme';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

type IconName = keyof typeof Ionicons.glyphMap;

const getTabBarIcon = (routeName: string, focused: boolean): IconName => {
  const iconMap: Record<string, { focused: IconName; unfocused: IconName }> = {
    Home: { focused: 'home', unfocused: 'home-outline' },
    Devotion: { focused: 'sunny', unfocused: 'sunny-outline' },
    More: { focused: 'grid', unfocused: 'grid-outline' },
    Profile: { focused: 'person', unfocused: 'person-outline' },
  };

  const icons = iconMap[routeName] || { focused: 'help', unfocused: 'help-outline' };
  return focused ? icons.focused : icons.unfocused;
};

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const iconName = getTabBarIcon(route.name, focused);
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
        headerShown: false,
        tabBarStyle: {
          borderTopColor: colors.border,
          backgroundColor: colors.surface,
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: '首页' }}
      />
      <Tab.Screen
        name="Devotion"
        component={DevotionScreen}
        options={{ tabBarLabel: '早灵修' }}
      />
      <Tab.Screen
        name="More"
        component={MoreScreen}
        options={{ tabBarLabel: '更多' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: '我的' }}
      />
    </Tab.Navigator>
  );
}
