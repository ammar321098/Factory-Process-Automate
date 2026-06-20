'use client';

import React, { memo, useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, MoreHorizontal, Eye, EyeOff } from 'lucide-react';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  responsive?: boolean;
  priority?: number;
  width?: string;
}

interface ResponsiveTableProps {
  columns: Column[];
  data: any[];
  loading?: boolean;
  className?: string;
  maxHeight?: string;
  stickyHeader?: boolean;
  showMobileToggle?: boolean;
}

const ResponsiveTable = memo(({
  columns,
  data,
  loading = false,
  className = '',
  maxHeight = '500px',
  stickyHeader = true,
  showMobileToggle = true
}: ResponsiveTableProps) => {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showMobileView, setShowMobileView] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set(columns.map(c => c.key)));

  // Sort columns by priority for mobile view
  const sortedColumns = useMemo(() => {
    return [...columns].sort((a, b) => (b.priority || 0) - (a.priority || 0));
  }, [columns]);

  // Get columns to display based on view mode
  const displayColumns = useMemo(() => {
    if (showMobileView) {
      return sortedColumns.slice(0, 3);
    }
    return columns.filter(col => visibleColumns.has(col.key));
  }, [columns, sortedColumns, showMobileView, visibleColumns]);

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const sortedData = useMemo(() => {
    if (!sortColumn) return data;
    
    return [...data].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortColumn, sortDirection]);

  const toggleColumn = (columnKey: string) => {
    const newVisible = new Set(visibleColumns);
    if (newVisible.has(columnKey)) {
      newVisible.delete(columnKey);
    } else {
      newVisible.add(columnKey);
    }
    setVisibleColumns(newVisible);
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-3 sm:space-y-0">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {data.length} items
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Column Visibility Toggle */}
          <div className="column-controls group">
            <button className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">
              <Eye className="h-4 w-4" />
              <span>Columns</span>
            </button>
            
            <div className="column-dropdown">
              <div className="p-3 space-y-2">
                {columns.map((column) => (
                  <label key={column.key} className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={visibleColumns.has(column.key)}
                      onChange={() => toggleColumn(column.key)}
                      className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="text-gray-700 dark:text-gray-300">{column.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile View Toggle */}
          {showMobileToggle && (
            <button
              onClick={() => setShowMobileView(!showMobileView)}
              className="lg:hidden flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <MoreHorizontal className="h-4 w-4" />
              <span>{showMobileView ? 'Show All' : 'Compact'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div 
        className="overflow-x-auto overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg"
        style={{ maxHeight: maxHeight }}
      >
        <table className="w-full min-w-full">
          <thead className={`bg-gray-50 dark:bg-gray-800 ${stickyHeader ? 'sticky top-0 z-10' : ''}`}>
            <tr>
              {displayColumns.map((column) => (
                <th 
                  key={column.key} 
                  className={`text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap ${
                    column.sortable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700' : ''
                  }`}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {column.sortable && (
                      <div className="flex flex-col">
                        <ChevronUp 
                          className={`h-3 w-3 ${
                            sortColumn === column.key && sortDirection === 'asc' 
                              ? 'text-primary-600' 
                              : 'text-gray-400'
                          }`} 
                        />
                        <ChevronDown 
                          className={`h-3 w-3 -mt-1 ${
                            sortColumn === column.key && sortDirection === 'desc' 
                              ? 'text-primary-600' 
                              : 'text-gray-400'
                          }`} 
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {sortedData.map((item, index) => (
              <tr 
                key={item.id || index} 
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150"
              >
                {displayColumns.map((column) => (
                  <td 
                    key={column.key} 
                    className="py-4 px-4 text-gray-900 dark:text-white"
                  >
                    <div className="truncate max-w-xs">
                      {item[column.key]}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No data available
        </div>
      )}
    </div>
  );
});

ResponsiveTable.displayName = 'ResponsiveTable';

export default ResponsiveTable;
