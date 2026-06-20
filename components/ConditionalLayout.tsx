"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import OptimizedLayout from "@/components/OptimizedLayout";
import AddFormPopup from "@/components/AddFormPopup";
import { FastNavigation } from "@/components/FastNavigation";
import { NavigationPerformance } from "@/components/NavigationPerformance";
import { Suspense } from "react";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();

  // Pages that should render in full screen without sidebar/topbar
  // Define locale-independent full-screen paths
  const fullScreenBasePaths = ["/login", "/sales/pos"];

  // Remove locale (like /en, /ur) from the current pathname
  const normalizedPath = pathname.replace(/^\/(en|ur)/, "");

  // Check if normalized path matches any of the base paths
  const isFullScreenPage = fullScreenBasePaths.includes(normalizedPath);

  if (isFullScreenPage) {
    return <div className="h-screen w-screen">{children}</div>;
  }

  // Regular layout with sidebar and topbar
  return (
    <div className="h-screen relative">
      {/* Simplified Background */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800"></div>

      {/* Main Content */}
      <div className="relative z-10 flex h-screen">
        <Sidebar />
        <div className="flex-1 min-w-0 lg:ml-0 h-screen overflow-y-auto">
          <Topbar />
          <main className="pt-6 pb-28 h-screen">
            <div className="w-full px-4">
              <Suspense
                fallback={
                  <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-64 rounded-lg"></div>
                }
              >
                <FastNavigation>
                  <OptimizedLayout showPerformanceMonitor={false}>
                    {children}
                  </OptimizedLayout>
                </FastNavigation>
              </Suspense>
            </div>
          </main>
        </div>
      </div>

      {/* Add Form Popup */}
      <AddFormPopup />
    </div>
  );
}
