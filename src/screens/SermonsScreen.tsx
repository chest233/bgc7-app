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

import { getSermons } from '../services/api';
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

  const renderSermon = ({ item }: { item: Sermon }) => (
    <TouchableOpacity
      style={styles.sermonCard}
      onPress={() => navigation.navigate('SermonDetail', { id: item.id })}
    >
      <View style={styles.sermonHeader}>
        <Text style={styles.sermonTitle} numberOfLines={2}>
          {item.title}
        </Text>
        {item.special_occasion && (
          <View style={styles.occasionTag}>
            <Text style={styles.occasionText}>{item.special_occasion}</Text>
          </View>
        )}
      </View>
      <Text style={styles.sermonMeta}>
        {item.speaker} · {item.date}
      </Text>
      <Text style={styles.sermonScripture}>{item.scripture}</Text>
      {item.audio_status === 'ready' && (
        <View style={styles.audioTag}>
          <Text style={styles.audioTagText}>有音频</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#2563eb" />
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
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
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  listContent: {
    padding: 16,
  },
  sermonCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sermonHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  sermonTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginRight: 8,
  },
  occasionTag: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  occasionText: {
    fontSize: 12,
    color: '#92400e',
  },
  sermonMeta: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 8,
  },
  sermonScripture: {
    fontSize: 13,
    color: '#2563eb',
    marginTop: 4,
  },
  audioTag: {
    marginTop: 8,
    backgroundColor: '#dbeafe',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  audioTagText: {
    fontSize: 12,
    color: '#1d4ed8',
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
  },
});
