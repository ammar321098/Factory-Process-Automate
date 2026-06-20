// API service for Dashboard module

export interface DashboardStats {
  // Main KPIs
  totalMaterialAvailable: number;
  totalRemainingMolding: number;
  totalRemainingPolishing: number;
  totalRemainingPacking: number;
  // Analysis metrics
  analysis: {
    materials: {
      total: number;
      addedToday: number;
      stockValue: number;
    };

    production: {
      moldingToday: number;
      polishingToday: number;
      packingToday: number;
      totalToday: number;
    };

    Products: {
      totalClients: number;
      openOrders: number;
      todaysSales: number;
      totalInvoices: number;
    };

    employees: {
      total: number;
      active: number;
      presentToday: number;
    };
  };
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const response = await fetch("/api/dashboard/stats");

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard statistics");
  }

  return response.json();
}
