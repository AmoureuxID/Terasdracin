/**
 * Drama Service - Handles all drama-related API calls
 * This service layer provides a clean interface for components
 */

import { dramaboxAPI, Drama, DramaDetail, Episode, extractData, extractItem } from './api';
import { ENV } from './env';

export class DramaService {
  /**
   * Fetch trending dramas
   */
  static async getTrending(): Promise<Drama[]> {
    try {
      const response = await dramaboxAPI.trending();
      return extractData<Drama>(response);
    } catch (error) {
      console.error('Failed to fetch trending dramas:', error);
      throw error;
    }
  }

  /**
   * Fetch latest dramas
   */
  static async getLatest(): Promise<Drama[]> {
    try {
      const response = await dramaboxAPI.latest();
      return extractData<Drama>(response);
    } catch (error) {
      console.error('Failed to fetch latest dramas:', error);
      throw error;
    }
  }

  /**
   * Fetch personalized recommendations
   */
  static async getForYou(page: number = 1): Promise<Drama[]> {
    try {
      const response = await dramaboxAPI.forYou(page);
      return extractData<Drama>(response);
    } catch (error) {
      console.error('Failed to fetch for you dramas:', error);
      throw error;
    }
  }

  /**
   * Fetch Indonesian dubbed dramas
   */
  static async getDubIndo(classify: string = 'terpopuler', page: number = 1): Promise<Drama[]> {
    try {
      const response = await dramaboxAPI.dubIndo(classify, page);
      return extractData<Drama>(response);
    } catch (error) {
      console.error('Failed to fetch dubbed dramas:', error);
      throw error;
    }
  }

  /**
   * Fetch drama details by bookId
   */
  static async getDetail(bookId: string): Promise<DramaDetail | null> {
    try {
      const response = await dramaboxAPI.detail(bookId);
      return extractItem<DramaDetail>(response);
    } catch (error) {
      console.error(`Failed to fetch drama detail for ${bookId}:`, error);
      throw error;
    }
  }

  /**
   * Fetch all episodes for a drama
   */
  static async getAllEpisodes(bookId: string): Promise<Episode[]> {
    try {
      const response = await dramaboxAPI.allEpisodes(bookId);
      return extractData<Episode>(response);
    } catch (error) {
      console.error(`Failed to fetch episodes for ${bookId}:`, error);
      throw error;
    }
  }

  /**
   * Search dramas by query
   */
  static async search(query: string): Promise<Drama[]> {
    try {
      if (!query || query.trim().length === 0) {
        return [];
      }
      const response = await dramaboxAPI.search(query);
      return extractData<Drama>(response);
    } catch (error) {
      console.error(`Failed to search dramas with query "${query}":`, error);
      throw error;
    }
  }

  /**
   * Fetch home page data (all sections at once)
   */
  static async getHomeData(): Promise<{
    trending: Drama[];
    latest: Drama[];
    forYou: Drama[];
    dubIndo: Drama[];
  }> {
    try {
      const [trending, latest, forYou, dubIndo] = await Promise.all([
        this.getTrending(),
        this.getLatest(),
        this.getForYou(1),
        this.getDubIndo('terpopuler', 1),
      ]);

      return {
        trending,
        latest,
        forYou,
        dubIndo,
      };
    } catch (error) {
      console.error('Failed to fetch home data:', error);
      throw error;
    }
  }

  /**
   * Get drama cover image URL with fallback
   */
  static getCoverImage(drama: Drama): string {
    return (
      drama.coverVertical ||
      drama.cover ||
      drama.posterUrl ||
      drama.coverHorizontal ||
      '/placeholder.jpg'
    );
  }

  /**
   * Get drama title with fallback
   */
  static getTitle(drama: Drama): string {
    return drama.title || drama.name || 'Untitled';
  }

  /**
   * Get drama description with fallback
   */
  static getDescription(drama: Drama): string {
    return drama.introduction || drama.description || 'Tidak ada deskripsi tersedia.';
  }

  /**
   * Format episode number
   */
  static formatEpisodeNumber(episode: Episode): string {
    const epNum = episode.episodeNumber || episode.episodeIndex || 0;
    return `Episode ${epNum}`;
  }

  /**
   * Clear all cached data
   */
  static clearCache(): void {
    dramaboxAPI.clearCache();
    console.log('Cache cleared');
  }
}
