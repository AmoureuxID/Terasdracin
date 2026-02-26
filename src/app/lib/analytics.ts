/**
 * Analytics and monitoring utilities for production
 */

import { ENV } from './env';

interface EventData {
  [key: string]: any;
}

class Analytics {
  private static instance: Analytics;
  private enabled: boolean;

  private constructor() {
    this.enabled = ENV.ENABLE_ANALYTICS && ENV.isProduction;
  }

  static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics();
    }
    return Analytics.instance;
  }

  /**
   * Track page view
   */
  pageView(path: string, title?: string): void {
    if (!this.enabled) return;

    console.log('[Analytics] Page View:', { path, title });

    // Here you can integrate with services like:
    // - Google Analytics
    // - Mixpanel
    // - PostHog
    // - Custom analytics endpoint
    
    // Example:
    // gtag('event', 'page_view', { page_path: path, page_title: title });
  }

  /**
   * Track custom event
   */
  event(name: string, data?: EventData): void {
    if (!this.enabled) return;

    console.log('[Analytics] Event:', name, data);

    // Example:
    // gtag('event', name, data);
  }

  /**
   * Track user interaction
   */
  interaction(action: string, category: string, label?: string): void {
    if (!this.enabled) return;

    this.event('user_interaction', {
      action,
      category,
      label,
    });
  }

  /**
   * Track video play
   */
  videoPlay(bookId: string, episodeIndex: number, title: string): void {
    this.event('video_play', {
      book_id: bookId,
      episode_index: episodeIndex,
      title,
    });
  }

  /**
   * Track search
   */
  search(query: string, resultsCount: number): void {
    this.event('search', {
      search_query: query,
      results_count: resultsCount,
    });
  }

  /**
   * Track error
   */
  error(error: Error, context?: string): void {
    if (!ENV.ENABLE_ERROR_REPORTING) return;

    console.error('[Analytics] Error:', {
      message: error.message,
      stack: error.stack,
      context,
    });

    // You can integrate with error tracking services like:
    // - Sentry
    // - Rollbar
    // - Bugsnag
    
    // Example:
    // Sentry.captureException(error, { tags: { context } });
  }
}

export const analytics = Analytics.getInstance();

/**
 * Performance monitoring utilities
 */
export class PerformanceMonitor {
  private static marks: Map<string, number> = new Map();

  /**
   * Start performance measurement
   */
  static start(name: string): void {
    this.marks.set(name, performance.now());
  }

  /**
   * End performance measurement and log result
   */
  static end(name: string): number | null {
    const startTime = this.marks.get(name);
    if (!startTime) {
      console.warn(`[Performance] No start mark found for: ${name}`);
      return null;
    }

    const duration = performance.now() - startTime;
    this.marks.delete(name);

    if (ENV.isDevelopment) {
      console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
    }

    // You can send this to your analytics service
    // analytics.event('performance', { metric: name, duration });

    return duration;
  }

  /**
   * Measure API call performance
   */
  static async measureAPI<T>(
    name: string,
    apiCall: () => Promise<T>
  ): Promise<T> {
    this.start(name);
    try {
      const result = await apiCall();
      return result;
    } finally {
      this.end(name);
    }
  }
}

/**
 * Network quality monitor
 */
export class NetworkMonitor {
  private static instance: NetworkMonitor;
  private connectionType: string = 'unknown';
  private effectiveType: string = 'unknown';

  private constructor() {
    this.initialize();
  }

  static getInstance(): NetworkMonitor {
    if (!NetworkMonitor.instance) {
      NetworkMonitor.instance = new NetworkMonitor();
    }
    return NetworkMonitor.instance;
  }

  private initialize(): void {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      this.connectionType = connection?.type || 'unknown';
      this.effectiveType = connection?.effectiveType || 'unknown';

      connection?.addEventListener('change', () => {
        this.connectionType = connection.type;
        this.effectiveType = connection.effectiveType;
        console.log('[Network] Connection changed:', {
          type: this.connectionType,
          effectiveType: this.effectiveType,
        });
      });
    }
  }

  getConnectionInfo() {
    return {
      type: this.connectionType,
      effectiveType: this.effectiveType,
    };
  }

  isSlowConnection(): boolean {
    return this.effectiveType === 'slow-2g' || this.effectiveType === '2g';
  }
}

export const networkMonitor = NetworkMonitor.getInstance();
