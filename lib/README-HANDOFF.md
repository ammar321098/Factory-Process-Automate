# Backend Integration Handoff Guide

This document provides a comprehensive mapping of mock functions to backend endpoints and guidance for integrating with a real backend system.

## 🏗️ Architecture Overview

### Current Mock System
- **Data Storage**: In-memory arrays in `useMockApi.ts`
- **State Management**: React state with `useState` and `useCallback`
- **Updates**: Direct array mutations with `triggerUpdate()`
- **Relationships**: Manual foreign key lookups

### Target Backend Architecture
```
Frontend (Next.js) ↔ API Layer ↔ Database
                         ↓
                   Authentication
                   Authorization
                   Business Logic
```

## 📊 Mock Function to API Endpoint Mapping

### Authentication & Users

| Mock Function | HTTP Method | Endpoint | Purpose |
|---------------|-------------|----------|---------|
| `getUsers()` | GET | `/api/users` | Get all users |
| `createUser()` | POST | `/api/users` | Create new user |
| `updateUser()` | PUT | `/api/users/{id}` | Update user |
| `deleteUser()` | DELETE | `/api/users/{id}` | Delete user |

**Request/Response Examples:**
```typescript
// GET /api/users
Response: {
  users: User[],
  total: number,
  page: number,
  limit: number
}

// POST /api/users
Request: {
  name: string,
  email: string,
  roleId: string
}
Response: User
```

### Role & Module Management

| Mock Function | HTTP Method | Endpoint | Purpose |
|---------------|-------------|----------|---------|
| `getRoles()` | GET | `/api/roles` | Get all roles |
| `createRole()` | POST | `/api/roles` | Create role |
| `updateRole()` | PUT | `/api/roles/{id}` | Update role |
| `deleteRole()` | DELETE | `/api/roles/{id}` | Delete role |
| `assignModuleToRole()` | POST | `/api/roles/{id}/modules` | Assign module to role |
| `unassignModuleFromRole()` | DELETE | `/api/roles/{id}/modules/{moduleId}` | Unassign module |

### Master Data Management

| Mock Function | HTTP Method | Endpoint | Purpose |
|---------------|-------------|----------|---------|
| `getDepartments()` | GET | `/api/departments` | Get departments |
| `createDepartment()` | POST | `/api/departments` | Create department |
| `getProducts()` | GET | `/api/products` | Get products |
| `createProduct()` | POST | `/api/products` | Create product |
| `getClients()` | GET | `/api/clients` | Get clients |
| `createClient()` | POST | `/api/clients` | Create client |

### Inventory Management

| Mock Function | HTTP Method | Endpoint | Purpose |
|---------------|-------------|----------|---------|
| `getPurchases()` | GET | `/api/inventory/purchases` | Get purchase records |
| `createPurchase()` | POST | `/api/inventory/purchases` | Create purchase |
| `getStockTransactions()` | GET | `/api/inventory/transactions` | Get stock transactions |
| `createIssue()` | POST | `/api/inventory/issues` | Issue materials to production |

### Production Management

| Mock Function | HTTP Method | Endpoint | Purpose |
|---------------|-------------|----------|---------|
| `getJobOrders()` | GET | `/api/production/job-orders` | Get job orders |
| `createJobOrder()` | POST | `/api/production/job-orders` | Create job order |
| `updateJobOrder()` | PUT | `/api/production/job-orders/{id}` | Update job order |
| `simulateProduction()` | POST | `/api/production/job-orders/{id}/simulate` | Simulate production |

### Sales & Invoicing

| Mock Function | HTTP Method | Endpoint | Purpose |
|---------------|-------------|----------|---------|
| `getSalesOrders()` | GET | `/api/sales/orders` | Get sales orders |
| `createSalesOrder()` | POST | `/api/sales/orders` | Create sales order |
| `getInvoices()` | GET | `/api/sales/invoices` | Get invoices |
| `createInvoiceFromSalesOrder()` | POST | `/api/sales/orders/{id}/invoice` | Generate invoice |

### HR Management

| Mock Function | HTTP Method | Endpoint | Purpose |
|---------------|-------------|----------|---------|
| `getEmployees()` | GET | `/api/hr/employees` | Get employees |
| `createEmployee()` | POST | `/api/hr/employees` | Create employee |
| `getAttendance()` | GET | `/api/hr/attendance` | Get attendance records |
| `createAttendance()` | POST | `/api/hr/attendance` | Create attendance record |
| `calculateEmployeeSalary()` | GET | `/api/hr/employees/{id}/salary` | Calculate salary |

### Accounting

| Mock Function | HTTP Method | Endpoint | Purpose |
|---------------|-------------|----------|---------|
| `getJournalEntries()` | GET | `/api/accounting/journal` | Get journal entries |
| `createJournalEntry()` | POST | `/api/accounting/journal` | Create journal entry |
| `getAccounts()` | GET | `/api/accounting/accounts` | Get chart of accounts |
| `calculateAccountBalances()` | POST | `/api/accounting/balances/recalculate` | Recalculate balances |

## 🔄 Integration Steps

### Step 1: Create API Layer

Create an API client to replace mock functions:

```typescript
// lib/api-client.ts
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  setToken(token: string) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  // Users
  async getUsers(): Promise<User[]> {
    return this.request<User[]>('/api/users');
  }

  async createUser(user: Omit<User, 'id'>): Promise<User> {
    return this.request<User>('/api/users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  }

  // Add other methods...
}

export const apiClient = new ApiClient(process.env.NEXT_PUBLIC_API_URL!);
```

### Step 2: Replace Mock Hook

Update `useMockApi.ts` to use real API calls:

