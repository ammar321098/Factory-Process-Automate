// Mock data for the application
// This file contains all the initial mock data and can be extended as needed

export interface User {
  id: string;
  name: string;
  phone?: string;
  email: string;
  password: string;
  role: string;
  department?: string;
  avatar?: string;
  joined?: boolean;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  createdBy: string;
}

export interface Role {
  id: string;
  name: string;
  permissions: string[];
}

export interface Module {
  key: any;
  id: string;
  name: string;
  path: string;
  icon: string;
  description: string;
  badge?: number;
  active: boolean;
}

export interface DashboardKPIs {
  totalStockValue: number;
  todayProduction: number;
  openOrders: number;
  todaysSales: number;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  manager: string;
  createdAt: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  unit: string;
  description?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  createdAt: string;
}

export interface Material {
  id: string;
  name: string;
  category: string;
  supplier: string;
  stock: number;
  unit: string;
  cost: number;
}

export interface StockEntry {
  id: string;
  productId: string;
  type: "in" | "out";
  quantity: number;
  date: string;
  reason: string;
}

export interface Purchase {
  id: string;
  date: string;
  supplier: string;
  productId: string;
  quantity: number;
  unitCost: number;
  total: number;
  createdAt: string;
}

export interface StockTransaction {
  id: string;
  date: string;
  productId: string;
  type: "purchase" | "sale" | "adjustment" | "transfer" | "issue";
  quantity: number;
  unitCost?: number;
  reference: string; // Purchase ID, Sale ID, etc.
  reason: string;
  balanceAfter: number; // Stock balance after this transaction
}

export interface BOMItem {
  id: string;
  productId: string;
  materialId: string;
  requiredQuantity: number;
  unit: string;
}

export interface Issue {
  id: string;
  date: string;
  productId: string;
  issuedBy: string;
  materials: IssueMaterial[];
  createdAt: string;
}

export interface IssueMaterial {
  materialId: string;
  requiredQuantity: number;
  issuedQuantity: number;
  unit: string;
}

export interface JobOrder {
  id: string;
  productId: string;
  quantity: number;
  dueDate: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  materials: JobOrderMaterial[];
  labour: JobOrderLabour[];
  wastage: JobOrderWastage;
  createdAt: string;
  createdBy: string;
}

export interface JobOrderMaterial {
  materialId: string;
  requiredQuantity: number;
  issuedQuantity: number;
  unit: string;
}

export interface JobOrderLabour {
  id: string;
  employeeId: string;
  employeeName: string;
  hours?: number;
  pieceRate?: number;
  rate: number; // per hour or per piece
  total: number;
}

export interface JobOrderWastage {
  materialWastage: number; // percentage
  labourWastage: number; // percentage
}

export interface SalesOrder {
  id: string;
  clientId: string;
  date: string;
  status: "draft" | "confirmed" | "shipped" | "delivered" | "cancelled";
  items: SalesOrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  createdAt: string;
  createdBy: string;
}

export interface SalesOrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  salesOrderId: string;
  clientId: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  status: "draft" | "sent" | "paid" | "overdue";
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  notes: string;
  createdAt: string;
}

export interface InvoiceItem {
  productId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  weight?: number;
  size?: string;
  total: number;
}

export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  hireDate: string;
  salaryType: "hourly" | "piece_rate";
  hourlyRate?: number;
  pieceRate?: number;
  status: "active" | "inactive";
  createdAt: string;
}

export interface Attendance {
  id: string;
  employeeId: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  hoursWorked: number;
  status: "present" | "absent" | "late" | "half_day";
  notes?: string;
  createdAt: string;
  createdBy: string;
}

export interface SalaryPeriod {
  id: string;
  month: number;
  year: number;
  startDate: string;
  endDate: string;
  status: "draft" | "calculated" | "approved" | "paid";
  createdAt: string;
}

export interface Payslip {
  id: string;
  employeeId: string;
  salaryPeriodId: string;
  basicPay: number;
  overtimePay: number;
  pieceRatePay: number;
  grossPay: number;
  deductions: {
    tax: number;
    insurance: number;
    other: number;
  };
  netPay: number;
  period: string;
  createdAt: string;
}

export interface Account {
  id: string;
  code: string;
  name: string;
  type: "asset" | "liability" | "equity" | "revenue" | "expense";
  balance: number;
  description?: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  reference: string;
  narration: string;
  entries: JournalEntryLine[];
  totalDebit: number;
  totalCredit: number;
  createdAt: string;
  createdBy: string;
}

export interface JournalEntryLine {
  id: string;
  accountId: string;
  debit: number;
  credit: number;
  narration: string;
}

export interface UserRole {
  id: string;
  userId: string;
  roleId: string;
  assignedAt: string;
  assignedBy: string;
}

