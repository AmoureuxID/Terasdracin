/**
 * Local Storage utilities with type safety
 */

import { STORAGE_KEYS } from './constants';

interface WatchHistoryItem {
  bookId: string;
  episodeIndex: number;
  title: string;
  timestamp: number;
  progress?: number; // Video progress in seconds
  coverImage?: string;
}

interface FavoriteItem {
  bookId: string;
  title: string;
  coverImage?: string;
  timestamp: number;
}

class StorageManager {
  /**
   * Get item from localStorage with fallback
   */
  private static getItem<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error reading from localStorage: ${key}`, error);
      return defaultValue;
    }
  }

  /**
   * Set item in localStorage
   */
  private static setItem(key: string, value: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage: ${key}`, error);
    }
  }

  /**
   * Remove item from localStorage
   */
  private static removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage: ${key}`, error);
    }
  }

  // Watch History Management
  static getWatchHistory(): WatchHistoryItem[] {
    const history = this.getItem<WatchHistoryItem[]>(STORAGE_KEYS.WATCH_HISTORY, []);
    // Sort by timestamp descending (newest first)
    return history.sort((a, b) => b.timestamp - a.timestamp);
  }

  static addToWatchHistory(item: Omit<WatchHistoryItem, 'timestamp'>): void {
    const history = this.getWatchHistory();
    
    // Remove existing entry for the same drama and episode
    const filtered = history.filter(
      h => !(h.bookId === item.bookId && h.episodeIndex === item.episodeIndex)
    );

    // Add new entry at the beginning
    const newHistory = [
      { ...item, timestamp: Date.now() },
      ...filtered,
    ].slice(0, 50); // Keep only last 50 items

    this.setItem(STORAGE_KEYS.WATCH_HISTORY, newHistory);
  }

  static clearWatchHistory(): void {
    this.removeItem(STORAGE_KEYS.WATCH_HISTORY);
  }

  // Favorites Management
  static getFavorites(): FavoriteItem[] {
    return this.getItem<FavoriteItem[]>(STORAGE_KEYS.FAVORITES, []);
  }

  static addToFavorites(item: Omit<FavoriteItem, 'timestamp'>): void {
    const favorites = this.getFavorites();
    
    // Check if already exists
    const exists = favorites.some(f => f.bookId === item.bookId);
    if (exists) return;

    const newFavorites = [
      { ...item, timestamp: Date.now() },
      ...favorites,
    ];

    this.setItem(STORAGE_KEYS.FAVORITES, newFavorites);
  }

  static removeFromFavorites(bookId: string): void {
    const favorites = this.getFavorites();
    const filtered = favorites.filter(f => f.bookId !== bookId);
    this.setItem(STORAGE_KEYS.FAVORITES, filtered);
  }

  static isFavorite(bookId: string): boolean {
    const favorites = this.getFavorites();
    return favorites.some(f => f.bookId === bookId);
  }

  static clearFavorites(): void {
    this.removeItem(STORAGE_KEYS.FAVORITES);
  }

  // Video Settings
  static getVolume(): number {
    return this.getItem<number>(STORAGE_KEYS.VOLUME, 0.7);
  }

  static setVolume(volume: number): void {
    this.setItem(STORAGE_KEYS.VOLUME, Math.max(0, Math.min(1, volume)));
  }

  static getQualityPreference(): string {
    return this.getItem<string>(STORAGE_KEYS.QUALITY_PREFERENCE, 'auto');
  }

  static setQualityPreference(quality: string): void {
    this.setItem(STORAGE_KEYS.QUALITY_PREFERENCE, quality);
  }

  // Last Visited Page
  static getLastVisited(): string | null {
    return this.getItem<string | null>(STORAGE_KEYS.LAST_VISITED, null);
  }

  static setLastVisited(path: string): void {
    this.setItem(STORAGE_KEYS.LAST_VISITED, path);
  }

  // Clear all app data
  static clearAll(): void {
    this.clearWatchHistory();
    this.clearFavorites();
    this.removeItem(STORAGE_KEYS.VOLUME);
    this.removeItem(STORAGE_KEYS.QUALITY_PREFERENCE);
    this.removeItem(STORAGE_KEYS.LAST_VISITED);
  }

  // Get storage size info
  static getStorageInfo(): {
    used: number;
    available: number;
    percentage: number;
  } {
    let used = 0;
    
    try {
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          used += localStorage[key].length + key.length;
        }
      }
    } catch (error) {
      console.error('Error calculating storage size:', error);
    }

    const available = 5 * 1024 * 1024; // Typical 5MB limit
    const percentage = (used / available) * 100;

    return {
      used,
      available,
      percentage,
    };
  }
}

export default StorageManager;
