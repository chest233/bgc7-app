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
import { Ionicons } from '@expo/vector-icons';

import { getSermons } from '../services/api';
import { BannerCarousel } from '../components';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from '../constants/theme';
import { scale, moderateScale } from '../utils/responsive';
import type { MainTabScreenProps } from '../navigation/types';
import type { Sermon } from '../types';

type ServiceTime = 'morning' | 'afternoon';

export default function HomeScreen({ navigation }: MainTabScreenProps<'Home'>) {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [serviceTime, setServiceTime] = useState<ServiceTime>('morning');

  const fetchData = async () => {
    try {
      const sermonsData = await getSermons({ limit: 20 }).catch(() => ({ sermons: [] }));
      setSermons(sermonsData?.sermons || []);
    } catch (error) {
      console.error('Failed to fetch home data:', error);
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

  // 根据礼拜时间筛选
  const filteredSermons = sermons.filter((sermon) => {
    if (serviceTime === 'morning') {
      return sermon.service_time === 'morning' || sermon.service_time === 'joint' || !sermon.service_time;
    }
    return sermon.service_time === 'afternoon';
  });

  // 获取日期信息
  const getDateInfo = (dateStr: string) => {
    if (!dateStr) return { day: '', month: '' };
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return { day: '', month: '' };
    return {
      day: date.getDate().toString(),
      month: `${date.getMonth() + 1}月`,
    };
  };

  // 获取标签
  const getTags = (sermon: Sermon) => {
    const tags: string[] = [];
    if (sermon.service_time === 'joint') tags.push('合堂');
    if (sermon.special_occasion) tags.push(sermon.special_occasion);
    if (sermon.communion_songs && sermon.communion_songs.length > 0) tags.push('圣餐');
    return tags;
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
        {/* Banner 轮播图 */}
        <BannerCarousel />

        {/* Tab 切换 */}
        <View style={styles.tabWrapper}>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, serviceTime === 'morning' && styles.tabActive]}
              onPress={() => setServiceTime('morning')}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, serviceTime === 'morning' && styles.tabTextActive]}>
                上午堂
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, serviceTime === 'afternoon' && styles.tabActive]}
              onPress={() => setServiceTime('afternoon')}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, serviceTime === 'afternoon' && styles.tabTextActive]}>
                下午堂
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 主日信息标题 */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>主日信息</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Sermons')}
            style={styles.viewAllBtn}
          >
            <Text style={styles.viewAllText}>查看全部</Text>
            <Ionicons name="chevron-forward" size={14} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* 讲道列表 */}
        <View style={styles.sermonList}>
          {filteredSermons.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>暂无讲道信息</Text>
            </View>
          ) : (
            filteredSermons.slice(0, 10).map((sermon) => {
              const dateInfo = getDateInfo(sermon.date);
              const tags = getTags(sermon);
              return (
                <TouchableOpacity
                  key={sermon.id}
                  style={styles.sermonCard}
                  onPress={() => navigation.navigate('SermonDetail', { id: sermon.id })}
                  activeOpacity={0.7}
                >
                  <View style={styles.sermonContent}>
                    <Text style={styles.sermonTitle} numberOfLines={2}>
                      {sermon.title}
                    </Text>
                    <Text style={styles.sermonMeta}>
                      {sermon.speaker}
                    </Text>
                    <View style={styles.sermonFooter}>
                      <Text style={styles.sermonScripture} numberOfLines={1}>
                        {sermon.scripture}
                      </Text>
                      {tags.length > 0 && (
                        <View style={styles.tagsRow}>
                          {tags.map((tag, i) => (
                            <Text key={i} style={styles.tagText}>[{tag}]</Text>
                          ))}
                        </View>
                      )}
                    </View>
                  </View>
                  {/* 日期盒子 */}
                  <View style={styles.dateBox}>
                    <Text style={styles.dateDay}>{dateInfo.day}</Text>
                    <Text style={styles.dateMonth}>{dateInfo.month}</Text>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  // Tab 切换
  tabWrapper: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.section,
    borderRadius: borderRadius.lg,
    padding: spacing.xs,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: colors.surface,
    ...shadows.sm,
  },
  tabText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
  },
  tabTextActive: {
    color: colors.textPrimary,
    fontWeight: fontWeight.semibold,
  },
  // 区块标题
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: fontSize.sm,
    color: colors.primary,
  },
  // 讲道列表
  sermonList: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  sermonCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  sermonContent: {
    flex: 1,
    marginRight: spacing.md,
  },
  sermonTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    lineHeight: moderateScale(24),
  },
  sermonMeta: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  sermonFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sermonScripture: {
    fontSize: fontSize.sm,
    color: colors.primary,
    flex: 1,
  },
  tagsRow: {
    flexDirection: 'row',
    marginLeft: spacing.sm,
  },
  tagText: {
    fontSize: fontSize.xs,
    color: colors.primary,
    marginLeft: spacing.xs,
  },
  // 日期盒子
  dateBox: {
    width: scale(52),
    height: scale(52),
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateDay: {
    fontSize: moderateScale(20),
    fontWeight: fontWeight.bold,
    color: colors.textOnPrimary,
  },
  dateMonth: {
    fontSize: fontSize.xs,
    color: 'rgba(255,255,255,0.8)',
  },
  // 空状态
  emptyContainer: {
    padding: spacing.xxl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
});