export interface RoleModule {
  id: string;
  roleId: string;
  moduleId: string;
  assignedAt: string;
  assignedBy: string;
}

// Initial mock data
export const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@company.com",
    password: "admin123", // In production, this would be hashed
    role: "admin",
    department: "IT",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
    isActive: true,
    lastLogin: "2024-01-15T09:30:00Z",
    createdAt: "2024-01-01T00:00:00Z",
    createdBy: "system",
  },
  // {
  //   id: "2",
  //   name: "Jane Smith",
  //   email: "jane@company.com",
  //   password: "manager123",
  //   role: "manager",
  //   department: "Production",
  //   isActive: true,
  //   lastLogin: "2024-01-15T08:45:00Z",
  //   createdAt: "2024-01-01T00:00:00Z",
  //   createdBy: "admin",
  // },
  // {
  //   id: "3",
  //   name: "Bob Johnson",
  //   email: "bob@company.com",
  //   password: "employee123",
  //   role: "employee",
  //   department: "Production",
  //   isActive: true,
  //   lastLogin: "2024-01-15T09:15:00Z",
  //   createdAt: "2024-01-01T00:00:00Z",
  //   createdBy: "admin",
  // },
  // {
  //   id: "4",
  //   name: "Alice Williams",
  //   email: "alice.williams@company.com",
  //   password: "molding123",
  //   role: "molding_manager",
  //   department: "Molding",
  //   isActive: true,
  //   lastLogin: "2024-01-15T08:30:00Z",
  //   createdAt: "2024-01-15T00:00:00Z",
  //   createdBy: "admin",
  // },
  // {
  //   id: "5",
  //   name: "Carol Davis",
  //   email: "carol.davis@company.com",
  //   password: "polishing123",
  //   role: "polishing_manager",
  //   department: "Polishing",
  //   isActive: true,
  //   lastLogin: "2024-01-15T09:00:00Z",
  //   createdAt: "2024-01-15T00:00:00Z",
  //   createdBy: "admin",
  // },
  // {
  //   id: "6",
  //   name: "David Lee",
  //   email: "david.lee@company.com",
  //   password: "packing123",
  //   role: "packing_manager",
  //   department: "Packing",
  //   isActive: true,
  //   lastLogin: "2024-01-15T08:15:00Z",
  //   createdAt: "2024-01-15T00:00:00Z",
  //   createdBy: "admin",
  // },
  // {
  //   id: "7",
  //   name: "Sarah Wilson",
  //   email: "sarah.wilson@company.com",
  //   password: "sales123",
  //   role: "sales_manager",
  //   department: "Sales",
  //   isActive: true,
  //   lastLogin: "2024-01-15T09:45:00Z",
  //   createdAt: "2024-01-15T00:00:00Z",
  //   createdBy: "admin",
  // },
];

export const mockRoles: Role[] = [
  {
    id: "1",
    name: "admin",
    permissions: ["read", "write", "delete", "admin"],
  },
  // {
  //   id: "2",
  //   name: "manager",
  //   permissions: ["read", "write"],
  // },
  // {
  //   id: "3",
  //   name: "employee",
  //   permissions: ["read"],
  // },
  // {
  //   id: "4",
  //   name: "molding_manager",
  //   permissions: ["read", "write"],
  // },
  // {
  //   id: "5",
  //   name: "polishing_manager",
  //   permissions: ["read", "write"],
  // },
  // {
  //   id: "6",
  //   name: "packing_manager",
  //   permissions: ["read", "write"],
  // },
  // {
  //   id: "7",
  //   name: "sales_manager",
  //   permissions: ["read", "write"],
  // },
];

