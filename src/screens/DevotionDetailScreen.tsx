import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getDevotion } from '../services/api';
import AudioPlayer from '../components/AudioPlayer';
import { formatChineseDate, getWeekdayName } from '../utils';
import type { RootStackScreenProps } from '../navigation/types';
import type { Devotion } from '../types';

export default function DevotionDetailScreen({
  route,
}: RootStackScreenProps<'DevotionDetail'>) {
  const { id } = route.params;
  const [devotion, setDevotion] = useState<Devotion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevotion = async () => {
      try {
        const data = await getDevotion(id);
        setDevotion(data);
      } catch (error) {
        console.error('Failed to fetch devotion:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDevotion();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      </SafeAreaView>
    );
  }

  if (!devotion) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>灵修不存在</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView}>
        {/* 日期卡片 */}
        <View style={styles.dateCard}>
          <Text style={styles.dateLabel}>灵修日期</Text>
          <Text style={styles.dateText}>
            {formatChineseDate(devotion.date)} {getWeekdayName(devotion.date)}
          </Text>
          <Text style={styles.weekText}>
            {devotion.year}年 第{devotion.week_number}周
          </Text>
        </View>

        {/* 经文 */}
        {devotion.scripture && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>经文</Text>
            <Text style={styles.scripture}>{devotion.scripture}</Text>
          </View>
        )}

        {/* 音频播放器 */}
        {devotion.audio_status === 'ready' && devotion.audio_url && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>灵修音频</Text>
            <AudioPlayer
              audioUrl={devotion.audio_url}
              storageKey={`devotion_${devotion.id}`}
              onPlay={() => {}}
            />
          </View>
        )}

        {/* 播放统计 */}
        {devotion.play_count > 0 && (
          <View style={styles.statsSection}>
            <Text style={styles.statsText}>
              已有 {devotion.play_count} 人收听
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
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#6b7280',
  },
  scrollView: {
    flex: 1,
  },
  dateCard: {
    backgroundColor: '#2563eb',
    padding: 24,
    alignItems: 'center',
  },
  dateLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginBottom: 4,
  },
  dateText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  weekText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginTop: 8,
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  scripture: {
    fontSize: 18,
    color: '#2563eb',
    lineHeight: 28,
    textAlign: 'center',
  },
  statsSection: {
    padding: 16,
    alignItems: 'center',
  },
  statsText: {
    fontSize: 13,
    color: '#9ca3af',
  },
});
