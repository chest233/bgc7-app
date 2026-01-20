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

import { getDevotions, getTodayDevotion, getCurrentWeekInfo, getPrayerRequests } from '../services/api';
import { formatChineseDate, getWeekdayName } from '../utils';
import type { MainTabScreenProps } from '../navigation/types';
import type { Devotion, PrayerRequest, WeekInfo } from '../types';

export default function DevotionScreen({ navigation }: MainTabScreenProps<'Devotion'>) {
  const [todayDevotion, setTodayDevotion] = useState<Devotion | null>(null);
  const [weekDevotions, setWeekDevotions] = useState<Devotion[]>([]);
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([]);
  const [weekInfo, setWeekInfo] = useState<WeekInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [today, week, prayers] = await Promise.all([
        getTodayDevotion().catch(() => null),
        getCurrentWeekInfo().catch(() => null),
        getPrayerRequests().catch(() => []),
      ]);

      setTodayDevotion(today || null);
      setWeekInfo(week || null);
      setPrayerRequests(Array.isArray(prayers) ? prayers : []);

      if (week) {
        const devotions = await getDevotions({ year: week.year, week: week.week }).catch(() => []);
        // 过滤掉今日灵修
        const todayStr = new Date().toISOString().split('T')[0];
        const devotionList = Array.isArray(devotions) ? devotions : [];
        setWeekDevotions(devotionList.filter((d) => d.date !== todayStr));
      }
    } catch (error) {
      console.error('Failed to fetch devotion data:', error);
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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>早灵修</Text>
        {weekInfo && (
          <Text style={styles.weekText}>
            {weekInfo.year}年 第{weekInfo.week}周
          </Text>
        )}
      </View>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* 今日灵修 */}
        {todayDevotion && (
          <TouchableOpacity
            style={styles.todayCard}
            onPress={() =>
              navigation.navigate('DevotionDetail', { id: todayDevotion.id })
            }
          >
            <Text style={styles.todayLabel}>今日灵修</Text>
            <Text style={styles.todayDate}>
              {formatChineseDate(todayDevotion.date)}{' '}
              {getWeekdayName(todayDevotion.date)}
            </Text>
            {todayDevotion.scripture && (
              <Text style={styles.todayScripture}>{todayDevotion.scripture}</Text>
            )}
            {todayDevotion.audio_status === 'ready' && (
              <View style={styles.audioIndicator}>
                <Text style={styles.audioText}>点击收听</Text>
              </View>
            )}
          </TouchableOpacity>
        )}

        {/* 祷告事项 */}
        {prayerRequests.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>本周祷告事项</Text>
            <View style={styles.prayerCard}>
              {prayerRequests.map((prayer) => (
                <View key={prayer.id} style={styles.prayerItem}>
                  <Text style={styles.prayerContent}>{prayer.content}</Text>
                  {!prayer.is_anonymous && prayer.submitter_name && (
                    <Text style={styles.prayerSubmitter}>
                      — {prayer.submitter_name}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* 本周灵修列表 */}
        {weekDevotions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>本周灵修</Text>
            {weekDevotions.map((devotion) => (
              <TouchableOpacity
                key={devotion.id}
                style={styles.devotionCard}
                onPress={() =>
                  navigation.navigate('DevotionDetail', { id: devotion.id })
                }
              >
                <Text style={styles.devotionDate}>
                  {formatChineseDate(devotion.date)}{' '}
                  {getWeekdayName(devotion.date)}
                </Text>
                {devotion.scripture && (
                  <Text style={styles.devotionScripture}>
                    {devotion.scripture}
                  </Text>
                )}
                {devotion.audio_status === 'ready' && (
                  <View style={styles.smallAudioTag}>
                    <Text style={styles.smallAudioText}>有音频</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
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
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  weekText: {
    fontSize: 14,
    color: '#6b7280',
  },
  scrollView: {
    flex: 1,
  },
  todayCard: {
    margin: 16,
    backgroundColor: '#2563eb',
    borderRadius: 16,
    padding: 20,
  },
  todayLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginBottom: 4,
  },
  todayDate: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  todayScripture: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 15,
    marginTop: 12,
  },
  audioIndicator: {
    marginTop: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  audioText: {
    color: '#fff',
    fontSize: 13,
  },
  section: {
    padding: 16,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  prayerCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  prayerItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  prayerContent: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
  },
  prayerSubmitter: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'right',
  },
  devotionCard: {
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
  devotionDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  devotionScripture: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  smallAudioTag: {
    marginTop: 8,
    backgroundColor: '#dbeafe',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  smallAudioText: {
    fontSize: 12,
    color: '#1d4ed8',
  },
});
