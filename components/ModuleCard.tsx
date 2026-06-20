'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Zap, Star, Lock } from 'lucide-react';
import { Module } from '@/lib/mocks';

interface ModuleCardProps {
  module: Module;
  gradient?: 'primary' | 'success' | 'warning' | 'danger' | 'accent';
}

export function ModuleCard({ module, gradient = 'primary' }: ModuleCardProps) {
  const getGradientClasses = () => {
    switch (gradient) {
      case 'success':
        return 'from-success-500 to-success-600';
      case 'warning':
        return 'from-warning-500 to-warning-600';
      case 'danger':
        return 'from-danger-500 to-danger-600';
      case 'accent':
        return 'from-accent-500 to-accent-600';
      default:
        return 'from-primary-500 to-primary-600';
    }
  };

  const getIconGradientClasses = () => {
    switch (gradient) {
      case 'success':
        return 'from-success-100 to-success-200 dark:from-success-900/30 dark:to-success-800/20';
      case 'warning':
        return 'from-warning-100 to-warning-200 dark:from-warning-900/30 dark:to-warning-800/20';
      case 'danger':
        return 'from-danger-100 to-danger-200 dark:from-danger-900/30 dark:to-danger-800/20';
      case 'accent':
        return 'from-accent-100 to-accent-200 dark:from-accent-900/30 dark:to-accent-800/20';
      default:
        return 'from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/20';
    }
  };

  return (
    <Link
      href={module.path}
      className="group relative block"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br opacity-5 dark:opacity-10 rounded-2xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5QzkyQUMiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMjAgMjBjMC01LjUtNC41LTEwLTEwLTEwcy0xMCA0LjUtMTAgMTAgNC41IDEwIDEwIDEwIDEwLTQuNSAxMC0xMHptMTAgMGMwLTUuNS00LjUtMTAtMTAtMTBzLTEwIDQuNS0xMCAxMCA0LjUgMTAgMTAgMTAgMTAtNC41IDEwLTEweiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
      </div>

      {/* Main Card */}
      <div className="relative card-glass p-6 hover:shadow-large transition-all duration-500 hover:scale-[1.02] group-hover:border-white/30 dark:group-hover:border-gray-600/30">
        {/* Shimmer Effect */}
        <div className="absolute inset-0 -top-1 -left-1 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer transition-opacity duration-500 rounded-2xl"></div>
        
        {/* Header */}
        <div className="relative flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              {/* Icon Background Glow */}
              <div className={`absolute inset-0 bg-gradient-to-br ${getGradientClasses()} rounded-2xl blur-md opacity-30 group-hover:opacity-50 transition-opacity duration-300`}></div>
              
              {/* Icon Container */}
              <div className={`relative w-16 h-16 bg-gradient-to-br ${getIconGradientClasses()} rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-all duration-300 border border-white/20 dark:border-gray-700/30`}>
            {module.icon}
                
                {/* Pulse Effect */}
                <div className="absolute inset-0 rounded-2xl border-2 border-white/20 animate-ping opacity-20"></div>
              </div>
          </div>
            
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200 mb-2">
              {module.name}
            </h3>
              
              <div className="flex items-center space-x-2">
            {module.badge && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-danger-500 to-danger-600 text-white animate-pulse shadow-lg">
                    <Star className="h-3 w-3 mr-1" />
                {module.badge}
              </span>
            )}
                
                {!module.active && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                    <Lock className="h-3 w-3 mr-1" />
                    Coming Soon
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className={`p-2 rounded-xl bg-gradient-to-br ${getGradientClasses()} opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0`}>
              <ArrowRight className="h-5 w-5 text-white" />
            </div>
          </div>
      </div>
      
        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6">
        {module.description}
      </p>
      
        {/* Footer */}
        <div className="relative flex items-center justify-between">
      <div className="flex items-center text-primary-600 dark:text-primary-400 text-sm font-medium group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors duration-200">
            <span className="flex items-center">
              {module.active ? (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Open module
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  Coming soon
                </>
              )}
            </span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Sparkles className="h-4 w-4 text-primary-400 opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse" />
            <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all duration-300" />
          </div>
        </div>

        {/* Progress Bar (for active modules) */}
        {module.active && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-400 to-primary-600 rounded-b-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
        )}
      </div>
    </Link>
  );
}