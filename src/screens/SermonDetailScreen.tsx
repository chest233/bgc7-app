import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getSermon, recordSermonView } from '../services/api';
import AudioPlayer from '../components/AudioPlayer';
import type { RootStackScreenProps } from '../navigation/types';
import type { Sermon } from '../types';

export default function SermonDetailScreen({
  route,
}: RootStackScreenProps<'SermonDetail'>) {
  const { id } = route.params;
  const [sermon, setSermon] = useState<Sermon | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSermon = async () => {
      try {
        const data = await getSermon(id);
        setSermon(data);
        // 记录浏览
        recordSermonView(id).catch(() => {});
      } catch (error) {
        console.error('Failed to fetch sermon:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSermon();
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

  if (!sermon) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>讲道不存在</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView}>
        {/* 标题区域 */}
        <View style={styles.headerSection}>
          {sermon.special_occasion && (
            <View style={styles.occasionTag}>
              <Text style={styles.occasionText}>{sermon.special_occasion}</Text>
            </View>
          )}
          <Text style={styles.title}>{sermon.title}</Text>
          <Text style={styles.meta}>
            {sermon.speaker} · {sermon.date}
          </Text>
        </View>

        {/* 经文 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>经文</Text>
          <Text style={styles.scripture}>{sermon.scripture}</Text>
          {sermon.responsive_scripture && (
            <Text style={styles.responsiveScripture}>
              启应经文: {sermon.responsive_scripture}
            </Text>
          )}
        </View>

        {/* 音频播放器 */}
        {sermon.audio_status === 'ready' && sermon.audio_url && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>讲道音频</Text>
            <AudioPlayer
              audioUrl={sermon.audio_url}
              chapters={sermon.audio_chapters}
              storageKey={`sermon_${sermon.id}`}
              onPlay={() => {}}
            />
          </View>
        )}

        {/* 诗歌 */}
        {sermon.hymns && sermon.hymns.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>诗歌</Text>
            {sermon.hymns.map((hymn, index) => (
              <Text key={index} style={styles.listItem}>
                {hymn}
              </Text>
            ))}
          </View>
        )}

        {/* 诗班献诗 */}
        {sermon.choir_songs && sermon.choir_songs.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>诗班献诗</Text>
            {sermon.choir_songs.map((song, index) => (
              <Text key={index} style={styles.listItem}>
                {song}
              </Text>
            ))}
          </View>
        )}

        {/* 服侍人员 */}
        {(sermon.presiding || sermon.intercession || sermon.pianist) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>服侍人员</Text>
            {sermon.presiding && (
              <Text style={styles.serviceItem}>主领: {sermon.presiding}</Text>
            )}
            {sermon.intercession && (
              <Text style={styles.serviceItem}>
                代祷: {sermon.intercession}
              </Text>
            )}
            {sermon.pianist && (
              <Text style={styles.serviceItem}>司琴: {sermon.pianist}</Text>
            )}
          </View>
        )}

        {/* 描述 */}
        {sermon.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>其他事项描述</Text>
            <Text style={styles.description}>{sermon.description}</Text>
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
  headerSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  occasionTag: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  occasionText: {
    fontSize: 13,
    color: '#92400e',
    fontWeight: '500',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  meta: {
    fontSize: 14,
    color: '#6b7280',
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
    fontSize: 16,
    color: '#2563eb',
    lineHeight: 24,
  },
  responsiveScripture: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
  },
  listItem: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 24,
    paddingLeft: 8,
  },
  serviceItem: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 28,
  },
  description: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 24,
  },
});
