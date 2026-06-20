// API service for Sizes, Gages, and Unit Weights

export interface Size {
  id: string;
  name: string;
  length: number | null;
  width: number | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Gage {
  id: string;
  name: string;
  thickness: number | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UnitWeight {
  id: string;
  sizeId: string;
  size: Size;
  gageId: string;
  gage: Gage;
  weight: number;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PagedResponse<T> {
  data: T[];
  total: number;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Sizes API
export async function fetchSizes(params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<PagedResponse<Size>> {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.search) queryParams.append("search", params.search);

  const response = await fetch(`/api/sizes?${queryParams.toString()}`);
  if (!response.ok) throw new Error("Failed to fetch sizes");
  return response.json();
}

export async function createSize(data: {
  name: string;
  length?: number;
  width?: number;
  description?: string;
}): Promise<Size> {
  const response = await fetch("/api/sizes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create size");
  return response.json();
}

export async function updateSize(
  id: string,
  data: Partial<{
    name: string;
    length: number;
    width: number;
    description: string;
  }>
): Promise<Size> {
  const response = await fetch(`/api/sizes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update size");
  return response.json();
}

export async function deleteSize(id: string): Promise<void> {
  const response = await fetch(`/api/sizes/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Failed to delete size");
}

// Gages API
export async function fetchGages(params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<PagedResponse<Gage>> {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.search) queryParams.append("search", params.search);

  const response = await fetch(`/api/gages?${queryParams.toString()}`);
  if (!response.ok) throw new Error("Failed to fetch gages");
  return response.json();
}

export async function createGage(data: {
  name: string;
  thickness?: number;
  description?: string;
}): Promise<Gage> {
  const response = await fetch("/api/gages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create gage");
  return response.json();
}

export async function updateGage(
  id: string,
  data: Partial<{ name: string; thickness: number; description: string }>
): Promise<Gage> {
  const response = await fetch(`/api/gages/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update gage");
  return response.json();
}

export async function deleteGage(id: string): Promise<void> {
  const response = await fetch(`/api/gages/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Failed to delete gage");
}

// Unit Weights API
export async function fetchUnitWeights(params?: {
  page?: number;
  limit?: number;
  sizeId?: string;
  gageId?: string;
  search?: string;
}): Promise<PagedResponse<UnitWeight>> {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.search) queryParams.append("search", params.search);
  if (params?.sizeId) queryParams.append("sizeId", params.sizeId);
  if (params?.gageId) queryParams.append("gageId", params.gageId);

  const response = await fetch(`/api/unit-weight?${queryParams.toString()}`);
  if (!response.ok) throw new Error("Failed to fetch unit weights");
  return response.json();
}

export async function createUnitWeight(data: {
  sizeId: string;
  gageId: string;
  weight: number;
  description?: string;
}): Promise<UnitWeight> {
  const response = await fetch("/api/unit-weights", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create unit weight");
  return response.json();
}

export async function updateUnitWeight(
  id: string,
  data: Partial<{
    sizeId: string;
    gageId: string;
    weight: number;
    description: string;
  }>
): Promise<UnitWeight> {
  const response = await fetch(`/api/unit-weights/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update unit weight");
  return response.json();
}

export async function deleteUnitWeight(id: string): Promise<void> {
  const response = await fetch(`/api/unit-weights/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Failed to delete unit weight");
}