export const mockModules: Module[] = [
  {
    id: "1",
    key: "dashboard",
    name: "Dashboard",
    path: "/dashboard",
    icon: "📊",
    description: "Overview of manufacturing process and key metrics",
    active: true,
  },
  {
    id: "2",
    key: "rawMaterials",
    name: "Raw Materials",
    path: "/raw-materials",
    icon: "🧰",
    description: "Manage raw materials with categories and weights",
    active: true,
  },
  {
    id: "3",
    key: "molding",
    name: "Molding Process",
    path: "/molding",
    icon: "🏭",
    description:
      "Manage molding process with employee tracking and waste calculation",
    active: true,
  },
  {
    id: "4",
    key: "polishing",
    name: "Polishing Process",
    path: "/polishing",
    icon: "✨",
    description:
      "Manage polishing process with employee tracking and waste calculation",
    active: true,
  },
  {
    id: "5",
    key: "packing",
    name: "Packing Process",
    path: "/packing",
    icon: "📦",
    description:
      "Manage packing process with employee tracking and waste calculation",
    active: true,
  },
  // {
  //   id: "6",
  //   key: "stock",
  //   name: "Stock Management",
  //   path: "/stock",
  //   icon: "🏪",
  //   description:
  //     "Manage finished product inventory with names, categories, weights, and sizes",
  //   active: true,
  // },
  // {
  //   id: "7",
  //   key: "sales",
  //   name: "Sales & Billing",
  //   path: "/sales",
  //   icon: "💰",
  //   description: "Sales management, customer billing, and account calculations",
  //   active: true,
  // },
  {
    id: "8",
    key: "employees",
    name: "Employee Management",
    path: "/employees",
    icon: "👥",
    description:
      "Manage employees with fixed salary and per piece salary categories",
    active: true,
  },
  // {
  //   id: "9",
  //   key: "expenses",
  //   name: "Expenses",
  //   path: "/expenses",
  //   icon: "🧾",
  //   description: "Track and manage business expenses",
  //   active: true,
  // },
  // {
  //   id: "10",
  //   key: "customers",
  //   name: "Customers",
  //   path: "/customers",
  //   icon: "👤",
  //   description: "Manage customer information and relationships",
  //   active: true,
  // },
  // {
  //   id: "11",
  //   key: "transactions",
  //   name: "Transactions",
  //   path: "/transactions",
  //   icon: "💳",
  //   description: "Process all payable, receivable, and salary transactions",
  //   active: true,
  // },
  // {
  //   id: "12",
  //   key: "reports",
  //   name: "Reports",
  //   path: "/reports",
  //   icon: "📈",
  //   description: "Generate comprehensive manufacturing and business reports",
  //   active: true,
  // },
  // {
  //   id: "13",
  //   key: "profitLoss",
  //   name: "P&L Analytics",
  //   path: "/analytics/profit-loss",
  //   icon: "📊",
  //   description: "Profit & Loss analytics with interactive charts and insights",
  //   active: true,
  // },
  // {
  //   id: "14",
  //   key: "admin",
  //   name: "Admin Panel",
  //   path: "/admin",
  //   icon: "⚙️",
  //   description:
  //     "Role assignment, module permissions, and system administration",
  //   active: true,
  // },
];

export const mockDashboardKPIs: DashboardKPIs = {
  totalStockValue: 35000000, // 125,000 USD * 280 PKR
  todayProduction: 450,
  openOrders: 23,
  todaysSales: 2380000, // 8,500 USD * 280 PKR
};

export const mockDepartments: Department[] = [
  {
    id: "1",
    name: "Production",
    description: "Manufacturing and production operations",
    manager: "John Smith",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Sales",
    description: "Sales and customer relations",
    manager: "Jane Doe",
    createdAt: "2024-01-16",
  },
  {
    id: "3",
    name: "HR",
    description: "Human resources and administration",
    manager: "Bob Johnson",
    createdAt: "2024-01-17",
  },
];

export const mockProducts: Product[] = [
  {
    id: "1",
    sku: "PROD-001",
    name: "Product A",
    category: "Electronics",
    price: 83997, // 299.99 USD * 280 PKR
    stock: 50,
    unit: "pcs",
    description: "High-quality electronic product",
  },
  {
    id: "2",
    sku: "PROD-002",
    name: "Product B",
    category: "Clothing",
    price: 13997, // 49.99 USD * 280 PKR
    stock: 100,
    unit: "pcs",
    description: "Comfortable clothing item",
  },
  {
    id: "3",
    sku: "PROD-003",
    name: "Product C",
    category: "Books",
    price: 5597, // 19.99 USD * 280 PKR
    stock: 200,
    unit: "pcs",
    description: "Educational book",
  },
];

export const mockClients: Client[] = [
  {
    id: "1",
    name: "Alice Williams",
    email: "alice@company.com",
    phone: "+1-555-0123",
    company: "Tech Corp",
    address: "123 Tech Street, City, State 12345",
    createdAt: "2024-01-10",
  },
  {
    id: "2",
    name: "Charlie Brown",
    email: "charlie@business.com",
    phone: "+1-555-0456",
    company: "Business Inc",
    address: "456 Business Ave, City, State 67890",
    createdAt: "2024-01-12",
  },
  {
    id: "3",
    name: "Diana Prince",
    email: "diana@enterprise.com",
    phone: "+1-555-0789",
    company: "Enterprise Ltd",
    address: "789 Enterprise Blvd, City, State 54321",
    createdAt: "2024-01-14",
  },
];

export const mockMaterials: Material[] = [
  {
    id: "1",
    name: "Raw Material X",
    category: "Components",
    supplier: "Supplier A",
    stock: 500,
    unit: "kg",
    cost: 7140, // 25.50 USD * 280 PKR
  },
  {
    id: "2",
    name: "Raw Material Y",
    category: "Packaging",
    supplier: "Supplier B",
    stock: 1000,
    unit: "pcs",
    cost: 1610, // 5.75 USD * 280 PKR
  },
];

