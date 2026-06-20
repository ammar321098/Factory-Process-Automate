"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const MOCK_PRODUCTION_TREND = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  molding: [120, 145, 132, 168, 155, 90, 110],
  polishing: [95, 110, 105, 130, 125, 70, 85],
  packing: [80, 95, 88, 115, 108, 60, 75],
};

type DashboardProductionChartProps = {
  labels: {
    molding: string;
    polishing: string;
    packing: string;
    yAxis: string;
  };
};

function useIsDarkMode() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const update = () => setIsDark(root.classList.contains("dark"));

    update();
    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  return isDark;
}

export function DashboardProductionChart({
  labels,
}: DashboardProductionChartProps) {
  const isDark = useIsDarkMode();

  const textColor = isDark ? "#9ca3af" : "#6b7280";
  const gridColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";

  const data = useMemo(
    () => ({
      labels: MOCK_PRODUCTION_TREND.labels,
      datasets: [
        {
          label: labels.molding,
          data: MOCK_PRODUCTION_TREND.molding,
          borderColor: "#0284c7",
          backgroundColor: "rgba(2, 132, 199, 0.12)",
          fill: true,
          tension: 0.35,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
        {
          label: labels.polishing,
          data: MOCK_PRODUCTION_TREND.polishing,
          borderColor: "#c832f0",
          backgroundColor: "rgba(200, 50, 240, 0.1)",
          fill: true,
          tension: 0.35,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
        {
          label: labels.packing,
          data: MOCK_PRODUCTION_TREND.packing,
          borderColor: "#f59e0b",
          backgroundColor: "rgba(245, 158, 11, 0.1)",
          fill: true,
          tension: 0.35,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    }),
    [labels.molding, labels.polishing, labels.packing]
  );

  const options: ChartOptions<"line"> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false,
      },
      plugins: {
        legend: {
          position: "top",
          align: "end",
          labels: {
            color: textColor,
            usePointStyle: true,
            pointStyle: "circle",
            padding: 16,
            font: { size: 12, weight: 500 },
          },
        },
        tooltip: {
          backgroundColor: isDark ? "#1f2937" : "#ffffff",
          titleColor: isDark ? "#f9fafb" : "#111827",
          bodyColor: isDark ? "#d1d5db" : "#374151",
          borderColor: isDark ? "#374151" : "#e5e7eb",
          borderWidth: 1,
          padding: 12,
          callbacks: {
            label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y} pcs`,
          },
        },
      },
      scales: {
        x: {
          grid: { color: gridColor },
          ticks: { color: textColor, font: { size: 11 } },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: labels.yAxis,
            color: textColor,
            font: { size: 11, weight: 500 },
          },
          grid: { color: gridColor },
          ticks: { color: textColor, font: { size: 11 } },
        },
      },
    }),
    [gridColor, isDark, labels.yAxis, textColor]
  );

  return (
    <div className="h-64 sm:h-72 rounded-2xl bg-gradient-to-br from-primary-50/50 to-primary-100/30 dark:from-primary-900/20 dark:to-primary-800/10 border border-primary-100 dark:border-primary-800/50 p-3 sm:p-4">
      <Line data={data} options={options} />
    </div>
  );
}
