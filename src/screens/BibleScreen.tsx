import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { MainTabScreenProps } from '../navigation/types';

// 圣经书卷数据（静态）
const OLD_TESTAMENT = [
  { id: 1, name: '创世记', chapters: 50 },
  { id: 2, name: '出埃及记', chapters: 40 },
  { id: 3, name: '利未记', chapters: 27 },
  { id: 4, name: '民数记', chapters: 36 },
  { id: 5, name: '申命记', chapters: 34 },
  { id: 6, name: '约书亚记', chapters: 24 },
  { id: 7, name: '士师记', chapters: 21 },
  { id: 8, name: '路得记', chapters: 4 },
  { id: 9, name: '撒母耳记上', chapters: 31 },
  { id: 10, name: '撒母耳记下', chapters: 24 },
  { id: 11, name: '列王纪上', chapters: 22 },
  { id: 12, name: '列王纪下', chapters: 25 },
  { id: 13, name: '历代志上', chapters: 29 },
  { id: 14, name: '历代志下', chapters: 36 },
  { id: 15, name: '以斯拉记', chapters: 10 },
  { id: 16, name: '尼希米记', chapters: 13 },
  { id: 17, name: '以斯帖记', chapters: 10 },
  { id: 18, name: '约伯记', chapters: 42 },
  { id: 19, name: '诗篇', chapters: 150 },
  { id: 20, name: '箴言', chapters: 31 },
  { id: 21, name: '传道书', chapters: 12 },
  { id: 22, name: '雅歌', chapters: 8 },
  { id: 23, name: '以赛亚书', chapters: 66 },
  { id: 24, name: '耶利米书', chapters: 52 },
  { id: 25, name: '耶利米哀歌', chapters: 5 },
  { id: 26, name: '以西结书', chapters: 48 },
  { id: 27, name: '但以理书', chapters: 12 },
  { id: 28, name: '何西阿书', chapters: 14 },
  { id: 29, name: '约珥书', chapters: 3 },
  { id: 30, name: '阿摩司书', chapters: 9 },
  { id: 31, name: '俄巴底亚书', chapters: 1 },
  { id: 32, name: '约拿书', chapters: 4 },
  { id: 33, name: '弥迦书', chapters: 7 },
  { id: 34, name: '那鸿书', chapters: 3 },
  { id: 35, name: '哈巴谷书', chapters: 3 },
  { id: 36, name: '西番雅书', chapters: 3 },
  { id: 37, name: '哈该书', chapters: 2 },
  { id: 38, name: '撒迦利亚书', chapters: 14 },
  { id: 39, name: '玛拉基书', chapters: 4 },
];

const NEW_TESTAMENT = [
  { id: 40, name: '马太福音', chapters: 28 },
  { id: 41, name: '马可福音', chapters: 16 },
  { id: 42, name: '路加福音', chapters: 24 },
  { id: 43, name: '约翰福音', chapters: 21 },
  { id: 44, name: '使徒行传', chapters: 28 },
  { id: 45, name: '罗马书', chapters: 16 },
  { id: 46, name: '哥林多前书', chapters: 16 },
  { id: 47, name: '哥林多后书', chapters: 13 },
  { id: 48, name: '加拉太书', chapters: 6 },
  { id: 49, name: '以弗所书', chapters: 6 },
  { id: 50, name: '腓立比书', chapters: 4 },
  { id: 51, name: '歌罗西书', chapters: 4 },
  { id: 52, name: '帖撒罗尼迦前书', chapters: 5 },
  { id: 53, name: '帖撒罗尼迦后书', chapters: 3 },
  { id: 54, name: '提摩太前书', chapters: 6 },
  { id: 55, name: '提摩太后书', chapters: 4 },
  { id: 56, name: '提多书', chapters: 3 },
  { id: 57, name: '腓利门书', chapters: 1 },
  { id: 58, name: '希伯来书', chapters: 13 },
  { id: 59, name: '雅各书', chapters: 5 },
  { id: 60, name: '彼得前书', chapters: 5 },
  { id: 61, name: '彼得后书', chapters: 3 },
  { id: 62, name: '约翰一书', chapters: 5 },
  { id: 63, name: '约翰二书', chapters: 1 },
  { id: 64, name: '约翰三书', chapters: 1 },
  { id: 65, name: '犹大书', chapters: 1 },
  { id: 66, name: '启示录', chapters: 22 },
];

export default function BibleScreen({ navigation }: MainTabScreenProps<'Bible'>) {
  const [activeTab, setActiveTab] = useState<'old' | 'new'>('old');

  const books = activeTab === 'old' ? OLD_TESTAMENT : NEW_TESTAMENT;

  const handleBookPress = (bookId: number) => {
    navigation.navigate('BibleReader', { bookId, chapter: 1 });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>圣经</Text>
      </View>

      {/* 旧约/新约切换 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'old' && styles.activeTab]}
          onPress={() => setActiveTab('old')}
        >
          <Text style={[styles.tabText, activeTab === 'old' && styles.activeTabText]}>
            旧约 (39卷)
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'new' && styles.activeTab]}
          onPress={() => setActiveTab('new')}
        >
          <Text style={[styles.tabText, activeTab === 'new' && styles.activeTabText]}>
            新约 (27卷)
          </Text>
        </TouchableOpacity>
      </View>

      {/* 书卷列表 */}
      <ScrollView style={styles.scrollView}>
        <View style={styles.booksGrid}>
          {books.map((book) => (
            <TouchableOpacity
              key={book.id}
              style={styles.bookItem}
              onPress={() => handleBookPress(book.id)}
            >
              <Text style={styles.bookName}>{book.name}</Text>
              <Text style={styles.bookChapters}>{book.chapters}章</Text>
            </TouchableOpacity>
          ))}
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#2563eb',
  },
  tabText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  booksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
  },
  bookItem: {
    width: '31%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    margin: '1%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  bookName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    textAlign: 'center',
  },
  bookChapters: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
});
