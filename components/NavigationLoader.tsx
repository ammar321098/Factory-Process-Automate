'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export function NavigationLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Show loading state when pathname changes
    setIsLoading(true);
    
    // Hide loading state after a short delay
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [pathname]);

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-center py-2">
        <Loader2 className="h-4 w-4 animate-spin text-primary-600 mr-2" />
        <span className="text-sm text-gray-600 dark:text-gray-400">Loading page...</span>
      </div>
    </div>
  );
}

