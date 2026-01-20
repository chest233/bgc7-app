import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { getSermons } from '../services/api';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../constants/theme';
import type { MainTabScreenProps } from '../navigation/types';
import type { Sermon } from '../types';

const PAGE_SIZE = 20;

export default function SermonsScreen({ navigation }: MainTabScreenProps<'Sermons'>) {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchSermons = useCallback(async (pageNum: number, isRefresh = false) => {
    try {
      const data = await getSermons({ page: pageNum, limit: PAGE_SIZE });
      const sermonsList = data?.sermons || [];
      if (isRefresh) {
        setSermons(sermonsList);
      } else {
        setSermons((prev) => [...prev, ...sermonsList]);
      }
      setHasMore(sermonsList.length === PAGE_SIZE);
    } catch (error) {
      console.error('Failed to fetch sermons:', error);
      if (isRefresh) {
        setSermons([]);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchSermons(1, true);
  }, [fetchSermons]);

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchSermons(1, true);
  };

  const onLoadMore = () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    fetchSermons(nextPage);
  };

  // 格式化日期为中文格式
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}年${month}月${day}日`;
  };

  // 获取标签
  const getServiceTags = (sermon: Sermon) => {
    const tags: string[] = [];
    if (sermon.service_time === 'joint') {
      tags.push('合堂');
    }
    if (sermon.special_occasion) {
      tags.push(sermon.special_occasion);
    }
    if (sermon.communion_songs && sermon.communion_songs.length > 0) {
      tags.push('圣餐');
    }
    return tags;
  };

  const renderSermon = ({ item }: { item: Sermon }) => {
    const tags = getServiceTags(item);
    return (
      <TouchableOpacity
        style={styles.sermonCard}
        onPress={() => navigation.navigate('SermonDetail', { id: item.id })}
        activeOpacity={0.7}
      >
        <View style={styles.sermonContent}>
          <Text style={styles.sermonTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.sermonMeta}>
            {item.speaker} · {formatDate(item.date)}
          </Text>
          <View style={styles.sermonBottom}>
            <Text style={styles.sermonScripture}>{item.scripture}</Text>
            {tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {tags.map((tag, index) => (
                  <Text key={index} style={styles.tagText}>[{tag}]</Text>
                ))}
              </View>
            )}
          </View>
        </View>
        <Ionicons
          name="chevron-forward"
          size={20}
          color={colors.textTertiary}
        />
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>讲道</Text>
      </View>
      <FlatList
        data={sermons}
        renderItem={renderSermon}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>暂无讲道</Text>
          </View>
        }
      />
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
  listContent: {
    padding: spacing.lg,
  },
  sermonCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sermonContent: {
    flex: 1,
  },
  sermonTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  sermonMeta: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  sermonBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sermonScripture: {
    fontSize: fontSize.sm,
    color: colors.scripture,
    flex: 1,
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  tagText: {
    fontSize: fontSize.xs,
    color: colors.tagText,
  },
  footer: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  emptyContainer: {
    padding: spacing.xxl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
});
