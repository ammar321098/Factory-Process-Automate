// API service for Polishing module

export interface PolishingEntry {
  id: number;
  moldedMaterial: string;
  operator: string;
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

export interface PolishingStats {
  moldedItemsUsed: number;
  activePolishingEmployees: number;
  todayPolished: number;
  totalPolishedItems: number;
}

export interface PolishingEntriesResponse {
  data: PolishingEntry[];
  employeePerformance: PolishingEntry[];
  total: number;
  employeeTotal: number;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Fetch polishing entries with filters
export async function fetchPolishingEntries(
  params: {
    page?: number;
    limit?: number;
    search?: string;
    operator?: string;
    moldedMaterial?: string;
    dateFrom?: string;
    dateTo?: string;
    sortBy?: string;
    sortOrder?: string;
  } = {}
): Promise<PolishingEntriesResponse> {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      searchParams.append(key, value.toString());
    }
  });

  const response = await fetch(`/api/polishing?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to fetch polishing entries");
  }

  return response.json();
}

// Fetch single polishing entry
export async function fetchPolishingEntry(id: string): Promise<PolishingEntry> {
  const response = await fetch(`/api/polishing-entries/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch polishing entry");
  }

  return response.json();
}

// Create polishing entry
export async function createPolishingEntry(data: {
  moldedMaterial: string;
  operator: string;
  quantity: number;
  qualityNotes?: string;
  date?: string;
}): Promise<PolishingEntry> {
  const response = await fetch("/api/polishing-entries", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create polishing entry");
  }

  return response.json();
}

// Update polishing entry
export async function updatePolishingEntry(
  id: string,
  data: {
    moldedMaterial: string;
    operator: string;
    quantity: number;
    qualityNotes?: string;
    date?: string;
  }
): Promise<PolishingEntry> {
  const response = await fetch(`/api/polishing-entries/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update polishing entry");
  }

  return response.json();
}

// Delete polishing entry
export async function deletePolishingEntry(id: string): Promise<void> {
  const response = await fetch(`/api/polishing-entries/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete polishing entry");
  }
}

// Fetch polishing statistics
export async function fetchMoldingStats(): Promise<PolishingStats> {
  const response = await fetch("/api/polishing/stats");

  if (!response.ok) {
    throw new Error("Failed to fetch molding stats");
  }

  return response.json();
}

// Fetch polishing statistics
export async function fetchPolishingStats(): Promise<PolishingStats> {
  const response = await fetch("/api/polishing/stats");

  if (!response.ok) {
    throw new Error("Failed to fetch polishing stats");
  }

  return response.json();
}

// Fetch polishing rates
export async function fetchPolishingRates(
  params: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  } = {}
): Promise<PolishingEntriesResponse> {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      queryParams.append(key, value.toString());
    }
  });

  const response = await fetch(`/api/polishing-rate?${queryParams.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to fetch product types");
  }

  return response.json();
}

// Fetch remaining polishing products
export async function fetchRemainingPolishing(
  params: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  } = {}
): Promise<PolishingEntriesResponse> {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      queryParams.append(key, value.toString());
    }
  });

  const response = await fetch(
    `/api/remaining-polishing?${queryParams.toString()}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch product types");
  }

  return response.json();
}
