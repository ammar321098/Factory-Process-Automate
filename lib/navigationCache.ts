'use client';

interface CacheEntry {
  data: any;
  timestamp: number;
  component: React.ComponentType<any> | null;
}

class NavigationCache {
  private cache = new Map<string, CacheEntry>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private readonly MAX_CACHE_SIZE = 50; // Maximum number of cached pages

  set(path: string, data: any, component?: React.ComponentType<any>) {
    // Clean up old entries if cache is full
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      this.cleanup();
    }

    this.cache.set(path, {
      data,
      timestamp: Date.now(),
      component: component || null
    });
  }

  get(path: string): any | null {
    const entry = this.cache.get(path);
    if (!entry) return null;

    // Check if cache entry is still valid
    if (Date.now() - entry.timestamp > this.CACHE_DURATION) {
      this.cache.delete(path);
      return null;
    }

    return entry.data;
  }

  getComponent(path: string): React.ComponentType<any> | null {
    const entry = this.cache.get(path);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > this.CACHE_DURATION) {
      this.cache.delete(path);
      return null;
    }

    return entry.component;
  }

  has(path: string): boolean {
    const entry = this.cache.get(path);
    if (!entry) return false;

    if (Date.now() - entry.timestamp > this.CACHE_DURATION) {
      this.cache.delete(path);
      return false;
    }

    return true;
  }

  delete(path: string) {
    this.cache.delete(path);
  }

  clear() {
    this.cache.clear();
  }

  private cleanup() {
    const now = Date.now();
    const entries = Array.from(this.cache.entries());
    
    // Sort by timestamp (oldest first)
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    
    // Remove oldest entries until we're under the limit
    const toRemove = entries.slice(0, entries.length - this.MAX_CACHE_SIZE + 1);
    toRemove.forEach(([path]) => this.cache.delete(path));
  }

  // Get cache statistics
  getStats() {
    const now = Date.now();
    const validEntries = Array.from(this.cache.entries()).filter(
      ([, entry]) => now - entry.timestamp <= this.CACHE_DURATION
    );

    return {
      totalEntries: this.cache.size,
      validEntries: validEntries.length,
      expiredEntries: this.cache.size - validEntries.length,
      memoryUsage: this.estimateMemoryUsage()
    };
  }

  private estimateMemoryUsage(): number {
    let totalSize = 0;
    this.cache.forEach((entry) => {
      totalSize += JSON.stringify(entry).length * 2; // Rough estimate
    });
    return totalSize;
  }
}

// Create a singleton instance
export const navigationCache = new NavigationCache();

// Helper functions
export const getCachedPage = (path: string) => navigationCache.get(path);
export const setCachedPage = (path: string, data: any, component?: React.ComponentType<any>) => 
  navigationCache.set(path, data, component);
export const hasCachedPage = (path: string) => navigationCache.has(path);
export const clearCache = () => navigationCache.clear();
export const getCacheStats = () => navigationCache.getStats();

// Preload critical pages
export const preloadCriticalPages = () => {
  const criticalPages = [
    '/dashboard',
    '/raw-materials',
    '/inventory',
    '/production',
    '/sales'
  ];

  // This would typically preload page data
  // For now, we'll just mark them as ready for prefetching
  criticalPages.forEach(page => {
    if (!navigationCache.has(page)) {
      navigationCache.set(page, { preloaded: true });
    }
  });
};