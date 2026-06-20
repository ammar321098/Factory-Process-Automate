'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Sparkles, Zap } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: React.ReactNode;
  gradient?: 'primary' | 'success' | 'warning' | 'danger' | 'accent';
}

export function KpiCard({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon, 
  gradient = 'primary' 
}: KpiCardProps) {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-success-600 dark:text-success-400';
      case 'negative':
        return 'text-danger-600 dark:text-danger-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getChangeIcon = () => {
    if (!change) return null;
    
    switch (changeType) {
      case 'positive':
        return <TrendingUp className="h-4 w-4" />;
      case 'negative':
        return <TrendingDown className="h-4 w-4" />;
      default:
        return null;
    }
  };

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

  const getBackgroundGradient = () => {
    switch (gradient) {
      case 'success':
        return 'from-success-50/50 to-success-100/30 dark:from-success-900/20 dark:to-success-800/10';
      case 'warning':
        return 'from-warning-50/50 to-warning-100/30 dark:from-warning-900/20 dark:to-warning-800/10';
      case 'danger':
        return 'from-danger-50/50 to-danger-100/30 dark:from-danger-900/20 dark:to-danger-800/10';
      case 'accent':
        return 'from-accent-50/50 to-accent-100/30 dark:from-accent-900/20 dark:to-accent-800/10';
      default:
        return 'from-primary-50/50 to-primary-100/30 dark:from-primary-900/20 dark:to-primary-800/10';
    }
  };

  return (
    <div className="rounded-2xl group relative overflow-hidden h-full">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br opacity-5 dark:opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5QzkyQUMiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
      </div>

      {/* Main Card */}
      <div className={`relative rounded-2xl card-glass p-3 sm:p-4 hover:shadow-large transition-all duration-300 hover:scale-[1.02] group-hover:border-white/30 dark:group-hover:border-gray-600/30 h-full flex flex-col`}>
        {/* Shimmer Effect */}
        <div className="absolute inset-0 -top-1 -left-1 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer transition-opacity duration-500"></div>
        
        {/* Content */}
        <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between h-full">
          <div className="flex-1 min-w-0 w-full lg:w-auto">
            <div className="flex items-center space-x-2 mb-1 sm:mb-2">
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
                {title}
              </p>
              {changeType === 'positive' && (
                <div className="flex items-center space-x-1 flex-shrink-0">
                  <Sparkles className="h-2 w-2 sm:h-3 sm:w-3 text-success-500 animate-pulse" />
                  <Zap className="h-2 w-2 sm:h-3 sm:w-3 text-success-500 animate-pulse" style={{ animationDelay: '0.2s' }} />
                </div>
              )}
            </div>
            
            <p className="text-xl sm:text-2xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 tracking-tight truncate">
              {value}
            </p>
            
            {change && (
              <div className={`flex items-center text-xs sm:text-sm font-medium ${getChangeColor()}`}>
                <div className={`p-1 rounded-lg mr-2 flex-shrink-0 ${
                  changeType === 'positive' ? 'bg-success-100 dark:bg-success-900/30' :
                  changeType === 'negative' ? 'bg-danger-100 dark:bg-danger-900/30' :
                  'bg-gray-100 dark:bg-gray-700/50'
                }`}>
                  {getChangeIcon()}
                </div>
                <span className="truncate">{change}</span>
              </div>
            )}
            
          </div>
          
          {icon && (
            <div className="flex-shrink-0 mt-3 sm:mt-4 lg:mt-0 lg:ml-6 self-center lg:self-auto">
              <div className="relative">
                {/* Icon Background Glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${getGradientClasses()} rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300`}></div>
                
                {/* Icon Container */}
                <div className={`relative w-10 h-10 sm:w-12 sm:h-12  bg-gradient-to-br ${getGradientClasses()} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-all duration-300 border border-white/20`}>
                  <div className="scale-75 sm:scale-90 lg:scale-100">
                    {icon}
                  </div>
                  
                  {/* Pulse Effect */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-white/30 animate-ping opacity-20"></div>
                </div>
              </div>
            </div>
          )}
        </div>

      {/* Progress Bar (for positive changes) */}
        {changeType === 'positive' && change && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-success-400 to-success-600 rounded-b-2xl opacity-50"></div>
        )}  
      </div>
      
    </div>
  );
}