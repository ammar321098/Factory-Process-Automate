'use client';

import React from 'react';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';

interface KeyboardNavigationProviderProps {
  children: React.ReactNode;
}

export function KeyboardNavigationProvider({ children }: KeyboardNavigationProviderProps) {
  useKeyboardNavigation();
  
  return <>{children}</>;
}
