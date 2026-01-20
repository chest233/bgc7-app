import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MainTabNavigator from './MainTabNavigator';
import SermonDetailScreen from '../screens/SermonDetailScreen';
import DevotionScreen from '../screens/DevotionScreen';
import DevotionDetailScreen from '../screens/DevotionDetailScreen';
import BibleReaderScreen from '../screens/BibleReaderScreen';
import GalleryScreen from '../screens/GalleryScreen';
import GalleryDetailScreen from '../screens/GalleryDetailScreen';

import { colors } from '../constants/theme';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitle: '返回',
        headerTintColor: colors.primary,
        headerTitleStyle: {
          color: colors.textPrimary,
        },
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SermonDetail"
        component={SermonDetailScreen}
        options={{ title: '讲道详情' }}
      />
      <Stack.Screen
        name="Devotion"
        component={DevotionScreen}
        options={{ title: '每日灵修' }}
      />
      <Stack.Screen
        name="DevotionDetail"
        component={DevotionDetailScreen}
        options={{ title: '灵修详情' }}
      />
      <Stack.Screen
        name="BibleReader"
        component={BibleReaderScreen}
        options={{ title: '圣经阅读' }}
      />
      <Stack.Screen
        name="Gallery"
        component={GalleryScreen}
        options={{ title: '相册' }}
      />
      <Stack.Screen
        name="GalleryDetail"
        component={GalleryDetailScreen}
        options={{ title: '相册详情' }}
      />
    </Stack.Navigator>
  );
}
