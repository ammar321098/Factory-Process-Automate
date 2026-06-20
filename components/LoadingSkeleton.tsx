'use client';
import React, { memo } from 'react';

const SkeletonBox = memo(({ className = '' }: { className?: string }) => (
  <div className={`bg-gray-200 dark:bg-gray-700 rounded animate-pulse ${className}`} />
));

SkeletonBox.displayName = 'SkeletonBox';

export const PageSkeleton = memo(() => (
  <div className="space-y-6">
    {/* Header Skeleton */}
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-6">
        <div>
          <SkeletonBox className="h-10 w-80 mb-2" />
          <SkeletonBox className="h-6 w-96" />
        </div>
        <div className="hidden lg:block">
          <SkeletonBox className="h-16 w-48" />
        </div>
      </div>
    </div>

    {/* Stats Skeleton */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
          <div className="card-glass p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <SkeletonBox className="h-4 w-24 mb-1" />
                <SkeletonBox className="h-8 w-16 mb-2" />
                <SkeletonBox className="h-4 w-20" />
              </div>
              <SkeletonBox className="h-12 w-12 rounded-2xl" />
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Content Skeleton */}
    <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
      <div className="card-glass">
        {/* Tab Navigation Skeleton */}
        <div className="border-b border-white/10 dark:border-gray-700/30">
          <div className="flex space-x-8 px-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="py-4">
                <div className="flex items-center space-x-2">
                  <SkeletonBox className="h-5 w-5" />
                  <SkeletonBox className="h-4 w-20" />
                  <SkeletonBox className="h-5 w-6 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Toolbar Skeleton */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <SkeletonBox className="h-10 w-80" />
              <SkeletonBox className="h-10 w-20" />
            </div>
            <div className="flex items-center space-x-3">
              <SkeletonBox className="h-10 w-20" />
              <SkeletonBox className="h-10 w-32" />
            </div>
          </div>

          {/* Table Skeleton */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <th key={index} className="text-left py-3 px-4">
                      <SkeletonBox className="h-4 w-20" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 10 }).map((_, index) => (
                  <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                    {Array.from({ length: 8 }).map((_, cellIndex) => (
                      <td key={cellIndex} className="py-4 px-4">
                        <SkeletonBox className="h-4 w-24" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Skeleton */}
          <div className="flex items-center justify-between mt-6">
            <SkeletonBox className="h-4 w-32" />
            <div className="flex items-center space-x-2">
              <SkeletonBox className="h-8 w-8" />
              <SkeletonBox className="h-8 w-8" />
              <SkeletonBox className="h-8 w-8" />
              <SkeletonBox className="h-8 w-8" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
));

PageSkeleton.displayName = 'PageSkeleton';

export const CardSkeleton = memo(({ className = '' }: { className?: string }) => (
  <div className={`card-glass p-6 ${className}`}>
    <div className="flex items-center justify-between mb-4">
      <SkeletonBox className="h-6 w-32" />
      <SkeletonBox className="h-8 w-8 rounded" />
    </div>
    <SkeletonBox className="h-8 w-24 mb-2" />
    <SkeletonBox className="h-4 w-16" />
  </div>
));

CardSkeleton.displayName = 'CardSkeleton';

export const TableSkeleton = memo(({ rows = 5, columns = 6 }: { rows?: number; columns?: number }) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="border-b border-gray-200 dark:border-gray-700">
          {Array.from({ length: columns }).map((_, index) => (
            <th key={index} className="text-left py-3 px-4">
              <SkeletonBox className="h-4 w-20" />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, index) => (
          <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
            {Array.from({ length: columns }).map((_, cellIndex) => (
              <td key={cellIndex} className="py-4 px-4">
                <SkeletonBox className="h-4 w-24" />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
));

TableSkeleton.displayName = 'TableSkeleton';

export default PageSkeleton;