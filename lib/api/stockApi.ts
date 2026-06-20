// API service for Stock module

export interface StockTransaction {
  id: number;
  date: string;
  productId: number | null;
  materialId: number | null;
  type: 'IN' | 'OUT' | 'ADJUSTMENT' | 'TRANSFER';
  quantity: number;
  unitCost: number | null;
  reference: string;
  reason: string;
  balanceAfter: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  materials?: {
    id: number;
    name: string;
    category: string;
    supplier: string;
  } | null;
  products?: {
    id: number;
    name: string;
    description: string;
  } | null;
}

export interface StockStats {
  totalStockTransactions: number;
  todayStockTransactions: number;
  totalMaterials: number;
  totalProducts: number;
  lowStockItems: number;
  totalStockValue: number;
  todayStockMovement: number;
  stockMovementStats: {
    type: string;
    transactionCount: number;
    totalQuantity: number;
  }[];
  recentTransactions: {
    id: number;
    item: string;
    type: string;
    quantity: number;
    reference: string;
    date: string;
    createdAt: string;
  }[];
}

export interface StockTransactionsResponse {
  data: StockTransaction[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Fetch stock transactions with filters
export async function fetchStockTransactions(params: {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  productId?: string;
  materialId?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: string;
} = {}): Promise<StockTransactionsResponse> {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      searchParams.append(key, value.toString());
    }
  });

  const response = await fetch(`/api/stock-transactions?${searchParams.toString()}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch stock transactions');
  }
  
  return response.json();
}

// Fetch single stock transaction
export async function fetchStockTransaction(id: string): Promise<StockTransaction> {
  const response = await fetch(`/api/stock-transactions/${id}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch stock transaction');
  }
  
  return response.json();
}

// Create stock transaction
export async function createStockTransaction(data: {
  date: string;
  productId?: number;
  materialId?: number;
  type: 'IN' | 'OUT' | 'ADJUSTMENT' | 'TRANSFER';
  quantity: number;
  unitCost?: number;
  reference: string;
  reason: string;
  balanceAfter: number;
}): Promise<StockTransaction> {
  const response = await fetch('/api/stock-transactions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create stock transaction');
  }
  
  return response.json();
}

// Update stock transaction
export async function updateStockTransaction(id: string, data: {
  date: string;
  productId?: number;
  materialId?: number;
  type: 'IN' | 'OUT' | 'ADJUSTMENT' | 'TRANSFER';
  quantity: number;
  unitCost?: number;
  reference: string;
  reason: string;
  balanceAfter: number;
}): Promise<StockTransaction> {
  const response = await fetch(`/api/stock-transactions/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update stock transaction');
  }
  
  return response.json();
}

// Delete stock transaction
export async function deleteStockTransaction(id: string): Promise<void> {
  const response = await fetch(`/api/stock-transactions/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete stock transaction');
  }
}

// Fetch stock statistics
export async function fetchStockStats(): Promise<StockStats> {
  const response = await fetch('/api/stock-transactions/stats');
  
  if (!response.ok) {
    throw new Error('Failed to fetch stock stats');
  }
  
  return response.json();
}






