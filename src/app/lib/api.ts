import { API_CONFIG, CACHE_DURATION } from './constants';

const API_BASE = API_CONFIG.BASE_URL;

export interface Drama {
  bookId: string;
  title?: string;
  name?: string;
  cover?: string;
  coverVertical?: string;
  coverHorizontal?: string;
  posterUrl?: string;
  introduction?: string;
  description?: string;
  score?: number;
  episodeCount?: number;
  totalEpisodes?: number;
  tags?: string[];
  category?: string[];
}

export interface Episode {
  episodeId?: string;
  chapterId?: string;
  title?: string;
  episodeIndex?: number;
  episodeNumber?: number;
  streamUrl?: string;
  definition?: Array<{ url: string; definition: string }>;
}

export interface DramaDetail extends Drama {
  episodes?: Episode[];
  director?: string;
  actors?: string[];
}

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Helper function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Cache management
interface CacheEntry {
  data: any;
  timestamp: number;
}

class APICache {
  private cache: Map<string, CacheEntry> = new Map();

  set(key: string, data: any, duration: number = CACHE_DURATION.MEDIUM): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now() + duration,
    });
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (Date.now() > entry.timestamp) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  clear(): void {
    this.cache.clear();
  }

  clearExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.timestamp) {
        this.cache.delete(key);
      }
    }
  }
}

const apiCache = new APICache();

// Clear expired cache entries every 5 minutes
setInterval(() => apiCache.clearExpired(), 5 * 60 * 1000);

// Network status monitoring
let isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => { isOnline = true; });
  window.addEventListener('offline', () => { isOnline = false; });
}

// Request timeout helper
function fetchWithTimeout(url: string, options: RequestInit, timeout: number): Promise<Response> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Request timeout'));
    }, timeout);

    fetch(url, options)
      .then(response => {
        clearTimeout(timer);
        resolve(response);
      })
      .catch(error => {
        clearTimeout(timer);
        reject(error);
      });
  });
}

// Helper function to handle API responses with retry logic
async function fetchAPI(endpoint: string, retries = API_CONFIG.MAX_RETRIES, useCache = true): Promise<any> {
  // Check network status
  if (!isOnline) {
    throw new Error('Tidak ada koneksi internet. Silakan periksa koneksi Anda.');
  }

  // Check cache first
  const cacheKey = endpoint;
  if (useCache) {
    const cachedData = apiCache.get(cacheKey);
    if (cachedData) {
      console.log(`Cache hit for: ${endpoint}`);
      return cachedData;
    }
  }

  try {
    const response = await fetchWithTimeout(
      `${API_BASE}${endpoint}`,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      },
      API_CONFIG.TIMEOUT
    );
    
    if (!response.ok) {
      // Handle specific HTTP errors
      if (response.status === 429) {
        throw new Error('Terlalu banyak permintaan. Silakan tunggu beberapa saat.');
      } else if (response.status === 404) {
        throw new Error('Konten tidak ditemukan.');
      } else if (response.status >= 500) {
        throw new Error('Server sedang bermasalah. Silakan coba lagi nanti.');
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Cache successful response
    if (useCache && data) {
      apiCache.set(cacheKey, data);
    }
    
    return data;
  } catch (error) {
    // Retry logic for network errors
    if (retries > 0 && isOnline) {
      const retryCount = API_CONFIG.MAX_RETRIES - retries + 1;
      console.warn(`API call failed, retrying... (${retryCount}/${API_CONFIG.MAX_RETRIES})`);
      await delay(API_CONFIG.RETRY_DELAY * retryCount); // Exponential backoff
      return fetchAPI(endpoint, retries - 1, useCache);
    }
    
    // If all retries failed, throw error
    console.error(`API Error after ${API_CONFIG.MAX_RETRIES} retries:`, error);
    
    // Return more user-friendly error messages
    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        throw new Error('Permintaan terlalu lama. Silakan coba lagi.');
      } else if (error.message.includes('Failed to fetch')) {
        throw new Error('Gagal terhubung ke server. Silakan periksa koneksi internet Anda.');
      }
      throw error;
    }
    
    throw new Error('Terjadi kesalahan yang tidak diketahui.');
  }
}

export const dramaboxAPI = {
  trending: (useCache = true) => fetchAPI('/dramabox/trending', API_CONFIG.MAX_RETRIES, useCache),
  latest: (useCache = true) => fetchAPI('/dramabox/latest', API_CONFIG.MAX_RETRIES, useCache),
  forYou: (page = 1, useCache = true) => fetchAPI(`/dramabox/foryou?page=${page}`, API_CONFIG.MAX_RETRIES, useCache),
  dubIndo: (classify = 'terpopuler', page = 1, useCache = true) => 
    fetchAPI(`/dramabox/dubindo?classify=${classify}&page=${page}`, API_CONFIG.MAX_RETRIES, useCache),
  detail: (bookId: string, useCache = true) => fetchAPI(`/dramabox/detail?bookId=${bookId}`, API_CONFIG.MAX_RETRIES, useCache),
  allEpisodes: (bookId: string, useCache = true) => fetchAPI(`/dramabox/allepisode?bookId=${bookId}`, API_CONFIG.MAX_RETRIES, useCache),
  search: (query: string, useCache = false) => fetchAPI(`/dramabox/search?query=${encodeURIComponent(query)}`, API_CONFIG.MAX_RETRIES, useCache),
  
  // Utility to clear cache
  clearCache: () => apiCache.clear(),
};

// Helper to safely extract data from API response
export function extractData<T>(response: any): T[] {
  if (Array.isArray(response)) return response;
  if (response?.data && Array.isArray(response.data)) return response.data;
  if (response?.result && Array.isArray(response.result)) return response.result;
  return [];
}

// Helper to safely extract single item from API response
export function extractItem<T>(response: any): T | null {
  if (response?.data) return response.data;
  if (response?.result) return response.result;
  return response || null;
}