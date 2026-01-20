import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Linking from 'expo-linking';

import { getBanners } from '../services/api';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../constants/theme';
import type { Banner } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BANNER_HEIGHT = 180;

export default function BannerCarousel() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);
  const autoPlayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigation = useNavigation();

  // 加载 Banner 数据
  useEffect(() => {
    const loadBanners = async () => {
      try {
        const data = await getBanners();
        setBanners(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to load banners:', error);
        setBanners([]);
      } finally {
        setLoading(false);
      }
    };

    loadBanners();
  }, []);

  // 切换到下一张
  const goToNext = useCallback(() => {
    if (banners.length <= 1) return;
    const nextIndex = currentIndex < banners.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(nextIndex);
    scrollViewRef.current?.scrollTo({ x: nextIndex * SCREEN_WIDTH, animated: true });
  }, [banners.length, currentIndex]);

  // 自动播放
  useEffect(() => {
    if (banners.length <= 1) return;

    const currentBanner = banners[currentIndex];
    const duration = (currentBanner?.duration || 5) * 1000;

    autoPlayRef.current = setTimeout(() => {
      goToNext();
    }, duration);

    return () => {
      if (autoPlayRef.current) {
        clearTimeout(autoPlayRef.current);
      }
    };
  }, [banners, currentIndex, goToNext]);

  // 处理滚动结束
  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    if (index !== currentIndex && index >= 0 && index < banners.length) {
      setCurrentIndex(index);
    }
  };

  // 点击跳转链接
  const handleClick = (banner: Banner) => {
    if (!banner.link_url) return;

    // 站内链接
    if (banner.link_url.startsWith('/')) {
      // 解析路由并导航
      const route = banner.link_url.slice(1);
      if (route.startsWith('sermons/')) {
        const id = route.split('/')[1];
        (navigation as any).navigate('SermonDetail', { id });
      } else if (route.startsWith('devotion/')) {
        const id = route.split('/')[1];
        (navigation as any).navigate('DevotionDetail', { id: parseInt(id) });
      } else if (route === 'devotion') {
        (navigation as any).navigate('Devotion');
      } else if (route === 'gallery') {
        (navigation as any).navigate('Gallery');
      }
    } else {
      // 外部链接
      Linking.openURL(banner.link_url);
    }
  };

  // 点击指示点
  const handleDotPress = (index: number) => {
    setCurrentIndex(index);
    scrollViewRef.current?.scrollTo({ x: index * SCREEN_WIDTH, animated: true });
  };

  // 加载中或无数据时显示占位图
  if (loading || banners.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>BGC7</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
        scrollEventThrottle={16}
      >
        {banners.map((banner) => (
          <TouchableOpacity
            key={banner.id}
            style={styles.slide}
            activeOpacity={banner.link_url ? 0.9 : 1}
            onPress={() => handleClick(banner)}
          >
            {banner.image_url ? (
              <>
                <Image
                  source={{ uri: banner.image_url }}
                  style={styles.image}
                  resizeMode="cover"
                />
                {/* 渐变遮罩层 */}
                <View style={styles.overlay} />
                {/* 有图片时的标题和描述 */}
                {(banner.title || banner.description) && (
                  <View style={styles.content}>
                    {banner.title && (
                      <Text style={styles.title}>{banner.title}</Text>
                    )}
                    {banner.description && (
                      <Text style={styles.description} numberOfLines={2}>
                        {banner.description}
                      </Text>
                    )}
                  </View>
                )}
              </>
            ) : (
              <View style={styles.placeholderSlide}>
                {banner.title && (
                  <Text style={styles.placeholderTitle}>{banner.title}</Text>
                )}
                {banner.description && (
                  <Text style={styles.placeholderDesc} numberOfLines={2}>
                    {banner.description}
                  </Text>
                )}
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 底部指示点 */}
      {banners.length > 1 && (
        <View style={styles.indicators}>
          {banners.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.dot, index === currentIndex && styles.dotActive]}
              onPress={() => handleDotPress(index)}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: BANNER_HEIGHT,
    backgroundColor: colors.section,
  },
  placeholder: {
    flex: 1,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 32,
    fontWeight: fontWeight.bold,
    color: colors.textOnPrimary,
    opacity: 0.8,
  },
  slide: {
    width: SCREEN_WIDTH,
    height: BANNER_HEIGHT,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    paddingBottom: spacing.xl + 16, // 留出指示点空间
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: '#FFFFFF',
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: fontSize.sm,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 18,
  },
  placeholderSlide: {
    flex: 1,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  placeholderTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textOnPrimary,
    textAlign: 'center',
  },
  placeholderDesc: {
    fontSize: fontSize.md,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  indicators: {
    position: 'absolute',
    bottom: spacing.md,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: '#FFFFFF',
    width: 16,
  },
});
