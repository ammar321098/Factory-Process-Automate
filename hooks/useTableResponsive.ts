'use client';

import { useState, useEffect, useMemo } from 'react';

interface UseTableResponsiveOptions {
  columns: Array<{
    key: string;
    responsive?: boolean;
    priority?: number;
  }>;
  defaultMobileView?: boolean;
  breakpoints?: {
    sm: number;
    md: number;
    lg: number;
  };
}

export function useTableResponsive({
  columns,
  defaultMobileView = false,
  breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
  }
}: UseTableResponsiveOptions) {
  const [screenSize, setScreenSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('xl');
  const [showMobileView, setShowMobileView] = useState(defaultMobileView);
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(columns.map(c => c.key))
  );

  // Detect screen size
  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      if (width < breakpoints.sm) {
        setScreenSize('sm');
      } else if (width < breakpoints.md) {
        setScreenSize('md');
      } else if (width < breakpoints.lg) {
        setScreenSize('lg');
      } else {
        setScreenSize('xl');
      }
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    return () => window.removeEventListener('resize', updateScreenSize);
  }, [breakpoints]);

  // Get visible columns based on screen size and mobile view
  const displayColumns = useMemo(() => {
    if (showMobileView) {
      // Show only top 3 priority columns on mobile
      return columns
        .sort((a, b) => (b.priority || 0) - (a.priority || 0))
        .slice(0, 3);
    }

    // Filter columns based on visibility settings
    return columns.filter(col => visibleColumns.has(col.key));
  }, [columns, showMobileView, visibleColumns]);

  // Get columns that should be hidden on current screen size
  const hiddenColumns = useMemo(() => {
    return columns.filter(col => {
      if (!col.responsive) return false;
      
      switch (screenSize) {
        case 'sm':
          return col.priority === 0;
        case 'md':
          return col.priority === 0 || col.priority === 1;
        case 'lg':
          return col.priority === 0 || col.priority === 1 || col.priority === 2;
        default:
          return false;
      }
    });
  }, [columns, screenSize]);

  // Toggle column visibility
  const toggleColumn = (columnKey: string) => {
    setVisibleColumns(prev => {
      const newVisible = new Set(prev);
      if (newVisible.has(columnKey)) {
        newVisible.delete(columnKey);
      } else {
        newVisible.add(columnKey);
      }
      return newVisible;
    });
  };

  // Toggle mobile view
  const toggleMobileView = () => {
    setShowMobileView(prev => !prev);
  };

  // Reset to default visibility
  const resetColumns = () => {
    setVisibleColumns(new Set(columns.map(c => c.key)));
  };

  // Get responsive classes for columns
  const getColumnClasses = (column: { responsive?: boolean; priority?: number }) => {
    const classes = [];
    
    if (column.responsive) {
      switch (column.priority) {
        case 0:
          classes.push('hidden');
          break;
        case 1:
          classes.push('hidden', 'sm:table-cell');
          break;
        case 2:
          classes.push('hidden', 'md:table-cell');
          break;
        case 3:
          classes.push('hidden', 'lg:table-cell');
          break;
        default:
          classes.push('hidden', 'sm:table-cell');
      }
    }
    
    return classes.join(' ');
  };

  return {
    screenSize,
    showMobileView,
    visibleColumns,
    displayColumns,
    hiddenColumns,
    toggleColumn,
    toggleMobileView,
    resetColumns,
    getColumnClasses,
    isMobile: screenSize === 'sm',
    isTablet: screenSize === 'md',
    isDesktop: screenSize === 'lg' || screenSize === 'xl',
  };
}

