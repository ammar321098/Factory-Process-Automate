// API service for Materials module

export interface Material {
  id: number;
  name: string;
  category: string;
  supplier: string;
  stock: number;
  unit: string;
  cost: number;
  weight: number | null;
  sizes: string | null;
  gages: string | null;
  unitWeight: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface MaterialsResponse {
  data: Material[];
  summary: Material[];
  total: number;
  totalRemaining: number;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface MaterialsStats {
  totalMaterials: number;
  todayMaterials: number;
  totalWeight: number;
  remainingQuantity: number;
}

export async function fetchMaterials(
  params: {
    page?: number;
    limit?: number;
    search?: string;
    sizeId?: string;
    gageId?: string;
    sortBy?: string;
    sortOrder?: string;
  } = {}
): Promise<MaterialsResponse> {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      searchParams.append(key, value.toString());
    }
  });

  const response = await fetch(`/api/raw-material?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to fetch materials");
  }

  return response.json();
}

export async function fetchMaterial(id: string): Promise<Material> {
  const response = await fetch(`/api/raw-material${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch material");
  }

  return response.json();
}

export async function createMaterial(data: {
  name: string;
  category: string;
  supplier: string;
  stock?: number;
  unit: string;
  cost: number;
  weight?: number;
  sizes?: string;
  gages?: string;
  unitWeight?: number;
}): Promise<Material> {
  const response = await fetch("/api/material", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create material");
  }

  return response.json();
}

export async function updateMaterial(
  id: string,
  data: Partial<{
    name: string;
    category: string;
    supplier: string;
    stock: number;
    unit: string;
    cost: number;
    weight: number;
    sizes: string;
    gages: string;
    unitWeight: number;
  }>
): Promise<Material> {
  const response = await fetch(`/api/raw-material${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update material");
  }

  return response.json();
}

export async function deleteMaterial(id: string): Promise<void> {
  const response = await fetch(`/api/raw-material${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete material");
  }
}

export async function fetchMaterialsStats(): Promise<MaterialsStats> {
  const response = await fetch("/api/raw-material/stats");

  if (!response.ok) {
    throw new Error("Failed to fetch materials stats");
  }

  return response.json();
}
