// TypeScript interfaces for Payments
export interface Payment {
  id: number;
  transactionId?: number;
  invoiceId?: number;
  clientId?: number;
  supplierId?: number;
  amount: number;
  method: 'BANK_TRANSFER' | 'CASH' | 'CREDIT_CARD' | 'CHEQUE';
  status: 'PAID' | 'PENDING' | 'PARTIALLY_PAID' | 'UNPAID' | 'FAILED';
  date: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  reference?: string;
  notes?: string;
  client?: {
    id: number;
    name: string;
    company: string;
    email: string;
    phone: string;
    address?: string;
  };
  invoice?: {
    id: number;
    invoiceNumber: string;
    total: number;
    date?: string;
  };
  transaction?: {
    id: number;
    type: string;
    amount: number;
    date?: string;
  };
}

export interface PaymentStats {
  totalPayments: number;
  todayPayments: number;
  totalAmount: number;
  todayAmount: number;
  amountChange: string;
  paymentsChange: string;
  statusStats: Array<{
    status: string;
    _count: { id: number };
    _sum: { amount: number };
  }>;
  methodStats: Array<{
    method: string;
    _count: { id: number };
    _sum: { amount: number };
  }>;
  topClients: Array<{
    clientId: number;
    clientName: string;
    company: string;
    _count: { id: number };
    _sum: { amount: number };
  }>;
  recentPayments: Payment[];
  monthlyTrends: Record<string, { count: number; total: number }>;
  pendingPayments: number;
  pendingAmount: number;
  failedPayments: number;
  failedAmount: number;
}

export interface PaymentResponse {
  data: Payment[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreatePaymentRequest {
  transactionId?: number;
  invoiceId?: number;
  clientId?: number;
  supplierId?: number;
  amount: number;
  method: 'BANK_TRANSFER' | 'CASH' | 'CREDIT_CARD' | 'CHEQUE';
  status?: 'PAID' | 'PENDING' | 'PARTIALLY_PAID' | 'UNPAID' | 'FAILED';
  date: string;
  reference?: string;
  notes?: string;
}

// API Functions
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export async function fetchPayments(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  method?: string;
  clientId?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}): Promise<PaymentResponse> {
  const searchParams = new URLSearchParams();
  
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.limit) searchParams.append('limit', params.limit.toString());
  if (params?.search) searchParams.append('search', params.search);
  if (params?.status) searchParams.append('status', params.status);
  if (params?.method) searchParams.append('method', params.method);
  if (params?.clientId) searchParams.append('clientId', params.clientId.toString());
  if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
  if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder);

  const response = await fetch(`${API_BASE_URL}/api/payments?${searchParams}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch payments');
  }
  
  return response.json();
}

export async function fetchPayment(id: number): Promise<Payment> {
  const response = await fetch(`${API_BASE_URL}/api/payments/${id}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch payment');
  }
  
  return response.json();
}

export async function createPayment(data: CreatePaymentRequest): Promise<Payment> {
  const response = await fetch(`${API_BASE_URL}/api/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create payment');
  }
  
  return response.json();
}

export async function updatePayment(id: number, data: Partial<CreatePaymentRequest>): Promise<Payment> {
  const response = await fetch(`${API_BASE_URL}/api/payments/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update payment');
  }
  
  return response.json();
}

export async function deletePayment(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/payments/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete payment');
  }
}

export async function fetchPaymentStats(): Promise<PaymentStats> {
  const response = await fetch(`${API_BASE_URL}/api/payments/stats`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch payment statistics');
  }
  
  return response.json();
}






