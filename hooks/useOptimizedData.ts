'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';

interface UseOptimizedDataOptions {
  pageSize?: number;
  cacheKey?: string;
  staleTime?: number;
  enabled?: boolean;
}

interface UseOptimizedDataReturn<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
  totalCount: number;
  currentPage: number;
}

// Simple in-memory cache
const cache = new Map<string, { data: any; timestamp: number; totalCount: number }>();

export function useOptimizedData<T>(
  fetchFunction: (page: number, pageSize: number) => Promise<{ data: T[]; totalCount: number }>,
  options: UseOptimizedDataOptions = {}
): UseOptimizedDataReturn<T> {
  const {
    pageSize = 20,
    cacheKey = 'default',
    staleTime = 2 * 60 * 1000, // 2 minutes
    enabled = true
  } = options;

  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const hasMore = useMemo(() => {
    return data.length < totalCount;
  }, [data.length, totalCount]);

  const cacheKeyWithPage = `${cacheKey}-${currentPage}-${pageSize}`;

  const loadData = useCallback(async (page: number, append = false) => {
    if (!enabled) return;

    // Check cache first
    const cached = cache.get(cacheKeyWithPage);
    if (cached && Date.now() - cached.timestamp < staleTime) {
      if (append) {
        setData(prev => [...prev, ...cached.data]);
      } else {
        setData(cached.data);
      }
      setTotalCount(cached.totalCount);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetchFunction(page, pageSize);
      
      // Cache the result
      cache.set(cacheKeyWithPage, {
        data: result.data,
        timestamp: Date.now(),
        totalCount: result.totalCount
      });

      if (append) {
        setData(prev => [...prev, ...result.data]);
      } else {
        setData(result.data);
      }
      setTotalCount(result.totalCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  }, [fetchFunction, pageSize, cacheKey, staleTime, enabled]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      loadData(nextPage, true);
    }
  }, [loading, hasMore, currentPage, loadData]);

  const refresh = useCallback(() => {
    // Clear cache for this key
    const keysToDelete = Array.from(cache.keys()).filter(key => key.startsWith(cacheKey));
    keysToDelete.forEach(key => cache.delete(key));
    
    setCurrentPage(1);
    setData([]);
    loadData(1, false);
  }, [cacheKey, loadData]);

  // Initial load
  useEffect(() => {
    if (isInitialLoad && enabled) {
      loadData(1, false);
    }
  }, [isInitialLoad, enabled, loadData]);

  return {
    data,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    totalCount,
    currentPage
  };
}

// Hook for simple data fetching without pagination
export function useSimpleData<T>(
  fetchFunction: () => Promise<T[]>,
  options: { cacheKey?: string; staleTime?: number; enabled?: boolean } = {}
) {
  const { cacheKey = 'simple', staleTime = 5 * 60 * 1000, enabled = true } = options;
  
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!enabled) return;

    // Check cache
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < staleTime) {
      setData(cached.data);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetchFunction();
      
      // Cache the result
      cache.set(cacheKey, {
        data: result,
        timestamp: Date.now(),
        totalCount: result.length
      });

      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, cacheKey, staleTime, enabled]);

  useEffect(() => {
    if (enabled) {
      loadData();
    }
  }, [enabled, loadData]);

  return { data, loading, error, refresh: loadData };
}

// Utility function to clear cache
export function clearCache(pattern?: string) {
  if (pattern) {
    const keysToDelete = Array.from(cache.keys()).filter(key => key.includes(pattern));
    keysToDelete.forEach(key => cache.delete(key));
  } else {
    cache.clear();
  }
}