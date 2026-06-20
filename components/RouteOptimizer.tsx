'use client';

import React, { Suspense, lazy, memo } from 'react';
import { PageSkeleton } from './LoadingSkeleton';

// Lazy load heavy components that are not immediately visible
const HeavyComponents = {
  // Lazy load widgets
  QuickAccessWidget: lazy(() => import('./QuickAccessWidget')),
  PerformanceMonitor: lazy(() => import('./PerformanceMonitor')),
};

interface RouteOptimizerProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RouteOptimizer = memo(({ 
  children, 
  fallback = <PageSkeleton /> 
}: RouteOptimizerProps) => {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
});

RouteOptimizer.displayName = 'RouteOptimizer';

// Higher-order component for lazy loading routes
export function withRouteOptimization(
  Component: React.ComponentType<any>,
  fallback?: React.ReactNode
) {
  const LazyComponent = lazy(() => Promise.resolve({ default: Component }));
  
  const OptimizedComponent = memo((props: any) => (
    <Suspense fallback={fallback || <PageSkeleton />}>
      <LazyComponent {...props} />
    </Suspense>
  ));
  
  OptimizedComponent.displayName = `withRouteOptimization(${Component.displayName || Component.name})`;
  
  return OptimizedComponent;
}

// Hook for preloading routes
export function usePreloadRoute(route: string) {
  const preload = React.useCallback(() => {
    // Preload the route by importing it
    import(`../app${route}/page`).catch(() => {
      // Route doesn't exist or failed to load
    });
  }, [route]);

  return preload;
}

export default RouteOptimizer;
