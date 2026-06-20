"use client";

import React, { useState, memo, useCallback } from "react";
import {
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  Moon,
  Sun,
  Command,
  Zap,
  Shield,
} from "lucide-react";
import { useTheme } from "@/lib/theme-context";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import QuickAddMenu from "@/components/QuickAddMenu";
import { useLocale, useTranslations } from "next-intl";

const Topbar = memo(() => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const currentLocale = useLocale();
  const t = useTranslations("top-bar");

  const toggleLanguage = () => {
    const newLocale = currentLocale === "en" ? "ur" : "en";

    //  Store the user's preferred locale in a cookie (1 year)
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;

    //  Build new path without duplicating locale prefix
    const newPath = `/${newLocale}${pathname.replace(/^\/(en|ur)/, "")}`;

    //  Navigate to new locale
    router.push(newPath);
  };

  const handleLogout = useCallback(() => {
    logout();
    router.push("/login");
  }, [logout, router]);

  const porfileClickHandle = () => {
    setIsProfileOpen(false);
    router.push("/profile");
  };
  const setingClickHandle = () => {
    setIsProfileOpen(false);
    router.push("/settings");
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-white/20 dark:border-gray-700/50 shadow-lg">
      <div className="px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Search */}
          <div className="flex-1 mx-5 max-w-2xl">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search
                  className={`h-5 w-5 transition-colors duration-500 ${
                    searchFocused
                      ? "text-primary-500"
                      : "text-gray-400 dark:text-gray-500"
                  }`}
                />
              </div>
              <input
                type="text"
                placeholder={t("searchPlaceholder")}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="input-modern pl-12 pr-16 py-3 text-sm"
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg px-2 py-1">
                  <Command className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                    K
                  </span>
                </div>
              </div>

              {/* Search suggestions overlay */}
              {searchFocused && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-large border border-white/20 dark:border-gray-700/50 py-2 animate-fade-in-up">
                  <div className="px-4 py-2">
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                      {t("quickActions")}
                    </div>
                    <div className="space-y-1">
                      <button className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-500">
                        <Search className="h-4 w-4 mr-3 text-gray-400" />
                        {t("dashboardSearch")}
                      </button>
                      <button className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-500">
                        <Zap className="h-4 w-4 mr-3 text-gray-400" />
                        {t("quickActions")}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center justify-between space-x-3">
            {/* Quick Add Menu */}
            {/* <QuickAddMenu /> */}

            {/* Language toggle */}
            <button
              onClick={toggleLanguage}
              className="group relative p-3 rounded-2xl bg-white/50 dark:bg-gray-800/50 hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all duration-500 border border-white/20 dark:border-gray-700/50 hover:scale-105"
              aria-label="Toggle language"
            >
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                {locale === "en" ? "اردو" : "EN"}
              </span>
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="group relative p-3 rounded-2xl bg-white/50 dark:bg-gray-800/50 hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all duration-500 border border-white/20 dark:border-gray-700/50 hover:scale-105"
              aria-label={`Switch to ${
                theme === "light" ? "dark" : "light"
              } mode`}
            >
              <div className="relative">
                {theme === "light" ? (
                  <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-primary-500 transition-colors duration-500" />
                ) : (
                  <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-warning-500 transition-colors duration-500" />
                )}
              </div>
            </button>

            {/* Notifications */}
            {/* <div className="relative">
              <button className="group relative p-3 rounded-2xl bg-white/50 dark:bg-gray-800/50 hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all duration-500 border border-white/20 dark:border-gray-700/50 hover:scale-105">
                <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-primary-500 transition-colors duration-500" />
                <span className="absolute top-2 right-2 h-3 w-3 bg-gradient-to-r from-danger-500 to-danger-600 rounded-full animate-pulse shadow-lg"></span>
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-danger-500 to-danger-600 text-white text-xs rounded-full flex items-center justify-center font-medium animate-bounce">
                  3
                </span>
              </button>
            </div> */}

            {/* Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="group flex items-center space-x-3 p-2 rounded-2xl hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-500 border border-transparent hover:border-white/20 dark:hover:border-gray-700/50 hover:scale-105"
                aria-label="User menu"
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                </div>
                <div className="hidden lg:block text-left">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {user?.name || "Guest"}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                    <Shield className="h-3 w-3 mr-1" />
                    {user?.role?.replace("_", " ").toUpperCase() || "Guest"}
                  </div>
                </div>
              </button>

              {/* Enhanced Dropdown menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-large border border-white/20 dark:border-gray-700/50 py-3 z-50 animate-fade-in-up">
                  {/* Profile Header */}
                  <div className="px-6 py-4 border-b border-white/10 dark:border-gray-700/50">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg">
                          <User className="h-6 w-6 text-white" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-success-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                      </div>
                      <div className="flex-1">
                        <div className="text-base font-semibold text-gray-900 dark:text-white">
                          {user?.name || "Guest"}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {user?.email || "guest@example.com"}
                        </div>
                        <div className="flex items-center mt-1">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-400">
                            <Shield className="h-3 w-3 mr-1" />
                            {user?.role?.replace("_", " ").toUpperCase() ||
                              "Guest"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items
                  <div className="py-2">
                    <button
                      onClick={porfileClickHandle}
                      className="flex items-center w-full px-6 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors duration-500"
                    >
                      <User className="mr-4 h-5 w-5 text-gray-400" />
                      <div className="text-left">
                        <div className="font-medium">{t("profile")}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {t("viewProfile")}
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={setingClickHandle}
                      className="flex items-center w-full px-6 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors duration-500"
                    >
                      <Settings className="mr-4 h-5 w-5 text-gray-400" />
                      <div className="text-left">
                        <div className="font-medium">{t("settings")}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {t("preferences")}
                        </div>
                      </div>
                    </button>
                  </div> */}

                  {/* <hr className="my-2 border-white/10 dark:border-gray-700/50" /> */}

                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-6 py-3 text-sm text-danger-600 dark:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/20 transition-colors duration-500"
                  >
                    <LogOut className="mr-4 h-5 w-5" />
                    <div className="text-left">
                      <div className="font-medium">{t("logout")}</div>
                      <div className="text-xs text-danger-500 dark:text-danger-400">
                        {t("endSession")}
                      </div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {isProfileOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileOpen(false)}
          aria-hidden="true"
        />
      )}
    </header>
  );
});

Topbar.displayName = "Topbar";

export { Topbar };
