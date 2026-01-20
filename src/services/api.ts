import { API_BASE_URL } from '../constants/config';
import type {
  Sermon,
  Devotion,
  PrayerRequest,
  WeekInfo,
  Album,
  AlbumMedia,
  Banner,
  Popup,
  BibleVersion,
  BibleBook,
  BibleVerse,
} from '../types';

/**
 * 通用请求函数
 */
async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// ============ 讲道 API ============

export async function getSermons(params?: {
  page?: number;
  limit?: number;
  speaker?: string;
  year?: number;
  month?: number;
}): Promise<{ sermons: Sermon[]; total: number; page: number; limit: number }> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set('page', String(params.page));
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.speaker) searchParams.set('speaker', params.speaker);
  if (params?.year) searchParams.set('year', String(params.year));
  if (params?.month) searchParams.set('month', String(params.month));

  const query = searchParams.toString();
  return request(`/sermons${query ? `?${query}` : ''}`);
}

export async function getSermon(id: string): Promise<Sermon> {
  return request(`/sermons/${id}`);
}

export async function recordSermonView(id: string): Promise<void> {
  await request(`/sermons/${id}/view`, { method: 'POST' });
}

export async function recordSermonPlay(id: string): Promise<void> {
  await request(`/sermons/${id}/play`, { method: 'POST' });
}

// ============ 灵修 API ============

export async function getDevotions(params?: {
  year?: number;
  week?: number;
}): Promise<Devotion[]> {
  const searchParams = new URLSearchParams();
  if (params?.year) searchParams.set('year', String(params.year));
  if (params?.week) searchParams.set('week', String(params.week));

  const query = searchParams.toString();
  return request(`/devotions${query ? `?${query}` : ''}`);
}

export async function getDevotion(id: number): Promise<Devotion> {
  return request(`/devotions/${id}`);
}

export async function getTodayDevotion(): Promise<Devotion | null> {
  try {
    return await request('/devotions/today');
  } catch {
    return null;
  }
}

export async function getCurrentWeekInfo(): Promise<WeekInfo> {
  return request('/devotions/current-week');
}

// ============ 祷告事项 API ============

export async function getPrayerRequests(params?: {
  year?: number;
  week?: number;
}): Promise<PrayerRequest[]> {
  const searchParams = new URLSearchParams();
  if (params?.year) searchParams.set('year', String(params.year));
  if (params?.week) searchParams.set('week', String(params.week));

  const query = searchParams.toString();
  return request(`/prayer-requests${query ? `?${query}` : ''}`);
}

export async function submitPrayerRequest(data: {
  content: string;
  submitter_name?: string;
  is_anonymous: boolean;
}): Promise<{ id: number }> {
  return request('/prayer-requests', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ============ 相册 API ============

export async function getAlbums(): Promise<Album[]> {
  return request('/albums');
}

export async function getAlbum(id: number): Promise<{ album: Album; media: AlbumMedia[] }> {
  return request(`/albums/${id}`);
}

export async function recordAlbumView(id: number): Promise<void> {
  await request(`/albums/${id}/view`, { method: 'POST' });
}

// ============ Banner API ============

export async function getBanners(): Promise<Banner[]> {
  return request('/banners');
}

// ============ 弹窗 API ============

export async function getPopups(): Promise<Popup[]> {
  return request('/popups');
}

// ============ 圣经 API ============

export async function getBibleVersions(): Promise<BibleVersion[]> {
  return request('/bible/versions');
}

export async function getBibleBooks(): Promise<BibleBook[]> {
  return request('/bible/books');
}

export async function getBibleChapter(
  bookId: number,
  chapter: number,
  versionId?: string
): Promise<{
  version: BibleVersion;
  bookId: number;
  bookName: string;
  chapter: number;
  verses: BibleVerse[];
}> {
  const params = versionId ? `?version=${versionId}` : '';
  return request(`/bible/chapter/${bookId}/${chapter}${params}`);
}

export async function getBibleVerses(
  reference: string,
  versionId?: string
): Promise<{
  reference: string;
  version: BibleVersion;
  bookId: number;
  bookName: string;
  startChapter: number;
  startVerse: number;
  endChapter: number;
  endVerse: number;
  verses: BibleVerse[];
}> {
  const params = new URLSearchParams({ ref: reference });
  if (versionId) params.set('version', versionId);
  return request(`/bible/verses?${params}`);
}

export async function compareBibleVerses(
  reference: string,
  versions: string[]
): Promise<{
  reference: string;
  bookId: number;
  bookName: string;
  startChapter: number;
  startVerse: number;
  endChapter: number;
  endVerse: number;
  versions: {
    version: BibleVersion;
    verses: BibleVerse[];
  }[];
}> {
  const params = new URLSearchParams({
    ref: reference,
    versions: versions.join(','),
  });
  return request(`/bible/compare?${params}`);
}

export async function searchBible(
  query: string,
  versionId?: string
): Promise<{
  query: string;
  version: BibleVersion;
  results: BibleVerse[];
  total: number;
}> {
  const params = new URLSearchParams({ q: query });
  if (versionId) params.set('version', versionId);
  return request(`/bible/search?${params}`);
}