export const mockStockEntries: StockEntry[] = [
  {
    id: "1",
    productId: "1",
    type: "in",
    quantity: 25,
    date: "2024-01-15",
    reason: "New stock received",
  },
  {
    id: "2",
    productId: "1",
    type: "out",
    quantity: 10,
    date: "2024-01-16",
    reason: "Sales order",
  },
  {
    id: "3",
    productId: "2",
    type: "in",
    quantity: 50,
    date: "2024-01-17",
    reason: "Restock",
  },
];

export const mockPurchases: Purchase[] = [
  {
    id: "1",
    date: "2024-01-15",
    supplier: "Tech Suppliers Inc",
    productId: "1",
    quantity: 25,
    unitCost: 250.0,
    total: 6250.0,
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    date: "2024-01-17",
    supplier: "Fashion Wholesale",
    productId: "2",
    quantity: 50,
    unitCost: 30.0,
    total: 1500.0,
    createdAt: "2024-01-17T14:30:00Z",
  },
  {
    id: "3",
    date: "2024-01-20",
    supplier: "Book Distributors",
    productId: "3",
    quantity: 100,
    unitCost: 12.0,
    total: 1200.0,
    createdAt: "2024-01-20T09:15:00Z",
  },
];

export const mockStockTransactions: StockTransaction[] = [
  {
    id: "1",
    date: "2024-01-15",
    productId: "1",
    type: "purchase",
    quantity: 25,
    unitCost: 250.0,
    reference: "PUR-001",
    reason: "Purchase from Tech Suppliers Inc",
    balanceAfter: 75,
  },
  {
    id: "2",
    date: "2024-01-16",
    productId: "1",
    type: "sale",
    quantity: -10,
    reference: "SALE-001",
    reason: "Sales order #12345",
    balanceAfter: 65,
  },
  {
    id: "3",
    date: "2024-01-17",
    productId: "2",
    type: "purchase",
    quantity: 50,
    unitCost: 30.0,
    reference: "PUR-002",
    reason: "Purchase from Fashion Wholesale",
    balanceAfter: 150,
  },
  {
    id: "4",
    date: "2024-01-20",
    productId: "3",
    type: "purchase",
    quantity: 100,
    unitCost: 12.0,
    reference: "PUR-003",
    reason: "Purchase from Book Distributors",
    balanceAfter: 300,
  },
];

export const mockBOMItems: BOMItem[] = [
  {
    id: "1",
    productId: "1", // Product A (Electronics)
    materialId: "1", // Raw Material X
    requiredQuantity: 2,
    unit: "kg",
  },
  {
    id: "2",
    productId: "1", // Product A (Electronics)
    materialId: "2", // Raw Material Y
    requiredQuantity: 5,
    unit: "pcs",
  },
  {
    id: "3",
    productId: "2", // Product B (Clothing)
    materialId: "2", // Raw Material Y
    requiredQuantity: 3,
    unit: "pcs",
  },
  {
    id: "4",
    productId: "3", // Product C (Books)
    materialId: "1", // Raw Material X
    requiredQuantity: 1,
    unit: "kg",
  },
];

export const mockIssues: Issue[] = [
  {
    id: "1",
    date: "2024-01-18",
    productId: "1",
    issuedBy: "John Doe",
    materials: [
      {
        materialId: "1",
        requiredQuantity: 2,
        issuedQuantity: 2,
        unit: "kg",
      },
      {
        materialId: "2",
        requiredQuantity: 5,
        issuedQuantity: 5,
        unit: "pcs",
      },
    ],
    createdAt: "2024-01-18T10:30:00Z",
  },
  {
    id: "2",
    date: "2024-01-19",
    productId: "2",
    issuedBy: "Jane Smith",
    materials: [
      {
        materialId: "2",
        requiredQuantity: 3,
        issuedQuantity: 3,
        unit: "pcs",
      },
    ],
    createdAt: "2024-01-19T14:15:00Z",
  },
];

export const mockJobOrders: JobOrder[] = [
  {
    id: "1",
    productId: "1",
    quantity: 10,
    dueDate: "2024-02-01",
    status: "in_progress",
    materials: [
      {
        materialId: "1",
        requiredQuantity: 20,
        issuedQuantity: 15,
        unit: "kg",
      },
      {
        materialId: "2",
        requiredQuantity: 50,
        issuedQuantity: 45,
        unit: "pcs",
      },
    ],
    labour: [
      {
        id: "1",
        employeeId: "1",
        employeeName: "John Doe",
        hours: 8,
        rate: 25.0,
        total: 200.0,
      },
    ],
    wastage: {
      materialWastage: 5,
      labourWastage: 10,
    },
    createdAt: "2024-01-20T09:00:00Z",
    createdBy: "Jane Smith",
  },
  {
    id: "2",
    productId: "2",
    quantity: 25,
    dueDate: "2024-02-05",
    status: "pending",
    materials: [
      {
        materialId: "2",
        requiredQuantity: 75,
        issuedQuantity: 0,
        unit: "pcs",
      },
    ],
    labour: [],
    wastage: {
      materialWastage: 3,
      labourWastage: 8,
    },
    createdAt: "2024-01-21T14:30:00Z",
    createdBy: "Bob Johnson",
  },
];

