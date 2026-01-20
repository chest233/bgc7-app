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

import { getBanners, getSermons, getTodayDevotion } from '../services/api';
import { formatChineseDate, getWeekdayName } from '../utils';
import type { MainTabScreenProps } from '../navigation/types';
import type { Banner, Sermon, Devotion } from '../types';

export default function HomeScreen({ navigation }: MainTabScreenProps<'Home'>) {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [todayDevotion, setTodayDevotion] = useState<Devotion | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [bannersData, sermonsData, devotionData] = await Promise.all([
        getBanners().catch(() => []),
        getSermons({ limit: 3 }).catch(() => ({ sermons: [] })),
        getTodayDevotion().catch(() => null),
      ]);
      setBanners(Array.isArray(bannersData) ? bannersData : []);
      setSermons(sermonsData?.sermons || []);
      setTodayDevotion(devotionData || null);
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
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Banner 区域 */}
        {banners.length > 0 && (
          <View style={styles.bannerContainer}>
            <View style={styles.banner}>
              <Text style={styles.bannerTitle}>
                {banners[0].title || '欢迎来到 BGC7'}
              </Text>
              {banners[0].description && (
                <Text style={styles.bannerDescription}>
                  {banners[0].description}
                </Text>
              )}
            </View>
          </View>
        )}

        {/* 今日灵修 */}
        {todayDevotion && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>今日灵修</Text>
            <TouchableOpacity
              style={styles.devotionCard}
              onPress={() =>
                navigation.navigate('DevotionDetail', { id: todayDevotion.id })
              }
            >
              <Text style={styles.devotionDate}>
                {formatChineseDate(todayDevotion.date)}{' '}
                {getWeekdayName(todayDevotion.date)}
              </Text>
              {todayDevotion.scripture && (
                <Text style={styles.devotionScripture}>
                  {todayDevotion.scripture}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* 最新讲道 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>最新讲道</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Sermons')}
            >
              <Text style={styles.moreLink}>查看全部</Text>
            </TouchableOpacity>
          </View>
          {sermons.map((sermon) => (
            <TouchableOpacity
              key={sermon.id}
              style={styles.sermonCard}
              onPress={() =>
                navigation.navigate('SermonDetail', { id: sermon.id })
              }
            >
              <Text style={styles.sermonTitle}>{sermon.title}</Text>
              <Text style={styles.sermonMeta}>
                {sermon.speaker} · {sermon.date}
              </Text>
              <Text style={styles.sermonScripture}>{sermon.scripture}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 快捷入口 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>快捷入口</Text>
          <View style={styles.quickLinks}>
            <TouchableOpacity
              style={styles.quickLinkItem}
              onPress={() => navigation.navigate('Bible')}
            >
              <Text style={styles.quickLinkIcon}>📖</Text>
              <Text style={styles.quickLinkText}>圣经阅读</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickLinkItem}
              onPress={() => navigation.navigate('Gallery')}
            >
              <Text style={styles.quickLinkIcon}>📷</Text>
              <Text style={styles.quickLinkText}>相册</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickLinkItem}
              onPress={() => navigation.navigate('Devotion')}
            >
              <Text style={styles.quickLinkIcon}>🙏</Text>
              <Text style={styles.quickLinkText}>祷告事项</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  bannerContainer: {
    padding: 16,
  },
  banner: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    padding: 24,
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  bannerDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginTop: 8,
  },
  section: {
    padding: 16,
    paddingTop: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  moreLink: {
    color: '#2563eb',
    fontSize: 14,
  },
  devotionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  devotionDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  devotionScripture: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
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
  sermonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  sermonMeta: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
  },
  sermonScripture: {
    fontSize: 13,
    color: '#2563eb',
    marginTop: 4,
  },
  quickLinks: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  quickLinkItem: {
    alignItems: 'center',
  },
  quickLinkIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  quickLinkText: {
    fontSize: 13,
    color: '#4b5563',
  },
});
