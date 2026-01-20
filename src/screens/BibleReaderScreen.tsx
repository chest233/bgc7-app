import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { getBibleChapter } from '../services/api';
import type { RootStackScreenProps } from '../navigation/types';
import type { BibleVerse, BibleVersion } from '../types';

// 书卷名称映射
const BOOK_NAMES: Record<number, { name: string; chapters: number }> = {
  1: { name: '创世记', chapters: 50 },
  2: { name: '出埃及记', chapters: 40 },
  3: { name: '利未记', chapters: 27 },
  4: { name: '民数记', chapters: 36 },
  5: { name: '申命记', chapters: 34 },
  6: { name: '约书亚记', chapters: 24 },
  7: { name: '士师记', chapters: 21 },
  8: { name: '路得记', chapters: 4 },
  9: { name: '撒母耳记上', chapters: 31 },
  10: { name: '撒母耳记下', chapters: 24 },
  11: { name: '列王纪上', chapters: 22 },
  12: { name: '列王纪下', chapters: 25 },
  13: { name: '历代志上', chapters: 29 },
  14: { name: '历代志下', chapters: 36 },
  15: { name: '以斯拉记', chapters: 10 },
  16: { name: '尼希米记', chapters: 13 },
  17: { name: '以斯帖记', chapters: 10 },
  18: { name: '约伯记', chapters: 42 },
  19: { name: '诗篇', chapters: 150 },
  20: { name: '箴言', chapters: 31 },
  21: { name: '传道书', chapters: 12 },
  22: { name: '雅歌', chapters: 8 },
  23: { name: '以赛亚书', chapters: 66 },
  24: { name: '耶利米书', chapters: 52 },
  25: { name: '耶利米哀歌', chapters: 5 },
  26: { name: '以西结书', chapters: 48 },
  27: { name: '但以理书', chapters: 12 },
  28: { name: '何西阿书', chapters: 14 },
  29: { name: '约珥书', chapters: 3 },
  30: { name: '阿摩司书', chapters: 9 },
  31: { name: '俄巴底亚书', chapters: 1 },
  32: { name: '约拿书', chapters: 4 },
  33: { name: '弥迦书', chapters: 7 },
  34: { name: '那鸿书', chapters: 3 },
  35: { name: '哈巴谷书', chapters: 3 },
  36: { name: '西番雅书', chapters: 3 },
  37: { name: '哈该书', chapters: 2 },
  38: { name: '撒迦利亚书', chapters: 14 },
  39: { name: '玛拉基书', chapters: 4 },
  40: { name: '马太福音', chapters: 28 },
  41: { name: '马可福音', chapters: 16 },
  42: { name: '路加福音', chapters: 24 },
  43: { name: '约翰福音', chapters: 21 },
  44: { name: '使徒行传', chapters: 28 },
  45: { name: '罗马书', chapters: 16 },
  46: { name: '哥林多前书', chapters: 16 },
  47: { name: '哥林多后书', chapters: 13 },
  48: { name: '加拉太书', chapters: 6 },
  49: { name: '以弗所书', chapters: 6 },
  50: { name: '腓立比书', chapters: 4 },
  51: { name: '歌罗西书', chapters: 4 },
  52: { name: '帖撒罗尼迦前书', chapters: 5 },
  53: { name: '帖撒罗尼迦后书', chapters: 3 },
  54: { name: '提摩太前书', chapters: 6 },
  55: { name: '提摩太后书', chapters: 4 },
  56: { name: '提多书', chapters: 3 },
  57: { name: '腓利门书', chapters: 1 },
  58: { name: '希伯来书', chapters: 13 },
  59: { name: '雅各书', chapters: 5 },
  60: { name: '彼得前书', chapters: 5 },
  61: { name: '彼得后书', chapters: 3 },
  62: { name: '约翰一书', chapters: 5 },
  63: { name: '约翰二书', chapters: 1 },
  64: { name: '约翰三书', chapters: 1 },
  65: { name: '犹大书', chapters: 1 },
  66: { name: '启示录', chapters: 22 },
};

export default function BibleReaderScreen({
  route,
  navigation,
}: RootStackScreenProps<'BibleReader'>) {
  const { bookId, chapter: initialChapter } = route.params;
  const [chapter, setChapter] = useState(initialChapter);
  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [version, setVersion] = useState<BibleVersion | null>(null);
  const [loading, setLoading] = useState(true);

  const bookInfo = BOOK_NAMES[bookId];
  const maxChapter = bookInfo?.chapters || 1;

  const fetchChapter = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getBibleChapter(bookId, chapter);
      setVerses(data?.verses || []);
      setVersion(data?.version || null);
    } catch (error) {
      console.error('Failed to fetch chapter:', error);
      setVerses([]);
    } finally {
      setLoading(false);
    }
  }, [bookId, chapter]);

  useEffect(() => {
    fetchChapter();
  }, [fetchChapter]);

  useEffect(() => {
    // 更新标题
    navigation.setOptions({
      title: `${bookInfo?.name || ''} 第${chapter}章`,
    });
  }, [navigation, bookInfo, chapter]);

  const goToPrevChapter = () => {
    if (chapter > 1) {
      setChapter(chapter - 1);
    }
  };

  const goToNextChapter = () => {
    if (chapter < maxChapter) {
      setChapter(chapter + 1);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* 版本和章节信息 */}
      <View style={styles.headerBar}>
        <Text style={styles.versionText}>
          {version?.name || '和合本简体'}
        </Text>
        <Text style={styles.chapterInfo}>
          {bookInfo?.name} {chapter}/{maxChapter}
        </Text>
      </View>

      {/* 经文内容 */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : (
        <ScrollView style={styles.scrollView}>
          <View style={styles.versesContainer}>
            {verses.map((verse) => (
              <Text key={verse.verse} style={styles.verseText}>
                <Text style={styles.verseNumber}>{verse.verse}</Text>
                {'  '}
                {verse.content}
              </Text>
            ))}
          </View>
        </ScrollView>
      )}

      {/* 章节导航 */}
      <View style={styles.navigationBar}>
        <TouchableOpacity
          style={[styles.navButton, chapter === 1 && styles.navButtonDisabled]}
          onPress={goToPrevChapter}
          disabled={chapter === 1}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={chapter === 1 ? '#d1d5db' : '#2563eb'}
          />
          <Text
            style={[
              styles.navButtonText,
              chapter === 1 && styles.navButtonTextDisabled,
            ]}
          >
            上一章
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navButton,
            chapter === maxChapter && styles.navButtonDisabled,
          ]}
          onPress={goToNextChapter}
          disabled={chapter === maxChapter}
        >
          <Text
            style={[
              styles.navButtonText,
              chapter === maxChapter && styles.navButtonTextDisabled,
            ]}
          >
            下一章
          </Text>
          <Ionicons
            name="chevron-forward"
            size={24}
            color={chapter === maxChapter ? '#d1d5db' : '#2563eb'}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f9fafb',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  versionText: {
    fontSize: 13,
    color: '#2563eb',
    fontWeight: '500',
  },
  chapterInfo: {
    fontSize: 13,
    color: '#6b7280',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  versesContainer: {
    padding: 16,
  },
  verseText: {
    fontSize: 18,
    lineHeight: 32,
    color: '#1f2937',
    marginBottom: 8,
  },
  verseNumber: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '600',
  },
  navigationBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 15,
    color: '#2563eb',
    fontWeight: '500',
  },
  navButtonTextDisabled: {
    color: '#d1d5db',
  },
});
