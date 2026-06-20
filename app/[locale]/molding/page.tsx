"use client";
import React, { useCallback, useState, useEffect } from "react";
import { KpiCard } from "@/components/KpiCard";
import {
  Factory,
  Plus,
  Download,
  Users,
  AlertTriangle,
  Calendar,
  Package2Icon,
  Tag,
  ToolCase,
  CalendarClock,
} from "lucide-react";
import { useAddForm } from "@/hooks/useAddForm";
import OptimizedTable from "@/components/OptimizedTable";
import { useTranslations } from "next-intl";
import OptimizedSearch from "@/components/OptimizedSearch";
import {
  fetchMoldingEntries,
  fetchMoldingStats,
  fetchProductRates,
  fetchProductTypes,
  fetchRemainingMoldings,
  MoldingEntry,
  MoldingStats,
} from "@/lib/api/moldingApi";
import ViewModal from "@/components/ViewModal";
import EditModal from "@/components/EditModal";
import { DeleteModal } from "@/components/DeleteModal";
import ErrorPopup from "@/components/ErrorPopup";

export default function MoldingPage() {
  const [activeTab, setActiveTab] = useState("production");
  const { openAddForm } = useAddForm();
  const t = useTranslations("Molding");

  // API data state
  const [moldingEntries, setMoldingEntries] = useState<MoldingEntry[]>([]);
  const [productTypeData, setProductTypeData] = useState<any[]>([]);
  const [productRateData, setProductRateData] = useState<any[]>([]);
  const [employeePerformanceData, setEmployeePerformanceData] = useState<any[]>(
    []
  );
  const [remainingMoldingData, setRemainingMoldingData] = useState<any[]>([]);
  const [stats, setStats] = useState<MoldingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totals, setTotals] = useState({
    molding: 0,
    products: 0,
    rates: 0,
    employees: 0,
    remaining: 0,
  });

  // Action Buttons states
  const [selectedMoldingRecord, setSelectedMoldingRecord] = useState<
    any | null
  >(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [errorPopupOpen, setErrorPopupOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);

  // Search and filter state
  const [moldingSearch, setMoldingSearch] = useState("");
  const [moldingFilters, setMoldingFilters] = useState({});

  //Pagination states
  const [moldingPage, setMoldingPage] = useState(1);
  const pageSize = 5;

  const currentTotals = {
    production: totals.molding,
    "product-type": totals.products,
    "product-rate": totals.rates,
    employees: totals.employees,
    remaining: totals.remaining,
  };

  const totalItems =
    currentTotals[activeTab as keyof typeof currentTotals] || 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  // Reset page when tab changes
  useEffect(() => {
    setMoldingPage(1);
  }, [activeTab]);

  const handlePageChange = (newPage: number) => {
    setMoldingPage(newPage);
  };

  const moldingStatsConfig = [
    {
      key: "materialUsed",
      label: "Material Used",
      value: stats ? `${stats.totalMaterialUsed} pcs` : "0 pcs",
      icon: ToolCase,
      color: "success",
    },
    {
      key: "todayMolding",
      label: "Today Molding",
      value: stats ? `${stats.todayMoldingQuantity} pcs` : "0 pcs",
      icon: CalendarClock,
      color: "primary",
    },

    {
      key: "totalDamage",
      label: "Molding Damage",
      value: stats ? `${stats.totalDamage} pcs` : "0 pcs",
      icon: AlertTriangle,
      color: "warning",
    },

    {
      key: "moldingItems",
      label: "Molding Items",
      value: stats ? `${stats.totalRemainingMoldedProducts} pcs` : "0 pcs",
      icon: Package2Icon,
      color: "accent",
    },
  ];

  // Fetch data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch molding entries, stats, and product types
        const [
          moldingRes,
          productTypeRes,
          productRatesRes,
          remainingMoldingRes,
          moldingStatsRes,
        ] = await Promise.all([
          fetchMoldingEntries({
            page: moldingPage,
            limit: pageSize,
            search: moldingSearch,
          }),
          fetchProductTypes({
            page: moldingPage,
            limit: pageSize,
            search: moldingSearch,
          }),
          fetchProductRates({
            page: moldingPage,
            limit: pageSize,
            search: moldingSearch,
          }),
          fetchRemainingMoldings({
            page: moldingPage,
            limit: pageSize,
            search: moldingSearch,
          }),
          fetchMoldingStats(),
        ]);

        // All Moldings data
        const moldings = Array.isArray(moldingRes)
          ? moldingRes
          : moldingRes?.data || [];

        const types = Array.isArray(productTypeRes)
          ? productTypeRes
          : productTypeRes?.data || [];

        const rates = Array.isArray(productRatesRes)
          ? productRatesRes
          : productRatesRes?.data || [];

        const employeePerformance = Array.isArray(moldingRes)
          ? moldingRes
          : moldingRes?.employeePerformance || [];

        const remainingMoldings = Array.isArray(remainingMoldingRes)
          ? remainingMoldingRes
          : remainingMoldingRes?.data || [];

        setMoldingEntries(moldings);
        setProductTypeData(types);
        setProductRateData(rates);
        setEmployeePerformanceData(employeePerformance);
        setRemainingMoldingData(remainingMoldings);
        setStats(moldingStatsRes);


        setTotals({
          molding: moldingRes.total || 0,
          products: productTypeRes.total || 0,
          rates: productRatesRes.total || 0,
          employees: moldingRes.employeeTotal || 0,
          remaining: remainingMoldingRes.total,
        });
      } catch (err) {
        console.error("Error loading molding data:", err);
        setError(
          "Failed to load molding data. Please check if the database is connected."
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
  }, [moldingPage, moldingSearch]);

  const tabs = [
    {
      id: "production",
      name: "Molding Log",
      icon: Factory,
      count: totals.molding,
    },

    {
      id: "product-type",
      name: "Products",
      icon: Package2Icon,
      count: totals.products,
    },
    {
      id: "product-rate",
      name: "Product Rates",
      icon: Tag,
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
      name: "Molded Products",
      icon: Package2Icon,
      count: totals.remaining,
    },
  ];

  // Table columns data here
  const moldingEntryColumns = [
    {
      key: "materials.name",
      label: "Material (pcs)",
      sortable: true,
      priority: 4,
      render: (row: any) => row.materials?.name ?? "—",
    },
    {
      key: "employees.name",
      label: "Employee (Operator)",
      sortable: true,
      priority: 4,
      render: (row: any) => row.employees?.name ?? "—",
    },
    {
      key: "product_types.productType",
      label: "Product Name",
      sortable: true,
      priority: 3,
      render: (row: any) => row.product_types?.productType ?? "—",
    },
    {
      key: "productRate",
      label: "Rate Per Piece",
      sortable: true,
      priority: 3,
      type: "number",
      render: (row: any) => row.productRate ?? "—",
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
      key: "damage",
      label: "Damage (pcs)",
      sortable: true,
      priority: 3,
      type: "number",
      render: (row: any) => (row.damage ?? 0).toString(),
    },
    {
      key: "finalQuantity",
      label: "Production (pcs)",
      sortable: true,
      priority: 3,
      type: "number",
      render: (row: any) => (row.finalQuantity ?? 0).toString(),
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

  const productTypeColumns = [
    {
      key: "productType",
      label: "Product Name",
      sortable: true,
      priority: 1,
      render: (row: any) => row.productType ?? "—",
    },

    {
      key: "description",
      label: "Description",
      render: (row: any) => row.description ?? "—",
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

  const productRateColumns = [
    {
      key: "employees.name",
      label: "Employee Name",
      sortable: true,
      priority: 1,
      render: (row: any) => row.employees?.name ?? "—",
    },
    {
      key: "product_types.productType",
      label: "Product Type",
      sortable: true,
      priority: 1,
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
      key: "productRate",
      label: "Rate",
      sortable: true,
      priority: 1,
      type: "number",
      render: (row: any) => row.productRate ?? "—",
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

  const moldingEmployeeColumns = [
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

  const remainingMoldProductsColumns = [
    {
      key: "product_types.productType",
      label: "Product Type",
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
      key: "totalDamage",
      label: "Total Damage (pcs)",
      sortable: true,
      priority: 4,
      render: (row: any) => row.totalDamage ?? "0",
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
    setSelectedMoldingRecord(record); // your view modal
    setIsViewOpen(true);
  };

  // Edit Record
  const onEditRecord = (record: any) => {
    setSelectedMoldingRecord(record);
    setIsEditOpen(true);
  };

  const handleEditChange = (key: string, value: any) => {
    setSelectedMoldingRecord((prev: any) =>
      prev ? { ...prev, [key]: value } : null
    );
  };

  const onDeleteMaterial = (record: any) => {
    setSelectedRecord(record);
    setIsDeleteOpen(true);
  };

  // Handler function that update record
  const handleUpdateRecord = async () => {
    let payload: any = {};
    let endpoint = "";

    switch (activeTab) {
      // PRODUCTION / MOLDING ENTRIES
      case "production":
        if (!selectedMoldingRecord) return;
        payload = {
          quantity: Number(selectedMoldingRecord.quantity ?? 0),
          damage: Number(selectedMoldingRecord.damage ?? 0),
          finalQuantity: Number(selectedMoldingRecord.finalQuantity ?? 0),
          qualityNotes: selectedMoldingRecord.qualityNotes ?? null,
        };
        endpoint = `/api/molding-entry/${selectedMoldingRecord.id}`;
        break;

      // PRODUCT TYPE
      case "product-type":
        if (!selectedMoldingRecord) return;

        payload = {
          productType: selectedMoldingRecord.productType ?? "",
          description: selectedMoldingRecord.description ?? null,
        };

        endpoint = `/api/product-type/${selectedMoldingRecord.id}`;
        break;

      // PRODUCT RATE
      case "product-rate":
        if (!selectedMoldingRecord) return;

        payload = {
          productRate: Number(selectedMoldingRecord.productRate ?? 0),
          description: selectedMoldingRecord.description ?? null,
        };

        endpoint = `/api/product-rate/${selectedMoldingRecord.id}`;
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
      setSelectedMoldingRecord(null);
    } catch (err) {
      console.error("Failed to update record:", err);
      alert(err instanceof Error ? err.message : "Update failed");
    }
  };

  // here is start delete handle for all records....
  const handleDeleteRecord = async () => {
    if (!selectedRecord) return;

    let endpoint = "";

    switch (activeTab) {
      case "production":
        endpoint = `/api/molding-entry/${selectedRecord.id}`;
        break;
      case "product-type":
        endpoint = `/api/product-type/${selectedRecord.id}`;
        break;
      case "product-rate":
        endpoint = `/api/product-rate/${selectedRecord.id}`;
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
      setMoldingSearch(query);
      setMoldingPage(1);
    },
    [setMoldingSearch]
  );

  const handleFilter = useCallback(
    (filters: Record<string, string>) => {
      setMoldingFilters(filters);
    },
    [setMoldingFilters]
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

      {/* Molding Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {moldingStatsConfig.map((stat, index) => (
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
      <div className="animate-fade-in-up" style={{ animationDelay: "0.8s" }}>
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

              <div className="flex items-center space-x-3 w-full lg:w-auto">
                {/* <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200">
                  <Download className="h-4 w-4" />
                  <span>{t("export")}</span>
                </button> */}

                {activeTab === "production" && (
                  <button
                    onClick={() => openAddForm("molding-entry")}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
                  >
                    <Plus className="h-4 w-4" />
                    <span>{t("newEntry")}</span>
                  </button>
                )}
                {activeTab === "product-type" && (
                  <button
                    onClick={() => openAddForm("product-type")}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
                  >
                    <Plus className="h-4 w-4" />
                    <span>{t("addProductType")}</span>
                  </button>
                )}
                {activeTab === "product-rate" && (
                  <button
                    onClick={() => openAddForm("product-rate")}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
                  >
                    <Plus className="h-4 w-4" />
                    <span>{t("addProductRate")}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Optimized Data Table */}
            <div className="overflow-hidden">
              {activeTab === "production" && (
                <OptimizedTable
                  columns={moldingEntryColumns}
                  data={moldingEntries}
                  loading={loading}
                  currentPage={moldingPage}
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

              {activeTab === "product-type" && (
                <OptimizedTable
                  columns={productTypeColumns}
                  data={productTypeData}
                  loading={loading}
                  currentPage={moldingPage}
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
              {activeTab === "product-rate" && (
                <OptimizedTable
                  columns={productRateColumns}
                  data={productRateData}
                  loading={loading}
                  currentPage={moldingPage}
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
                  columns={moldingEmployeeColumns}
                  data={employeePerformanceData}
                  loading={loading}
                  currentPage={moldingPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  pageSize={pageSize}
                  onPageChange={handlePageChange}
                />
              )}
              {activeTab === "remaining" && (
                <OptimizedTable
                  columns={remainingMoldProductsColumns}
                  data={remainingMoldingData}
                  loading={loading}
                  currentPage={moldingPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  pageSize={pageSize}
                  onPageChange={handlePageChange}
                />
              )}
            </div>
          </div>
        </div>

        <ErrorPopup
          open={errorPopupOpen}
          message={errorMessage}
          onClose={() => {
            setIsDeleteOpen(false);
            setErrorPopupOpen(false);
          }}
        />

        {/* this ia view model for view molding information in this model */}
        {isViewOpen && (
          <ViewModal
            open={isViewOpen}
            onClose={() => setIsViewOpen(false)}
            onEdit={() => {
              setIsViewOpen(false);
              setIsEditOpen(true);
            }}
            record={selectedMoldingRecord}
            columns={
              activeTab === "production"
                ? moldingEntryColumns
                : activeTab === "product-type"
                ? productTypeColumns
                : productRateColumns
            }
          />
        )}

        {/* this is edit model for edit the information any perticular molding data */}
        {isEditOpen && (
          <EditModal
            open={isEditOpen}
            record={selectedMoldingRecord}
            columns={
              activeTab === "production"
                ? moldingEntryColumns
                : activeTab === "product-type"
                ? productTypeColumns
                : productRateColumns
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
