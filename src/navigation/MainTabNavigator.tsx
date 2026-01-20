import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import SermonsScreen from '../screens/SermonsScreen';
import DevotionScreen from '../screens/DevotionScreen';
import BibleScreen from '../screens/BibleScreen';
import MoreScreen from '../screens/MoreScreen';

import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

type IconName = keyof typeof Ionicons.glyphMap;

const getTabBarIcon = (routeName: string, focused: boolean): IconName => {
  const iconMap: Record<string, { focused: IconName; unfocused: IconName }> = {
    Home: { focused: 'home', unfocused: 'home-outline' },
    Sermons: { focused: 'mic', unfocused: 'mic-outline' },
    Devotion: { focused: 'book', unfocused: 'book-outline' },
    Bible: { focused: 'library', unfocused: 'library-outline' },
    More: { focused: 'ellipsis-horizontal', unfocused: 'ellipsis-horizontal-outline' },
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
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#6b7280',
        headerShown: false,
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
        name="Devotion"
        component={DevotionScreen}
        options={{ tabBarLabel: '灵修' }}
      />
      <Tab.Screen
        name="Bible"
        component={BibleScreen}
        options={{ tabBarLabel: '圣经' }}
      />
      <Tab.Screen
        name="More"
        component={MoreScreen}
        options={{ tabBarLabel: '更多' }}
      />
    </Tab.Navigator>
  );
}
