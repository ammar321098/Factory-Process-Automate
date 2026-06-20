"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Plus,
  Package,
  Factory,
  Users,
  DollarSign,
  BarChart3,
  Warehouse,
  Receipt,
  UserCheck,
  Save,
  AlertCircle,
  Truck,
  Sparkles,
  ToolCase,
  ExpandIcon,
  ChevronDownCircleIcon,
  WeightIcon,
  Package2Icon,
  TagIcon,
} from "lucide-react";
import { useAddForm } from "@/hooks/useAddForm";
import { submitForm } from "@/lib/api/submitForm";
import { useTranslations } from "next-intl";

export type FormType =
  | "raw-material"
  | "sizes"
  | "gages"
  | "unit-weight"
  | "molding-entry"
  | "product-type"
  | "product-rate"
  | "polishing"
  | "polishing-rate"
  | "packing"
  | "employees";
interface AddFormPopupProps {
  // Props are now handled by context
}

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface Field {
  name: string; // key in formData
  label: string; // label shown in UI
  type:
    | "text"
    | "number"
    | "email"
    | "tel"
    | "textarea"
    | "select"
    | "date"
    | "datetime-local"; // all supported input types
  required?: boolean;
  options?: (string | SelectOption)[]; // for select dropdowns
  step?: number;
  min?: number;
  disabled?: boolean;
  default?: string | number;
}

export interface FormConfigEntry {
  title: string;
  icon: React.ElementType; // any lucide-react icon
  description: string;
  fields: Field[];
}