export const mockSalesOrders: SalesOrder[] = [
  {
    id: "1",
    clientId: "1",
    date: "2024-01-22",
    status: "confirmed",
    items: [
      {
        productId: "1",
        quantity: 5,
        unitPrice: 299.99,
        total: 1499.95,
      },
      {
        productId: "2",
        quantity: 10,
        unitPrice: 49.99,
        total: 499.9,
      },
    ],
    subtotal: 1999.85,
    tax: 199.99,
    total: 2199.84,
    createdAt: "2024-01-22T10:00:00Z",
    createdBy: "John Doe",
  },
  {
    id: "2",
    clientId: "2",
    date: "2024-01-23",
    status: "draft",
    items: [
      {
        productId: "3",
        quantity: 20,
        unitPrice: 19.99,
        total: 399.8,
      },
    ],
    subtotal: 399.8,
    tax: 39.98,
    total: 439.78,
    createdAt: "2024-01-23T14:30:00Z",
    createdBy: "Jane Smith",
  },
];

export const mockInvoices: Invoice[] = [
  {
    id: "1",
    salesOrderId: "1",
    clientId: "1",
    invoiceNumber: "INV-2024-001",
    date: "2024-01-22",
    dueDate: "2024-02-21",
    status: "sent",
    items: [
      {
        productId: "1",
        description: "High-quality electronic product",
        quantity: 5,
        unitPrice: 299.99,
        weight: 2.5,
        size: "Medium",
        total: 1499.95,
      },
      {
        productId: "2",
        description: "Comfortable clothing item",
        quantity: 10,
        unitPrice: 49.99,
        weight: 0.5,
        size: "Large",
        total: 499.9,
      },
    ],
    subtotal: 1999.85,
    tax: 199.99,
    total: 2199.84,
    notes: "Payment due within 30 days. Thank you for your business!",
    createdAt: "2024-01-22T10:00:00Z",
  },
];

export const mockEmployees: Employee[] = [
  {
    id: "1",
    employeeId: "EMP-001",
    name: "John Smith",
    email: "john.smith@company.com",
    phone: "+1-555-0101",
    department: "Production",
    position: "Machine Operator",
    hireDate: "2023-01-15",
    salaryType: "hourly",
    hourlyRate: 25.0,
    status: "active",
    createdAt: "2023-01-15T09:00:00Z",
  },
  {
    id: "2",
    employeeId: "EMP-002",
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    phone: "+1-555-0102",
    department: "Production",
    position: "Assembly Worker",
    hireDate: "2023-02-01",
    salaryType: "piece_rate",
    pieceRate: 2.5,
    status: "active",
    createdAt: "2023-02-01T09:00:00Z",
  },
  {
    id: "3",
    employeeId: "EMP-003",
    name: "Mike Davis",
    email: "mike.davis@company.com",
    phone: "+1-555-0103",
    department: "Quality Control",
    position: "QC Inspector",
    hireDate: "2023-03-10",
    salaryType: "hourly",
    hourlyRate: 28.0,
    status: "active",
    createdAt: "2023-03-10T09:00:00Z",
  },
  {
    id: "4",
    employeeId: "EMP-004",
    name: "Lisa Wilson",
    email: "lisa.wilson@company.com",
    phone: "+1-555-0104",
    department: "Production",
    position: "Packaging Specialist",
    hireDate: "2023-04-05",
    salaryType: "piece_rate",
    pieceRate: 1.75,
    status: "active",
    createdAt: "2023-04-05T09:00:00Z",
  },
];

