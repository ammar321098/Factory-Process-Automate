'use client';
import React, { useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface OptimizedLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  prefetch?: boolean;
  priority?: boolean;
  onClick?: () => void;
}

export const OptimizedLink: React.FC<OptimizedLinkProps> = React.memo(({
  href,
  children,
  className = '',
  prefetch = true,
  priority = false,
  onClick
}) => {
  const router = useRouter();
  const prefetchTimeoutRef = useRef<NodeJS.Timeout>();
  const isPrefetchingRef = useRef(false);

  // Intelligent prefetching based on user behavior
  const handleMouseEnter = useCallback(() => {
    if (!prefetch || isPrefetchingRef.current) return;

    // Delay prefetch to avoid unnecessary requests
    prefetchTimeoutRef.current = setTimeout(() => {
      router.prefetch(href);
      isPrefetchingRef.current = true;
    }, 100);
  }, [href, prefetch, router]);

  const handleMouseLeave = useCallback(() => {
    if (prefetchTimeoutRef.current) {
      clearTimeout(prefetchTimeoutRef.current);
    }
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    // Preload the route immediately on click
    router.prefetch(href);
    
    if (onClick) {
      onClick();
    }
  }, [href, router, onClick]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (prefetchTimeoutRef.current) {
        clearTimeout(prefetchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Link
      href={href}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      prefetch={priority ? true : false}
    >
      {children}
    </Link>
  );
});

OptimizedLink.displayName = 'OptimizedLink';
