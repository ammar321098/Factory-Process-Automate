'use client';
import React from "react";
import { LucideIcon } from "lucide-react";

interface WidgetItem {
  label: string;
  value: number | string;
  color?: string;
}

interface WidgetCardProps {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  iconGradient?: string; // e.g., 'from-primary-500 to-primary-600'
  items: WidgetItem[];
  totalLabel?: string;
  totalValue?: number | string;
  totalColor?: string;
}

const WidgetCard: React.FC<WidgetCardProps> = ({
  title,
  subtitle,
  icon: Icon,
  iconGradient = "from-primary-500 to-primary-600",
  items,
  totalLabel,
  totalValue,
  totalColor = "text-primary-500",
}) => {
  return (
    <div className="card-glass p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
          {subtitle && (
            <p className="text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>
          )}
        </div>
        <div className={`p-2 bg-gradient-to-r ${iconGradient} rounded-xl`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex justify-between items-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl"
          >
            <p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
            <p className={`text-lg font-semibold ${item.color || "text-gray-900 dark:text-white"}`}>
              {typeof item.value === "number"
                ? `Rs. ${item.value.toLocaleString()}`
                : item.value}
            </p>
          </div>
        ))}

        {totalLabel && totalValue && (
          <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{totalLabel}</p>
            <p className={`text-lg font-bold ${totalColor}`}>
              {typeof totalValue === "number"
                ? `Rs. ${totalValue.toLocaleString()}`
                : totalValue}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WidgetCard;
