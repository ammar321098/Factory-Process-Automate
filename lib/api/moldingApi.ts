// API service for Molding module

export interface MoldingEntry {
  id: number;
  productTypeId: number;
  materialId: number;
  operator: string;
  quantity: number;
  qualityNotes: string | null;
  date: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  userId: number | null;
  materials: {
    id: number;
    name: string;
    category: string;
    supplier: string;
    unit: string;
    cost: number;
  };
  product_types: {
    id: number;
    name: string;
    description: string | null;
  };
}

export interface ProductType {
  id: number;
  name: string;
  productType: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface MoldingStats {
  todayMoldingQuantity: number;
  totalMaterialUsed: number;
  totalDamage: number;
  totalRemainingMoldedProducts: number;
}

export interface MoldingEntriesResponse {
  data: MoldingEntry[];
  employeePerformance: [];
  total: number;
  employeeTotal: number;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ProductTypesResponse {
  data: ProductType[];
  total: number;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Fetch molding entries with filters
// Fetch multiple molding entries with optional filters
export async function fetchMoldingEntries(
  params: {
    page?: number;
    limit?: number;
    search?: string;
  } = {}
): Promise<MoldingEntriesResponse> {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.append(key, value.toString());
    }
  });

  const response = await fetch(`/api/molding-entry?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to fetch molding entries");
  }

  return response.json();
}

// Fetch a single molding entry by ID
export async function fetchMoldingEntry(id: string): Promise<MoldingEntry> {
  if (!id) throw new Error("Missing molding entry ID");

  const response = await fetch(`/api/molding-entries/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch molding entry");
  }

  return response.json();
}

// Create molding entry
export async function createMoldingEntry(data: {
  productTypeId: number;
  materialId: number;
  operator: string;
  quantity: number;
  qualityNotes?: string;
  date?: string;
}): Promise<MoldingEntry> {
  const response = await fetch("/api/molding-entries", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create molding entry");
  }

  return response.json();
}

// Update molding entry
export async function updateMoldingEntry(
  id: string,
  data: {
    productTypeId: number;
    materialId: number;
    operator: string;
    quantity: number;
    qualityNotes?: string;
    date?: string;
  }
): Promise<MoldingEntry> {
  const response = await fetch(`/api/molding-entries/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update molding entry");
  }

  return response.json();
}

// Delete molding entry
export async function deleteMoldingEntry(id: string): Promise<void> {
  const response = await fetch(`/api/molding-entries/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete molding entry");
  }
}

// Fetch molding statistics
export async function fetchMoldingStats(): Promise<MoldingStats> {
  const response = await fetch("/api/molding-entry/stats");

  if (!response.ok) {
    throw new Error("Failed to fetch molding stats");
  }

  return response.json();
}

// Fetch product types
export async function fetchProductTypes(
  params: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  } = {}
): Promise<ProductTypesResponse> {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      queryParams.append(key, value.toString());
    }
  });

  const response = await fetch(`/api/product-type?${queryParams.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to fetch product types");
  }

  return response.json();
}

// Create product type
export async function createProductType(data: {
  name: string;
  productType: string;
  description?: string;
}): Promise<ProductType> {
  const response = await fetch("/api/product-type", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create product type");
  }

  return response.json();
}

// Fetch product rates
export async function fetchProductRates(
  params: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  } = {}
): Promise<ProductTypesResponse> {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      queryParams.append(key, value.toString());
    }
  });

  const response = await fetch(`/api/product-rate?${queryParams.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to fetch product types");
  }

  return response.json();
}

// Fetch remaining molding products
export async function fetchRemainingMoldings(
  params: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  } = {}
): Promise<ProductTypesResponse> {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      queryParams.append(key, value.toString());
    }
  });

  const response = await fetch(
    `/api/remaining-moldings?${queryParams.toString()}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch product types");
  }

  return response.json();
}
