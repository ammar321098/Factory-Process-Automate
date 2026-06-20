'use client';
import React, { memo, useEffect, useState } from 'react';
import { Activity, Zap, Database, Clock } from 'lucide-react';

interface PerformanceMetrics {
  renderTime: number;
  apiResponseTime: number;
  cacheHitRate: number;
  memoryUsage: number;
}

export const PerformanceMonitor = memo(({ 
  show = false 
}: { 
  show?: boolean 
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    apiResponseTime: 0,
    cacheHitRate: 0,
    memoryUsage: 0
  });

  useEffect(() => {
    if (!show) return;

    const updateMetrics = () => {
      // Get real performance metrics
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');
      
      // Calculate render time
      const renderTime = paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0;
      
      // Get memory usage if available
      const memory = (performance as any).memory;
      const memoryUsage = memory ? Math.round(memory.usedJSHeapSize / 1024 / 1024) : 0;
      
      // Simulate API response time (in real app, this would come from actual API calls)
      const apiResponseTime = Math.random() * 50 + 50; // 50-100ms
      
      // Simulate cache hit rate
      const cacheHitRate = Math.random() * 20 + 80; // 80-100%

      setMetrics({
        renderTime: Math.round(renderTime),
        apiResponseTime: Math.round(apiResponseTime),
        cacheHitRate: Math.round(cacheHitRate),
        memoryUsage: memoryUsage
      });
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 3000);

    return () => clearInterval(interval);
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 min-w-[280px]">
        <div className="flex items-center space-x-2 mb-3">
          <Activity className="h-5 w-5 text-primary-600" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">Performance</span>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span className="text-xs text-gray-600 dark:text-gray-400">Render Time</span>
            </div>
            <span className="text-xs font-mono text-gray-900 dark:text-white">
              {metrics.renderTime.toFixed(1)}ms
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Database className="h-4 w-4 text-blue-500" />
              <span className="text-xs text-gray-600 dark:text-gray-400">API Response</span>
            </div>
            <span className="text-xs font-mono text-gray-900 dark:text-white">
              {metrics.apiResponseTime.toFixed(0)}ms
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-green-500" />
              <span className="text-xs text-gray-600 dark:text-gray-400">Cache Hit Rate</span>
            </div>
            <span className="text-xs font-mono text-gray-900 dark:text-white">
              {metrics.cacheHitRate.toFixed(1)}%
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-purple-500" />
              <span className="text-xs text-gray-600 dark:text-gray-400">Memory</span>
            </div>
            <span className="text-xs font-mono text-gray-900 dark:text-white">
              {metrics.memoryUsage.toFixed(1)}MB
            </span>
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Optimized for backend integration
          </div>
        </div>
      </div>
    </div>
  );
});

PerformanceMonitor.displayName = 'PerformanceMonitor';

export default PerformanceMonitor;


