'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getCacheStats } from '@/lib/navigationCache';

export function NavigationPerformance() {
  const [stats, setStats] = useState(getCacheStats());
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Update stats when pathname changes
    setStats(getCacheStats());
  }, [pathname]);

  useEffect(() => {
    // Show performance indicator in development
    if (process.env.NODE_ENV === 'development') {
      setIsVisible(true);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white text-xs p-2 rounded-lg z-50 font-mono">
      <div className="space-y-1">
        <div>Route: {pathname}</div>
        <div>Cache: {stats.validEntries}/{stats.totalEntries}</div>
        <div>Memory: {(stats.memoryUsage / 1024).toFixed(1)}KB</div>
        <div className="text-green-400">⚡ Fast Nav</div>
      </div>
    </div>
  );
}