export const mockAttendance: Attendance[] = [
  {
    id: "1",
    employeeId: "1",
    date: "2024-01-15",
    checkIn: "09:00",
    checkOut: "17:00",
    hoursWorked: 8,
    status: "present",
    createdAt: "2024-01-15T09:00:00Z",
    createdBy: "HR Admin",
  },
  {
    id: "2",
    employeeId: "1",
    date: "2024-01-16",
    checkIn: "09:15",
    checkOut: "17:00",
    hoursWorked: 7.75,
    status: "late",
    notes: "Traffic delay",
    createdAt: "2024-01-16T09:15:00Z",
    createdBy: "HR Admin",
  },
  {
    id: "3",
    employeeId: "2",
    date: "2024-01-15",
    checkIn: "08:30",
    checkOut: "16:30",
    hoursWorked: 8,
    status: "present",
    createdAt: "2024-01-15T08:30:00Z",
    createdBy: "HR Admin",
  },
  {
    id: "4",
    employeeId: "3",
    date: "2024-01-15",
    checkIn: "09:00",
    checkOut: "17:00",
    hoursWorked: 8,
    status: "present",
    createdAt: "2024-01-15T09:00:00Z",
    createdBy: "HR Admin",
  },
  {
    id: "5",
    employeeId: "4",
    date: "2024-01-15",
    checkIn: "08:45",
    checkOut: "17:15",
    hoursWorked: 8.5,
    status: "present",
    createdAt: "2024-01-15T08:45:00Z",
    createdBy: "HR Admin",
  },
];

export const mockSalaryPeriods: SalaryPeriod[] = [
  {
    id: "1",
    month: 1,
    year: 2024,
    startDate: "2024-01-01",
    endDate: "2024-01-31",
    status: "calculated",
    createdAt: "2024-01-31T17:00:00Z",
  },
];

export const mockPayslips: Payslip[] = [
  {
    id: "1",
    employeeId: "1",
    salaryPeriodId: "1",
    basicPay: 4000.0,
    overtimePay: 500.0,
    pieceRatePay: 0,
    grossPay: 4500.0,
    deductions: {
      tax: 900.0,
      insurance: 200.0,
      other: 50.0,
    },
    netPay: 3350.0,
    period: "January 2024",
    createdAt: "2024-01-31T17:00:00Z",
  },
  {
    id: "2",
    employeeId: "2",
    salaryPeriodId: "1",
    basicPay: 0,
    overtimePay: 0,
    pieceRatePay: 3200.0,
    grossPay: 3200.0,
    deductions: {
      tax: 640.0,
      insurance: 150.0,
      other: 30.0,
    },
    netPay: 2380.0,
    period: "January 2024",
    createdAt: "2024-01-31T17:00:00Z",
  },
];

export const mockAccounts: Account[] = [
  {
    id: "1",
    code: "1001",
    name: "Cash",
    type: "asset",
    balance: 0,
    description: "Cash on hand and in bank",
  },
  {
    id: "2",
    code: "1002",
    name: "Accounts Receivable",
    type: "asset",
    balance: 0,
    description: "Money owed by customers",
  },
  {
    id: "3",
    code: "1003",
    name: "Inventory",
    type: "asset",
    balance: 0,
    description: "Raw materials and finished goods",
  },
  {
    id: "4",
    code: "2001",
    name: "Accounts Payable",
    type: "liability",
    balance: 0,
    description: "Money owed to suppliers",
  },
  {
    id: "5",
    code: "2002",
    name: "Accrued Expenses",
    type: "liability",
    balance: 0,
    description: "Expenses incurred but not yet paid",
  },
  {
    id: "6",
    code: "3001",
    name: "Owner's Equity",
    type: "equity",
    balance: 0,
    description: "Owner's investment in the business",
  },
  {
    id: "7",
    code: "4001",
    name: "Sales Revenue",
    type: "revenue",
    balance: 0,
    description: "Revenue from sales",
  },
  {
    id: "8",
    code: "5001",
    name: "Cost of Goods Sold",
    type: "expense",
    balance: 0,
    description: "Direct costs of producing goods",
  },
  {
    id: "9",
    code: "5002",
    name: "Operating Expenses",
    type: "expense",
    balance: 0,
    description: "General business expenses",
  },
];

export const mockJournalEntries: JournalEntry[] = [
  {
    id: "1",
    date: "2024-01-01",
    reference: "JE-001",
    narration: "Initial cash investment",
    entries: [
      {
        id: "1",
        accountId: "1", // Cash
        debit: 100000,
        credit: 0,
        narration: "Cash received from owner",
      },
      {
        id: "2",
        accountId: "6", // Owner's Equity
        debit: 0,
        credit: 100000,
        narration: "Owner investment",
      },
    ],
    totalDebit: 100000,
    totalCredit: 100000,
    createdAt: "2024-01-01T09:00:00Z",
    createdBy: "Admin",
  },
  {
    id: "2",
    date: "2024-01-15",
    reference: "JE-002",
    narration: "Purchase inventory on credit",
    entries: [
      {
        id: "3",
        accountId: "3", // Inventory
        debit: 50000,
        credit: 0,
        narration: "Inventory purchased",
      },
      {
        id: "4",
        accountId: "4", // Accounts Payable
        debit: 0,
        credit: 50000,
        narration: "Amount owed to supplier",
      },
    ],
    totalDebit: 50000,
    totalCredit: 50000,
    createdAt: "2024-01-15T10:00:00Z",
    createdBy: "Admin",
  },
  {
    id: "3",
    date: "2024-01-20",
    reference: "JE-003",
    narration: "Sale on credit",
    entries: [
      {
        id: "5",
        accountId: "2", // Accounts Receivable
        debit: 30000,
        credit: 0,
        narration: "Amount owed by customer",
      },
      {
        id: "6",
        accountId: "7", // Sales Revenue
        debit: 0,
        credit: 30000,
        narration: "Revenue from sale",
      },
    ],
    totalDebit: 30000,
    totalCredit: 30000,
    createdAt: "2024-01-20T14:00:00Z",
    createdBy: "Admin",
  },
];

