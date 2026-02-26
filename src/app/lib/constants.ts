import { ENV } from './env';

// API Configuration
export const API_CONFIG = {
  BASE_URL: ENV.API_BASE_URL,
  TIMEOUT: 30000,
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  CACHE_ENABLED: true,
} as const;

// App Configuration
export const APP_CONFIG = {
  NAME: 'Teras Dracin',
  DESCRIPTION: 'Platform Streaming Drama Terbaik - Nonton Drama Terbaru dan Populer',
  DEFAULT_LOCALE: 'id-ID',
  SUPPORT_EMAIL: 'support@terasdracin.com', // Change to your support email
  VERSION: '1.0.0',
} as const;

// Cache duration (in milliseconds)
export const CACHE_DURATION = {
  SHORT: 5 * 60 * 1000, // 5 minutes
  MEDIUM: 15 * 60 * 1000, // 15 minutes
  LONG: 60 * 60 * 1000, // 1 hour
  VERY_LONG: 24 * 60 * 60 * 1000, // 24 hours
} as const;

// Route paths
export const ROUTES = {
  HOME: '/',
  DRAMA_DETAIL: (bookId: string) => `/drama/${bookId}`,
  WATCH: (bookId: string, episodeIndex: number) => `/watch/${bookId}/${episodeIndex}`,
  SEARCH: '/search',
  NOT_FOUND: '/404',
} as const;

// SEO Configuration
export const SEO_CONFIG = {
  DEFAULT_TITLE: 'Teras Dracin - Platform Streaming Drama Terbaik',
  TITLE_TEMPLATE: '%s | Teras Dracin',
  DEFAULT_DESCRIPTION: 'Nonton drama terbaru dan populer dengan subtitle Indonesia. Streaming berkualitas HD, update episode terbaru setiap hari.',
  DEFAULT_IMAGE: '/og-image.jpg', // Add your OG image
  SITE_URL: 'https://terasdracin.com', // Change to your domain
  TWITTER_HANDLE: '@terasdracin',
} as const;

// Video Player Configuration
export const VIDEO_CONFIG = {
  DEFAULT_VOLUME: 0.7,
  SEEK_INTERVAL: 10, // seconds
  AUTO_QUALITY: true,
  PREFERRED_QUALITY: 'auto',
  QUALITIES: ['360p', '480p', '720p', '1080p', 'auto'] as const,
} as const;

// Pagination
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Tidak ada koneksi internet. Silakan periksa koneksi Anda.',
  SERVER_ERROR: 'Server sedang bermasalah. Silakan coba lagi nanti.',
  NOT_FOUND: 'Konten tidak ditemukan.',
  TIMEOUT: 'Permintaan terlalu lama. Silakan coba lagi.',
  RATE_LIMIT: 'Terlalu banyak permintaan. Silakan tunggu beberapa saat.',
  UNKNOWN: 'Terjadi kesalahan yang tidak diketahui.',
  INVALID_VIDEO_URL: 'URL video tidak valid atau tidak tersedia.',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  WATCH_HISTORY: 'teras_dracin_watch_history',
  FAVORITES: 'teras_dracin_favorites',
  VOLUME: 'teras_dracin_volume',
  QUALITY_PREFERENCE: 'teras_dracin_quality',
  LAST_VISITED: 'teras_dracin_last_visited',
} as const;

// Analytics Events
export const ANALYTICS_EVENTS = {
  PAGE_VIEW: 'page_view',
  VIDEO_PLAY: 'video_play',
  VIDEO_PAUSE: 'video_pause',
  VIDEO_COMPLETE: 'video_complete',
  SEARCH: 'search',
  DRAMA_CLICK: 'drama_click',
  EPISODE_CLICK: 'episode_click',
  ERROR: 'error',
} as const;