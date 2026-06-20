"use client";
import React, { useCallback, useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { KpiCard } from "@/components/KpiCard";
import {
  Users,
  Plus,
  Download,
  DollarSign,
  TrendingUp,
  UserCheck,
  Calendar,
  Package,
} from "lucide-react";
import { useAddForm } from "@/hooks/useAddForm";
import OptimizedTable from "@/components/OptimizedTable";
import { useTranslations } from "next-intl";
import OptimizedSearch from "@/components/OptimizedSearch";
import {
  fetchEmployees,
  fetchEmployeesProduction,
  fetchEmployeesStats,
  type Employee,
  type EmployeeStats,
} from "@/lib/api/employeesApi";
import ViewModal from "@/components/ViewModal";
import EditModal from "@/components/EditModal";
import { DeleteModal } from "@/components/DeleteModal";
import ErrorPopup from "@/components/ErrorPopup";

export default function EmployeesPage() {
  const [activeTab, setActiveTab] = useState("employees");
  const { openAddForm } = useAddForm();
  const t = useTranslations("Employees");

  // API data state
  const [employeesData, setEmployeesData] = useState<Employee[]>([]);
  const [employeesProductionData, setEmployeesProductionData] = useState<any[]>(
    []
  );
  const [stats, setStats] = useState<EmployeeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totals, setTotals] = useState({
    employees: 0,
    tracker: 0,
  });

  // Search and filter state
  const [employeesSearch, setEmployeesSearch] = useState("");
  const [employeesFilters, setEmployeesFilters] = useState({});
  const [selectedEmployeeRecord, setSelectedEmployeeRecord] = useState<
    any | null
  >(null);
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState(false);
  const [errorPopupOpen, setErrorPopupOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  //Pagination states
  const [employeesPage, setEmployeesPage] = useState(1);
  const pageSize = 5;

  const currentTotals = {
    employees: totals.employees,
    production: totals.tracker,
  };

  const totalItems =
    currentTotals[activeTab as keyof typeof currentTotals] || 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  // Reset page when tab changes
  useEffect(() => {
    setEmployeesPage(1);
  }, [activeTab]);

  const handlePageChange = (newPage: number) => {
    setEmployeesPage(newPage);
  };

  // Fetch data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch employees and stats
        const [employeesRes, productionStatsRes, employeesStatsRes] =
          await Promise.all([
            fetchEmployees({
              page: employeesPage,
              limit: pageSize,
              search: employeesSearch,
            }),
            fetchEmployeesProduction({
              page: employeesPage,
              limit: pageSize,
              search: employeesSearch,
            }),
            fetchEmployeesStats(),
          ]);

        // All Employees data
        const employees = Array.isArray(employeesRes)
          ? employeesRes
          : employeesRes?.data || [];

        const production = Array.isArray(productionStatsRes)
          ? productionStatsRes
          : productionStatsRes?.data || [];

        setEmployeesData(employees);
        setEmployeesProductionData(production);

        setStats(employeesStatsRes);

        setTotals({
          employees: employeesRes.total || 0,
          tracker: productionStatsRes.total || 0,
        });
      } catch (err) {
        console.error("Error loading employees data:", err);
        setError(
          "Failed to load employees data. Please check if the database is connected."
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
  }, [employeesPage, employeesSearch]);

  const employeeStats = [
    {
      key: "moldingEmployees",
      label: "Molding Employees",
      value: stats ? stats.moldingEmployees : "0",
      icon: Users,
      color: "primary",
    },
    {
      key: "polishingEmployees",
      label: "Polishing Employees",
      value: stats ? stats.polishingEmployees : "0",
      icon: UserCheck,
      color: "success",
    },
    {
      key: "monthlySalaryEmployees",
      label: "Fixed Salary",
      value: stats ? stats.monthlySalaryEmployees : "0",
      icon: DollarSign,
      color: "accent",
    },
    {
      key: "pieceRateEmployees",
      label: "Per Piece Employees",
      value: stats ? `${stats.pieceRateEmployees}` : "0",
      icon: TrendingUp,
      color: "warning",
    },
  ];

  const tabs = [
    {
      id: "employees",
      name: "Employees",
      icon: Users,
      count: totals.employees,
    },
    {
      id: "production",
      name: "Production Tracker",
      icon: Package,
      count: totals.tracker,
    },
    // {
    //   id: "attendance",
    //   name: "Attendance",
    //   icon: Calendar,
    //   count: totals.attendance,
    // },
    // {
    //   id: "payroll",
    //   name: "Payroll",
    //   icon: DollarSign,
    //   count: totals.payroll,
    // },
  ];

  //  Table colums data here
  const employeeColumns = [
    {
      key: "name",
      label: "Employee Name",
      sortable: true,
      priority: 5,
      render: (row: any) => row.name ?? "—",
    },
    {
      key: "phone",
      label: "Phone",
      sortable: true,
      priority: 5,
      render: (row: any) => row.phone ?? "—",
    },
    {
      key: "email",
      label: "Phone",
      sortable: true,
      priority: 5,
      render: (row: any) => row.email ?? "—",
    },
    {
      key: "department",
      label: "Department",
      sortable: true,
      priority: 4,
      render: (row: any) => row.department ?? "—",
    },
    {
      key: "position",
      label: "Position",
      sortable: true,
      priority: 3,
      render: (row: any) => row.position ?? "—",
    },
    {
      key: "salaryType",
      label: "Salary Type",
      sortable: true,
      priority: 3,
      render: (row: any) => row.salaryType ?? "—",
    },
    {
      key: "monthlySalary",
      label: "Monthly Salary",
      sortable: true,
      priority: 2,
      type: "number",
      render: (row: any) =>
        row.monthlySalary != null ? row.monthlySalary.toString() : "0",
    },
    {
      key: "address",
      label: "Address",
      responsive: true,
      priority: 1,
      render: (row: any) => row.address ?? "—",
    },
    {
      key: "qualityNotes",
      label: "Quality Notes",
      responsive: true,
      priority: 1,
      render: (row: any) => row.qualityNotes ?? "—",
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
  ];

  const productionColumns = [
    {
      key: "name",
      label: "Employee",
      sortable: true,
      priority: 1,
      render: (row: any) => row.name ?? "—",
    },
    {
      key: "department",
      label: "Department",
      sortable: true,
      priority: 2,
      render: (row: any) => row.department ?? "—",
    },
    {
      key: "product",
      label: "Product",
      sortable: true,
      render: (row: any) => row.product ?? "—",
    },
    {
      key: "totalPieces",
      label: "Total Pieces",
      sortable: true,
      type: "number",
      render: (row: any) => (row.totalPieces ?? 0).toString(),
    },
    {
      key: "pricePerPiece",
      label: "Price / Piece",
      sortable: true,
      type: "number",
      render: (row: any) => (row.pricePerPiece ?? 0).toString(),
    },
    {
      key: "totalAmount",
      label: "Total Amount",
      sortable: true,
      type: "number",
      render: (row: any) => (row.totalAmount ?? 0).toString(),
    },
    {
      key: "date",
      label: "Date",
      sortable: true,
      render: (row: any) =>
        row.date
          ? new Date(row.date).toLocaleDateString("en-GB", {
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
    setSelectedEmployeeRecord(record); // your view modal
    setIsViewOpen(true);
  };
  // Edit Material
  const onEditRecord = (record: any) => {
    setSelectedEmployeeRecord(record);
    setIsEditOpen(true);
  };
  const handleEditChange = (key: string, value: any) => {
    setSelectedEmployeeRecord((prev: any) =>
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
      case "employees":
        if (!selectedEmployeeRecord) return;

        payload = {
          name: selectedEmployeeRecord.name,
          phone: selectedEmployeeRecord.phone,
          position: selectedEmployeeRecord.position,
          address: selectedEmployeeRecord.address || null,
          qualityNotes: selectedEmployeeRecord.qualityNotes || null,
        };

        endpoint = `/api/employees/${selectedEmployeeRecord.id}`;
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
      setSelectedEmployeeRecord(null);
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
      case "employees":
        endpoint = `/api/employees/${selectedRecord.id}`;
        break;
      default:
        console.warn("Unknown tab in delete action:", activeTab);
        return;
    }

    try {
      const res = await fetch(endpoint, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Unable to delete the employees.");
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
      setEmployeesSearch(query);
      setEmployeesPage(1);
    },
    [setEmployeesSearch]
  );

  const handleFilter = useCallback(
    (filters: Record<string, string>) => {
      setEmployeesFilters(filters);
    },
    [setEmployeesFilters]
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="animate-fade-in-up">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gradient mb-2">
              {t("title")}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {t("description")}
            </p>
          </div>
          <div className="hidden lg:flex items-center space-x-4">
            <div className="bg-gradient-to-r from-primary-500/10 to-accent-500/10 rounded-2xl p-4 border border-white/20 dark:border-gray-700/50">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-primary-600" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("totalEmp")}
                  {`: ${stats?.totalEmployees}`}
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

      {/* Employee Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {employeeStats.map((stat, index) => (
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
        <div className="card-glass">
          {/* Tab Navigation */}
          <div className="border-b border-white/10 dark:border-gray-700/30">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === tab.id
                        ? "border-primary-500 text-primary-600 dark:text-primary-400"
                        : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <IconComponent className="h-5 w-5" />
                      <span>{t(`tabs.${tab.id}`)}</span>
                      <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full text-xs">
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

                {activeTab === "employees" && (
                  <button
                    onClick={() => {
                      openAddForm("employees");
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
                  >
                    <Plus className="h-4 w-4" />
                    <span>{t("addEmployee")}</span>
                  </button>
                )}
                {/* {activeTab === "attendance" && (
                  <button
                    onClick={() => {
                      openAddForm("attendance");
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
                  >
                    <Plus className="h-4 w-4" />
                    <span>{t("addAttendance")}</span>
                  </button>
                )} */}
              </div>
            </div>
            {/* Optimized Data Table */}
            <div className="overflow-hidden">
              {activeTab === "employees" && (
                <OptimizedTable
                  columns={employeeColumns}
                  data={employeesData}
                  loading={loading}
                  currentPage={employeesPage}
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
              {activeTab === "production" && (
                <OptimizedTable
                  columns={productionColumns}
                  data={employeesProductionData}
                  loading={loading}
                  currentPage={employeesPage}
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
            record={selectedEmployeeRecord}
            columns={employeeColumns}
          />
        )}

        {/* this is edit model for edit the information any perticular molding data */}
        {isEditOpen && (
          <EditModal
            open={isEditOpen}
            record={selectedEmployeeRecord}
            columns={employeeColumns}
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

        {/* This if show deleted errors */}
        <ErrorPopup
          open={errorPopupOpen}
          message={errorMessage}
          onClose={() => {
            setIsDeleteOpen(false);
            setErrorPopupOpen(false);
          }}
        />
      </div>
    </div>
  );
}
