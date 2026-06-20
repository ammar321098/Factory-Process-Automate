# Backend Integration Guide

## Summary of Changes Made

### 1. Deleted Duplicate Files
- ✅ `app/[locale]/raw-materials-optimized/page.tsx` - duplicate page removed
- ✅ `app/[locale]/optimized.css` - unused CSS file removed
- ✅ `next.config.optimized.js` - unused config file removed
- ✅ `lib/hooks/useOptimizedData.ts` - duplicate hook removed

### 2. Files That Need Backend Integration

All page components in `app/[locale]/*` need the following updates:

#### Remove Static Mock Data
- Remove all hardcoded arrays of mock data (e.g., `const materialdata = [...]`)
- Replace with empty arrays or data fetched from API

Example:
```typescript
// Before:
const materialdata = [
  { name: "Aluminum Sheet", weight: 500, ... },
  ...
];

// After:
const materialdata: any[] = []; // TODO: Fetch from backend API
```

#### Remove Static KPI Card Values
- Remove hardcoded `value` and `change` properties from KPI configs
- These should be fetched from the backend

Example:
```typescript
// Before:
const stats = [
  { label: "Total", value: "45", change: "+3", ... }
];

// After:
const statsConfig = [
  { key: "total", label: "Total", icon: Package }
];
// Then fetch actual values:
const stats = statsConfig.map(config => ({
  ...config,
  value: dataFromAPI[config.key]?.value || "0",
  change: dataFromAPI[config.key]?.change || "0"
}));
```

#### Remove Static Tab Counts
- Remove `count` property from tab definitions
- Counts should come from backend

Example:
```typescript
// Before:
const tabs = [
  { id: "materials", name: "Materials", count: 45 }
];

// After:
const tabs = [
  { id: "materials", name: "Materials" }
];
// Display count based on data length from backend
```

### 3. Backend API Endpoints Needed

For each module, implement these endpoints:

#### Raw Materials (`/api/materials`)
- `GET /api/materials` - list materials
- `GET /api/materials/stats` - get KPI stats
- `GET /api/materials/sizes` - list standard sizes
- `GET /api/materials/gages` - list standard gages
- `GET /api/materials/weights` - list unit weights
- `POST /api/materials` - create material
- `PUT /api/materials/:id` - update material
- `DELETE /api/materials/:id` - delete material

#### Similar endpoints needed for:
- Employees (`/api/employees`)
- Sales (`/api/sales`, `/api/orders`, `/api/invoices`)
- Inventory (`/api/inventory`, `/api/purchases`, `/api/stock`)
- HR (`/api/hr`, `/api/attendance`, `/api/salary`)
- Reports (`/api/reports/*`)
- Production (`/api/production`, `/api/job-orders`)
- Molding, Polishing, Packing (`/api/molding`, `/api/polishing`, `/api/packing`)
- Transactions (`/api/transactions`)
- Expenses (`/api/expenses`)
- Master data (`/api/clients`, `/api/departments`, `/api/products`)

### 4. Integration Steps

1. Create API service functions in `lib/api-service.ts` for each endpoint
2. Update components to fetch data using React Query or similar
3. Replace static data with API calls
4. Add loading states and error handling
5. Implement pagination, search, and filtering on backend

### 5. Current Status

- ✅ Build compiles successfully
- ✅ No TypeScript errors
- ⏳ Static mock data still present (needs backend integration)
- ⏳ Ready for backend developer to implement API endpoints

### 6. Next Steps for Backend Developer

1. Review `app/[locale]/*` to understand frontend structure
2. Implement API endpoints in `app/api/*`
3. Update components to fetch from API instead of using static data
4. Test with real data
5. Implement proper error handling and loading states

