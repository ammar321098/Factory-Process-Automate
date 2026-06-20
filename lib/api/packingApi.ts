// API service for Packing module

export interface PackingEntry {
  id: number;
  moldedMaterial: string;
  quantity: number;
  qualityNotes: string | null;
  date: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  userId: number | null;
  users?: {
    id: number;
    name: string;
    email: string;
  } | null;
}

export interface PackingStats {
  totalPolishedItemsUsed: number;
  todayPackedItems: number;
  totalProductsPacked: number;
  totalRemainingPacking: number;
}

export interface PackingEntriesResponse {
  data: PackingEntry[];
  total: number;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Fetch packing entries with filters
export async function fetchPackingEntries(
  params: {
    page?: number;
    limit?: number;
    search?: string;
    moldedMaterial?: string;
    dateFrom?: string;
    dateTo?: string;
    sortBy?: string;
    sortOrder?: string;
  } = {}
): Promise<PackingEntriesResponse> {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      searchParams.append(key, value.toString());
    }
  });

  const response = await fetch(`/api/packing?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to fetch packing entries");
  }

  return response.json();
}

// Fetch single packing entry
export async function fetchPackingEntry(id: string): Promise<PackingEntry> {
  const response = await fetch(`/api/packing/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch packing entry");
  }

  return response.json();
}

// Create packing entry
export async function createPackingEntry(data: {
  moldedMaterial: string;
  quantity: number;
  qualityNotes?: string;
  date?: string;
}): Promise<PackingEntry> {
  const response = await fetch("/api/packing", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create packing entry");
  }

  return response.json();
}

// Update packing entry
export async function updatePackingEntry(
  id: string,
  data: {
    moldedMaterial: string;
    quantity: number;
    qualityNotes?: string;
    date?: string;
  }
): Promise<PackingEntry> {
  const response = await fetch(`/api/packing/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update packing entry");
  }

  return response.json();
}

// Delete packing entry
export async function deletePackingEntry(id: string): Promise<void> {
  const response = await fetch(`/api/packing/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete packing entry");
  }
}

// Fetch packing statistics
export async function fetchPackingStats(): Promise<PackingStats> {
  const response = await fetch("/api/packing/stats");

  if (!response.ok) {
    throw new Error("Failed to fetch packing stats");
  }

  return response.json();
}

// Fetch remaining packing products
export async function fetchRemainingPacking(
  params: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  } = {}
): Promise<PackingEntriesResponse> {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      queryParams.append(key, value.toString());
    }
  });

  const response = await fetch(
    `/api/remaining-packing?${queryParams.toString()}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch product types");
  }

  return response.json();
}
