'use client';
import React, { useMemo, useCallback, useState, useRef, useEffect } from 'react';

interface VirtualizedTableProps {
  data: any[];
  columns: {
    key: string;
    header: string;
    width?: number;
    render?: (item: any, index: number) => React.ReactNode;
  }[];
  height?: number;
  rowHeight?: number;
  loading?: boolean;
  onRowClick?: (item: any, index: number) => void;
}

export const VirtualizedTable: React.FC<VirtualizedTableProps> = React.memo(({
  data,
  columns,
  height = 400,
  rowHeight = 60,
  loading = false,
  onRowClick
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const visibleRows = useMemo(() => {
    const startIndex = Math.floor(scrollTop / rowHeight);
    const endIndex = Math.min(startIndex + Math.ceil(height / rowHeight) + 1, data.length);
    return { startIndex, endIndex };
  }, [scrollTop, rowHeight, height, data.length]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const visibleData = useMemo(() => {
    return data.slice(visibleRows.startIndex, visibleRows.endIndex);
  }, [data, visibleRows.startIndex, visibleRows.endIndex]);

  const totalHeight = data.length * rowHeight;
  const offsetY = visibleRows.startIndex * rowHeight;

  if (loading) {
    return (
      <div className="w-full" style={{ height }}>
        <div className="animate-pulse">
          {Array.from({ length: Math.ceil(height / rowHeight) }).map((_, i) => (
            <div key={i} className="flex border-b border-gray-200 dark:border-gray-700">
              {columns.map((col, colIndex) => (
                <div
                  key={colIndex}
                  className="py-4 px-4"
                  style={{ width: col.width || 'auto', flex: col.width ? 'none' : 1 }}
                >
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        {columns.map((column, index) => (
          <div
            key={index}
            className="py-3 px-4 font-medium text-gray-900 dark:text-white"
            style={{ width: column.width || 'auto', flex: column.width ? 'none' : 1 }}
          >
            {column.header}
          </div>
        ))}
      </div>

      {/* Virtualized Body */}
      <div
        ref={containerRef}
        className="overflow-auto"
        style={{ height }}
        onScroll={handleScroll}
      >
        <div style={{ height: totalHeight, position: 'relative' }}>
          <div
            style={{
              transform: `translateY(${offsetY}px)`,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
            }}
          >
            {visibleData.map((item, index) => {
              const actualIndex = visibleRows.startIndex + index;
              return (
                <div
                  key={actualIndex}
                  className="flex border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200 cursor-pointer"
                  style={{ height: rowHeight }}
                  onClick={() => onRowClick?.(item, actualIndex)}
                >
                  {columns.map((column, colIndex) => (
                    <div
                      key={colIndex}
                      className="py-4 px-4 text-gray-600 dark:text-gray-400 flex items-center"
                      style={{ width: column.width || 'auto', flex: column.width ? 'none' : 1 }}
                    >
                      {column.render ? column.render(item, actualIndex) : item[column.key]}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
});

VirtualizedTable.displayName = 'VirtualizedTable';


