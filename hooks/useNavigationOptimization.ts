'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

export function useNavigationOptimization() {
  const router = useRouter();
  const navigationStartTime = useRef<number>(0);
  const [isNavigating, setIsNavigating] = useState(false);
  const prefetchedRoutes = useRef<Set<string>>(new Set());

  // Prefetch common routes on mount
  useEffect(() => {
    const commonRoutes = [
      '/dashboard',
      '/raw-materials',
      '/inventory',
      '/production',
      '/sales',
      '/hr',
      '/reports',
      '/admin',
      '/accounts',
      '/customers',
      '/employees',
      '/expenses',
      '/molding',
      '/polishing',
      '/packing',
      '/master',
      '/tools',
      '/transactions'
    ];

    // Prefetch all common routes after a short delay
    const prefetchTimer = setTimeout(() => {
      commonRoutes.forEach(route => {
        if (!prefetchedRoutes.current.has(route)) {
          router.prefetch(route);
          prefetchedRoutes.current.add(route);
        }
      });
    }, 1000);

    return () => clearTimeout(prefetchTimer);
  }, [router]);

  const optimizedNavigate = useCallback((href: string) => {
    // Always allow navigation - don't block
    setIsNavigating(true);
    navigationStartTime.current = performance.now();
    
    // Prefetch the route if not already prefetched
    if (!prefetchedRoutes.current.has(href)) {
      router.prefetch(href);
      prefetchedRoutes.current.add(href);
    }
    
    // Navigate immediately without blocking
    router.push(href);
    
    // Reset navigation state quickly
    setTimeout(() => {
      setIsNavigating(false);
    }, 100);
  }, [router]);

  const handleNavigationComplete = useCallback(() => {
    setIsNavigating(false);
    const navigationTime = performance.now() - navigationStartTime.current;
  }, []);

  // Auto-reset navigation state to prevent blocking
  useEffect(() => {
    if (isNavigating) {
      const timeoutId = setTimeout(() => {
        setIsNavigating(false);
      }, 200); // Reset after 200ms max

      return () => clearTimeout(timeoutId);
    }
  }, [isNavigating]);

  return {
    navigate: optimizedNavigate,
    isNavigating,
    prefetchedRoutes: prefetchedRoutes.current
  };
}

