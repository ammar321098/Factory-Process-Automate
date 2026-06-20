'use client';

import { useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';

export function useFastNavigation() {
  const router = useRouter();
  const navigationCount = useRef(0);
  const lastNavigationTime = useRef(0);

  const fastNavigate = useCallback((href: string) => {
    const now = Date.now();
    const timeSinceLastNav = now - lastNavigationTime.current;
    
    // Minimal debounce to prevent accidental double-clicks
    if (timeSinceLastNav < 25) {
      return;
    }
    
    lastNavigationTime.current = now;
    navigationCount.current += 1;
    
    // Navigate instantly - no loading states
    router.push(href);
  }, [router]);

  return {
    navigate: fastNavigate,
    navigationCount: navigationCount.current
  };
}
