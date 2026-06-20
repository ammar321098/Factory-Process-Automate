// API Service Layer for Backend Integration
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

class ApiService {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api') {
    this.baseUrl = baseUrl;
  }

  setToken(token: string) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        data: null as T,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Raw Materials API
  async getRawMaterials(page: number = 1, pageSize: number = 20, filters?: any) {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...filters,
    });
    
    return this.request<PaginatedResponse<any>>(`/raw-materials?${params}`);
  }

  async createRawMaterial(data: any) {
    return this.request<any>('/raw-materials', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateRawMaterial(id: string, data: any) {
    return this.request<any>(`/raw-materials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteRawMaterial(id: string) {
    return this.request<any>(`/raw-materials/${id}`, {
      method: 'DELETE',
    });
  }

  // Production API
  async getMoldingData(page: number = 1, pageSize: number = 20, filters?: any) {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...filters,
    });
    
    return this.request<PaginatedResponse<any>>(`/molding?${params}`);
  }

  async getPolishingData(page: number = 1, pageSize: number = 20, filters?: any) {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...filters,
    });
    
    return this.request<PaginatedResponse<any>>(`/polishing?${params}`);
  }

  async getPackingData(page: number = 1, pageSize: number = 20, filters?: any) {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...filters,
    });
    
    return this.request<PaginatedResponse<any>>(`/packing?${params}`);
  }

  // Stock API
  async getStockData(page: number = 1, pageSize: number = 20, filters?: any) {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...filters,
    });
    
    return this.request<PaginatedResponse<any>>(`/stock?${params}`);
  }

  // Sales API
  async getSalesData(page: number = 1, pageSize: number = 20, filters?: any) {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...filters,
    });
    
    return this.request<PaginatedResponse<any>>(`/sales?${params}`);
  }

  // Employee API
  async getEmployees(page: number = 1, pageSize: number = 20, filters?: any) {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...filters,
    });
    
    return this.request<PaginatedResponse<any>>(`/employees?${params}`);
  }

  // Dashboard API
  async getDashboardStats() {
    return this.request<any>('/dashboard/stats');
  }

  // Reports API
  async generateReport(reportType: string, params: any) {
    return this.request<any>(`/reports/${reportType}`, {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // Authentication API
  async login(email: string, password: string) {
    return this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async logout() {
    this.token = null;
    return this.request<any>('/auth/logout', {
      method: 'POST',
    });
  }

  // Bulk operations for better performance
  async bulkUpdateRawMaterials(updates: { id: string; data: any }[]) {
    return this.request<any>('/raw-materials/bulk', {
      method: 'PUT',
      body: JSON.stringify({ updates }),
    });
  }

  // Real-time updates using Server-Sent Events
  subscribeToUpdates(eventType: string, callback: (data: any) => void) {
    const eventSource = new EventSource(`${this.baseUrl}/events/${eventType}`);
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        callback(data);
      } catch (error) {
        console.error('Error parsing SSE data:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
    };

    return () => eventSource.close();
  }
}

// Create singleton instance
export const apiService = new ApiService();

// Export types for use in components
export type { ApiResponse, PaginatedResponse };


