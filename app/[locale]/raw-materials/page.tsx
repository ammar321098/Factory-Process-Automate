"use client";
import React, { useState, useMemo, useCallback, memo, useEffect } from "react";
import {
  Plus,
  Download,
  ExpandIcon,
  CalendarClock,
  Weight,
  Archive,
  Calendar,
  ChevronDownCircleIcon,
  WeightIcon,
  ToolCase,
  SquareStack,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

// Lazy load heavy components
const OptimizedTable = dynamic(() => import("@/components/OptimizedTable"), {
  loading: () => (
    <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-64 rounded-lg"></div>
  ),
});

const OptimizedSearch = dynamic(() => import("@/components/OptimizedSearch"), {
  loading: () => (
    <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-10 rounded-lg w-64"></div>
  ),
});
import {
  fetchMaterials,
  fetchMaterialsStats,
  type Material,
  type MaterialsStats,
} from "@/lib/api/materialsApi";
import { formatNumber, formatPKR } from "@/lib/currency";
import { useAddForm } from "@/hooks/useAddForm";
import { KpiCard } from "@/components/KpiCard";
import { fetchGages, fetchSizes, fetchUnitWeights } from "@/lib/api/sizesApi";
import ViewModal from "@/components/ViewModal";
import EditModal from "@/components/EditModal";
import { DeleteModal } from "@/components/DeleteModal";
import ErrorPopup from "@/components/ErrorPopup";
import { UpdateWeightModal } from "@/components/UpdateMaterialQuantityModal";
import { formatKG } from "@/lib/weight";

// KPI stats configuration - actual values to be fetched from backend
interface MaterialRecord {
  id: string;
  name?: string;
  quantity?: number;
  weight?: number;
  description?: string;
  size?: { id: string; name: string; length?: number; width?: number };
  gage?: { id: string; name: string; gage?: number };
  unitWeight?: { id: string; weight: number };
  createdAt?: string;
  updatedAt?: string;
}

interface SizeRecord {
  id: string;
  name?: string;
  length?: number;
  width?: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface GageRecord {
  id: string;
  name?: string;
  gage?: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

const RawMaterialsPage = memo(() => {
  const [activeTab, setActiveTab] = useState("materials");
  const { openAddForm } = useAddForm();
  const t = useTranslations("RawMaterials");
  const [selectedMaterialRecord, setSelectedMaterialRecord] =
    useState<MaterialRecord | null>(null);
  const [selectedSizeRecord, setSelectedSizeRecord] =
    useState<SizeRecord | null>(null);
  const [selectedGageRecord, setSelectedGageRecord] =
    useState<GageRecord | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
  const [isUpdateWeightModalOpen, setIsUpdateWeightModalOpen] = useState(false);

  // API data state
  const [materialsData, setMaterialsData] = useState<Material[]>([]);
  const [sizesData, setSizesData] = useState<any[]>([]);
  const [gagesData, setGagesData] = useState<any[]>([]);
  const [unitWeightData, setUnitWeightData] = useState<any[]>([]);
  const [remainingData, setRemainingData] = useState<any[]>([]);
  const [stats, setStats] = useState<MaterialsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [materialsSearch, setMaterialsSearch] = useState("");
  const [materialsFilters, setMaterialsFilters] = useState({});
  const [errorPopupOpen, setErrorPopupOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [affectedMaterials, setAffectedMaterials] = useState<string[]>([]);
  const [totals, setTotals] = useState({
    materials: 0,
    sizes: 0,
    gages: 0,
    unitWeight: 0,
  });

  //Pagination states
  const [materialsPage, setMaterialsPage] = useState(1);
  const pageSize = 5;

  const currentTotals = {
    materials: totals.materials,
    sizes: totals.sizes,
    gages: totals.gages,
    "unit-weight": totals.unitWeight,
  };

  const totalItems =
    currentTotals[activeTab as keyof typeof currentTotals] || 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  // Reset page when tab changes
  useEffect(() => {
    setMaterialsPage(1);
  }, [activeTab]);

  const handlePageChange = (newPage: number) => {
    setMaterialsPage(newPage);
  };

  // Fetch data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch both materials and sizes in parallel
        const [
          materialsResponse,
          sizesResponse,
          gagesResponse,
          unitWeightResponse,
          materialStats,
        ] = await Promise.all([
          fetchMaterials({
            page: materialsPage,
            limit: pageSize,
            search: materialsSearch,
          }),
          fetchSizes({
            page: materialsPage,
            limit: pageSize,
            search: materialsSearch,
          }),
          fetchGages({
            page: materialsPage,
            limit: pageSize,
            search: materialsSearch,
          }),
          fetchUnitWeights({
            page: materialsPage,
            limit: pageSize,
            search: materialsSearch,
          }),
          fetchMaterialsStats(),
        ]);

        // All Materials
        const materials = Array.isArray(materialsResponse)
          ? materialsResponse
          : materialsResponse?.data || [];

        // All Sizes
        const sizes = Array.isArray(sizesResponse)
          ? sizesResponse
          : sizesResponse?.data || [];

        // All Gages
        const gages = Array.isArray(gagesResponse)
          ? gagesResponse
          : gagesResponse?.data || [];

        // All Unit weights
        const unitWeights = Array.isArray(unitWeightResponse)
          ? unitWeightResponse
          : unitWeightResponse?.data || [];

        // All Remaining Materials
        const summary = Array.isArray(materialsResponse)
          ? materialsResponse
          : materialsResponse?.summary || [];

        setMaterialsData(materials);
        setSizesData(sizes);
        setGagesData(gages);
        setUnitWeightData(unitWeights);
        setRemainingData(summary);
        setStats(materialStats);

        setTotals({
          materials: materialsResponse.total || 0,
          sizes: sizesResponse.total || 0,
          gages: gagesResponse.total || 0,
          unitWeight: unitWeightResponse.total || 0,
        });
      } catch (err) {
        console.error("Error loading data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load materials/sizes"
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
  }, [materialsPage, materialsSearch]);

  const rawMaterialStatsConfig = [
    {
      key: "totalMaterials",
      label: "Total Materials",
      value: stats ? `${formatNumber(stats.totalMaterials)} Item(s)` : "0 Item",
      icon: SquareStack,
      color: "primary",
    },
    {
      key: "todayMaterials",
      label: "Today's Materials",
      value: stats ? `${formatNumber(stats.todayMaterials)} Item(s)` : "0 Item",
      icon: CalendarClock,
      color: "success",
    },
    {
      key: "totalWeight",
      label: "Total Weight (KG)",
      value: stats ? `${formatKG(stats.totalWeight)}` : "0",
      icon: Weight,
      color: "accent",
    },
    {
      key: "remainingQuantity",
      label: "Remaining Quantity",
      value: stats
        ? `${formatNumber(stats.remainingQuantity)} pc(s)`
        : "0 pc(s)",
      icon: Archive,
      color: "warning",
    },
  ];

  const tabs = [
    {
      id: "materials",
      name: "Raw Materials",
      icon: ToolCase,
      count: totals.materials || 0,
    },
    {
      id: "sizes",
      name: "Standard Sizes",
      icon: ExpandIcon,
      count: totals.sizes || 0,
    },
    {
      id: "gages",
      name: "Standard Gages",
      icon: ChevronDownCircleIcon,
      count: totals.gages || 0,
    },
    {
      id: "unit-weight",
      name: "Standard Unit Weight",
      icon: WeightIcon,
      count: totals.unitWeight || 0,
    },
  ];

  // Memoized table columns with responsive settings
  const materialsColumns = [
    {
      key: "name",
      label: "Material Name",
      sortable: true,
      priority: 1,
    },

    {
      key: "totalQuantity",
      label: "Quantity (pcs)",
      sortable: true,
      render: (row: any) => row.totalQuantity ?? "—",
    },

    {
      key: "weight",
      label: "Weight (Kg)",

      sortable: true,
      render: (row: any) => (row.weight ? `${row.weight.toFixed(2)} kg` : "—"),
    },

    {
      key: "size.name",
      label: "Size (in)",
      sortable: true,
      render: (row: any) => row.size?.name ?? "—",
    },
    {
      key: "gage.name",
      label: "Gage (mm)",
      sortable: true,
      render: (row: any) => row.gage?.name ?? "—",
    },
    {
      key: "unitWeight.weight",
      label: "Unit Weight (gm)",
      sortable: true,
      render: (row: any) =>
        row.unitWeight?.weight ? `${row.unitWeight.weight} g` : "—",
    },
    { key: "description", label: "Description" },
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

  const sizesColumns = [
    { key: "name", label: "Size Name", sortable: true },
    { key: "length", label: "Length (in)", type: "number" },
    { key: "width", label: "Width (in)", type: "number" },
    { key: "description", label: "Description" },
  ];

  const gagesColumns = [
    { key: "name", label: "Gage Name", sortable: true },
    { key: "gage", label: "Depth (mm)", type: "number" },
    { key: "description", label: "Description" },
  ];
  const weightsColumns = [
    {
      key: "size.name",
      label: "Size (in)",
      sortable: true,
      render: (row: any) => row.size?.name ?? "—",
    },
    {
      key: "gage.name",
      label: "Gage (mm)",
      sortable: true,
      render: (row: any) => row.gage?.name ?? "—",
    },
    { key: "weight", label: "Weight (gm)" },
    { key: "description", label: "Description" },
  ];

  // // Memoized filter options
  // const filterOptions = [
  //   {
  //     key: "category",
  //     label: "Category",
  //     options: [
  //       { value: "Metal", label: "Metal" },
  //       { value: "Plastic", label: "Plastic" },
  //       { value: "Rubber", label: "Rubber" },
  //       { value: "Wood", label: "Wood" },
  //       { value: "Chemical", label: "Chemical" },
  //     ],
  //   },
  //   {
  //     key: "status",
  //     label: "Status",
  //     options: [
  //       { value: "Active", label: "Active" },
  //       { value: "Low Stock", label: "Low Stock" },
  //       { value: "Out of Stock", label: "Out of Stock" },
  //     ],
  //   },
  // ];

  // Optimized handlers
  const handleSearch = useCallback(
    (query: string) => {
      setMaterialsSearch(query);
      setMaterialsPage(1);
    },
    [setMaterialsSearch]
  );

  // const handleFilter = useCallback(
  //   (filters: Record<string, string>) => {
  //     setMaterialsFilters(filters);
  //   },
  //   [setMaterialsFilters]
  // );

  // View Material
  const onViewMaterial = (material: any) => {
    setSelectedMaterialRecord(material); // your view modal
    setIsViewOpen(true);
  };

  // Edit Material
  const onEditMaterial = (material: MaterialRecord) => {
    setSelectedMaterialRecord(material);
    setIsEditOpen(true);
  };

  const onEditSize = (size: SizeRecord) => {
    setSelectedSizeRecord(size);
    setIsEditOpen(true);
  };

  const onEditGage = (gage: GageRecord) => {
    setSelectedGageRecord(gage);
    setIsEditOpen(true);
  };

  const onUpdateQuantity = (material: any) => {
    setSelectedMaterialRecord(material);
    setIsUpdateWeightModalOpen(true);
  };

  //  Delete Material
  const onDeleteMaterial = (record: any) => {
    setSelectedRecord(record);
    setIsDeleteOpen(true);
  };

  const handleEditChange = (key: string, value: any) => {
    switch (activeTab) {
      case "sizes":
        setSelectedSizeRecord((prev) =>
          prev ? { ...prev, [key]: value } : null
        );
        break;

      case "materials":
        setSelectedMaterialRecord((prev) =>
          prev ? { ...prev, [key]: value } : null
        );
        break;

      case "gages":
        setSelectedGageRecord((prev) =>
          prev ? { ...prev, [key]: value } : null
        );
        break;
    }
  };

  // here is functions that used to update material record
  const handleUpdateRecord = async () => {
    let payload: any = {};
    let endpoint = "";

    switch (activeTab) {
      case "materials":
        if (!selectedMaterialRecord) return;

        payload = {
          name: selectedMaterialRecord.name ?? "",
          description: selectedMaterialRecord.description ?? "",
        };
        endpoint = `/api/raw-material/${selectedMaterialRecord.id}`;
        break;

      case "sizes":
        if (!selectedSizeRecord) return; // guard null
        payload = {
          name: selectedSizeRecord.name ?? "",
          length:
            selectedSizeRecord.length !== undefined
              ? Number(selectedSizeRecord.length)
              : null,
          width:
            selectedSizeRecord.width !== undefined
              ? Number(selectedSizeRecord.width)
              : null,
          description: selectedSizeRecord.description ?? null,
        };
        endpoint = `/api/sizes/${selectedSizeRecord.id}`;
        break;

      case "gages":
        if (!selectedGageRecord) return; // guard against null

        payload = {
          name: selectedGageRecord.name ?? "",
          gage: selectedGageRecord.gage ?? null,
          description: selectedGageRecord.description ?? null,
        };

        endpoint = `/api/gages/${selectedGageRecord.id}`;
        break;
    }

    try {
      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // handle empty response gracefully
      let data = null;
      if (res.headers.get("content-length") !== "0") {
        data = await res.json().catch(() => null);
      }


      if (!res.ok) {
        throw new Error(data?.error || "Update failed");
      }

      // Refresh table and reset modals
      window.dispatchEvent(new Event("data-updated"));
      setIsEditOpen(false);
      setSelectedMaterialRecord(null);
      setSelectedSizeRecord(null);
      setSelectedGageRecord(null);
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
      case "materials":
        endpoint = `/api/raw-material/${selectedRecord.id}`;
        break;
      case "sizes":
        endpoint = `/api/sizes/${selectedRecord.id}`;
        break;
      case "gages":
        endpoint = `/api/gages/${selectedRecord.id}`;
        break;
      case "unit-weight":
        endpoint = `/api/unit-weight/${selectedRecord.id}`;
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

        if (data.materialsInUse) {
          setAffectedMaterials(data.materialsInUse);
        } else {
          setAffectedMaterials([]);
        }

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

  const onUpdateMaterialWeight = async (
    quantity: number,
    totalWeight: number,
    description: string
  ) => {
    if (!selectedMaterialRecord) return;

    try {
      const res = await fetch(
        `/api/raw-material/${selectedMaterialRecord.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            totalQuantity: quantity,
            weight: totalWeight,
            description,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to update weight");

      window.dispatchEvent(new Event("data-updated"));
      setSelectedMaterialRecord(null);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Update failed");
    }
  };

  return (
    <div className="space-y-6 max-w-full">
      {/* Page Header */}
      <div className="animate-fade-in-up">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 space-y-4 lg:space-y-0">
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
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Raw Material Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        {rawMaterialStatsConfig.map((stat, index) => (
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
            {/* Optimized Toolbar */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 space-y-4 lg:space-y-0">
              <div className="w-full lg:w-auto">
                <OptimizedSearch
                  placeholder={t("search")}
                  onSearch={handleSearch}
                  // onFilter={handleFilter}
                  // filters={filterOptions}
                  loading={loading}
                />
              </div>

              <div className="flex items-center space-x-3 w-full lg:w-auto">
                {/* <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200">
                  <Download className="h-4 w-4" />
                  <span>{t("export")}</span>
                </button> */}

                {activeTab === "materials" && (
                  <button
                    onClick={() => openAddForm("raw-material")}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
                  >
                    <Plus className="h-4 w-4" />
                    <span>{t("addMaterial")}</span>
                  </button>
                )}

                {activeTab === "sizes" && (
                  <button
                    onClick={() => openAddForm("sizes")}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
                  >
                    <Plus className="h-4 w-4" />
                    <span>{t("addSize")}</span>
                  </button>
                )}

                {activeTab === "gages" && (
                  <button
                    onClick={() => openAddForm("gages")}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
                  >
                    <Plus className="h-4 w-4" />
                    <span>{t("addGage")}</span>
                  </button>
                )}

                {activeTab === "unit-weight" && (
                  <button
                    onClick={() => openAddForm("unit-weight")}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
                  >
                    <Plus className="h-4 w-4" />
                    <span>{t("addUnitWeight")}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Optimized Data Table */}
            <div className="overflow-hidden">
              {activeTab === "materials" && (
                <OptimizedTable
                  columns={materialsColumns}
                  data={materialsData}
                  loading={loading}
                  currentPage={materialsPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  pageSize={pageSize}
                  onPageChange={handlePageChange}
                  actions={(item) => (
                    <div className="flex items-center gap-3 text-sm">
                      <button
                        onClick={() => onViewMaterial(item)}
                        className="text-blue-600 hover:underline"
                      >
                        View
                      </button>
                      <button
                        onClick={() => onEditMaterial(item)}
                        className="text-yellow-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onUpdateQuantity(item)}
                        className="text-purple-600 hover:underline"
                      >
                        Update Qty
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
              {activeTab === "sizes" && (
                <OptimizedTable
                  columns={sizesColumns}
                  data={sizesData}
                  loading={loading}
                  currentPage={materialsPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  pageSize={pageSize}
                  onPageChange={handlePageChange}
                  actions={(item) => (
                    <div className="flex items-center gap-3 text-sm">
                      <button
                        onClick={() => onViewMaterial(item)}
                        className="text-blue-600 hover:underline"
                      >
                        View
                      </button>

                      <button
                        onClick={() => onEditSize(item)}
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
              {activeTab === "gages" && (
                <OptimizedTable
                  columns={gagesColumns}
                  data={gagesData}
                  loading={loading}
                  currentPage={materialsPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  pageSize={pageSize}
                  onPageChange={handlePageChange}
                  actions={(item) => (
                    <div className="flex items-center gap-3 text-sm">
                      <button
                        onClick={() => onViewMaterial(item)}
                        className="text-blue-600 hover:underline"
                      >
                        View
                      </button>
                      <button
                        onClick={() => onEditGage(item)}
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
              {activeTab === "unit-weight" && (
                <OptimizedTable
                  columns={weightsColumns}
                  data={unitWeightData}
                  loading={loading}
                  currentPage={materialsPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  pageSize={pageSize}
                  onPageChange={handlePageChange}
                  actions={(item) => (
                    <div className="flex items-center gap-3 text-sm">
                      <button
                        onClick={() => onViewMaterial(item)}
                        className="text-blue-600 hover:underline"
                      >
                        View
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
            </div>
          </div>
        </div>

        <ErrorPopup
          open={errorPopupOpen}
          message={errorMessage}
          materials={affectedMaterials}
          onClose={() => {
            setIsDeleteOpen(false);
            setErrorPopupOpen(false);
          }}
        />

        {/* this ia view model for view meterial information in this model */}
        {isViewOpen && (
          <ViewModal
            open={isViewOpen}
            onClose={() => setIsViewOpen(false)}
            onEdit={() => {
              setIsViewOpen(false);
              setIsEditOpen(true);
            }}
            record={selectedMaterialRecord}
            columns={
              activeTab === "materials"
                ? materialsColumns
                : activeTab === "sizes"
                ? sizesColumns
                : activeTab === "gages"
                ? gagesColumns
                : weightsColumns
            }
          />
        )}

        {/* this is edit model for edit the information any perticular material */}
        {isEditOpen && (
          <EditModal
            open={isEditOpen}
            record={
              activeTab === "sizes"
                ? selectedSizeRecord ?? {}
                : activeTab === "gages"
                ? selectedGageRecord ?? {}
                : selectedMaterialRecord ?? {}
            }
            columns={
              activeTab === "materials"
                ? materialsColumns
                : activeTab === "sizes"
                ? sizesColumns
                : activeTab === "gages"
                ? gagesColumns
                : weightsColumns
            }
            onClose={() => setIsEditOpen(false)}
            onSave={handleUpdateRecord}
            onChange={handleEditChange}
          />
        )}

        {isUpdateWeightModalOpen && selectedMaterialRecord && (
          <UpdateWeightModal
            open={isUpdateWeightModalOpen}
            currentWeight={selectedMaterialRecord.weight || 0}
            currentQuantity={selectedMaterialRecord.quantity || 0}
            unitWeight={selectedMaterialRecord.unitWeight?.weight || 1} // fallback 1
            onClose={() => setIsUpdateWeightModalOpen(false)}
            onUpdate={onUpdateMaterialWeight}
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
});

RawMaterialsPage.displayName = "RawMaterialsPage";

export default RawMaterialsPage;