export const mockUserRoles: UserRole[] = [
  {
    id: "1",
    userId: "1",
    roleId: "1", // admin
    assignedAt: "2024-01-01T00:00:00Z",
    assignedBy: "system",
  },
  {
    id: "2",
    userId: "2",
    roleId: "2", // manager
    assignedAt: "2024-01-01T00:00:00Z",
    assignedBy: "admin",
  },
  {
    id: "3",
    userId: "3",
    roleId: "3", // employee
    assignedAt: "2024-01-01T00:00:00Z",
    assignedBy: "admin",
  },
  {
    id: "4",
    userId: "4",
    roleId: "4", // molding_manager
    assignedAt: "2024-01-15T00:00:00Z",
    assignedBy: "admin",
  },
  {
    id: "5",
    userId: "5",
    roleId: "5", // polishing_manager
    assignedAt: "2024-01-15T00:00:00Z",
    assignedBy: "admin",
  },
  {
    id: "6",
    userId: "6",
    roleId: "6", // packing_manager
    assignedAt: "2024-01-15T00:00:00Z",
    assignedBy: "admin",
  },
  {
    id: "7",
    userId: "7",
    roleId: "7", // sales_manager
    assignedAt: "2024-01-15T00:00:00Z",
    assignedBy: "admin",
  },
];

