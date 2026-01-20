import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getDevotions, getTodayDevotion, getCurrentWeekInfo, getPrayerRequests } from '../services/api';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../constants/theme';
import type { MainTabScreenProps } from '../navigation/types';
import type { Devotion, PrayerRequest, WeekInfo } from '../types';

// 格式化日期
const formatChineseDate = (dateStr: string) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}月${day}日`;
};

const getWeekdayName = (dateStr: string) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return weekdays[date.getDay()];
};

export default function DevotionScreen({ navigation }: MainTabScreenProps<'Devotion'>) {
  const [todayDevotion, setTodayDevotion] = useState<Devotion | null>(null);
  const [weekDevotions, setWeekDevotions] = useState<Devotion[]>([]);
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([]);
  const [weekInfo, setWeekInfo] = useState<WeekInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [today, week, prayers] = await Promise.all([
        getTodayDevotion().catch(() => null),
        getCurrentWeekInfo().catch(() => null),
        getPrayerRequests().catch(() => []),
      ]);

      setTodayDevotion(today || null);
      setWeekInfo(week || null);
      setPrayerRequests(Array.isArray(prayers) ? prayers : []);

      if (week) {
        const devotions = await getDevotions({ year: week.year, week: week.week }).catch(() => []);
        const todayStr = new Date().toISOString().split('T')[0];
        const devotionList = Array.isArray(devotions) ? devotions : [];
        setWeekDevotions(devotionList.filter((d) => d.date !== todayStr));
      }
    } catch (error) {
      console.error('Failed to fetch devotion data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 顶部标题栏 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>早灵修</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* 今日灵修 */}
        {todayDevotion && (
          <TouchableOpacity
            style={styles.todayCard}
            onPress={() => navigation.navigate('DevotionDetail', { id: todayDevotion.id })}
            activeOpacity={0.8}
          >
            <Text style={styles.todayLabel}>今日灵修</Text>
            <Text style={styles.todayDate}>
              {formatChineseDate(todayDevotion.date)} {getWeekdayName(todayDevotion.date)}
            </Text>
            {todayDevotion.scripture && (
              <Text style={styles.todayScripture}>{todayDevotion.scripture}</Text>
            )}
            {todayDevotion.audio_status === 'ready' && (
              <View style={styles.audioIndicator}>
                <Text style={styles.audioText}>点击收听</Text>
              </View>
            )}
          </TouchableOpacity>
        )}

        {/* 祷告事项 */}
        {prayerRequests.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>本周祷告事项</Text>
            <View style={styles.prayerCard}>
              {prayerRequests.map((prayer, index) => (
                <View
                  key={prayer.id}
                  style={[
                    styles.prayerItem,
                    index === prayerRequests.length - 1 && styles.prayerItemLast,
                  ]}
                >
                  <Text style={styles.prayerContent}>{prayer.content}</Text>
                  {!prayer.is_anonymous && prayer.submitter_name && (
                    <Text style={styles.prayerSubmitter}>— {prayer.submitter_name}</Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* 本周灵修列表 */}
        {weekDevotions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>本周灵修</Text>
            {weekDevotions.map((devotion) => (
              <TouchableOpacity
                key={devotion.id}
                style={styles.devotionCard}
                onPress={() => navigation.navigate('DevotionDetail', { id: devotion.id })}
                activeOpacity={0.7}
              >
                <View style={styles.devotionContent}>
                  <Text style={styles.devotionDate}>
                    {formatChineseDate(devotion.date)} {getWeekdayName(devotion.date)}
                  </Text>
                  {devotion.scripture && (
                    <Text style={styles.devotionScripture}>{devotion.scripture}</Text>
                  )}
                </View>
                {devotion.audio_status === 'ready' && (
                  <View style={styles.smallAudioTag}>
                    <Text style={styles.smallAudioText}>有音频</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* 周信息 */}
        {weekInfo && (
          <View style={styles.weekInfoContainer}>
            <Text style={styles.weekInfoText}>
              {weekInfo.year}年 第{weekInfo.week}周
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  // 今日灵修卡片
  todayCard: {
    margin: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
  },
  todayLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: fontSize.sm,
    marginBottom: spacing.xs,
  },
  todayDate: {
    color: colors.textOnPrimary,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  todayScripture: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: fontSize.md,
    marginTop: spacing.md,
  },
  audioIndicator: {
    marginTop: spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  audioText: {
    color: colors.textOnPrimary,
    fontSize: fontSize.sm,
  },
  // 区块
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  // 祷告卡片
  prayerCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  prayerItem: {
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  prayerItemLast: {
    borderBottomWidth: 0,
  },
  prayerContent: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  prayerSubmitter: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'right',
  },
  // 灵修卡片
  devotionCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  devotionContent: {
    flex: 1,
  },
  devotionDate: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  devotionScripture: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  smallAudioTag: {
    backgroundColor: colors.tagBackground,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  smallAudioText: {
    fontSize: fontSize.xs,
    color: colors.tagText,
  },
  // 周信息
  weekInfoContainer: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  weekInfoText: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
  },
});
