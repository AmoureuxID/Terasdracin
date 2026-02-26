/**
 * Custom hooks for API data fetching
 */

import { useEffect, useState, useCallback } from 'react';
import { Drama, DramaDetail, Episode } from './api';
import { DramaService } from './dramaService';
import { analytics, PerformanceMonitor } from './analytics';

interface UseDataOptions {
  enabled?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

/**
 * Generic hook for data fetching
 */
function useData<T>(
  fetcher: () => Promise<T>,
  dependencies: any[] = [],
  options: UseDataOptions = {}
) {
  const { enabled = true, onSuccess, onError } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    try {
      setLoading(true);
      setError(null);

      const result = await fetcher();
      setData(result);
      onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      onError?.(error);
      analytics.error(error, 'useData hook');
    } finally {
      setLoading(false);
    }
  }, [enabled, ...dependencies]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

/**
 * Hook for fetching home page data
 */
export function useHomeData() {
  return useData(
    () => PerformanceMonitor.measureAPI('home-data', () => DramaService.getHomeData()),
    []
  );
}

/**
 * Hook for fetching trending dramas
 */
export function useTrendingDramas() {
  return useData(
    () => PerformanceMonitor.measureAPI('trending', () => DramaService.getTrending()),
    []
  );
}

/**
 * Hook for fetching drama detail
 */
export function useDramaDetail(bookId: string | undefined) {
  return useData(
    async () => {
      if (!bookId) throw new Error('Book ID is required');
      
      const [drama, episodes] = await Promise.all([
        PerformanceMonitor.measureAPI(`drama-detail-${bookId}`, () => 
          DramaService.getDetail(bookId)
        ),
        PerformanceMonitor.measureAPI(`episodes-${bookId}`, () => 
          DramaService.getAllEpisodes(bookId)
        ),
      ]);

      if (!drama) throw new Error('Drama not found');

      return {
        ...drama,
        episodes,
      } as DramaDetail;
    },
    [bookId],
    { enabled: !!bookId }
  );
}

/**
 * Hook for searching dramas
 */
export function useSearchDramas(query: string) {
  const [results, setResults] = useState<Drama[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!query || query.trim().length === 0) {
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;

    const searchDramas = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await PerformanceMonitor.measureAPI(`search-${query}`, () =>
          DramaService.search(query)
        );

        if (!cancelled) {
          setResults(data);
          analytics.search(query, data.length);
        }
      } catch (err) {
        if (!cancelled) {
          const error = err instanceof Error ? err : new Error('Search failed');
          setError(error);
          setResults([]);
          analytics.error(error, 'useSearchDramas');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    // Debounce search
    const timeoutId = setTimeout(searchDramas, 300);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [query]);

  return {
    results,
    loading,
    error,
  };
}

/**
 * Hook for episodes data
 */
export function useEpisodes(bookId: string | undefined) {
  return useData(
    async () => {
      if (!bookId) throw new Error('Book ID is required');
      return await PerformanceMonitor.measureAPI(`episodes-${bookId}`, () =>
        DramaService.getAllEpisodes(bookId)
      );
    },
    [bookId],
    { enabled: !!bookId }
  );
}

/**
 * Hook for online status
 */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
