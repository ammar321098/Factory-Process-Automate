'use client';
import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage?: number;
  componentMounts: number;
  lastRenderTime: number;
}

export const usePerformanceMonitor = (componentName: string) => {
  const metricsRef = useRef<PerformanceMetrics>({
    renderTime: 0,
    componentMounts: 0,
    lastRenderTime: 0,
  });

  const startTime = useRef<number>(0);

  useEffect(() => {
    // Record component mount
    metricsRef.current.componentMounts++;
    
    // Start timing
    startTime.current = performance.now();

    return () => {
      // Record render time
      const endTime = performance.now();
      metricsRef.current.renderTime = endTime - startTime.current;
      metricsRef.current.lastRenderTime = endTime;

      // Log performance metrics in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`${componentName} Performance:`, {
          renderTime: `${metricsRef.current.renderTime.toFixed(2)}ms`,
          componentMounts: metricsRef.current.componentMounts,
          memoryUsage: (performance as any).memory ? 
            `${((performance as any).memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB` : 'N/A'
        });
      }

      // Send metrics to analytics in production
      if (process.env.NODE_ENV === 'production' && metricsRef.current.renderTime > 16) {
        // Log slow renders (>16ms = <60fps)
        console.warn(`Slow render detected in ${componentName}: ${metricsRef.current.renderTime.toFixed(2)}ms`);
      }
    };
  });

  return metricsRef.current;
};

// Hook for monitoring API performance
export const useApiPerformanceMonitor = () => {
  const apiMetrics = useRef<Map<string, { startTime: number; endTime?: number }>>(new Map());

  const startApiCall = (apiName: string) => {
    apiMetrics.current.set(apiName, { startTime: performance.now() });
  };

  const endApiCall = (apiName: string) => {
    const metric = apiMetrics.current.get(apiName);
    if (metric) {
      metric.endTime = performance.now();
      const duration = metric.endTime - metric.startTime;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`API Call ${apiName}: ${duration.toFixed(2)}ms`);
      }

      // Log slow API calls
      if (duration > 1000) {
        console.warn(`Slow API call detected: ${apiName} took ${duration.toFixed(2)}ms`);
      }
    }
  };

  return { startApiCall, endApiCall };
};

// Hook for monitoring bundle size and loading performance
export const useBundleAnalyzer = () => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Monitor bundle loading
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            console.log('Page Load Performance:', {
              domContentLoaded: `${(navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart).toFixed(2)}ms`,
              loadComplete: `${(navEntry.loadEventEnd - navEntry.loadEventStart).toFixed(2)}ms`,
              totalTime: `${(navEntry.loadEventEnd - navEntry.fetchStart).toFixed(2)}ms`
            });
          }
        });
      });

      observer.observe({ entryTypes: ['navigation'] });

      return () => observer.disconnect();
    }
  }, []);
};


