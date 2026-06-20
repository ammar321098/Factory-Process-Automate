"use client";

import React, { memo, useState, useCallback } from "react";
import { Search, Filter, X } from "lucide-react";
import { useTranslations } from "next-intl"; // ✅ Import i18n hook

interface FilterOption {
  value: string;
  label: string;
}

interface Filter {
  key: string;
  label: string;
  options: FilterOption[];
}

interface OptimizedSearchProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onFilter?: (filters: Record<string, string>) => void;
  filters?: Filter[];
  loading?: boolean;
}

const OptimizedSearch = memo(
  ({
    placeholder,
    onSearch,
    onFilter,
    filters = [],
    loading = false,
  }: OptimizedSearchProps) => {
    const t = useTranslations("SearchBar");
    const [searchQuery, setSearchQuery] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
      {}
    );

    const handleSearchSubmit = useCallback(
      (e?: React.FormEvent) => {
        e?.preventDefault();
        onSearch?.(searchQuery.trim());
      },
      [searchQuery, onSearch]
    );

    const clearSearch = useCallback(() => {
      setSearchQuery("");
      onSearch?.(""); // instantly reset backend search
    }, [onSearch]);

    // const handleFilterChange = useCallback(
    //   (filterKey: string, value: string) => {
    //     const newFilters = { ...activeFilters, [filterKey]: value };
    //     setActiveFilters(newFilters);
    //     onFilter?.(newFilters);
    //   },
    //   [activeFilters, onFilter]
    // );

    return (
      <div className="flex items-center space-x-4">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative">
          {/* Input Wrapper */}
          <div className="relative flex items-center">
            {/* Left Icon */}
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

            {/* Input */}
            <input
              type="text"
              placeholder={placeholder || t("placeholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-20 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              disabled={loading}
            />

            {/* Clear Button (X) */}
            {searchQuery.length > 0 && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="h-4 w-4 text-gray-500 hover:text-gray-700 dark:text-gray-300" />
              </button>
            )}
          </div>
        </form>

        {/* Filter Button */}
        {filters.length > 0 && (
          <div className="relative">
            {/* <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <Filter className="h-4 w-4" />
              <span>{t("filters")}</span>
              {Object.keys(activeFilters).length > 0 && (
                <span className="bg-primary-500 text-white text-xs rounded-full px-2 py-1">
                  {Object.keys(activeFilters).length}
                </span>
              )}
            </button> */}

            {/* Filter Dropdown */}
            {showFilters && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20">
                <div className="p-4 space-y-4">
                  {/* {filters.map((filter) => (
                    <div key={filter.key}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {filter.label}
                      </label>
                      <select
                        value={activeFilters[filter.key] || ""}
                        onChange={(e) =>
                          handleFilterChange(filter.key, e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="">All {filter.label}</option>
                        {filter.options.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))} */}

                  {/* Clear Filters */}
                  {/* <div className="flex justify-end space-x-2 pt-2">
                    <button
                      onClick={() => {
                        setActiveFilters({});
                        onFilter?.({});
                      }}
                      className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                    >
                      {t("clear")}
                    </button>
                  </div> */}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

OptimizedSearch.displayName = "OptimizedSearch";

export default OptimizedSearch;
