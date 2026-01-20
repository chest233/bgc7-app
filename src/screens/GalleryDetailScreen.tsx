import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getAlbum, recordAlbumView } from '../services/api';
import { R2_PUBLIC_URL } from '../constants/config';
import type { RootStackScreenProps } from '../navigation/types';
import type { Album, AlbumMedia } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ITEM_SIZE = (SCREEN_WIDTH - 32 - 8) / 3; // 3列，左右各16px padding，中间间隔4px

export default function GalleryDetailScreen({
  route,
  navigation,
}: RootStackScreenProps<'GalleryDetail'>) {
  const { id } = route.params;
  const [album, setAlbum] = useState<Album | null>(null);
  const [media, setMedia] = useState<AlbumMedia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const data = await getAlbum(id);
        setAlbum(data?.album || null);
        setMedia(data?.media || []);
        // 记录浏览
        recordAlbumView(id).catch(() => {});
        // 更新标题
        if (data?.album?.title) {
          navigation.setOptions({ title: data.album.title });
        }
      } catch (error) {
        console.error('Failed to fetch album:', error);
        setMedia([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbum();
  }, [id, navigation]);

  const getMediaUrl = (item: AlbumMedia) => {
    // 优先使用缩略图
    const url = item.thumbnail_url || item.medium_url || item.original_url;
    if (!url) return '';
    if (url.startsWith('http')) {
      return url;
    }
    return `${R2_PUBLIC_URL}/${url}`;
  };

  const renderMedia = ({ item }: { item: AlbumMedia }) => {
    const mediaUrl = getMediaUrl(item);

    return (
      <TouchableOpacity style={styles.mediaItem}>
        <Image
          source={{ uri: mediaUrl }}
          style={styles.mediaImage}
          resizeMode="cover"
        />
        {item.media_type === 'video' && (
          <View style={styles.videoOverlay}>
            <Text style={styles.videoIcon}>▶</Text>
          </View>
        )}
      </TouchableOpacity>
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

  if (!album) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>相册不存在</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <FlatList
        data={media}
        renderItem={renderMedia}
        keyExtractor={(item) => String(item.id)}
        numColumns={3}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>{album.title}</Text>
            {album.description && (
              <Text style={styles.description}>{album.description}</Text>
            )}
            <Text style={styles.meta}>
              {album.media_count} 张照片 · {album.view_count} 次浏览
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>暂无照片</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  listContent: {
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
    lineHeight: 20,
  },
  meta: {
    fontSize: 13,
    color: '#9ca3af',
    marginTop: 8,
  },
  mediaItem: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    margin: 2,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: '#f3f4f6',
  },
  mediaImage: {
    width: '100%',
    height: '100%',
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoIcon: {
    color: '#fff',
    fontSize: 24,
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
