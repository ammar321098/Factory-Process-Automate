"use client";

import React, { memo, useState, useMemo } from "react";
import { TableSkeleton } from "./LoadingSkeleton";
import {
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  MoreHorizontal,
} from "lucide-react";
import { useTranslations } from "next-intl";

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  responsive?: boolean;
  priority?: number;
  render?: (row: any) => React.ReactNode; // Custom render function
}

interface OptimizedTableProps {
  columns: Column[];
  data: any[];
  orders?: any[];
  loading?: boolean;
  actions?: (row: any) => React.ReactNode;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  stickyHeader?: boolean;
  maxHeight?: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Approved":
    case "Completed":
    case "Active":
    case "Generated":
    case "Paid":
      return "success";
    case "Pending":
    case "In Progress":
    case "Medium":
    case "Partially Paid":
      return "warning";
    case "Rejected":
    case "Cancelled":
    case "Inactive":
    case "High":
    case "Unpaid":
      return "danger";
    default:
      return "gray";
  }
};

const OptimizedTable: React.FC<OptimizedTableProps> = memo(
  ({
    columns,
    data,
    orders,
    loading = false,
    currentPage = 1,
    totalItems = 10,
    pageSize = 2,
    totalPages = 2,
    onPageChange,
    actions,
    stickyHeader = true,
    maxHeight = "600px",
  }: OptimizedTableProps) => {
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const [showMobileView, setShowMobileView] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
    const t = useTranslations("OptimizedTable");

    // Sort columns by priority
    const sortedColumns = useMemo(
      () => [...columns].sort((a, b) => (b.priority || 0) - (a.priority || 0)),
      [columns]
    );

    // Determine visible columns
    const visibleColumns = useMemo(
      () => (showMobileView ? sortedColumns.slice(0, 3) : columns),
      [columns, sortedColumns, showMobileView]
    );

    // Sorting logic
    const handleSort = (columnKey: string) => {
      if (sortColumn === columnKey) {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      } else {
        setSortColumn(columnKey);
        setSortDirection("asc");
      }
    };

    const sortedData = useMemo(() => {
      if (!sortColumn) return data;

      return [...data].sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];
        if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
        if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }, [data, sortColumn, sortDirection]);

    if (loading) {
      return <TableSkeleton rows={pageSize} columns={columns.length} />;
    }

    // Helper: safely get nested property (e.g., size.name)
    const getNestedValue = (obj: any, path: string) =>
      path.split(".").reduce((acc, part) => acc && acc[part], obj);

    return (
      <div className="w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {t("showing")} {(currentPage - 1) * pageSize + 1} {t("to")}{" "}
            {Math.min(currentPage * pageSize, totalItems)} {t("toOf")}{" "}
            {totalItems} {t("results")}
          </div>

          <button
            onClick={() => setShowMobileView(!showMobileView)}
            className="lg:hidden flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span>{showMobileView ? "Show All" : "Compact"}</span>
          </button>
        </div>

        {/* View Record Panel */}
        {selectedRecord && (
          <div className="my-4 w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t("viewDetails")}
              </h3>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-red-500 hover:text-red-700 text-sm font-medium"
              >
                {t("close")}
              </button>
            </div>

            {/* Record Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {Object.entries(selectedRecord).map(([key, value]) => {
                let displayValue: string = "N/A";

                if (value !== null && value !== undefined && value !== "") {
                  if (typeof value === "object") {
                    const obj = value as Record<string, unknown>;

                    // Handle nested objects safely
                    if (typeof obj.name === "string") displayValue = obj.name;
                    else if (
                      typeof obj.weight === "number" ||
                      typeof obj.weight === "string"
                    )
                      displayValue = `${obj.weight} g`;
                    else if (typeof obj.description === "string")
                      displayValue = obj.description;
                    else displayValue = JSON.stringify(obj, null, 2);
                  } else if (
                    key.toLowerCase().includes("date") ||
                    key.toLowerCase().includes("at")
                  ) {
                    displayValue = new Date(String(value)).toLocaleString();
                  } else {
                    displayValue = String(value);
                  }
                }

                // Make field names more readable (camelCase → Words)
                const label = key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase());

                return (
                  <div key={key} className="p-3 rounded-lg">
                    <p className="text-xs uppercase text-gray-500 dark:text-gray-400">
                      {label}
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white whitespace-pre-wrap break-words">
                      {displayValue}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Orders Section (unchanged) */}
            {orders && (
              <div>
                <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  {t("previousOrders")}
                </h4>

                {orders.filter((o) => o.customer === selectedRecord.customer)
                  .length > 0 ? (
                  <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                    <table className="w-full text-sm min-w-[600px]">
                      <thead className="bg-gray-100 dark:bg-gray-700">
                        <tr>
                          <th className="text-left py-2 px-3">Order #</th>
                          <th className="text-left py-2 px-3">Date</th>
                          <th className="text-left py-2 px-3">Items</th>
                          <th className="text-left py-2 px-3">Total</th>
                          <th className="text-left py-2 px-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders
                          .filter((o) => o.customer === selectedRecord.customer)
                          .map((order, idx) => (
                            <tr
                              key={idx}
                              className="border-t border-gray-200 dark:border-gray-600"
                            >
                              <td className="py-2 px-3">
                                {order.invoice || "N/A"}
                              </td>
                              <td className="py-2 px-3">
                                {order.date
                                  ? new Date(order.date).toLocaleString()
                                  : "N/A"}
                              </td>
                              <td className="py-2 px-3">
                                <div className="flex flex-wrap gap-1">
                                  {order.items && order.items.length > 0 ? (
                                    order.items.map(
                                      (item: string, i: number) => (
                                        <span
                                          key={i}
                                          className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-full text-xs"
                                        >
                                          {item}
                                        </span>
                                      )
                                    )
                                  ) : (
                                    <span className="text-gray-500 dark:text-gray-400 text-xs">
                                      N/A
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="py-2 px-3">
                                {order.total || "N/A"}
                              </td>
                              <td className="py-2 px-3">
                                <span
                                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    order.status === "Paid"
                                      ? "bg-green-100 text-green-700"
                                      : order.status === "Pending"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {order.status || "N/A"}
                                </span>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-lg">
                    {t("noOrders")}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Table */}
        <div
          className="overflow-x-auto overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg"
          style={{ maxHeight }}
        >
          <table className="w-full min-w-full border-collapse">
            <thead
              className={`bg-gray-50 dark:bg-gray-800 ${
                stickyHeader ? "sticky top-0 z-10" : ""
              }`}
            >
              <tr>
                {visibleColumns.map((column) => (
                  <th
                    key={column.key}
                    className={`text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 whitespace-nowrap ${
                      column.sortable
                        ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                        : ""
                    } ${column.responsive ? "hidden sm:table-cell" : ""}`}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{column.label}</span>
                      {column.sortable && (
                        <div className="flex flex-col">
                          <ChevronUp
                            className={`h-3 w-3 ${
                              sortColumn === column.key &&
                              sortDirection === "asc"
                                ? "text-primary-600"
                                : "text-gray-400"
                            }`}
                          />
                          <ChevronDown
                            className={`h-3 w-3 -mt-1 ${
                              sortColumn === column.key &&
                              sortDirection === "desc"
                                ? "text-primary-600"
                                : "text-gray-400"
                            }`}
                          />
                        </div>
                      )}
                    </div>
                  </th>
                ))}
                {actions && (
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Actions
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="bg-white dark:bg-gray-900">
              {sortedData.map((item, index) => (
                <tr
                  key={item.id || index}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150 border-b border-gray-100 dark:border-gray-800"
                >
                  {visibleColumns.map((column) => {
                    // If render function exists, use it
                    if (column.render) {
                      return (
                        <td
                          key={column.key}
                          className={`py-3 px-4 text-gray-900 dark:text-white whitespace-nowrap align-middle ${
                            column.responsive ? "hidden sm:table-cell" : ""
                          }`}
                        >
                          {column.render(item)}
                        </td>
                      );
                    }

                    const value = getNestedValue(item, column.key);

                    // Status column with color badges
                    if (column.key.toLowerCase().includes("status")) {
                      const color = getStatusColor(String(value));
                      const colorClasses: Record<string, string> = {
                        success:
                          "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                        warning:
                          "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
                        danger:
                          "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
                        gray: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
                      };

                      return (
                        <td
                          key={column.key}
                          className={`py-3 px-4 whitespace-nowrap ${
                            column.responsive ? "hidden sm:table-cell" : ""
                          }`}
                        >
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              colorClasses[color] || colorClasses.gray
                            }`}
                          >
                            {String(value ?? "—")}
                          </span>
                        </td>
                      );
                    }

                    // Arrays as inline badges
                    if (Array.isArray(value)) {
                      return (
                        <td
                          key={column.key}
                          className="py-3 px-4 whitespace-nowrap align-middle"
                        >
                          <div className="flex flex-wrap items-center gap-2">
                            {value.map((val: any, i: number) => (
                              <span
                                key={i}
                                className="px-2 py-1 border border-blue-600 text-blue-700 dark:text-blue-400 text-xs font-medium rounded-full"
                              >
                                {String(val)}
                              </span>
                            ))}
                          </div>
                        </td>
                      );
                    }

                    // Default value
                    return (
                      <td
                        key={column.key}
                        className={`py-4 px-4 text-gray-900 dark:text-white whitespace-nowrap align-middle ${
                          column.responsive ? "hidden sm:table-cell" : ""
                        }`}
                      >
                        {typeof value === "object" && value !== null
                          ? JSON.stringify(value)
                          : column.key === "description"
                          ? String(value ?? "—").slice(0, 20) +
                            (String(value ?? "").length > 20 ? "…" : "")
                          : String(value ?? "—")}
                      </td>
                    );
                  })}

                  {/* Actions Column */}
                  {actions && (
                    <td className="py-4 px-4 whitespace-nowrap align-middle">
                      {actions(item)}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Enhanced Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between mt-4 space-y-3 sm:space-y-0">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {t("page")} {currentPage} {t("toOf")} {totalPages}
            </div>
            <div className="flex items-center space-x-2">
              {/* Previous Button */}
              <button
                onClick={() => onPageChange?.(currentPage - 1)}
                disabled={currentPage <= 1}
                className="flex items-center space-x-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">{t("previous")}</span>
              </button>

              {/* Page Numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let page: number;
                if (totalPages <= 5) {
                  page = i + 1;
                } else {
                  if (currentPage <= 3) {
                    page = i + 1; // show 1–5
                  } else if (currentPage >= totalPages - 2) {
                    page = totalPages - 4 + i; // last 5 pages
                  } else {
                    page = currentPage - 2 + i; // current page centered
                  }
                }

                const isActive = page === currentPage;

                return (
                  <button
                    key={page}
                    onClick={() => onPageChange?.(page)}
                    className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                      isActive
                        ? "bg-primary-600 text-white"
                        : "border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              {/* Next Button */}
              <button
                onClick={() => onPageChange?.(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="flex items-center space-x-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span className="hidden sm:inline">{t("next")}</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
);

OptimizedTable.displayName = "OptimizedTable";

export default OptimizedTable;
