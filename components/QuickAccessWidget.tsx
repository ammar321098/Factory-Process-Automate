"use client";

import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  Package,
  Factory,
  Sparkles,
  Users,
  DollarSign,
  FileText,
  BarChart3,
  Zap,
  Warehouse,
  ArrowRight,
} from "lucide-react";

export default function QuickAccessWidget() {
  const t = useTranslations("QuickAccess");

  const quickAccessItems = [
    {
      key: "rawMaterial",
      href: "/raw-materials",
      icon: Package,
      color: "primary",
      badge: "Popular",
      badgeColor: "success",
    },
    {
      key: "molding",
      href: "/molding",
      icon: Factory,
      color: "success",
      badge: "Quick",
      badgeColor: "primary",
    },
    {
      key: "polishing",
      href: "/polishing",
      icon: Sparkles,
      color: "warning",
      badge: "Live",
      badgeColor: "accent",
    },
    {
      key: "employees",
      href: "/employees",
      icon: Users,
      color: "accent",
      badge: "Daily",
      badgeColor: "warning",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Quick Access Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {t("title")}
        </h3>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <Zap className="h-4 w-4 mr-1" />
          {t("mostUsed")}
        </div>
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickAccessItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.key}
              href={item.href}
              className="group relative block"
            >
              <div
                className={`card-glass p-4 hover:shadow-large transition-all duration-300 hover:scale-[1.02]`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`p-2 rounded-xl bg-${item.color}-100 dark:bg-${item.color}-900/30`}
                  >
                    <Icon
                      className={`h-5 w-5 text-${item.color}-600 dark:text-${item.color}-400`}
                    />
                  </div>
                  {item.badge && (
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full bg-${item.badgeColor}-100 dark:bg-${item.badgeColor}-900/30 text-${item.badgeColor}-600 dark:text-${item.badgeColor}-400`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
                  {t(`items.${item.key}.title`)}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  {t(`items.${item.key}.desc`)}
                </p>
                <div className="flex items-center text-xs text-primary-600 dark:text-primary-400 font-medium">
                  <span>{t("access")}</span>
                  <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Module Shortcuts */}
      <div className="animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
        <div className="card-glass p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t("moduleShortcuts")}
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
            <Link
              href="/raw-materials"
              className="flex flex-col items-center p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors duration-200 group"
            >
              <Package className="h-6 w-6 text-primary-600 mb-2" />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">
                {t("shortcuts.rawMaterial")}
              </span>
            </Link>

            <Link
              href="/molding"
              className="flex flex-col items-center p-3 rounded-xl bg-success-50 dark:bg-success-900/20 hover:bg-success-100 dark:hover:bg-success-900/30 transition-colors duration-200 group"
            >
              <Factory className="h-6 w-6 text-success-600 mb-2" />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">
                {t("shortcuts.molding")}
              </span>
            </Link>

            <Link
              href="/polishing"
              className="flex flex-col items-center p-3 rounded-xl bg-warning-50 dark:bg-warning-900/20 hover:bg-warning-100 dark:hover:bg-warning-900/30 transition-colors duration-200 group"
            >
              <Sparkles className="h-6 w-6 text-warning-600 mb-2" />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">
                {t("shortcuts.polishing")}
              </span>
            </Link>

            <Link
              href="/packing"
              className="flex flex-col items-center p-3 rounded-xl bg-accent-50 dark:bg-accent-900/20 hover:bg-accent-100 dark:hover:bg-accent-900/30 transition-colors duration-200 group"
            >
              <Package className="h-6 w-6 text-accent-600 mb-2" />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">
                {t("shortcuts.packing")}
              </span>
            </Link>

            {/* <Link
              href="/stock"
              className="flex flex-col items-center p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors duration-200 group"
            >
              <Warehouse className="h-6 w-6 text-primary-600 mb-2" />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">
                {t("shortcuts.stock")}
              </span>
            </Link> */}

            {/* <Link
              href="/reports"
              className="flex flex-col items-center p-3 rounded-xl bg-success-50 dark:bg-success-900/20 hover:bg-success-100 dark:hover:bg-success-900/30 transition-colors duration-200 group"
            >
              <BarChart3 className="h-6 w-6 text-success-600 mb-2" />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">
                {t("shortcuts.reports")}
              </span>
            </Link> */}
          </div>
        </div>
      </div>
    </div>
  );
}
