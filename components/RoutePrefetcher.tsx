'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Common routes that should be prefetched
const COMMON_ROUTES = [
  '/dashboard',
  '/raw-materials',
  '/inventory',
  '/sales',
  '/hr',
  '/reports',
  '/admin'
];

export function RoutePrefetcher() {
  const router = useRouter();

  useEffect(() => {
    // Prefetch common routes after initial load
    const prefetchRoutes = () => {
      COMMON_ROUTES.forEach(route => {
        router.prefetch(route);
      });
    };

    // Delay prefetching to not interfere with initial page load
    const timeoutId = setTimeout(prefetchRoutes, 2000);

    return () => clearTimeout(timeoutId);
  }, [router]);

  return null; // This component doesn't render anything
}

