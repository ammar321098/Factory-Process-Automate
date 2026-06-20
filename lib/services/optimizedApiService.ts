'use client';

interface ApiParams {
  page?: number;
  pageSize?: number;
  search?: string;
  filters?: Record<string, string>;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface ApiResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data generators
const generateMockData = <T>(
  generator: (id: number) => T,
  count: number
): T[] => {
  return Array.from({ length: count }, (_, index) => generator(index + 1));
};

// Optimized search function
const searchData = <T>(
  data: T[],
  searchQuery: string,
  searchFields: string[]
): T[] => {
  if (!searchQuery) return data;
  
  const query = searchQuery.toLowerCase();
  return data.filter(item => 
    searchFields.some(field => {
      const value = (item as any)[field];
      return value && value.toString().toLowerCase().includes(query);
    })
  );
};

// Optimized filter function
const filterData = <T>(
  data: T[],
  filters: Record<string, string>
): T[] => {
  return data.filter(item => {
    return Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      const itemValue = (item as any)[key];
      return itemValue && itemValue.toString().toLowerCase().includes(value.toLowerCase());
    });
  });
};

// Optimized sort function
const sortData = <T>(
  data: T[],
  sortBy?: string,
  sortOrder: 'asc' | 'desc' = 'asc'
): T[] => {
  if (!sortBy) return data;
  
  return [...data].sort((a, b) => {
    const aValue = (a as any)[sortBy];
    const bValue = (b as any)[sortBy];
    
    if (aValue === bValue) return 0;
    
    const comparison = aValue < bValue ? -1 : 1;
    return sortOrder === 'asc' ? comparison : -comparison;
  });
};

// Generic API service
export class OptimizedApiService {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_DURATION = 30000; // 30 seconds

  private getCacheKey(params: ApiParams, endpoint: string): string {
    return `${endpoint}:${JSON.stringify(params)}`;
  }

  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private async fetchData<T>(
    endpoint: string,
    params: ApiParams,
    dataGenerator: (count: number) => T[],
    searchFields: string[] = []
  ): Promise<ApiResponse<T>> {
    const cacheKey = this.getCacheKey(params, endpoint);
    const cached = this.getFromCache<ApiResponse<T>>(cacheKey);
    
    if (cached) {
      await delay(100); // Simulate minimal network delay for cached data
      return cached;
    }

    // Simulate network delay
    await delay(300 + Math.random() * 200);

    const {
      page = 1,
      pageSize = 10,
      search = '',
      filters = {},
      sortBy,
      sortOrder = 'asc'
    } = params;

    // Generate mock data (simulate large dataset)
    const allData = dataGenerator(1000);
    
    // Apply search
    const searchedData = searchData(allData, search, searchFields);
    
    // Apply filters
    const filteredData = filterData(searchedData, filters);
    
    // Apply sorting
    const sortedData = sortData(filteredData, sortBy, sortOrder);
    
    // Calculate pagination
    const total = sortedData.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = sortedData.slice(startIndex, endIndex);

    const response: ApiResponse<T> = {
      data: paginatedData,
      total,
      page,
      pageSize,
      totalPages
    };

    this.setCache(cacheKey, response);
    return response;
  }

  // Raw Materials API
  async getRawMaterials(params: ApiParams = {}) {
    return this.fetchData(
      'raw-materials',
      params,
      (count) => generateMockData((id) => ({
        id,
        name: `Raw Material ${id}`,
        category: ['Metal', 'Plastic', 'Rubber', 'Wood', 'Chemical'][id % 5],
        supplier: `Supplier ${(id % 10) + 1}`,
        quantity: Math.floor(Math.random() * 1000),
        unit: 'kg',
        cost: (Math.random() * 100).toFixed(2),
        status: ['In Stock', 'Low Stock', 'Out of Stock'][id % 3],
        lastUpdated: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }), count),
      ['name', 'category', 'supplier', 'status']
    );
  }

  // Molding Process API
  async getMoldingData(params: ApiParams = {}) {
    return this.fetchData(
      'molding',
      params,
      (count) => generateMockData((id) => ({
        id,
        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        shift: ['Morning', 'Afternoon', 'Night'][id % 3],
        rawMaterialUsed: `Material ${id % 20}`,
        quantity: Math.floor(Math.random() * 100),
        moldedOutput: Math.floor(Math.random() * 90),
        efficiency: `${(Math.random() * 20 + 80).toFixed(1)}%`,
        manager: `Manager ${(id % 5) + 1}`,
        employees: Math.floor(Math.random() * 10) + 1,
        status: ['Completed', 'In Progress', 'Pending'][id % 3]
      }), count),
      ['date', 'shift', 'rawMaterialUsed', 'manager', 'status']
    );
  }