```typescript
// lib/useApi.ts
export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequest = async <T>(
    requestFn: () => Promise<T>
  ): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      return await requestFn();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getUsers = () => handleRequest(() => apiClient.getUsers());
  const createUser = (user: Omit<User, 'id'>) => 
    handleRequest(() => apiClient.createUser(user));

  return {
    loading,
    error,
    getUsers,
    createUser,
    // ... other methods
  };
};
```

### Step 3: Authentication Integration

Implement session-based authentication:

```typescript
// lib/auth.ts
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      apiClient.setToken(token);
      // Verify token and get user info
      verifyToken(token).then(setUser).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await apiClient.login({ email, password });
    localStorage.setItem('auth_token', response.token);
    apiClient.setToken(response.token);
    setUser(response.user);
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    apiClient.setToken('');
    setUser(null);
  };

  return { user, login, logout, loading };
};
```

### Step 4: Database Schema

Example database schema for key entities:

```sql
-- Users and Roles
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  permissions TEXT[] NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role_id UUID REFERENCES roles(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Products and Inventory
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  price DECIMAL(10,2) NOT NULL,
  stock INTEGER DEFAULT 0,
  unit VARCHAR(50) DEFAULT 'pcs',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE stock_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id),
  type VARCHAR(50) NOT NULL, -- 'purchase', 'issue', 'adjustment'
  quantity INTEGER NOT NULL,
  unit_cost DECIMAL(10,2),
  reference_id UUID, -- Links to purchase, issue, etc.
  created_at TIMESTAMP DEFAULT NOW()
);

-- Job Orders and Production
CREATE TABLE job_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'draft',
  due_date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE job_order_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_order_id UUID REFERENCES job_orders(id),
  material_id UUID REFERENCES products(id),
  required_quantity INTEGER NOT NULL,
  issued_quantity INTEGER DEFAULT 0
);
```

### Step 5: Cost Calculation Integration

Update cost calculation to work with persisted data:

```typescript
// lib/costs.ts - Updated for backend integration
export async function calculateCostPerPiece(
  jobOrderId: string,
  apiClient: ApiClient
): Promise<CostBreakdown> {
  // Fetch job order with materials and labour
  const jobOrder = await apiClient.getJobOrder(jobOrderId);
  const materials = await apiClient.getMaterials();
  const product = await apiClient.getProduct(jobOrder.productId);

  // Calculate costs using fetched data
  const materialCost = calculateMaterialCost(
    jobOrder.materials, 
    materials, 
    jobOrder.wastage.materialWastage
  );

  const labourCost = calculateLabourCost(
    jobOrder.labour, 
    jobOrder.wastage.labourWastage
  );

  // Return calculated breakdown
  return {
    materialCost,
    labourCost,
    totalCost: materialCost + labourCost,
    costPerPiece: jobOrder.quantity > 0 ? (materialCost + labourCost) / jobOrder.quantity : 0,
    profitMargin: product.price > 0 ? ((product.price - costPerPiece) / product.price) * 100 : 0,
    profitPerPiece: product.price - costPerPiece,
  };
}
```

## 🔐 Security Implementation

### Authentication Middleware

```typescript
// middleware/auth.ts
export function withAuth(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    try {
      const user = await verifyJWT(token);
      req.user = user;
      return handler(req, res);
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
}
```

### Authorization Checks

```typescript
// middleware/authorization.ts
export function requirePermission(permission: string) {
  return (handler: NextApiHandler) => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
      const user = req.user;
      
      if (!user.role.permissions.includes(permission)) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      return handler(req, res);
    };
  };
}

// Usage in API routes
export default withAuth(requirePermission('write')(handler));
```

## 📊 Real-time Updates

### WebSocket Integration

```typescript
// lib/websocket.ts
export const useWebSocket = (url: string) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket(url);
    
    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    ws.onerror = (error) => console.error('WebSocket error:', error);

    setSocket(ws);

    return () => ws.close();
  }, [url]);

  const subscribe = (event: string, callback: (data: any) => void) => {
    if (socket) {
      socket.addEventListener('message', (event) => {
        const { type, data } = JSON.parse(event.data);
        if (type === event) {
          callback(data);
        }
      });
    }
  };

  return { socket, connected, subscribe };
};
```

## 🧪 Testing Strategy

### API Testing

```typescript
// tests/api.test.ts
describe('API Integration', () => {
  test('should fetch users', async () => {
    const users = await apiClient.getUsers();
    expect(users).toBeInstanceOf(Array);
  });

  test('should create user', async () => {
    const newUser = await apiClient.createUser({
      name: 'Test User',
      email: 'test@example.com',
    });
    expect(newUser.id).toBeDefined();
  });
});
```

### Error Handling

```typescript
// lib/error-handling.ts
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const handleApiError = (error: any): string => {
  if (error instanceof ApiError) {
    return error.message;
  }
  return 'An unexpected error occurred';
};
```

## 🚀 Deployment Considerations

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api
DATABASE_URL=postgresql://user:password@localhost:5432/automate_process
JWT_SECRET=your-jwt-secret
REDIS_URL=redis://localhost:6379
```

### Docker Configuration

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📈 Performance Optimization

### Caching Strategy

```typescript
// lib/cache.ts
export const cache = {
  get: async <T>(key: string): Promise<T | null> => {
    // Implement Redis or in-memory cache
  },
  set: async <T>(key: string, value: T, ttl?: number): Promise<void> => {
    // Implement cache storage
  },
  invalidate: async (pattern: string): Promise<void> => {
    // Implement cache invalidation
  },
};
```

### Database Optimization

- Use database indexes for frequently queried fields
- Implement pagination for large datasets
- Use database views for complex queries
- Consider read replicas for reporting queries

---

This handoff guide provides the foundation for integrating the mock system with a real backend. The key is to maintain the same interface while replacing the implementation with actual API calls and database operations.
