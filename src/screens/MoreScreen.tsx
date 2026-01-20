import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';

import { colors, spacing, borderRadius, fontSize, fontWeight } from '../constants/theme';
import { scale, moderateScale } from '../utils/responsive';
import type { MainTabScreenProps } from '../navigation/types';

type MenuItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress: () => void;
};

function MenuItem({ icon, title, subtitle, onPress }: MenuItemProps) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.menuIcon}>
        <Ionicons name={icon} size={moderateScale(22)} color={colors.primary} />
      </View>
      <View style={styles.menuContent}>
        <Text style={styles.menuTitle}>{title}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={moderateScale(20)} color={colors.textTertiary} />
    </TouchableOpacity>
  );
}

export default function MoreScreen({ navigation }: MainTabScreenProps<'More'>) {
  const showComingSoon = (feature: string) => {
    Alert.alert('提示', `${feature}功能开发中...`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>更多</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        {/* 功能区 */}
        <View style={styles.section}>
          <View style={styles.menuCard}>
            <MenuItem
              icon="book-outline"
              title="圣经阅读"
              subtitle="在线阅读圣经"
              onPress={() => navigation.navigate('BibleReader', { bookId: 1, chapter: 1 })}
            />
            <MenuItem
              icon="time-outline"
              title="敬拜时间"
              subtitle="查看礼拜时间安排"
              onPress={() => showComingSoon('敬拜时间')}
            />
            <MenuItem
              icon="notifications-outline"
              title="公告"
              subtitle="教会通知公告"
              onPress={() => showComingSoon('公告')}
            />
            <MenuItem
              icon="images-outline"
              title="相册"
              subtitle="查看活动照片"
              onPress={() => navigation.navigate('Gallery')}
            />
          </View>
        </View>

        {/* 工具区 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>工具</Text>
          <View style={styles.menuCard}>
            <MenuItem
              icon="apps-outline"
              title="常用软件"
              subtitle="推荐的基督徒应用"
              onPress={() => showComingSoon('常用软件')}
            />
            <MenuItem
              icon="chatbubble-outline"
              title="问题反馈"
              subtitle="提交建议或报告问题"
              onPress={() => showComingSoon('问题反馈')}
            />
            <MenuItem
              icon="volume-high-outline"
              title="音频测试"
              subtitle="测试音频播放功能"
              onPress={() => showComingSoon('音频测试')}
            />
          </View>
        </View>

        {/* 外部链接 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>链接</Text>
          <View style={styles.menuCard}>
            <MenuItem
              icon="globe-outline"
              title="访问网站"
              subtitle="在浏览器中打开 BGC7 网站"
              onPress={() => Linking.openURL('https://bgc7.cn')}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: spacing.lg,
    paddingBottom: 0,
  },
  sectionTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  menuCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  menuIcon: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    backgroundColor: colors.tagBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  menuTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.textPrimary,
  },
  menuSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