  // Polishing Process API
  async getPolishingData(params: ApiParams = {}) {
    return this.fetchData(
      'polishing',
      params,
      (count) => generateMockData((id) => ({
        id,
        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        shift: ['Morning', 'Afternoon', 'Night'][id % 3],
        moldedItemsUsed: `Molded Item ${id % 20}`,
        quantity: Math.floor(Math.random() * 100),
        polishedOutput: Math.floor(Math.random() * 90),
        efficiency: `${(Math.random() * 20 + 80).toFixed(1)}%`,
        manager: `Manager ${(id % 5) + 1}`,
        employees: Math.floor(Math.random() * 8) + 1,
        status: ['Completed', 'In Progress', 'Pending'][id % 3]
      }), count),
      ['date', 'shift', 'moldedItemsUsed', 'manager', 'status']
    );
  }

  // Packing Process API
  async getPackingData(params: ApiParams = {}) {
    return this.fetchData(
      'packing',
      params,
      (count) => generateMockData((id) => ({
        id,
        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        shift: ['Morning', 'Afternoon', 'Night'][id % 3],
        polishedItemsUsed: `Polished Item ${id % 20}`,
        quantity: Math.floor(Math.random() * 100),
        packedOutput: Math.floor(Math.random() * 90),
        efficiency: `${(Math.random() * 20 + 80).toFixed(1)}%`,
        manager: `Manager ${(id % 5) + 1}`,
        employees: Math.floor(Math.random() * 6) + 1,
        status: ['Completed', 'In Progress', 'Pending'][id % 3]
      }), count),
      ['date', 'shift', 'polishedItemsUsed', 'manager', 'status']
    );
  }

  // Stock Management API
  async getStockData(params: ApiParams = {}) {
    return this.fetchData(
      'stock',
      params,
      (count) => generateMockData((id) => ({
        id,
        name: `Product ${id}`,
        category: ['Metal Products', 'Plastic Products', 'Rubber Products', 'Wood Products'][id % 4],
        weight: `${(Math.random() * 5 + 0.5).toFixed(1)} kg`,
        size: `${Math.floor(Math.random() * 100 + 10)}mm x ${Math.floor(Math.random() * 200 + 50)}mm`,
        currentStock: Math.floor(Math.random() * 100),
        minStock: Math.floor(Math.random() * 20),
        maxStock: Math.floor(Math.random() * 200 + 100),
        unitCost: `$${(Math.random() * 50 + 10).toFixed(2)}`,
        totalValue: `$${(Math.random() * 5000 + 500).toFixed(2)}`,
        supplier: 'Internal Production',
        status: ['In Stock', 'Low Stock', 'Out of Stock'][id % 3]
      }), count),
      ['name', 'category', 'supplier', 'status']
    );
  }

  // Sales API
  async getSalesData(params: ApiParams = {}) {
    return this.fetchData(
      'sales',
      params,
      (count) => generateMockData((id) => ({
        id,
        orderNumber: `SO-${String(id).padStart(3, '0')}`,
        customer: `Customer ${id % 50}`,
        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        items: `Product ${id % 100}`,
        quantity: Math.floor(Math.random() * 50),
        unitPrice: `$${(Math.random() * 100 + 10).toFixed(2)}`,
        total: `$${(Math.random() * 5000 + 100).toFixed(2)}`,
        status: ['Confirmed', 'Processing', 'Shipped', 'Delivered'][id % 4],
        salesManager: `Manager ${(id % 10) + 1}`
      }), count),
      ['orderNumber', 'customer', 'items', 'status', 'salesManager']
    );
  }

  // Employee API
  async getEmployeeData(params: ApiParams = {}) {
    return this.fetchData(
      'employees',
      params,
      (count) => generateMockData((id) => ({
        id,
        employeeId: `EMP-${String(id).padStart(3, '0')}`,
        name: `Employee ${id}`,
        email: `employee${id}@company.com`,
        department: ['Molding', 'Polishing', 'Packing', 'Sales', 'Admin'][id % 5],
        position: `Position ${id % 10}`,
        salaryType: ['Fixed Salary', 'Per Piece'][id % 2],
        monthlySalary: id % 2 === 0 ? `$${(Math.random() * 3000 + 2000).toFixed(2)}` : 'N/A',
        pieceRate: id % 2 === 1 ? `$${(Math.random() * 5 + 2).toFixed(2)}/piece` : 'N/A',
        status: ['Active', 'Inactive'][id % 10 === 0 ? 1 : 0]
      }), count),
      ['employeeId', 'name', 'email', 'department', 'position', 'status']
    );
  }

  // Clear cache method
  clearCache(): void {
    this.cache.clear();
  }

  // Get cache stats
  getCacheStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys())
    };
  }
}

export const apiService = new OptimizedApiService();


