import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getAlbums } from '../services/api';
import { R2_PUBLIC_URL } from '../constants/config';
import type { RootStackScreenProps } from '../navigation/types';
import type { Album } from '../types';

export default function GalleryScreen({
  navigation,
}: RootStackScreenProps<'Gallery'>) {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAlbums = async () => {
    try {
      const data = await getAlbums();
      setAlbums(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch albums:', error);
      setAlbums([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAlbums();
  };

  const getCoverUrl = (album: Album) => {
    if (album.cover_url) {
      if (album.cover_url.startsWith('http')) {
        return album.cover_url;
      }
      return `${R2_PUBLIC_URL}/${album.cover_url}`;
    }
    return null;
  };

  const renderAlbum = ({ item }: { item: Album }) => {
    const coverUrl = getCoverUrl(item);

    return (
      <TouchableOpacity
        style={styles.albumCard}
        onPress={() => navigation.navigate('GalleryDetail', { id: item.id })}
      >
        <View style={styles.albumCover}>
          {coverUrl ? (
            <Image
              source={{ uri: coverUrl }}
              style={styles.coverImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholderCover}>
              <Text style={styles.placeholderText}>📷</Text>
            </View>
          )}
        </View>
        <View style={styles.albumInfo}>
          <Text style={styles.albumTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.albumMeta}>
            {item.media_count} 张 · {item.view_count} 次浏览
          </Text>
          {item.event_date && (
            <Text style={styles.albumDate}>{item.event_date}</Text>
          )}
        </View>
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

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <FlatList
        data={albums}
        renderItem={renderAlbum}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>暂无相册</Text>
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
  listContent: {
    padding: 8,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  albumCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  albumCover: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#f3f4f6',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  placeholderCover: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 40,
  },
  albumInfo: {
    padding: 12,
  },
  albumTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
  },
  albumMeta: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  albumDate: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
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
