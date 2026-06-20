'use client';
import React, { memo, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import PerformanceMonitor from './PerformanceMonitor';
import PageSkeleton from './LoadingSkeleton';

interface OptimizedLayoutProps {
  children: React.ReactNode;
  showPerformanceMonitor?: boolean;
}

const OptimizedLayout = memo(({ 
  children, 
  showPerformanceMonitor = false 
}: OptimizedLayoutProps) => {
  return (
    <>
      <Suspense fallback={<PageSkeleton />}>
        {children}
      </Suspense>
      
      {showPerformanceMonitor && (
        <PerformanceMonitor show={showPerformanceMonitor} />
      )}
    </>
  );
});

OptimizedLayout.displayName = 'OptimizedLayout';

export default OptimizedLayout;


