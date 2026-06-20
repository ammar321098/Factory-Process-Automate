'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface NavigationShortcut {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  route: string;
  description: string;
}

export function useKeyboardNavigation() {
  const router = useRouter();
  const { user, canAccessModule } = useAuth();

  const shortcuts: NavigationShortcut[] = [
    { key: '1', ctrlKey: true, route: '/dashboard', description: 'Dashboard' },
    { key: '2', ctrlKey: true, route: '/raw-materials', description: 'Raw Materials' },
    { key: '3', ctrlKey: true, route: '/inventory', description: 'Inventory' },
    { key: '4', ctrlKey: true, route: '/production', description: 'Production' },
    { key: '5', ctrlKey: true, route: '/sales', description: 'Sales' },
    { key: '6', ctrlKey: true, route: '/hr', description: 'HR Management' },
    { key: '7', ctrlKey: true, route: '/reports', description: 'Reports' },
    { key: '8', ctrlKey: true, route: '/admin', description: 'Admin Panel' },
    { key: 'a', ctrlKey: true, route: '/accounts', description: 'Accounts' },
    { key: 'c', ctrlKey: true, route: '/customers', description: 'Customers' },
    { key: 'e', ctrlKey: true, route: '/employees', description: 'Employees' },
    { key: 'x', ctrlKey: true, route: '/expenses', description: 'Expenses' },
    { key: 'm', ctrlKey: true, route: '/molding', description: 'Molding' },
    { key: 'p', ctrlKey: true, route: '/polishing', description: 'Polishing' },
    { key: 'k', ctrlKey: true, route: '/packing', description: 'Packing' },
    { key: 't', ctrlKey: true, route: '/tools', description: 'Tools' },
    { key: 'r', ctrlKey: true, route: '/transactions', description: 'Transactions' },
  ];

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Check if user is typing in an input field
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return;
    }

    const pressedShortcut = shortcuts.find(shortcut => 
      shortcut.key === event.key.toLowerCase() &&
      !!shortcut.ctrlKey === event.ctrlKey &&
      !!shortcut.altKey === event.altKey &&
      !!shortcut.shiftKey === event.shiftKey
    );

    if (pressedShortcut) {
      // Check if user has access to this module
      if (canAccessModule && !canAccessModule(pressedShortcut.route)) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      
      router.push(pressedShortcut.route);
    }
  }, [router, canAccessModule, shortcuts]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return {
    shortcuts: shortcuts.map(s => ({
      ...s,
      available: canAccessModule ? canAccessModule(s.route) : true
    }))
  };
}
