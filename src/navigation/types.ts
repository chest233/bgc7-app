import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';

// 主页 Tab 导航参数
export type MainTabParamList = {
  Home: undefined;
  Devotion: undefined;
  More: undefined;
  Profile: undefined;
};

// 根导航参数
export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  Sermons: undefined;
  SermonDetail: { id: string };
  DevotionDetail: { id: number };
  Bible: undefined;
  BibleReader: { bookId: number; chapter: number };
  Gallery: undefined;
  GalleryDetail: { id: number };
};

// 屏幕 Props 类型
export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

export type MainTabScreenProps<T extends keyof MainTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, T>,
  NativeStackScreenProps<RootStackParamList>
>;
