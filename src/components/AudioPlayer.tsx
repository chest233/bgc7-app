import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Audio, AVPlaybackStatus } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

import { formatTime } from '../utils';
import { R2_PUBLIC_URL } from '../constants/config';
import type { AudioChapter } from '../types';

interface AudioPlayerProps {
  audioUrl: string;
  chapters?: AudioChapter[];
  storageKey: string;
  onPlay?: () => void;
}

export default function AudioPlayer({
  audioUrl,
  chapters,
  storageKey,
  onPlay,
}: AudioPlayerProps) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [hasRestoredPosition, setHasRestoredPosition] = useState(false);

  const isPlayingRef = useRef(false);
  const positionRef = useRef(0);

  // 获取完整 URL
  const getFullUrl = (url: string): string => {
    if (url.startsWith('http')) {
      return url;
    }
    return `${R2_PUBLIC_URL}/${url}`;
  };

  // 保存播放位置
  const savePosition = useCallback(async (pos: number) => {
    try {
      await AsyncStorage.setItem(`playback_${storageKey}`, String(Math.floor(pos)));
    } catch (e) {
      console.error('Failed to save position:', e);
    }
  }, [storageKey]);

  // 恢复播放位置
  const restorePosition = useCallback(async (): Promise<number> => {
    try {
      const saved = await AsyncStorage.getItem(`playback_${storageKey}`);
      return saved ? parseInt(saved, 10) : 0;
    } catch (e) {
      console.error('Failed to restore position:', e);
      return 0;
    }
  }, [storageKey]);

  // 播放状态更新回调
  const onPlaybackStatusUpdate = useCallback((status: AVPlaybackStatus) => {
    if (!status.isLoaded) {
      if (status.error) {
        setError(`播放错误: ${status.error}`);
      }
      return;
    }

    setDuration(status.durationMillis ? status.durationMillis / 1000 : 0);
    setPosition(status.positionMillis / 1000);
    positionRef.current = status.positionMillis / 1000;
    setIsPlaying(status.isPlaying);
    isPlayingRef.current = status.isPlaying;
    setIsLoading(false);

    // 播放完成
    if (status.didJustFinish) {
      setPosition(0);
      positionRef.current = 0;
      savePosition(0);
    }
  }, [savePosition]);

  // 加载音频
  useEffect(() => {
    let isMounted = true;

    const loadAudio = async () => {
      try {
        // 设置音频模式
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
        });

        const fullUrl = getFullUrl(audioUrl);
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: fullUrl },
          { shouldPlay: false },
          onPlaybackStatusUpdate
        );

        if (!isMounted) {
          await newSound.unloadAsync();
          return;
        }

        setSound(newSound);

        // 恢复播放位置
        const savedPosition = await restorePosition();
        if (savedPosition > 0) {
          await newSound.setPositionAsync(savedPosition * 1000);
          setPosition(savedPosition);
          positionRef.current = savedPosition;
          setHasRestoredPosition(true);
        }
      } catch (e) {
        console.error('Failed to load audio:', e);
        if (isMounted) {
          setError('加载音频失败');
          setIsLoading(false);
        }
      }
    };

    loadAudio();

    return () => {
      isMounted = false;
      // 保存位置并卸载
      if (positionRef.current > 0) {
        savePosition(positionRef.current);
      }
    };
  }, [audioUrl, onPlaybackStatusUpdate, restorePosition, savePosition]);

  // 卸载时清理
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  // 定期保存播放位置
  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlayingRef.current && positionRef.current > 0) {
        savePosition(positionRef.current);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [savePosition]);

  // 播放/暂停
  const togglePlayPause = async () => {
    if (!sound) return;

    try {
      if (isPlaying) {
        await sound.pauseAsync();
        savePosition(positionRef.current);
      } else {
        await sound.playAsync();
        onPlay?.();
      }
    } catch (e) {
      console.error('Failed to toggle play/pause:', e);
    }
  };

  // 快进/快退
  const seekBy = async (seconds: number) => {
    if (!sound) return;

    try {
      const newPosition = Math.max(0, Math.min(duration, position + seconds));
      await sound.setPositionAsync(newPosition * 1000);
      setPosition(newPosition);
      positionRef.current = newPosition;
    } catch (e) {
      console.error('Failed to seek:', e);
    }
  };

  // 跳转到章节
  const seekToChapter = async (time: number) => {
    if (!sound) return;

    try {
      await sound.setPositionAsync(time * 1000);
      setPosition(time);
      positionRef.current = time;
      if (!isPlaying) {
        await sound.playAsync();
        onPlay?.();
      }
    } catch (e) {
      console.error('Failed to seek to chapter:', e);
    }
  };

  // 获取当前章节
  const getCurrentChapter = (): number => {
    if (!chapters || chapters.length === 0) return -1;
    for (let i = chapters.length - 1; i >= 0; i--) {
      if (position >= chapters[i].time) {
        return i;
      }
    }
    return -1;
  };

  const currentChapter = getCurrentChapter();
  const progress = duration > 0 ? (position / duration) * 100 : 0;

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={24} color="#ef4444" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 恢复位置提示 */}
      {hasRestoredPosition && position > 0 && !isPlaying && (
        <View style={styles.restoreHint}>
          <Text style={styles.restoreText}>
            已为您定位至 {formatTime(position)}
          </Text>
          <TouchableOpacity
            onPress={() => {
              if (sound) {
                sound.setPositionAsync(0);
                setPosition(0);
                positionRef.current = 0;
                setHasRestoredPosition(false);
              }
            }}
          >
            <Text style={styles.restoreReset}>从头播放</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 进度条 */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{formatTime(position)}</Text>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>
      </View>

      {/* 播放控制 */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.seekButton}
          onPress={() => seekBy(-15)}
          disabled={isLoading}
        >
          <Ionicons name="play-back" size={24} color="#4b5563" />
          <Text style={styles.seekText}>15</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.playButton}
          onPress={togglePlayPause}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={32}
              color="#fff"
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.seekButton}
          onPress={() => seekBy(30)}
          disabled={isLoading}
        >
          <Ionicons name="play-forward" size={24} color="#4b5563" />
          <Text style={styles.seekText}>30</Text>
        </TouchableOpacity>
      </View>

      {/* 章节列表 */}
      {chapters && chapters.length > 0 && (
        <View style={styles.chaptersContainer}>
          <Text style={styles.chaptersTitle}>章节</Text>
          <View style={styles.chaptersList}>
            {chapters.map((chapter, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.chapterItem,
                  currentChapter === index && styles.chapterItemActive,
                ]}
                onPress={() => seekToChapter(chapter.time)}
              >
                <Text
                  style={[
                    styles.chapterName,
                    currentChapter === index && styles.chapterNameActive,
                  ]}
                >
                  {chapter.name}
                </Text>
                <Text
                  style={[
                    styles.chapterTime,
                    currentChapter === index && styles.chapterTimeActive,
                  ]}
                >
                  {formatTime(chapter.time)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  errorText: {
    color: '#ef4444',
    marginLeft: 8,
    fontSize: 14,
  },
  restoreHint: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#dbeafe',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  restoreText: {
    fontSize: 13,
    color: '#1d4ed8',
  },
  restoreReset: {
    fontSize: 13,
    color: '#2563eb',
    fontWeight: '500',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563eb',
    borderRadius: 2,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  timeText: {
    fontSize: 12,
    color: '#6b7280',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },
  seekButton: {
    alignItems: 'center',
    padding: 8,
  },
  seekText: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 2,
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chaptersContainer: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  chaptersTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  chaptersList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chapterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  chapterItemActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  chapterName: {
    fontSize: 13,
    color: '#374151',
    marginRight: 6,
  },
  chapterNameActive: {
    color: '#fff',
  },
  chapterTime: {
    fontSize: 11,
    color: '#9ca3af',
  },
  chapterTimeActive: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
});