export function AddFormPopup({}: AddFormPopupProps) {
  const { isOpen, formType, title, closeAddForm } = useAddForm();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sizes, setSizes] = useState<{ id: number; name: string }[]>([]);
  const [gages, setGages] = useState<{ id: number; name: string }[]>([]);
  const t = useTranslations("forms");
  const [pieceEmployees, setPieceEmployees] = useState<
    { id: number; name: string }[]
  >([]);
  const [moldingEmployees, setMoldingEmployees] = useState<
    { id: number; name: string; salaryType: string }[]
  >([]);
  const [availMaterial, setAvailMaterial] = useState<
    { id: number; name: string }[]
  >([]);
  const [products, setProducts] = useState<
    { id: number; productType: string }[]
  >([]);
  const [availMolding, setAvailMolding] = useState<
    { id: number; product_types: { id: number; productType: string } }[]
  >([]);
  const [apiError, setApiError] = useState<string | null>(null);
  const { openAddForm } = useAddForm();
  const [showDiscardPopup, setShowDiscardPopup] = useState(false);
  const [formsData, setFormsData] = useState<
    Record<string, Record<string, any>>
  >({});

  const formConfig: Record<FormType, FormConfigEntry> = {
    "raw-material": {
      title: "Add Raw Material",
      icon: ToolCase,
      description: "Add a new raw material to your inventory.",
      fields: [
        { name: "name", label: "Material Name", type: "text", required: true },

        {
          name: "sizeId",
          label: "Standard Sizes (in)",
          type: "select",
          required: true,
          options: sizes.map((s) => ({ value: s.id, label: s.name })),
        },
        {
          name: "gageId",
          label: "Standard Gages (in)",
          type: "select",
          required: true,
          options: gages.map((g) => ({ value: g.id, label: g.name })),
        },
        {
          name: "unitWeight",
          label: "Standard Unit Weight (gm)",
          type: "number",
          required: true,
          disabled: true,
        },
        {
          name: "weight",
          label: "Weight (kg)",
          type: "number",
          required: true,
          step: 0.1,
          min: 0,
        },
        {
          name: "totalQuantity",
          label: "Total Quantity (pcs)",
          type: "number",
          required: true,
          disabled: true,
          step: 0,
          min: 0,
        },
        {
          name: "description",
          label: "Description",
          type: "textarea",
          required: false,
        },
      ],
    },
    sizes: {
      title: "Add New Size",
      icon: ExpandIcon,
      description: "Add a new size to your material.",
      fields: [
        { name: "name", label: "Size Name", type: "text", required: true },
        {
          name: "length",
          label: "Total Length (in)",
          type: "number",
          required: true,
          step: 0.1,
          min: 0,
        },
        {
          name: "width",
          label: "Total Width (in)",
          type: "number",
          required: true,
          step: 0.1,
          min: 0,
        },
        {
          name: "description",
          label: "Description",
          type: "textarea",
          required: false,
        },
      ],
    },
    gages: {
      title: "Add New Gage",
      icon: ChevronDownCircleIcon,
      description: "Add a new gage to your material.",
      fields: [
        { name: "name", label: "Gage Name", type: "text", required: true },
        {
          name: "gage",
          label: "Standard Gage (mm)",
          type: "number",
          required: true,
          step: 0.1,
          min: 0,
        },
        {
          name: "description",
          label: "Description",
          type: "textarea",
          required: false,
        },
      ],
    },
    "unit-weight": {
      title: "Add Unit Weight",
      icon: WeightIcon,
      description: "Add a new unit weight to your material.",
      fields: [
        {
          name: "sizeId",
          label: "Standard Sizes",
          type: "select",
          required: true,
          options: sizes.map((s) => ({ value: s.id, label: s.name })),
        },
        {
          name: "gageId",
          label: "Standard Gages",
          type: "select",
          required: true,
          options: gages.map((g) => ({ value: g.id, label: g.name })),
        },
        {
          name: "weight",
          label: "Total Weight (g)",
          type: "number",
          required: true,
          step: 0.1,
          min: 0,
        },
        {
          name: "description",
          label: "Description",
          type: "textarea",
          required: false,
        },
      ],
    },
    "molding-entry": {
      title: "New Molding Entry",
      icon: Factory,
      description: "Create a new molding production entry.",
      fields: [
        {
          name: "productId",
          label: "Material Name",
          type: "select",
          required: true,
          options: availMaterial.map((mat) => ({
            value: mat.id,
            label: mat.name,
          })),
        },
        {
          name: "employeeId",
          label: "Operator (Employee)",
          type: "select",
          required: true,
          options: moldingEmployees.map((emp) => ({
            value: emp.id,
            label: `${emp.name} - (${emp.salaryType})`,
          })),
        },
        {
          name: "productTypeId",
          label: "Product Name",
          type: "select",
          required: true,
          options: products.map((emp) => ({
            value: emp.id,
            label: emp.productType,
          })),
        },
        {
          name: "productRate",
          label: "Product Rate",
          type: "text",
          disabled: true,
          required: true,
        },
        {
          name: "quantity",
          label: "Quantity",
          type: "number",
          required: true,
          step: 0,
          min: 0,
        },
        {
          name: "totalEarn",
          label: "Total Earning",
          type: "text",
          disabled: true,
          required: true,
        },

        {
          name: "damage",
          label: "Damage Pc(s)",
          type: "number",
          required: false,
          step: 0,
          min: 0,
        },
        {
          name: "finalQuantity",
          label: "Final Quantity",
          type: "number",
          required: true,
          disabled: true,
          step: 0,
          min: 0,
        },
        {
          name: "qualityNotes",
          label: "Quality Notes",
          type: "textarea",
          required: false,
        },
      ],
    },
    "product-type": {
      title: "Add New Product Name",
      icon: Package2Icon,
      description: "Add a new product for molding.",
      fields: [
        {
          name: "productType",
          label: "Product Name",
          type: "text",
          required: true,
        },
        {
          name: "description",
          label: "Description",
          type: "textarea",
          required: false,
        },
      ],
    },
    "product-rate": {
      title: "Add Product Rate For Employee",
      icon: TagIcon,
      description: "Add a new rate per product for per piece employee.",
      fields: [
        {
          name: "productTypeId",
          label: "Product Name",
          type: "select",
          required: true,
          options: products.map((emp) => ({
            value: emp.id,
            label: emp.productType,
          })),
        },
        {
          name: "employeeId",
          label: "Employee",
          type: "select",
          required: true,
          options: pieceEmployees.map((emp) => ({
            value: emp.id,
            label: emp.name,
          })),
        },
        {
          name: "rate",
          label: "Rate Per Product",
          type: "number",
          required: true,
          step: 0,
          min: 0,
        },
        {
          name: "description",
          label: "Description",
          type: "textarea",
          required: false,
        },
      ],
    },
    polishing: {
      title: "New Polishing Entry",
      icon: Sparkles,
      description: "Create a new molding production entry",
      fields: [
        {
          name: "productId",
          label: "Product Name",
          type: "select",
          required: true,
          options: availMolding.map((mold) => ({
            value: mold.product_types.id,
            label: mold.product_types.productType,
          })),
        },
        {
          name: "employeeId",
          label: "Operator (Employee)",
          type: "select",
          required: true,
          options: moldingEmployees.map((emp) => ({
            value: emp.id,
            label: `${emp.name} - (${emp.salaryType})`,
          })),
        },

        {
          name: "polishingRate",
          label: "Polishing Rate",
          type: "text",
          disabled: true,
          required: true,
        },
        {
          name: "quantity",
          label: "Quantity",
          type: "number",
          required: true,
          step: 0,
          min: 0,
        },
        {
          name: "totalEarn",
          label: "Total Earning",
          type: "text",
          disabled: true,
          required: true,
        },
        {
          name: "qualityNotes",
          label: "Quality Notes",
          type: "textarea",
          required: false,
        },
      ],
    },
    "polishing-rate": {
      title: "Add Polishing Rate For Employee",
      icon: TagIcon,
      description:
        "Add a new rate per polishing product for per piece employee.",
      fields: [
        {
          name: "productId",
          label: "Product Name",
          type: "select",
          required: true,
          options: availMolding.map((mold) => ({
            value: mold.product_types.id,
            label: mold.product_types.productType,
          })),
        },
        {
          name: "employeeId",
          label: "Employee",
          type: "select",
          required: true,
          options: pieceEmployees.map((emp) => ({
            value: emp.id,
            label: emp.name,
          })),
        },
        {
          name: "rate",
          label: "Rate Per Product",
          type: "number",
          required: true,
          step: 0,
          min: 0,
        },
        {
          name: "description",
          label: "Description",
          type: "textarea",
          required: false,
        },
      ],
    },
    packing: {
      title: "New Packing Entry",
      icon: Package,
      description: "Create a new polished packing entry",
      fields: [
        {
          name: "productId",
          label: "Product Name",
          type: "select",
          required: true,
          options: availMolding.map((mold) => ({
            value: mold.product_types.id,
            label: mold.product_types.productType,
          })),
        },
        {
          name: "quantity",
          label: "Quantity",
          type: "number",
          required: true,
          step: 0,
          min: 1,
        },
        {
          name: "qualityNotes",
          label: "Quality Notes",
          type: "textarea",
          required: false,
        },
      ],
    },
    employees: {
      title: "Add Employee",
      icon: Users,
      description: "Add a new employee to the system",
      fields: [
        {
          name: "name",
          label: "Employee Name",
          type: "text",
          required: true,
        },
        { name: "email", label: "Email", type: "email", required: false },
        { name: "phone", label: "Phone", type: "tel", required: true },
        {
          name: "department",
          label: "Department",
          type: "select",
          required: true,
          options: ["Molding", "Polishing"],
        },
        { name: "position", label: "Position", type: "text", required: false },
        {
          name: "salaryType",
          label: "Salary Type",
          type: "select",
          required: true,
          options: [
            { label: "Monthly", value: "MONTHLY" },
            { label: "Per Piece", value: "PIECE" },
          ],
        },
        {
          name: "monthlySalary",
          label: "Monthly Salary",
          type: "number",
          required: false,
          step: 0.01,
        },
        // {
        //   name: "status",
        //   label: "Employee Status",
        //   type: "select",
        //   required: false,
        //   options: [
        //     { label: "Active", value: "ACTIVE" },
        //     { label: "Inactive", value: "INACTIVE" },
        //   ],
        // },
        {
          name: "address",
          label: "Address",
          type: "textarea",
          required: false,
        },
        {
          name: "qualityNotes",
          label: "Quality Notes",
          type: "textarea",
          required: false,
        },
      ],
    },
  };

  // if data have not value
  const hasUnsavedChanges = () => {
    return Object.keys(formData).some(
      (key) => formData[key] !== "" && formData[key] !== null
    );
  };

  // Select fields that should show "Add New" button
  const addButtonAllowedFields = [
    "sizeId",
    "gageId",
    "unitWeight",
    "productTypeId",
    "employeeId",
    "productRate",
    "polishingRate",
  ];

  // handle close or cancel form
  const handleClose = () => {
    if (hasUnsavedChanges()) {
      setShowDiscardPopup(true); // Show confirmation
    } else {
      closeAddForm(); // No changes, just close
    }
  };

  // In your component
  useEffect(() => {
    if (apiError) {
      const timer = setTimeout(() => {
        // Clear the error after 2 seconds
        setApiError(""); // or setApiError(null) depending on your state
      }, 5000);

      return () => clearTimeout(timer); // Cleanup if apiError changes or component unmounts
    }
  }, [apiError]);

  const config = formType ? formConfig[formType] : null;
  const IconComponent = config?.icon || Plus;

  useEffect(() => {
    if (formType === "unit-weight" || formType === "raw-material") {
      fetch("/api/sizes")
        .then((res) => res.json())
        .then((resData) => setSizes(resData.data || []));

      fetch("/api/gages")
        .then((res) => res.json())
        .then((resData) => setGages(resData.data || []));
    }
    if (formType === "product-rate" || formType === "molding-entry") {
      fetch("/api/employees/molding/per-piece")
        .then((res) => res.json())
        .then((resData) => setPieceEmployees(resData.data || []));

      fetch("/api/raw-material/all")
        .then((res) => res.json())
        .then((resData) => setAvailMaterial(resData.data || []));

      fetch("/api/employees/molding")
        .then((res) => res.json())
        .then((resData) => setMoldingEmployees(resData.data || []));

      fetch("/api/product-type")
        .then((res) => res.json())
        .then((resData) => setProducts(resData.data || []));
    }
    if (formType === "polishing" || formType === "polishing-rate") {
      fetch("/api/remaining-moldings")
        .then((res) => res.json())
        .then((resData) => setAvailMolding(resData.data || []));

      fetch("/api/employees/polishing")
        .then((res) => res.json())
        .then((resData) => setMoldingEmployees(resData.data || []));

      fetch("/api/employees/polishing/per-piece")
        .then((res) => res.json())
        .then((resData) => setPieceEmployees(resData.data || []));
    }
    if (formType === "packing") {
      fetch("/api/remaining-polishing")
        .then((res) => res.json())
        .then((resData) => {
          setAvailMolding(resData.data || []);
        });
    }
  }, [formType]);

  useEffect(() => {
    if (isOpen && formType) {
      // Initialize formData with default values for the current form type
      setFormData(formsData[formType] || {});
      setErrors({});
    }
  }, [isOpen, formType, formsData]);

  const handleInputChange = async (name: string, value: any) => {
    if (!formType) return;

    // Clone current form data
    const updated: any = { ...formData, [name]: value };

    // Save changed field first
    const updatedFormData: any = {
      ...(formsData[formType] || {}),
      [name]: value,
    };

    // --- Determine selected IDs ---
    const productTypeId =
      name === "productTypeId" ? Number(value) : Number(updated.productTypeId);
    const productId =
      name === "productId" ? Number(value) : Number(updated.productId);
    const employeeId =
      name === "employeeId" ? Number(value) : Number(updated.employeeId);

    let salaryType = "PIECE";
    let rate = 0;
    let polishingRate = 0;

    // --- Fetch product rate ---
    if (productTypeId > 0 && employeeId > 0) {
      try {
        const res = await fetch(
          `/api/product-rate/check?productTypeId=${productTypeId}&employeeId=${employeeId}`
        );

        if (res.ok) {
          const data = await res.json();
          rate = Number(data.productRate ?? 0);
          salaryType = data.salaryType ?? "PIECE";

          updated.productRate = data.productRate;
          updatedFormData.productRate = data.productRate;
        } else {
          updated.productRate = "";
          updatedFormData.productRate = "";
        }
      } catch {
        updated.productRate = "";
        updatedFormData.productRate = "";
      }
    }

    // --- Fetch polishing rate ---
    if (productId > 0 && employeeId > 0) {
      try {
        const res = await fetch(
          `/api/polishing-rate/check?productId=${productId}&employeeId=${employeeId}`
        );

        if (res.ok) {
          const data = await res.json();
          polishingRate = Number(data.polishingRate ?? 0);
          salaryType = data.salaryType ?? "PIECE";

          updated.polishingRate = data.polishingRate;
          updatedFormData.polishingRate = data.polishingRate;
        } else {
          updated.polishingRate = "";
          updatedFormData.polishingRate = "";
        }
      } catch {
        updated.polishingRate = "";
        updatedFormData.polishingRate = "";
      }
    }

    // --- Auto calculate total earning ---
    const quantity = Number(
      name === "quantity" ? value : updated.quantity || 0
    );
    const damage = Number(name === "damage" ? value : updated.damage || 0);

    updated.finalQuantity = Math.max(quantity - damage, 0);
    updatedFormData.finalQuantity = updated.finalQuantity;

    const fQuantity = Number(updated.finalQuantity || 0);

    if (salaryType === "MONTHLY") {
      updated.totalEarn = "0";
      updatedFormData.totalEarn = "0";
    } else {
      const totalRate = (rate || 0) + (polishingRate || 0);
      updated.totalEarn = (totalRate * fQuantity).toString();
      updatedFormData.totalEarn = updated.totalEarn;
    }

    // --- Determine size + gage ---
    const sizeId = name === "sizeId" ? Number(value) : Number(updated.sizeId);
    const gageId = name === "gageId" ? Number(value) : Number(updated.gageId);

    // --- Fetch unit weight ---
    if (sizeId > 0 && gageId > 0) {
      try {
        const res = await fetch(
          `/api/unit-weight?sizeId=${sizeId}&gageId=${gageId}`
        );

        if (res.ok) {
          const data = await res.json();
          updated.unitWeight = Number(data?.data.weight || 0);
          updatedFormData.unitWeight = updated.unitWeight;
        } else {
          updated.unitWeight = 0;
          updatedFormData.unitWeight = 0;
        }
      } catch {
        updated.unitWeight = 0;
        updatedFormData.unitWeight = 0;
      }
    } else {
      updated.unitWeight = 0;
      updatedFormData.unitWeight = 0;
    }

    // --- Calculate total quantity ---
    const weightNum = Number(updated.weight || 0);
    const unitWeightNum = Number(updated.unitWeight || 0);

    updated.totalQuantity =
      unitWeightNum > 0 && weightNum > 0
        ? Math.floor(weightNum / (unitWeightNum / 1000))
        : 0;

    updatedFormData.totalQuantity = updated.totalQuantity;

    // --- Update STATE ---
    setFormData(updated);
    setFormsData((prev: any) => ({
      ...prev,
      [formType]: updatedFormData,
    }));
  };

  const validateForm = () => {
    if (!config) return false;

    const newErrors: Record<string, string> = {};

    config.fields.forEach((field) => {
      if (
        field.required &&
        (!formData[field.name] || formData[field.name] === "")
      ) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formType) return;

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      const response = await submitForm(formType, formData);

      if (response.success) {
        closeAddForm(); // or show toast success
        setFormsData((prev) => ({
          ...prev,
          [formType ?? "default"]: {}, // assuming formType is defined
        }));
        setFormData({});
        window.dispatchEvent(new Event("data-updated")); // Trigger global refresh event
      } else {
        console.error(`Failed to submit ${formType}:`, response.error);
        setApiError(response.error ?? "An unknown error occurred");
        return;
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      setApiError(error.message ?? "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !config) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={closeAddForm}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 animate-fade-in-up">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl">
                <IconComponent className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t(`${formType}.title`)}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t(`${formType}.description`)}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid items-end file:grid-cols-1 md:grid-cols-2 gap-6">
              {config.fields.map((field) => {
                if (formType === "employees") {
                  const salaryType = formData.salaryType;

                  // Hide non-relevant salary fields based on selection
                  if (["monthlySalary", "perPieceRate"].includes(field.name)) {
                    if (
                      field.name === "monthlySalary" &&
                      salaryType !== "MONTHLY"
                    ) {
                      return null; // Don't render irrelevant salary field
                    }
                  }
                }
                return (
                  <div
                    key={field.name}
                    className={field.type === "textarea" ? "md:col-span-2" : ""}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t(`${formType}.fields.${field.name}`)}
                        {field.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </label>

                      {addButtonAllowedFields.includes(field.name) && (
                        <div className="flex items-center justify-between mt-1">
                          <button
                            type="button"
                            onClick={() => {
                              const fieldToFormMap: Record<string, FormType> = {
                                sizeId: "sizes",
                                gageId: "gages",
                                unitWeight: "unit-weight",
                                employeeId: "employees",
                                productTypeId: "product-type",
                                productRate: "product-rate",
                                polishingRate: "polishing-rate",
                              };
                              const targetForm = fieldToFormMap[field.name];
                              if (targetForm) openAddForm(targetForm); // now stacks instead of replaces
                            }}
                            className="flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-primary-400 to-primary-600 text-white text-sm rounded-full hover:from-primary-700 hover:to-primary-700 transition-all duration-300"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Add New</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {field.type === "textarea" ? (
                      <textarea
                        name={field.name}
                        value={formData[field.name] || ""}
                        maxLength={100}
                        onChange={(e) =>
                          handleInputChange(field.name, e.target.value)
                        }
                        className={`w-full px-4 py-3 border rounded-xl transition-all duration-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          errors[field.name]
                            ? "border-red-300 dark:border-red-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        }`}
                        rows={3}
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                      />
                    ) : field.type === "select" ? (
                      <select
                        name={field.name}
                        value={formData[field.name] || ""}
                        onChange={(e) =>
                          handleInputChange(field.name, e.target.value)
                        }
                        className={`w-full px-4 py-3 border rounded-xl transition-all duration-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          errors[field.name]
                            ? "border-red-300 dark:border-red-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        }`}
                      >
                        <option value="">Select {field.label}</option>

                        {field.options?.map((option, index) => {
                          // Handle both object and string options
                          if (typeof option === "string") {
                            return (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            );
                          } else if (
                            typeof option === "object" &&
                            option !== null
                          ) {
                            return (
                              <option
                                key={option.value ?? index}
                                value={option.value}
                              >
                                {option.label}
                              </option>
                            );
                          }
                          return null;
                        })}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        name={field.name}
                        value={formData[field.name] || ""}
                        onChange={(e) =>
                          handleInputChange(field.name, e.target.value)
                        }
                        step={field?.step}
                        maxLength={35}
                        min={field?.min}
                        disabled={field?.disabled}
                        className={`w-full px-4 py-3 border rounded-xl transition-all duration-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          errors[field.name]
                            ? "border-red-300 dark:border-red-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        }`}
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                      />
                    )}

                    {errors[field.name] && (
                      <div className="flex items-center mt-2 text-red-600 dark:text-red-400">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        <span className="text-sm">{errors[field.name]}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Error Summary */}
            {Object.keys(errors).length > 0 && (
              <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
                  <span className="text-sm font-medium text-red-800 dark:text-red-200">
                    Please fix the errors above to continue
                  </span>
                </div>
              </div>
            )}

            {/* Summary Section */}
            <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {config.fields.map((field) => {
                  const value = formData[field.name];
                  if (!value || value === "") return null;

                  return (
                    <div key={field.name} className="flex flex-col">
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {field.label}:
                      </span>
                      <span className="text-gray-900 dark:text-gray-100">
                        {formData[field.name]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            {apiError && (
              <div className="mt-5 bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
                {apiError}
              </div>
            )}
            {/* Actions */}
            <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="disabled:pointer-events-none disabled:hover:bg-gray-800 px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Save {config.title.split(" ")[0]}</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {showDiscardPopup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div
                className="absolute inset-0 bg-black/50"
                onClick={() => setShowDiscardPopup(false)}
              />
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 z-10 w-full max-w-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Discard Changes?
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
                  You have unsaved changes. Are you sure you want to discard
                  them?
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
                    onClick={() => setShowDiscardPopup(false)}
                  >
                    No
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-300"
                    onClick={() => {
                      setShowDiscardPopup(false);
                      setFormsData((prev) => ({
                        ...prev,
                        [formType ?? "default"]: {}, // assuming formType is defined
                      }));
                      setFormData({}); // Reset current formData
                      setErrors({}); // Reset errors if needed
                      closeAddForm();
                    }}
                  >
                    Yes, Discard
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddFormPopup;
