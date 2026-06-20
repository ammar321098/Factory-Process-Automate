"use client";
import React, { useCallback, useState, useEffect, useMemo } from "react";
import { KpiCard } from "@/components/KpiCard";
import {
  Sparkles,
  Plus,
  Download,
  Users,
  Calendar,
  TagIcon,
  Package2,
  CalendarClock,
  Archive,
} from "lucide-react";
import { useAddForm } from "@/hooks/useAddForm";
import OptimizedTable from "@/components/OptimizedTable";
import { useTranslations } from "next-intl";
import OptimizedSearch from "@/components/OptimizedSearch";
import {
  fetchPolishingEntries,
  fetchPolishingRates,
  fetchPolishingStats,
  fetchRemainingPolishing,
  type PolishingEntry,
  type PolishingStats,
} from "@/lib/api/polishingApi";
import ViewModal from "@/components/ViewModal";
import EditModal from "@/components/EditModal";
import { DeleteModal } from "@/components/DeleteModal";

export default function PolishingPage() {
  const [activeTab, setActiveTab] = useState("polishing");
  const { openAddForm } = useAddForm();
  const t = useTranslations("Polishing");

  // API data state
  const [polishingEntries, setPolishingEntries] = useState<PolishingEntry[]>(
    []
  );
  const [polishingRates, setPolishingRates] = useState<any[]>([]);
  const [polishingEmployeePerformance, setPolishingEmployeePerformance] =
    useState<any[]>([]);
  const [remainingPolishing, setremainingPolishing] = useState<any[]>([]);
  const [stats, setStats] = useState<PolishingStats | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totals, setTotals] = useState({
    polishing: 0,
    rates: 0,
    employees: 0,
    remaining: 0,
  });
  const [errorMessage, setErrorMessage] = useState(false);
  const [errorPopupOpen, setErrorPopupOpen] = useState(false);
  const [selectedPolishingRecord, setSelectedPolishingRecord] = useState<
    any | null
  >(null);
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Search and filter state
  const [polishingSearch, setPolishingSearch] = useState("");
  const [polishingFilters, setPolishingFilters] = useState({});

  //Pagination states
  const [polishingPage, setPolishingPage] = useState(1);
  const pageSize = 5;

  const currentTotals = {
    polishing: totals.polishing,
    "polishing-rate": totals.rates,
    employees: totals.employees,
    remaining: totals.remaining,
  };

  const totalItems =
    currentTotals[activeTab as keyof typeof currentTotals] || 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  // Reset page when tab changes
  useEffect(() => {
    setPolishingPage(1);
  }, [activeTab]);

  const handlePageChange = (newPage: number) => {
    setPolishingPage(newPage);
  };

  // Fetch data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch polishing entries and stats
        const [
          polishingRes,
          polishingRateRes,
          remainingPolishingRes,
          polishingStatsRes,
        ] = await Promise.all([
          fetchPolishingEntries({
            page: polishingPage,
            limit: pageSize,
            search: polishingSearch,
          }),
          fetchPolishingRates({
            page: polishingPage,
            limit: pageSize,
            search: polishingSearch,
          }),
          fetchRemainingPolishing({
            page: polishingPage,
            limit: pageSize,
            search: polishingSearch,
          }),
          fetchPolishingStats(),
        ]);

        // All Polishing data
        const polishing = Array.isArray(polishingRes)
          ? polishingRes
          : polishingRes?.data || [];

        const polishingrates = Array.isArray(polishingRateRes)
          ? polishingRateRes
          : polishingRateRes?.data || [];

        const empPerformance = Array.isArray(polishingRes)
          ? polishingRes
          : polishingRes?.employeePerformance || [];

        const remaining = Array.isArray(remainingPolishingRes)
          ? remainingPolishingRes
          : remainingPolishingRes?.data || [];

        setPolishingEntries(polishing);
        setPolishingRates(polishingrates);

        setPolishingEmployeePerformance(empPerformance);
        setremainingPolishing(remaining);
        setStats(polishingStatsRes);

        setTotals({
          polishing: polishingRes.total || 0,
          rates: polishingRateRes.total || 0,
          employees: polishingRes.employeeTotal || 0,
          remaining: remainingPolishingRes.total,
        });
      } catch (err) {
        console.error("Error loading polishing data:", err);
        setError(
          "Failed to load polishing data. Please check if the database is connected."
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Event listener to trigger refresh on new material submission
    const handleDataUpdate = () => {
      loadData();
    };

    window.addEventListener("data-updated", handleDataUpdate);

    // Cleanup when component unmounts or dependencies change
    return () => {
      window.removeEventListener("data-updated", handleDataUpdate);
    };
  }, [polishingPage, polishingSearch]);

  const polishingStatsConfig = [
    {
      key: "moldedItemsUsed",
      label: "Molded Items Used",
      value: stats ? `${stats.moldedItemsUsed} pcs` : "0 pcs",
      icon: Package2,
      color: "accent",
    },
    {
      key: "activeEmployees",
      label: "Active Employees",
      value: stats ? stats.activePolishingEmployees.toString() : "0",
      icon: Users,
      color: "success",
    },
    {
      key: "todayPolished",
      label: "Today Polished",
      value: stats ? `${stats.todayPolished} pcs` : "0 pcs",
      icon: CalendarClock,
      color: "primary",
    },
    {
      key: "polishedItems",
      label: "Polished items",
      value: stats ? `${stats.totalPolishedItems.toString()} pcs` : "0 pcs",
      icon: Sparkles,
      color: "warning",
    },
  ];

  const tabs = [
    {
      id: "polishing",
      name: "Polishing Log",
      icon: Sparkles,
      count: totals.polishing,
    },
    {
      id: "polishing-rate",
      name: "Polishing Rates",
      icon: TagIcon,
      count: totals.rates,
    },
    {
      id: "employees",
      name: "Employee Performance",
      icon: Users,
      count: totals.employees,
    },
    {
      id: "remaining",
      name: "Polished Products",
      icon: Package2,
      count: totals.remaining,
    },
  ];

  // Molding Table Columns here
  const polishingEntryColumns = [
    {
      key: "remaining_molding?.product_types?.productType",
      label: "Product Name",
      sortable: true,
      priority: 4,
      render: (row: any) =>
        row.remaining_molding?.product_types?.productType ?? "—",
    },
    {
      key: "employees.name",
      label: "Employee (Operator)",
      sortable: true,
      priority: 4,
      render: (row: any) =>
        row.employees
          ? `${row.employees.name} (${row.employees.salaryType})`
          : "—",
    },
    {
      key: "polishingRate",
      label: "Polishing Rate",
      sortable: true,
      priority: 3,
      type: "number",
      render: (row: any) => row.polishingRate ?? "—",
    },
    {
      key: "quantity",
      label: "Quantity (pcs)",
      sortable: true,
      priority: 3,
      type: "number",
      render: (row: any) => (row.quantity ?? 0).toString(),
    },
    {
      key: "totalEarn",
      label: "Total Earning",
      sortable: true,
      priority: 3,
      type: "number",
      render: (row: any) => (row.totalEarn ?? 0).toString(),
    },
    {
      key: "qualityNotes",
      label: "Quality Notes",
      sortable: false,
      responsive: true,
      priority: 2,
      render: (row: any) => row.qualityNotes ?? "—",
    },
    {
      key: "updatedAt",
      label: "Updated On",
      sortable: true,
      render: (row: any) =>
        row.updatedAt
          ? new Date(row.updatedAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
          : "—",
    },
    {
      key: "createdAt",
      label: "Date Added",
      sortable: true,
      render: (row: any) =>
        row.createdAt
          ? new Date(row.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
          : "—",
    },
  ];

  const polishingRateColumns = [
    {
      key: "employees.name",
      label: "Employee Name",
      sortable: true,
      priority: 1,
      render: (row: any) => row.employees?.name ?? "—",
    },
    {
      key: "product_types.productType",
      label: "Product Name",
      sortable: true,
      render: (row: any) => row.product_types?.productType ?? "—",
    },
    {
      key: "employees.salaryType",
      label: "Salary type",
      sortable: true,
      priority: 1,
      render: (row: any) => row.employees?.salaryType ?? "—",
    },
    {
      key: "polishingRate",
      label: "Rate",
      sortable: true,
      priority: 1,
      type: "number",
      render: (row: any) => row.polishingRate ?? "—",
    },
    {
      key: "description",
      label: "Description",
      render: (row: any) => row.description ?? "—",
    },
    {
      key: "updatedAt",
      label: "Update On",
      sortable: true,
      render: (row: any) =>
        row.updatedAt
          ? new Date(row.updatedAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
          : "—",
    },
    {
      key: "createdAt",
      label: "Date Added",
      sortable: true,
      render: (row: any) =>
        row.createdAt
          ? new Date(row.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
          : "—",
    },
  ];

  const polishingEmployeeColumns = [
    {
      key: "employeeName",
      label: "Employee",
      sortable: true,
      priority: 5,
      render: (row: any) => row.employeeName ?? "—",
    },
    {
      key: "totalEntries",
      label: "Total Items",
      sortable: true,
      priority: 4,
      render: (row: any) => row.totalEntries ?? "0",
    },
    {
      key: "totalQuantity",
      label: "Quantity Used",
      sortable: true,
      priority: 4,
      render: (row: any) => row.totalQuantity ?? "0",
    },
    {
      key: "salaryType",
      label: "Salary Type",
      sortable: true,
      priority: 3,
      render: (row: any) => row.salaryType ?? "—",
    },
    {
      key: "totalEarning",
      label: "Total Earning",
      sortable: true,
      priority: 3,
      render: (row: any) =>
        row.totalEarning !== undefined && row.totalEarning !== 0
          ? `${row.totalEarning}`
          : "—",
    },
  ];

  const remainingPolishingProductsColumns = [
    {
      key: "product_types.productType",
      label: "Product Name",
      sortable: true,
      priority: 3,
      render: (row: any) => row.product_types?.productType ?? "—",
    },
    {
      key: "totalQuantity",
      label: "Total Quantity (pcs)",
      sortable: true,
      priority: 4,
      render: (row: any) => row.totalQuantity ?? "0",
    },
    {
      key: "remaining",
      label: "Production (pcs)",
      sortable: true,
      priority: 4,
      render: (row: any) => row.remaining ?? "0",
    },
    {
      key: "updatedAt",
      label: "Update On",
      sortable: true,
      render: (row: any) =>
        row.updatedAt
          ? new Date(row.updatedAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
          : "—",
    },
  ];

  const filterOptions = [
    {
      key: "category",
      label: "Category",
      options: [
        { value: "Metal", label: "Metal" },
        { value: "Plastic", label: "Plastic" },
        { value: "Rubber", label: "Rubber" },
        { value: "Wood", label: "Wood" },
        { value: "Chemical", label: "Chemical" },
      ],
    },
    {
      key: "status",
      label: "Status",
      options: [
        { value: "Active", label: "Active" },
        { value: "Low Stock", label: "Low Stock" },
        { value: "Out of Stock", label: "Out of Stock" },
      ],
    },
  ];

  // View Record
  const onViewRecord = (record: any) => {
    setSelectedPolishingRecord(record); // your view modal
    setIsViewOpen(true);
  };
  // Edit Material
  const onEditRecord = (record: any) => {
    setSelectedPolishingRecord(record);
    setIsEditOpen(true);
  };
  const handleEditChange = (key: string, value: any) => {
    setSelectedPolishingRecord((prev: any) =>
      prev ? { ...prev, [key]: value } : null
    );
  };
  //  Delete Material
  const onDeleteMaterial = (record: any) => {
    setSelectedRecord(record);
    setIsDeleteOpen(true);
  };

  // Handler function that update record
  const handleUpdateRecord = async () => {
    let payload: any = {};
    let endpoint = "";

    switch (activeTab) {
      // PRODUCTION / POLISHING ENTRIES
      case "polishing":
        if (!selectedPolishingRecord) return;
        payload = {
          quantity: Number(selectedPolishingRecord.quantity ?? 0),
          qualityNotes: selectedPolishingRecord.qualityNotes ?? null,
        };
        endpoint = `/api/polishing/${selectedPolishingRecord.id}`;
        break;

      // POLISHING RATE
      case "polishing-rate":
        if (!selectedPolishingRecord) return;

        payload = {
          polishingRate: Number(selectedPolishingRecord.polishingRate ?? 0),
          description: selectedPolishingRecord.description ?? null,
        };

        endpoint = `/api/polishing-rate/${selectedPolishingRecord.id}`;
        break;

      default:
        console.error("Unknown tab:", activeTab);
        return;
    }

    // SEND PATCH REQUEST
    try {
      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let data = null;
      if (res.headers.get("content-length") !== "0") {
        data = await res.json().catch(() => null);
      }

      if (!res.ok) throw new Error(data?.error || "Update failed");

      window.dispatchEvent(new Event("data-updated"));

      setIsEditOpen(false);

      // reset states
      setSelectedPolishingRecord(null);
    } catch (err) {
      console.error("Failed to update record:", err);
      alert(err instanceof Error ? err.message : "Update failed");
    }
  };

  // Handler function that delete record
  const handleDeleteRecord = async () => {
    if (!selectedRecord) return;

    let endpoint = "";

    switch (activeTab) {
      case "polishing":
        endpoint = `/api/polishing/${selectedRecord.id}`;
        break;
      case "polishing-rate":
        endpoint = `/api/polishing-rate/${selectedRecord.id}`;
        break;
      default:
        console.warn("Unknown tab in delete action:", activeTab);
        return;
    }

    try {
      const res = await fetch(endpoint, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Unable to delete the size.");
        setErrorPopupOpen(true);
        return;
      }

      // Notify listeners to refresh data
      window.dispatchEvent(new Event("data-updated"));

      // Close modal & reset selected record
      setIsDeleteOpen(false);
      setSelectedRecord(null);

    } catch (err) {
      console.error("Delete error:", err);
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  // Optimized handlers
  const handleSearch = useCallback(
    (query: string) => {
      setPolishingSearch(query);
      setPolishingPage(1);
    },
    [setPolishingSearch]
  );

  const handleFilter = useCallback(
    (filters: Record<string, string>) => {
      setPolishingFilters(filters);
    },
    [setPolishingFilters]
  );

  return (
    <div className="space-y-6 max-w-full">
      {/* Page Header */}
      <div className="animate-fade-in-up">
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-4xl font-bold text-gradient mb-2">
              {t("title")}{" "}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {t("description")}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-primary-500/10 to-accent-500/10 rounded-2xl p-4 border border-white/20 dark:border-gray-700/50">
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

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Polishing Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {polishingStatsConfig.map((stat, index) => (
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

      {/* Tabbed Interface */}
      <div className="animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
        <div className="card-glass overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-white/10 dark:border-gray-700/30">
            <nav className="flex space-x-4 px-6 overflow-x-auto">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 whitespace-nowrap ${
                      activeTab === tab.id
                        ? "border-primary-500 text-primary-600 dark:text-primary-400"
                        : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <IconComponent className="h-5 w-5" />
                      <span>{t(`tabs.${tab.id}`)}</span>
                      <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full text-xs">
                        {tab.count}
                      </span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <div className="w-full lg:w-auto">
                <OptimizedSearch
                  placeholder={t("search")}
                  onSearch={handleSearch}
                  onFilter={handleFilter}
                  filters={filterOptions}
                  loading={loading}
                />
              </div>
              <div className="flex items-center space-x-3">
                {/* <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200">
                  <Download className="h-4 w-4" />
                  <span>{t("export")}</span>
                </button> */}

                {activeTab === "polishing" && (
                  <button
                    onClick={() => openAddForm("polishing")}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
                  >
                    <Plus className="h-4 w-4" />
                    <span>{t("newEntry")}</span>
                  </button>
                )}
                {activeTab === "polishing-rate" && (
                  <button
                    onClick={() => openAddForm("polishing-rate")}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
                  >
                    <Plus className="h-4 w-4" />
                    <span>{t("addPolishingRate")}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Data Table */}
            <div className="overflow-hidden">
              {activeTab === "polishing" && (
                <OptimizedTable
                  columns={polishingEntryColumns}
                  data={polishingEntries}
                  loading={loading}
                  currentPage={polishingPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  pageSize={pageSize}
                  onPageChange={handlePageChange}
                  actions={(item) => (
                    <div className="flex items-center gap-3 text-sm">
                      <button
                        onClick={() => {
                          onViewRecord(item);
                        }}
                        className="text-blue-600 hover:underline"
                      >
                        View
                      </button>
                      <button
                        onClick={() => onEditRecord(item)}
                        className="text-yellow-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDeleteMaterial(item)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                />
              )}
              {activeTab === "polishing-rate" && (
                <OptimizedTable
                  columns={polishingRateColumns}
                  data={polishingRates}
                  loading={loading}
                  currentPage={polishingPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  pageSize={pageSize}
                  onPageChange={handlePageChange}
                  actions={(item) => (
                    <div className="flex items-center gap-3 text-sm">
                      <button
                        onClick={() => {
                          onViewRecord(item);
                        }}
                        className="text-blue-600 hover:underline"
                      >
                        View
                      </button>
                      <button
                        onClick={() => onEditRecord(item)}
                        className="text-yellow-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDeleteMaterial(item)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                />
              )}
              {activeTab === "employees" && (
                <OptimizedTable
                  columns={polishingEmployeeColumns}
                  data={polishingEmployeePerformance}
                  loading={loading}
                  currentPage={polishingPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  pageSize={pageSize}
                  onPageChange={handlePageChange}
                />
              )}
              {activeTab === "remaining" && (
                <OptimizedTable
                  columns={remainingPolishingProductsColumns}
                  data={remainingPolishing}
                  loading={loading}
                  currentPage={polishingPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  pageSize={pageSize}
                  onPageChange={handlePageChange}
                />
              )}
            </div>
          </div>
        </div>

        {/* this is view model for view polishing information in this model */}
        {isViewOpen && (
          <ViewModal
            open={isViewOpen}
            onClose={() => setIsViewOpen(false)}
            onEdit={() => {
              setIsViewOpen(false);
              setIsEditOpen(true);
            }}
            record={selectedPolishingRecord}
            columns={
              activeTab === "polishing"
                ? polishingEntryColumns
                : polishingRateColumns
            }
          />
        )}

        {/* this is edit model for edit the information any perticular polishing data */}
        {isEditOpen && (
          <EditModal
            open={isEditOpen}
            record={selectedPolishingRecord}
            columns={
              activeTab === "polishing"
                ? polishingEntryColumns
                : polishingRateColumns
            }
            onClose={() => setIsEditOpen(false)}
            onSave={handleUpdateRecord}
            onChange={handleEditChange}
          />
        )}

        {/* this is use for update dialogue confirm */}
        {isDeleteOpen && (
          <DeleteModal
            open={isDeleteOpen}
            onCancel={() => setIsDeleteOpen(false)}
            onConfirm={handleDeleteRecord}
          />
        )}
      </div>
    </div>
  );
}
