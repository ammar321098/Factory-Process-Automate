// API service for Employees module

export interface Employee {
  id: number;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  hireDate: string;
  salaryType: "PIECE_RATE" | "MONTHLY";
  hourlyRate?: number;
  pieceRate?: number;
  dailyRate?: number;
  monthlySalary?: number;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  departmentId?: number;
  departments?: {
    id: number;
    name: string;
    description: string;
  };
  attendance?: {
    id: number;
    date: string;
    status: string;
  }[];
  payslips?: {
    id: number;
    month: number;
    year: number;
    grossSalary: number;
    netSalary: number;
    status: string;
  }[];
}

export interface EmployeeStats {
  totalEmployees: number;
  moldingEmployees: number;
  polishingEmployees: number;
  monthlySalaryEmployees: number;
  pieceRateEmployees: number;
}

export interface EmployeesResponse {
  data: Employee[];
  total: number;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface EmployeeProductionRecord {
  name: string;
  department: string;
  product: string;
  totalPieces: number;
  pricePerPiece: number;
  totalAmount: number;
  date: string; // ISO string
}

export interface EmployeesProductionResponse {
  data: EmployeeProductionRecord[];
  total: number;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Fetch employees with filters
export async function fetchEmployees(
  params: {
    page?: number;
    limit?: number;
    search?: string;
    department?: string;
    status?: string;
    salaryType?: string;
    sortBy?: string;
    sortOrder?: string;
  } = {}
): Promise<EmployeesResponse> {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      searchParams.append(key, value.toString());
    }
  });

  const response = await fetch(`/api/employees?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to fetch employees");
  }

  return response.json();
}

// Fetch single employee
export async function fetchEmployee(id: string): Promise<Employee> {
  const response = await fetch(`/api/employees/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch employee");
  }

  return response.json();
}

// Create employee
export async function createEmployee(data: {
  name: string;
  email?: string;
  phone: string;
  department: string;
  position?: string;
  salaryType: "PIECE" | "MONTHLY";
  monthlySalary?: number;
  status?: "ACTIVE" | "INACTIVE";
}): Promise<Employee> {

  const response = await fetch("/api/employees", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create employee");
  }

  return response.json();
}

// Update employee
export async function updateEmployee(
  id: string,
  data: {
    employeeId: string;
    name: string;
    email: string;
    phone: string;
    department: string;
    position: string;
    hireDate: string;
    salaryType: "HOURLY" | "PIECE_RATE" | "DAILY" | "MONTHLY";
    hourlyRate?: number;
    pieceRate?: number;
    dailyRate?: number;
    monthlySalary?: number;
    status?: "ACTIVE" | "INACTIVE";
  }
): Promise<Employee> {
  const response = await fetch(`/api/employees/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update employee");
  }

  return response.json();
}

// Delete employee
export async function deleteEmployee(id: string): Promise<void> {
  const response = await fetch(`/api/employees/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete employee");
  }
}

// Fetch employees statistics
export async function fetchEmployeesStats(): Promise<EmployeeStats> {
  const response = await fetch("/api/employees/stats");

  if (!response.ok) {
    throw new Error("Failed to fetch employees stats");
  }

  return response.json();
}

// Fetch employees production statistics
export async function fetchEmployeesProduction(
  params: {
    page?: number;
    limit?: number;
    search?: string;
    department?: string;
    status?: string;
    salaryType?: string;
    sortBy?: string;
    sortOrder?: string;
  } = {}
): Promise<EmployeesProductionResponse> {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      searchParams.append(key, value.toString());
    }
  });

  const response = await fetch(
    `/api/employees/production-stat?${searchParams.toString()}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch employees");
  }

  return response.json();
}
