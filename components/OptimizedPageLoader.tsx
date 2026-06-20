'use client';

import React, { useState, useEffect, useCallback, memo } from 'react';
import { navigationCache } from '@/lib/navigationCache';
import LazyPage from './LazyPage';

interface OptimizedPageLoaderProps {
  pagePath: string;
  importFunc: () => Promise<{ default: React.ComponentType<any> }>;
  fallback?: React.ReactNode;
}

const OptimizedPageLoader = memo(({ 
  pagePath, 
  importFunc, 
  fallback 
}: OptimizedPageLoaderProps) => {
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadComponent = useCallback(async () => {
    // Check cache first
    const cachedComponent = navigationCache.get(pagePath);
    if (cachedComponent) {
      setComponent(() => cachedComponent);
      setIsLoading(false);
      return;
    }

    // Load component dynamically
    try {
      const moduleData = await importFunc();
      const component = moduleData.default;
      
      // Cache the component
      navigationCache.set(pagePath, component);
      
      setComponent(() => component);
    } catch (error) {
      console.error(`Failed to load page: ${pagePath}`, error);
    } finally {
      setIsLoading(false);
    }
  }, [pagePath, importFunc]);

  useEffect(() => {
    loadComponent();
  }, [loadComponent]);

  if (isLoading) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading page...</p>
        </div>
      </div>
    );
  }

  if (!Component) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">Failed to load page</p>
        </div>
      </div>
    );
  }

  return <Component />;
});

OptimizedPageLoader.displayName = 'OptimizedPageLoader';

export default OptimizedPageLoader;

