export interface AudioChapter {
  name: string;
  time: number; // 秒数
}

export interface Sermon {
  id: string;
  title: string;
  speaker: string;
  date: string;
  scripture: string;
  special_occasion?: string;
  responsive_scripture?: string;
  service_time?: 'morning' | 'afternoon' | 'joint';
  hymns?: string[];
  choir_songs?: string[];
  communion_songs?: string[];
  response_songs?: string[];
  presiding?: string;
  intercession?: string;
  pianist?: string;
  description?: string;
  audio_url?: string;
  audio_chapters?: AudioChapter[];
  audio_status?: 'none' | 'uploading' | 'processing' | 'ready' | 'failed';
  audio_duration?: number;
  download_url?: string;
}

export interface Devotion {
  id: number;
  date: string;
  week_number: number;
  year: number;
  scripture?: string;
  audio_url?: string;
  audio_status: 'none' | 'uploading' | 'processing' | 'ready' | 'failed';
  audio_duration?: number;
  play_count: number;
  download_url?: string;
}

export interface PrayerRequest {
  id: number;
  week_number: number;
  year: number;
  content: string;
  submitter_name?: string;
  is_anonymous: boolean;
  created_at: string;
}

export interface WeekInfo {
  year: number;
  week: number;
  start: string;
  end: string;
}

export interface Album {
  id: number;
  title: string;
  description?: string;
  cover_url?: string;
  event_date?: string;
  media_count: number;
  view_count: number;
}

export interface AlbumMedia {
  id: number;
  media_type: 'image' | 'video';
  original_url: string;
  hls_url?: string;
  medium_url?: string;
  thumbnail_url?: string;
  compressed_url?: string;
  video_status?: 'none' | 'processing' | 'ready' | 'failed';
  upload_status?: 'uploading' | 'ready' | 'failed';
  width?: number;
  height?: number;
  duration?: number;
}

export interface Banner {
  id: number;
  title?: string;
  description?: string;
  image_url?: string;
  link_url?: string;
  duration: number;
}

export interface Popup {
  id: number;
  title: string;
  image_url: string;
  link_url?: string;
  display_mode: 'always' | 'once' | 'daily' | 'session';
  show_on: 'all' | 'homepage';
  delay_seconds: number;
}

export interface BibleVersion {
  id: string;
  name: string;
  name_en?: string;
  language: string;
  year?: number;
}

export interface BibleBook {
  id: number;
  name: string;
  short_name: string;
  testament: 0 | 1;
  chapters: number;
}

export interface BibleVerse {
  book_id: number;
  book_name: string;
  chapter: number;
  verse: number;
  content: string;
}
