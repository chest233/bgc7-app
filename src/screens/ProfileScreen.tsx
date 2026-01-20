import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing, borderRadius, fontSize, fontWeight } from '../constants/theme';
import { scale, moderateScale } from '../utils/responsive';
import { APP_NAME, APP_VERSION } from '../constants/config';
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

export default function ProfileScreen({ navigation }: MainTabScreenProps<'Profile'>) {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>我的</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        {/* 信息区 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>关于</Text>
          <View style={styles.menuCard}>
            <MenuItem
              icon="information-circle-outline"
              title="关于我们"
              subtitle="了解 BGC7 教会"
              onPress={() => {}}
            />
            <MenuItem
              icon="call-outline"
              title="联系方式"
              subtitle="获取教会联系信息"
              onPress={() => {}}
            />
          </View>
        </View>

        {/* 设置区 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>设置</Text>
          <View style={styles.menuCard}>
            <MenuItem
              icon="settings-outline"
              title="播放设置"
              subtitle="音频播放相关设置"
              onPress={() => {}}
            />
            <MenuItem
              icon="trash-outline"
              title="清除缓存"
              subtitle="清理本地缓存数据"
              onPress={() => {}}
            />
          </View>
        </View>

        {/* 版本信息 */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>
            {APP_NAME} v{APP_VERSION}
          </Text>
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
  versionContainer: {
    padding: spacing.xxl,
    alignItems: 'center',
  },
  versionText: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
  },
});
