"use client";

import React, { useState } from "react";
import {
  Plus,
  Package,
  Factory,
  Users,
  Warehouse,
  Receipt,
  UserCheck,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { useAddForm } from "@/hooks/useAddForm";
import { FormType } from "@/components/AddFormPopup";
import { useLocale, useTranslations } from "next-intl";


const quickAddOptions = [
  {
    type: "raw-material" as FormType,
    label: "Add Material",
    icon: Package,
    description: "Add raw material to inventory",
    color: "primary",
  },
  {
    type: "molding-entry" as FormType,
    label: "New Molding Entry",
    icon: Factory,
    description: "Create molding production entry",
    color: "success",
  },
  {
    type: "polishing" as FormType,
    label: "New Polishing Entry",
    icon: Sparkles,
    description: "Create molding production entry",
    color: "accent",
  },
  {
    type: "packing" as FormType,
    label: "New Packing Entry",
    icon: Package,
    description: "Create a new polished packing entry",
    color: "primary",
  },
  {
    type: "stock" as FormType,
    label: "Add New Stock",
    icon: Warehouse,
    description: "Add a new stock for management purpose",
    color: "success",
  },
  {
    type: "employee" as FormType,
    label: "Add Employee",
    icon: Users,
    description: "Add a new employee to the system",
    color: "accent",
  },
  {
    type: "customers" as FormType,
    label: "New Customer",
    icon: UserCheck,
    description: "Create a new customer",
    color: "primary",
  },
  {
    type: "expenses" as FormType,
    label: "Add Expense",
    icon: Receipt,
    description: "Add a new expense to the system",
    color: "danger",
  },
];

export function QuickAddMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { openAddForm } = useAddForm();

    const t = useTranslations("quick");

  const handleAddClick = (formType: FormType, label: string) => {
    openAddForm(formType, label);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Quick Add Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-500 shadow-lg hover:shadow-xl"
      >
        <Plus className="h-5 w-5" />
        <span className="font-medium">{t("quickAd")}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 animate-fade-in-up">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t("quickForm")}
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {quickAddOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <button
                    key={option.type}
                    onClick={() => handleAddClick(option.type, option.label)}
                    className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 group"
                  >
                    <div
                      className={`p-2 rounded-lg bg-${option.color}-100 dark:bg-${option.color}-900/30 group-hover:bg-${option.color}-200 dark:group-hover:bg-${option.color}-800/50 transition-colors duration-300`}
                    >
                      <IconComponent
                        className={`h-5 w-5 text-${option.color}-600 dark:text-${option.color}-400`}
                      />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                        {option.label}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {option.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}

export default QuickAddMenu;
