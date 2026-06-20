import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home, ArrowLeft } from 'lucide-react';

interface ModuleNavigationProps {
  moduleName: string;
  modulePath: string;
  quickActions?: Array<{
    title: string;
    href: string;
    icon: React.ComponentType<any>;
    color: string;
  }>;
  recentActions?: Array<{
    title: string;
    href: string;
    description: string;
    time: string;
  }>;
}

export default function ModuleNavigation({ 
  moduleName, 
  modulePath, 
  quickActions = [], 
  recentActions = [] 
}: ModuleNavigationProps) {
  const pathname = usePathname();

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="animate-fade-in-up">
        <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
          <Link href="/dashboard" className="flex items-center hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200">
            <Home className="h-4 w-4 mr-1" />
            Dashboard
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900 dark:text-white font-medium">{moduleName}</span>
        </nav>
      </div>

      {/* Quick Actions */}
      {quickActions.length > 0 && (
        <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="card-glass p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => {
                const IconComponent = action.icon;
                return (
                  <Link 
                    key={action.href} 
                    href={action.href}
                    className={`flex items-center space-x-3 p-3 rounded-xl bg-${action.color}-50 dark:bg-${action.color}-900/20 hover:bg-${action.color}-100 dark:hover:bg-${action.color}-900/30 transition-all duration-200 hover:scale-105`}
                  >
                    <IconComponent className={`h-5 w-5 text-${action.color}-600`} />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{action.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Recent Actions */}
      {recentActions.length > 0 && (
        <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="card-glass p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {recentActions.map((action, index) => (
                <Link 
                  key={index}
                  href={action.href}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-colors duration-200"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{action.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{action.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-400">{action.time}</span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Module Navigation Help */}
      <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        <div className="card-glass p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Navigation Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
                <ChevronRight className="h-4 w-4 text-primary-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Quick Access</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Use quick action buttons for common tasks</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-lg bg-success-100 dark:bg-success-900/30">
                <Home className="h-4 w-4 text-success-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Easy Return</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Click Dashboard to return to main overview</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