export const mockRoleModules: RoleModule[] = [
  // Admin role has access to all modules
  {
    id: "1",
    roleId: "1",
    moduleId: "1", // Dashboard
    assignedAt: "2024-01-01T00:00:00Z",
    assignedBy: "system",
  },
  {
    id: "2",
    roleId: "1",
    moduleId: "2", // Raw Materials
    assignedAt: "2024-01-01T00:00:00Z",
    assignedBy: "system",
  },
  {
    id: "3",
    roleId: "1",
    moduleId: "3", // Molding Process
    assignedAt: "2024-01-01T00:00:00Z",
    assignedBy: "system",
  },
  {
    id: "4",
    roleId: "1",
    moduleId: "4", // Polishing Process
    assignedAt: "2024-01-01T00:00:00Z",
    assignedBy: "system",
  },
  {
    id: "5",
    roleId: "1",
    moduleId: "5", // Packing Process
    assignedAt: "2024-01-01T00:00:00Z",
    assignedBy: "system",
  },
  {
    id: "6",
    roleId: "1",
    moduleId: "6", // Stock Management
    assignedAt: "2024-01-01T00:00:00Z",
    assignedBy: "system",
  },
  {
    id: "7",
    roleId: "1",
    moduleId: "7", // Sales & Billing
    assignedAt: "2024-01-01T00:00:00Z",
    assignedBy: "system",
  },
  {
    id: "8",
    roleId: "1",
    moduleId: "8", // Employee Management
    assignedAt: "2024-01-01T00:00:00Z",
    assignedBy: "system",
  },
  {
    id: "9",
    roleId: "1",
    moduleId: "9", // Expenses
    assignedAt: "2024-01-01T00:00:00Z",
    assignedBy: "system",
  },
  {
    id: "10",
    roleId: "1",
    moduleId: "10", // Customers
    assignedAt: "2024-01-01T00:00:00Z",
    assignedBy: "system",
  },
  {
    id: "11",
    roleId: "1",
    moduleId: "11", // Accounts
    assignedAt: "2024-01-01T00:00:00Z",
    assignedBy: "system",
  },
  {
    id: "12",
    roleId: "1",
    moduleId: "12", // Transactions
    assignedAt: "2024-01-01T00:00:00Z",
    assignedBy: "system",
  },
  {
    id: "13",
    roleId: "1",
    moduleId: "13", // Reports
    assignedAt: "2024-01-01T00:00:00Z",
    assignedBy: "system",
  },
  {
    id: "14",
    roleId: "1",
    moduleId: "14", // Admin Panel
    assignedAt: "2024-01-01T00:00:00Z",
    assignedBy: "system",
  },
  // Molding Manager role
  {
    id: "15",
    roleId: "4",
    moduleId: "1", // Dashboard
    assignedAt: "2024-01-01T00:00:00Z",
    assignedBy: "admin",
  },
  {
    id: "16",
    roleId: "4",
    moduleId: "2", // Raw Materials
    assignedAt: "2024-01-01T00:00:00Z",
    assignedBy: "admin",
  },
  {
    id: "17",
    roleId: "4",
    moduleId: "3", // Molding Process
    assignedAt: "2024-01-01T00:00:00Z",
    assignedBy: "admin",
  },
  {
    id: "18",
    roleId: "4",
    moduleId: "6", // Stock Management
    assignedAt: "2024-01-01T00:00:00Z",
    assignedBy: "admin",
  },
  // Polishing Manager role
  {
    id: "19",
    roleId: "5",
    moduleId: "1", // Dashboard
    assignedAt: "2024-01-01T00:00:00Z",
    assignedBy: "admin",
  },
  {
    id: "20",
    roleId: "5",
    moduleId: "3", // Molding Process
    assignedAt: "2024-01-01T00:00:00Z",
    assignedBy: "admin",
  },
  {
    id: "21",
    roleId: "5",
    moduleId: "4", // Polishing Process
    assignedAt: "2024-01-01T00:00:00Z",
    assignedBy: "admin",
  },
  {
    id: "22",
    roleId: "5",
    moduleId: "6", // Stock Management
    assignedAt: "2024-01-01T00:00:00Z",
    assignedBy: "admin",
  },
  // Packing Manager role
  {
    id: "23",
    roleId: "6",
    moduleId: "1", // Dashboard
    assignedAt: "2024-01-01T00:00:00Z",
    assignedBy: "admin",
  },
  {
    id: "24",
    roleId: "6",
    moduleId: "4", // Polishing Process
    assignedAt: "2024-01-01T00:00:00Z",
    assignedBy: "admin",
  },
  {
    id: "25",
    roleId: "6",
    moduleId: "5", // Packing Process
    assignedAt: "2024-01-01T00:00:00Z",
    assignedBy: "admin",
  },
  {
    id: "26",
    roleId: "6",
    moduleId: "6", // Stock Management
    assignedAt: "2024-01-01T00:00:00Z",
    assignedBy: "admin",
  },
  // Sales Manager role
  {
    id: "27",
    roleId: "7",
    moduleId: "1", // Dashboard
    assignedAt: "2024-01-01T00:00:00Z",
    assignedBy: "admin",
  },
  {
    id: "28",
    roleId: "7",
    moduleId: "6", // Stock Management
    assignedAt: "2024-01-01T00:00:00Z",
    assignedBy: "admin",
  },
  {
    id: "29",
    roleId: "7",
    moduleId: "7", // Sales & Billing
    assignedAt: "2024-01-01T00:00:00Z",
    assignedBy: "admin",
  },
  {
    id: "30",
    roleId: "7",
    moduleId: "10", // Customers
    assignedAt: "2024-01-01T00:00:00Z",
    assignedBy: "admin",
  },
  {
    id: "31",
    roleId: "7",
    moduleId: "11", // Accounts
    assignedAt: "2024-01-01T00:00:00Z",
    assignedBy: "admin",
  },
  {
    id: "32",
    roleId: "7",
    moduleId: "13", // Reports
    assignedAt: "2024-01-01T00:00:00Z",
    assignedBy: "admin",
  },
  // Manager role has limited access
  {
    id: "33",
    roleId: "2",
    moduleId: "1", // Dashboard
    assignedAt: "2024-01-01T00:00:00Z",
    assignedBy: "admin",
  },
  {
    id: "34",
    roleId: "2",
    moduleId: "6", // Stock Management
    assignedAt: "2024-01-01T00:00:00Z",
    assignedBy: "admin",
  },
  {
    id: "35",
    roleId: "2",
    moduleId: "7", // Sales & Billing
    assignedAt: "2024-01-01T00:00:00Z",
    assignedBy: "admin",
  },
  {
    id: "36",
    roleId: "2",
    moduleId: "13", // Reports
    assignedAt: "2024-01-01T00:00:00Z",
    assignedBy: "admin",
  },
  // Employee role has minimal access
  {
    id: "37",
    roleId: "3",
    moduleId: "1", // Dashboard
    assignedAt: "2024-01-01T00:00:00Z",
    assignedBy: "admin",
  },
  {
    id: "38",
    roleId: "3",
    moduleId: "6", // Stock Management
    assignedAt: "2024-01-01T00:00:00Z",
    assignedBy: "admin",
  },
];

// How to extend mock data:
// 1. Add new interfaces above for your data types
// 2. Create new mock arrays with your initial data
// 3. Export them so they can be used in the useMockApi hook
// 4. Update the useMockApi hook to include your new data types
