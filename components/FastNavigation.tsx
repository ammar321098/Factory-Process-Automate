'use client';

import React, { useEffect } from 'react';
import { navigationCache, preloadCriticalPages } from '@/lib/navigationCache';

interface FastNavigationProps {
  children: React.ReactNode;
}

export function FastNavigation({ children }: FastNavigationProps) {
  useEffect(() => {
    // Preload critical pages on mount
    preloadCriticalPages();
  }, []);

  // Instant rendering - no loading states
  return <>{children}</>;
}

// Hook for fast navigation
export function useFastNavigation() {
  const navigateWithCache = (href: string, data?: any) => {
    // Cache the data if provided
    if (data) {
      navigationCache.set(href, data);
    }
    
    // Navigation is handled by the Link component
    // No blocking or state management needed
  };

  return {
    navigateWithCache
  };
}
