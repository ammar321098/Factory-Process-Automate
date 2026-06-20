"use client";

import React, { Suspense, lazy, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { KpiCard } from "@/components/KpiCard";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import {
  Factory,
  BarChart3,
  Activity,
  Calendar,
  ToolCase,
  Package2Icon,
  Sparkles,
} from "lucide-react";
import { PageSkeleton } from "@/components/LoadingSkeleton";
import {
  fetchDashboardStats,
  type DashboardStats,
} from "@/lib/api/dashboardApi";

// Lazy load heavy components
const QuickAccessWidget = lazy(() => import("@/components/QuickAccessWidget"));
const DashboardProductionChart = lazy(() =>
  import("@/components/DashboardProductionChart").then((mod) => ({
    default: mod.DashboardProductionChart,
  }))
);

export default function DashboardPage() {
  const t = useTranslations("Dashboard");

  // State for dashboard data
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const dashboardStats = await fetchDashboardStats();
        setStats(dashboardStats);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        setError(
          "Failed to load dashboard data. Please check if the database is connected."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const dashboardStatsConfig = [
    {
      key: "totalMaterial",
      label: "Available Material",
      value: stats ? `${stats.totalMaterialAvailable} KG` : "0 KG",
      icon: ToolCase,
      color: "success",
    },
    {
      key: "totalMolding",
      label: "Molding Products",
      value: stats ? `${stats.totalRemainingMolding} pcs` : "0 pcs",
      icon: Factory,
      color: "primary",
    },

    {
      key: "totalPolishing",
      label: "Polishing Products",
      value: stats ? `${stats.totalRemainingPolishing} pcs` : "0 pcs",
      icon: Sparkles,
      color: "accent",
    },

    {
      key: "totalStock",
      label: "Total Stock",
      value: stats ? `${stats.totalRemainingPacking} pcs` : "0 pcs",
      icon: Package2Icon,
      color: "warning",
    },
  ];

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="relative">
          <div className="animate-fade-in-up">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 space-y-4 lg:space-y-0">
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl sm:text-4xl font-bold text-gradient mb-2">
                  {t("title")}
                </h1>
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
                  {t("welcome")}
                </p>
              </div>
              <div className="flex items-center space-x-4 w-full lg:w-auto">
                <div className="bg-gradient-to-r from-primary-500/10 to-accent-500/10 rounded-2xl p-3 sm:p-4 border border-white/20 dark:border-gray-700/50 flex-1 lg:flex-none">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600" />
                    <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                      {new Date().toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {dashboardStatsConfig.map((stat, index) => (
            <div
              key={stat.label}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <KpiCard
                title={t(`kpi.${stat.key}`)}
                value={stat.value}
                gradient={
                  stat.color as
                    | "primary"
                    | "success"
                    | "warning"
                    | "danger"
                    | "accent"
                }
                icon={<stat.icon className="h-6 w-6" />}
              />
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="card-glass p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {t("chartTitle")}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t("chartSubtitle")}
              </p>
            </div>
            <div className="p-2 bg-gradient-primary rounded-xl">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
          </div>

          {loading ? (
            <div className="h-64 bg-gradient-to-br from-primary-50/50 to-primary-100/30 dark:from-primary-900/20 dark:to-primary-800/10 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <Activity className="h-12 w-12 text-primary-400 mx-auto mb-3 animate-pulse" />
                <p className="text-primary-600 dark:text-primary-400 font-medium">
                  Loading dashboard data...
                </p>
              </div>
            </div>
          ) : (
            <Suspense
              fallback={
                <div className="h-64 rounded-2xl bg-primary-50/30 dark:bg-primary-900/20 animate-pulse" />
              }
            >
              <DashboardProductionChart
                labels={{
                  molding: t("chart.molding"),
                  polishing: t("chart.polishing"),
                  packing: t("chart.packing"),
                  yAxis: t("chart.yAxis"),
                }}
              />
            </Suspense>
          )}
        </div>

        {/* Quick Access Widget */}
        <Suspense fallback={<PageSkeleton />}>
          <QuickAccessWidget />
        </Suspense>
      </div>
    </ProtectedRoute>
  );
}
