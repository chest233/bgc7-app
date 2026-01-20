import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import SermonsScreen from '../screens/SermonsScreen';
import BibleScreen from '../screens/BibleScreen';
import ProfileScreen from '../screens/ProfileScreen';

import { colors } from '../constants/theme';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

type IconName = keyof typeof Ionicons.glyphMap;

const getTabBarIcon = (routeName: string, focused: boolean): IconName => {
  const iconMap: Record<string, { focused: IconName; unfocused: IconName }> = {
    Home: { focused: 'home', unfocused: 'home-outline' },
    Sermons: { focused: 'mic', unfocused: 'mic-outline' },
    Bible: { focused: 'book', unfocused: 'book-outline' },
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
        name="Sermons"
        component={SermonsScreen}
        options={{ tabBarLabel: '讲道' }}
      />
      <Tab.Screen
        name="Bible"
        component={BibleScreen}
        options={{ tabBarLabel: '圣经' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: '我的' }}
      />
    </Tab.Navigator>
  );
}
