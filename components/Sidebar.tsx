"use client";

import React, { useState, useMemo, memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { mockModules } from "@/lib/mocks";
import { useAuth } from "@/contexts/AuthContext";
import { useFastNavigation } from "@/hooks/useFastNavigation";
import {
  LayoutDashboard,
  Settings,
  Package,
  Factory,
  Users,
  DollarSign,
  FileText,
  BarChart3,
  Shield,
  Wrench,
  Menu,
  X,
  Sparkles,
  ChevronRight,
  Warehouse,
  Receipt,
  UserCheck,
  CreditCard,
  ToolCase,
} from "lucide-react";
import Image from "next/image";

const iconMap = {
  "📊": LayoutDashboard,
  "⚙️": Settings,
  "🧰": ToolCase,
  "📦": Package,
  "🏭": Factory,
  "👥": Users,
  "💰": DollarSign,
  "📋": FileText,
  "📈": BarChart3,
  "🔧": Shield,
  "🛠️": Wrench,
  "✨": Sparkles,
  "🏪": Warehouse,
  "🧾": Receipt,
  "👤": UserCheck,
  "💳": CreditCard,
};

const Sidebar = memo(() => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const { user, canAccessModule } = useAuth();
  const { navigate } = useFastNavigation();
  const t = useTranslations("Sidebar");

  // Filter modules based on user access
  const SIDEBAR_LINKS = mockModules
    .filter((module) => {
      if (!user) return module.path === "/login";
      if (user.role === "admin") return true;
      return canAccessModule(module.path);
    })
    .map((module) => ({
      key: module.key,
      href: module.path,
      label: module.name,
      icon: module.icon,
      badge: module.badge,
      active: module.active,
    }));

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-6 left-6 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="group p-3 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-500 border border-white/20 dark:border-gray-700/50"
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6 text-gray-700 dark:text-gray-300" />
          ) : (
            <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed max-h-[100vh] inset-y-0 left-0 z-[9999] w-72 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-r border-white/20 dark:border-gray-700/50 transform transition-transform duration-300 ease-out lg:translate-x-0 lg:static lg:inset-0 shadow-lg lg:shadow-none ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Logo */}
          <div className="relative rounded-md m-2 flex items-center justify-center h-28 px-6 bg-gradient-primary">
            <div className="absolute rounded-md inset-0 bg-gradient-to-r from-primary-600/20 to-primary-700/20"></div>
            <div className="relative flex items-center space-x-3">
              <div className="relative">
                <Image src="/logo.png" width={75} height={75} alt="logo" priority />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">{t("title")}</h1>
                {/* <p className="text-xs text-primary-100">{t("subtitle")}</p> */}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {SIDEBAR_LINKS.map((link) => {
              const localePath = pathname.replace(/^\/(en|ur)/, "");
              const isActive =
                localePath === link.href ||
                localePath.startsWith(`${link.href}/`);
              const IconComponent =
                iconMap[link.icon as keyof typeof iconMap] || Package;

              return (
                <div key={link.href}>
                  <Link
                    href={link.href}
                    className={`group relative flex items-center px-4 py-3 text-sm font-medium rounded-2xl transition-all duration-200 truncate ${
                      isActive
                        ? "bg-gradient-to-r from-primary-500/20 to-primary-600/20 text-primary-700 dark:text-primary-300 border border-primary-500/30"
                        : "text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white"
                    } ${!link.active ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                      e.preventDefault();
                      if (link.active) {
                        navigate(link.href);
                        setIsMobileMenuOpen(false);
                      }
                    }}
                    onMouseEnter={() => setHoveredLink(link.href)}
                    onMouseLeave={() => setHoveredLink(null)}
                    aria-current={isActive ? "page" : undefined}
                    aria-disabled={!link.active}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-primary-400 to-primary-600 rounded-r-full"></div>
                    )}

                    <div className="relative flex items-center w-full min-w-0">
                      <div
                        className={`p-2 rounded-xl transition-all duration-200 flex-shrink-0 relative ${
                          isActive
                            ? "bg-primary-500/20 text-primary-600 dark:text-primary-400"
                            : "bg-gray-100/50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 group-hover:bg-primary-500/10 group-hover:text-primary-600 dark:group-hover:text-primary-400"
                        } ${hoveredLink === link.href ? "scale-110" : ""}`}
                      >
                        <IconComponent className="h-5 w-5" />
                      </div>

                      <div className="ml-3 flex-1 min-w-0">
                        <span className="block font-medium truncate">
                          {t(`Modules.${link.key}`)}
                        </span>
                        {!link.active && (
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            {t("comingSoon")}
                          </span>
                        )}
                      </div>

                      <ChevronRight
                        className={`h-4 w-4 transition-all duration-300 ${
                          isActive
                            ? "text-primary-600 dark:text-primary-400"
                            : "text-gray-400 group-hover:text-primary-500"
                        }`}
                      />
                    </div>
                  </Link>
                </div>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-white/10 dark:border-gray-700/50">
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
              {t("footer")}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-md lg:hidden animate-fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
});

Sidebar.displayName = "Sidebar";

export { Sidebar };
