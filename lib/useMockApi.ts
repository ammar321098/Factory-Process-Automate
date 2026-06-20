import { useState, useCallback } from "react";
import {
  mockUsers,
  mockRoles,
  mockModules,
  mockDepartments,
  mockProducts,
  mockClients,
  mockMaterials,
  mockStockEntries,
  mockPurchases,
  mockStockTransactions,
  mockBOMItems,
  mockIssues,
  mockJobOrders,
  mockSalesOrders,
  mockInvoices,
  mockEmployees,
  mockAttendance,
  mockSalaryPeriods,
  mockPayslips,
  mockAccounts,
  mockJournalEntries,
  mockUserRoles,
  mockRoleModules,
  User,
  Role,
  Module,
  Department,
  Product,
  Client,
  Material,
  StockEntry,
  Purchase,
  StockTransaction,
  BOMItem,
  Issue,
  JobOrder,
  SalesOrder,
  Invoice,
  Employee,
  Attendance,
  SalaryPeriod,
  Payslip,
  Account,
  JournalEntry,
  JournalEntryLine,
  UserRole,
  RoleModule,
} from "./mocks";

// In-memory data stores (these would be replaced with actual API calls)
let users = [...mockUsers];
let roles = [...mockRoles];
let modules = [...mockModules];
let departments = [...mockDepartments];
let products = [...mockProducts];
let clients = [...mockClients];
let materials = [...mockMaterials];
let stockEntries = [...mockStockEntries];
let purchases = [...mockPurchases];
let stockTransactions = [...mockStockTransactions];
let bomItems = [...mockBOMItems];
let issues = [...mockIssues];
let jobOrders = [...mockJobOrders];
let salesOrders = [...mockSalesOrders];
let invoices = [...mockInvoices];
let employees = [...mockEmployees];
let attendance = [...mockAttendance];
let salaryPeriods = [...mockSalaryPeriods];
let payslips = [...mockPayslips];
let accounts = [...mockAccounts];
let journalEntries = [...mockJournalEntries];
let userRoles = [...mockUserRoles];
let roleModules = [...mockRoleModules];

export const useMockApi = () => {
  // State to trigger re-renders when data changes
  const [, setUpdateCounter] = useState(0);

  const triggerUpdate = useCallback(() => {
    setUpdateCounter((prev) => prev + 1);
  }, []);

  // Memoize the loading state to prevent unnecessary re-renders
  const loading = false;

  // Users API
  const getUsers = useCallback(() => users, []);
  const createUser = useCallback(
    (user: Omit<User, "id">) => {
      const newUser = { ...user, id: Date.now().toString() };
      users.push(newUser);
      triggerUpdate();
      return newUser;
    },
    [triggerUpdate]
  );
  const updateUser = useCallback(
    (id: string, updates: Partial<User>) => {
      const index = users.findIndex((user) => user.id === id);
      if (index !== -1) {
        users[index] = { ...users[index], ...updates };
        triggerUpdate();
        return users[index];
      }
      return null;
    },
    [triggerUpdate]
  );
  const deleteUser = useCallback(
    (id: string) => {
      const index = users.findIndex((user) => user.id === id);
      if (index !== -1) {
        users.splice(index, 1);
        triggerUpdate();
        return true;
      }
      return false;
    },
    [triggerUpdate]
  );

  // Roles API
  const getRoles = useCallback(() => roles, []);

  // Modules API
  const getModules = useCallback(() => modules, []);
  const updateModuleBadge = useCallback(
    (moduleId: string, badge?: number) => {
      const index = modules.findIndex((module) => module.id === moduleId);
      if (index !== -1) {
        modules[index] = { ...modules[index], badge };
        triggerUpdate();
      }
    },
    [triggerUpdate]
  );

  // Products API
  const getProducts = useCallback(() => products, []);
  const createProduct = useCallback(
    (product: Omit<Product, "id">) => {
      const newProduct = { ...product, id: Date.now().toString() };
      products.push(newProduct);
      triggerUpdate();
      return newProduct;
    },
    [triggerUpdate]
  );
  const updateProduct = useCallback(
    (id: string, updates: Partial<Product>) => {
      const index = products.findIndex((product) => product.id === id);
      if (index !== -1) {
        products[index] = { ...products[index], ...updates };
        triggerUpdate();
        return products[index];
      }
      return null;
    },
    [triggerUpdate]
  );
  const deleteProduct = useCallback(
    (id: string) => {
      const index = products.findIndex((product) => product.id === id);
      if (index !== -1) {
        products.splice(index, 1);
        triggerUpdate();
        return true;
      }
      return false;
    },
    [triggerUpdate]
  );

  // Materials API
  const getMaterials = useCallback(() => materials, []);
  const createMaterial = useCallback(
    (material: Omit<Material, "id">) => {
      const newMaterial = { ...material, id: Date.now().toString() };
      materials.push(newMaterial);
      triggerUpdate();
      return newMaterial;
    },
    [triggerUpdate]
  );
  const updateMaterial = useCallback(
    (id: string, updates: Partial<Material>) => {
      const index = materials.findIndex((material) => material.id === id);
      if (index !== -1) {
        materials[index] = { ...materials[index], ...updates };
        triggerUpdate();
        return materials[index];
      }
      return null;
    },
    [triggerUpdate]
  );

  // Departments API
  const getDepartments = useCallback(() => departments, []);
  const createDepartment = useCallback(
    (department: Omit<Department, "id" | "createdAt">) => {
      const newDepartment = {
        ...department,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split("T")[0],
      };
      departments.push(newDepartment);
      triggerUpdate();
      return newDepartment;
    },
    [triggerUpdate]
  );
  const updateDepartment = useCallback(
    (id: string, updates: Partial<Department>) => {
      const index = departments.findIndex((dept) => dept.id === id);
      if (index !== -1) {
        departments[index] = { ...departments[index], ...updates };
        triggerUpdate();
        return departments[index];
      }
      return null;
    },
    [triggerUpdate]
  );
  const deleteDepartment = useCallback(
    (id: string) => {
      const index = departments.findIndex((dept) => dept.id === id);
      if (index !== -1) {
        departments.splice(index, 1);
        triggerUpdate();
        return true;
      }
      return false;
    },
    [triggerUpdate]
  );

  // Clients API
  const getClients = useCallback(() => clients, []);
  const createClient = useCallback(
    (client: Omit<Client, "id" | "createdAt">) => {
      const newClient = {
        ...client,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split("T")[0],
      };
      clients.push(newClient);
      triggerUpdate();
      return newClient;
    },
    [triggerUpdate]
  );
  const updateClient = useCallback(
    (id: string, updates: Partial<Client>) => {
      const index = clients.findIndex((client) => client.id === id);
      if (index !== -1) {
        clients[index] = { ...clients[index], ...updates };
        triggerUpdate();
        return clients[index];
      }
      return null;
    },
    [triggerUpdate]
  );
  const deleteClient = useCallback(
    (id: string) => {
      const index = clients.findIndex((client) => client.id === id);
      if (index !== -1) {
        clients.splice(index, 1);
        triggerUpdate();
        return true;
      }
      return false;
    },
    [triggerUpdate]
  );

  // Stock Entries API
  const getStockEntries = useCallback(() => stockEntries, []);
  const createStockEntry = useCallback(
    (entry: Omit<StockEntry, "id">) => {
      const newEntry = { ...entry, id: Date.now().toString() };
      stockEntries.push(newEntry);
      triggerUpdate();
      return newEntry;
    },
    [triggerUpdate]
  );

  // Purchases API
  const getPurchases = useCallback(() => purchases, []);
  const createPurchase = useCallback(
    (purchase: Omit<Purchase, "id" | "createdAt" | "total">) => {
      const total = purchase.quantity * purchase.unitCost;
      const newPurchase = {
        ...purchase,
        id: Date.now().toString(),
        total,
        createdAt: new Date().toISOString(),
      };
      purchases.push(newPurchase);

      // Update product stock
      const productIndex = products.findIndex(
        (p) => p.id === purchase.productId
      );
      if (productIndex !== -1) {
        products[productIndex].stock += purchase.quantity;
      }

      // Create stock transaction
      const product = products.find((p) => p.id === purchase.productId);
      const newStockTransaction: StockTransaction = {
        id: Date.now().toString() + "_tx",
        date: purchase.date,
        productId: purchase.productId,
        type: "purchase",
        quantity: purchase.quantity,
        unitCost: purchase.unitCost,
        reference: `PUR-${newPurchase.id}`,
        reason: `Purchase from ${purchase.supplier}`,
        balanceAfter: product ? product.stock : 0,
      };
      stockTransactions.unshift(newStockTransaction); // Add to beginning for chronological order

      triggerUpdate();
      return newPurchase;
    },
    [triggerUpdate]
  );

  // Stock Transactions API
  const getStockTransactions = useCallback(() => stockTransactions, []);
  const getStockTransactionsByProduct = useCallback((productId: string) => {
    return stockTransactions.filter((tx) => tx.productId === productId);
  }, []);
  const getStockTransactionsByDateRange = useCallback(
    (startDate: string, endDate: string) => {
      return stockTransactions.filter(
        (tx) => tx.date >= startDate && tx.date <= endDate
      );
    },
    []
  );

  // BOM API
  const getBOMItems = useCallback(() => bomItems, []);
  const getBOMItemsByProduct = useCallback((productId: string) => {
    return bomItems.filter((item) => item.productId === productId);
  }, []);

  // Issues API
  const getIssues = useCallback(() => issues, []);
  const createIssue = useCallback(
    (issue: Omit<Issue, "id" | "createdAt">) => {
      const newIssue = {
        ...issue,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      issues.unshift(newIssue); // Add to beginning for chronological order

      // Update material stock and create stock transactions
      issue.materials.forEach((material) => {
        // Update material stock
        const materialIndex = materials.findIndex(
          (m) => m.id === material.materialId
        );
        if (materialIndex !== -1) {
          materials[materialIndex].stock -= material.issuedQuantity;

          // Create stock transaction
          const stockTransaction = {
            id: Date.now().toString() + "_issue_" + material.materialId,
            date: issue.date,
            productId: material.materialId,
            type: "issue" as const,
            quantity: -material.issuedQuantity,
            reference: `ISSUE-${newIssue.id}`,
            reason: `Issued to production for ${
              products.find((p) => p.id === issue.productId)?.name ||
              "Unknown Product"
            }`,
            balanceAfter: materials[materialIndex].stock,
          };
          stockTransactions.unshift(stockTransaction);
        }
      });

      triggerUpdate();
      return newIssue;
    },
    [triggerUpdate]
  );

  // Job Orders API
  const getJobOrders = useCallback(() => jobOrders, []);
  const getJobOrder = useCallback((id: string) => {
    return jobOrders.find((job) => job.id === id);
  }, []);
  const createJobOrder = useCallback(
    (jobOrder: Omit<JobOrder, "id" | "createdAt">) => {
      const newJobOrder = {
        ...jobOrder,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      jobOrders.unshift(newJobOrder);
      triggerUpdate();
      return newJobOrder;
    },
    [triggerUpdate]
  );
  const updateJobOrder = useCallback(
    (id: string, updates: Partial<JobOrder>) => {
      const index = jobOrders.findIndex((job) => job.id === id);
      if (index !== -1) {
        jobOrders[index] = { ...jobOrders[index], ...updates };
        triggerUpdate();
        return jobOrders[index];
      }
      return null;
    },
    [triggerUpdate]
  );
  const simulateProduction = useCallback(
    (id: string, status: "in_progress" | "completed") => {
      const index = jobOrders.findIndex((job) => job.id === id);
      if (index !== -1) {
        jobOrders[index].status = status;
        triggerUpdate();
        return jobOrders[index];
      }
      return null;
    },
    [triggerUpdate]
  );

  // Sales Orders API
  const getSalesOrders = useCallback(() => salesOrders, []);
  const getSalesOrder = useCallback((id: string) => {
    return salesOrders.find((order) => order.id === id);
  }, []);
  const createSalesOrder = useCallback(
    (salesOrder: Omit<SalesOrder, "id" | "createdAt">) => {
      const newSalesOrder = {
        ...salesOrder,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      salesOrders.unshift(newSalesOrder);
      triggerUpdate();
      return newSalesOrder;
    },
    [triggerUpdate]
  );

  // Invoices API
  const getInvoices = useCallback(() => invoices, []);
  const getInvoice = useCallback((id: string) => {
    return invoices.find((invoice) => invoice.id === id);
  }, []);
  const createInvoiceFromSalesOrder = useCallback(
    (salesOrderId: string) => {
      const salesOrder = salesOrders.find((order) => order.id === salesOrderId);
      if (!salesOrder) return null;

      const invoiceNumber = `INV-2024-${String(invoices.length + 1).padStart(
        3,
        "0"
      )}`;
      const dueDate = new Date(salesOrder.date);
      dueDate.setDate(dueDate.getDate() + 30); // 30 days from invoice date

      const newInvoice: Invoice = {
        id: Date.now().toString(),
        salesOrderId: salesOrder.id,
        clientId: salesOrder.clientId,
        invoiceNumber,
        date: salesOrder.date,
        dueDate: dueDate.toISOString().split("T")[0],
        status: "draft",
        items: salesOrder.items.map((item) => {
          const product = products.find((p) => p.id === item.productId);
          return {
            productId: item.productId,
            description: product?.description || product?.name || "Product",
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.total,
          };
        }),
        subtotal: salesOrder.subtotal,
        tax: salesOrder.tax,
        total: salesOrder.total,
        notes: "Payment due within 30 days. Thank you for your business!",
        createdAt: new Date().toISOString(),
      };

      invoices.unshift(newInvoice);
      triggerUpdate();
      return newInvoice;
    },
    [triggerUpdate]
  );

  // Employees API
  const getEmployees = useCallback(() => employees, []);
  const getEmployee = useCallback((id: string) => {
    return employees.find((employee) => employee.id === id);
  }, []);

  // Attendance API
  const getAttendance = useCallback(() => attendance, []);
  const getAttendanceByEmployee = useCallback((employeeId: string) => {
    return attendance.filter((record) => record.employeeId === employeeId);
  }, []);
  const getAttendanceByDateRange = useCallback(
    (startDate: string, endDate: string) => {
      return attendance.filter(
        (record) => record.date >= startDate && record.date <= endDate
      );
    },
    []
  );
  const createAttendance = useCallback(
    (attendanceRecord: Omit<Attendance, "id" | "createdAt">) => {
      const newAttendance = {
        ...attendanceRecord,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      attendance.unshift(newAttendance);
      triggerUpdate();
      return newAttendance;
    },
    [triggerUpdate]
  );

  // Salary API
  const getSalaryPeriods = useCallback(() => salaryPeriods, []);
  const createSalaryPeriod = useCallback(
    (period: Omit<SalaryPeriod, "id" | "createdAt">) => {
      const newPeriod = {
        ...period,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      salaryPeriods.unshift(newPeriod);
      triggerUpdate();
      return newPeriod;
    },
    [triggerUpdate]
  );

  // const calculateEmployeeSalary = useCallback(
  //   (employeeId: string, periodStart: string, periodEnd: string) => {
  //     const employee = employees.find((e) => e.id === employeeId);
  //     if (!employee) return null;

  //     const employeeAttendance = attendance.filter(
  //       (record) =>
  //         record.employeeId === employeeId &&
  //         record.date >= periodStart &&
  //         record.date <= periodEnd
  //     );

  //     let basicPay = 0;
  //     let overtimePay = 0;
  //     let pieceRatePay = 0;

  //     if (employee.salaryType === "hourly") {
  //       const totalHours = employeeAttendance.reduce(
  //         (sum, record) => sum + record.hoursWorked,
  //         0
  //       );
  //       const regularHours = Math.min(totalHours, 160); // 160 hours per month
  //       const overtimeHours = Math.max(0, totalHours - 160);

  //       basicPay = regularHours * (employee.hourlyRate || 0);
  //       overtimePay = overtimeHours * (employee.hourlyRate || 0) * 1.5;
  //     } else if (employee.salaryType === "piece_rate") {
  //       // For piece rate, we'll use a mock calculation based on attendance
  //       const totalHours = employeeAttendance.reduce(
  //         (sum, record) => sum + record.hoursWorked,
  //         0
  //       );
  //       const estimatedPieces = totalHours * 10; // Mock: 10 pieces per hour
  //       pieceRatePay = estimatedPieces * (employee.pieceRate || 0);
  //     }

  //     const grossPay = basicPay + overtimePay + pieceRatePay;
  //     const tax = grossPay * 0.2; // 20% tax
  //     const insurance = grossPay * 0.05; // 5% insurance
  //     const other = 50; // Fixed other deductions
  //     const netPay = grossPay - tax - insurance - other;

  //     return {
  //       employee,
  //       basicPay,
  //       overtimePay,
  //       pieceRatePay,
  //       grossPay,
  //       deductions: { tax, insurance, other },
  //       netPay,
  //       attendance: employeeAttendance,
  //     };
  //   },
  //   [employees, attendance]
  // );

  // const generatePayslip = useCallback(
  //   (employeeId: string, salaryPeriodId: string) => {
  //     const salaryPeriod = salaryPeriods.find((p) => p.id === salaryPeriodId);
  //     if (!salaryPeriod) return null;

  //     const salaryCalculation = calculateEmployeeSalary(
  //       employeeId,
  //       salaryPeriod.startDate,
  //       salaryPeriod.endDate
  //     );
  //     if (!salaryCalculation) return null;

  //     const newPayslip: Payslip = {
  //       id: Date.now().toString(),
  //       employeeId,
  //       salaryPeriodId,
  //       basicPay: salaryCalculation.basicPay,
  //       overtimePay: salaryCalculation.overtimePay,
  //       pieceRatePay: salaryCalculation.pieceRatePay,
  //       grossPay: salaryCalculation.grossPay,
  //       deductions: salaryCalculation.deductions,
  //       netPay: salaryCalculation.netPay,
  //       period: `${salaryPeriod.month}/${salaryPeriod.year}`,
  //       createdAt: new Date().toISOString(),
  //     };

  //     payslips.unshift(newPayslip);
  //     triggerUpdate();
  //     return newPayslip;
  //   },
  //   [triggerUpdate, calculateEmployeeSalary]
  // );

  const getPayslips = useCallback(() => payslips, []);
  const getPayslip = useCallback((id: string) => {
    return payslips.find((payslip) => payslip.id === id);
  }, []);

  // Accounts API
  const getAccounts = useCallback(() => accounts, []);
  const getAccount = useCallback((id: string) => {
    return accounts.find((account) => account.id === id);
  }, []);
  const updateAccountBalance = useCallback(
    (accountId: string, debitAmount: number, creditAmount: number) => {
      const account = accounts.find((acc) => acc.id === accountId);
      if (account) {
        // For assets and expenses: debit increases, credit decreases
        // For liabilities, equity, and revenue: credit increases, debit decreases
        const balanceChange =
          account.type === "asset" || account.type === "expense"
            ? debitAmount - creditAmount
            : creditAmount - debitAmount;

        account.balance += balanceChange;
        triggerUpdate();
      }
    },
    [triggerUpdate]
  );

  // Journal Entries API
  const getJournalEntries = useCallback(() => journalEntries, []);
  const getJournalEntry = useCallback((id: string) => {
    return journalEntries.find((entry) => entry.id === id);
  }, []);
  const createJournalEntry = useCallback(
    (entry: Omit<JournalEntry, "id" | "createdAt">) => {
      // Validate that total debit equals total credit
      if (entry.totalDebit !== entry.totalCredit) {
        throw new Error("Total debit must equal total credit");
      }

      // Validate that each entry has either debit or credit, but not both
      const invalidEntries = entry.entries.filter(
        (line) =>
          (line.debit > 0 && line.credit > 0) ||
          (line.debit === 0 && line.credit === 0)
      );
      if (invalidEntries.length > 0) {
        throw new Error(
          "Each entry must have either debit or credit, but not both"
        );
      }

      const newEntry = {
        ...entry,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };

      journalEntries.unshift(newEntry);

      // Update account balances
      entry.entries.forEach((line) => {
        updateAccountBalance(line.accountId, line.debit, line.credit);
      });

      triggerUpdate();
      return newEntry;
    },
    [triggerUpdate, updateAccountBalance]
  );

  // // Calculate account balances from journal entries
  // const calculateAccountBalances = useCallback(() => {
  //   // Reset all account balances
  //   accounts.forEach((account) => {
  //     account.balance = 0;
  //   });

  //   // Recalculate balances from all journal entries
  //   journalEntries.forEach((entry) => {
  //     entry.entries.forEach((line) => {
  //       updateAccountBalance(line.accountId, line.debit, line.credit);
  //     });
  //   });

  //   triggerUpdate();
  // }, [updateAccountBalance]);

  // // Get ledger entries for a specific account
  // const getLedgerEntries = useCallback(
  //   (accountId: string) => {
  //     const ledgerEntries: Array<{
  //       date: string;
  //       reference: string;
  //       narration: string;
  //       debit: number;
  //       credit: number;
  //       balance: number;
  //     }> = [];

  //     let runningBalance = 0;

  //     // Get all journal entries for this account
  //     journalEntries
  //       .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  //       .forEach((entry) => {
  //         entry.entries
  //           .filter((line) => line.accountId === accountId)
  //           .forEach((line) => {
  //             const account = accounts.find((acc) => acc.id === accountId);
  //             if (account) {
  //               const balanceChange =
  //                 account.type === "asset" || account.type === "expense"
  //                   ? line.debit - line.credit
  //                   : line.credit - line.debit;

  //               runningBalance += balanceChange;

  //               ledgerEntries.push({
  //                 date: entry.date,
  //                 reference: entry.reference,
  //                 narration: line.narration,
  //                 debit: line.debit,
  //                 credit: line.credit,
  //                 balance: runningBalance,
  //               });
  //             }
  //           });
  //       });

  //     return ledgerEntries;
  //   },
  //   [accounts]
  // );

  // Admin API - Role Management (updated existing getRoles)
  const createRole = useCallback(
    (role: Omit<Role, "id">) => {
      const newRole = {
        ...role,
        id: Date.now().toString(),
      };
      roles.unshift(newRole);
      triggerUpdate();
      return newRole;
    },
    [triggerUpdate]
  );
  const updateRole = useCallback(
    (id: string, updates: Partial<Role>) => {
      const index = roles.findIndex((role) => role.id === id);
      if (index !== -1) {
        roles[index] = { ...roles[index], ...updates };
        triggerUpdate();
        return roles[index];
      }
      return null;
    },
    [triggerUpdate]
  );
  const deleteRole = useCallback(
    (id: string) => {
      const index = roles.findIndex((role) => role.id === id);
      if (index !== -1) {
        const deletedRole = roles.splice(index, 1)[0];
        // Remove all role-module assignments for this role
        roleModules.splice(
          0,
          roleModules.length,
          ...roleModules.filter((rm) => rm.roleId !== id)
        );
        triggerUpdate();
        return deletedRole;
      }
      return null;
    },
    [triggerUpdate]
  );

  // Admin API - Module Management (updated existing getModules)
  const updateModule = useCallback(
    (id: string, updates: Partial<Module>) => {
      const index = modules.findIndex((module) => module.id === id);
      if (index !== -1) {
        modules[index] = { ...modules[index], ...updates };
        triggerUpdate();
        return modules[index];
      }
      return null;
    },
    [triggerUpdate]
  );
  const toggleModuleActive = useCallback(
    (id: string) => {
      const index = modules.findIndex((module) => module.id === id);
      if (index !== -1) {
        modules[index].active = !modules[index].active;
        triggerUpdate();
        return modules[index];
      }
      return null;
    },
    [triggerUpdate]
  );

  // Admin API - Role-Module Assignments
  const getRoleModules = useCallback(() => roleModules, []);
  const getModulesForRole = useCallback((roleId: string) => {
    const assignedModuleIds = roleModules
      .filter((rm) => rm.roleId === roleId)
      .map((rm) => rm.moduleId);
    return modules.filter((module) => assignedModuleIds.includes(module.id));
  }, []);
  const assignModuleToRole = useCallback(
    (roleId: string, moduleId: string) => {
      // Check if assignment already exists
      const existingAssignment = roleModules.find(
        (rm) => rm.roleId === roleId && rm.moduleId === moduleId
      );
      if (existingAssignment) return existingAssignment;

      const newAssignment: RoleModule = {
        id: Date.now().toString(),
        roleId,
        moduleId,
        assignedAt: new Date().toISOString(),
        assignedBy: "admin", // In a real app, this would be the current user
      };
      roleModules.unshift(newAssignment);
      triggerUpdate();
      return newAssignment;
    },
    [triggerUpdate]
  );
  const unassignModuleFromRole = useCallback(
    (roleId: string, moduleId: string) => {
      const index = roleModules.findIndex(
        (rm) => rm.roleId === roleId && rm.moduleId === moduleId
      );
      if (index !== -1) {
        const removedAssignment = roleModules.splice(index, 1)[0];
        triggerUpdate();
        return removedAssignment;
      }
      return null;
    },
    [triggerUpdate]
  );

  // Admin API - User-Role Assignments
  const getUserRoles = useCallback(() => userRoles, []);
  const getRolesForUser = useCallback((userId: string) => {
    const assignedRoleIds = userRoles
      .filter((ur) => ur.userId === userId)
      .map((ur) => ur.roleId);
    return roles.filter((role) => assignedRoleIds.includes(role.id));
  }, []);
  const assignRoleToUser = useCallback(
    (userId: string, roleId: string) => {
      // Check if assignment already exists
      const existingAssignment = userRoles.find(
        (ur) => ur.userId === userId && ur.roleId === roleId
      );
      if (existingAssignment) return existingAssignment;

      const newAssignment: UserRole = {
        id: Date.now().toString(),
        userId,
        roleId,
        assignedAt: new Date().toISOString(),
        assignedBy: "admin", // In a real app, this would be the current user
      };
      userRoles.unshift(newAssignment);
      triggerUpdate();
      return newAssignment;
    },
    [triggerUpdate]
  );
  const unassignRoleFromUser = useCallback(
    (userId: string, roleId: string) => {
      const index = userRoles.findIndex(
        (ur) => ur.userId === userId && ur.roleId === roleId
      );
      if (index !== -1) {
        const removedAssignment = userRoles.splice(index, 1)[0];
        triggerUpdate();
        return removedAssignment;
      }
      return null;
    },
    [triggerUpdate]
  );

  return {
    // Users
    users: getUsers(),
    createUser,
    updateUser,
    deleteUser,

    // Roles
    roles: getRoles(),

    // Modules
    modules: getModules(),
    updateModuleBadge,

    // Departments
    departments: getDepartments(),
    createDepartment,
    updateDepartment,
    deleteDepartment,

    // Products
    products: getProducts(),
    createProduct,
    updateProduct,
    deleteProduct,

    // Clients
    clients: getClients(),
    createClient,
    updateClient,
    deleteClient,

    // Materials
    materials: getMaterials(),
    createMaterial,
    updateMaterial,

    // Stock Entries
    stockEntries: getStockEntries(),
    createStockEntry,

    // Purchases
    purchases: getPurchases(),
    createPurchase,

    // Stock Transactions
    stockTransactions: getStockTransactions(),
    getStockTransactionsByProduct,
    getStockTransactionsByDateRange,

    // BOM
    bomItems: getBOMItems(),
    getBOMItemsByProduct,

    // Issues
    issues: getIssues(),
    createIssue,

    // Job Orders
    jobOrders: getJobOrders(),
    getJobOrder,
    createJobOrder,
    updateJobOrder,
    simulateProduction,

    // Sales Orders
    salesOrders: getSalesOrders(),
    getSalesOrder,
    createSalesOrder,

    // Invoices
    invoices: getInvoices(),
    getInvoice,
    createInvoiceFromSalesOrder,

    // Employees
    employees: getEmployees(),
    getEmployee,

    // Attendance
    attendance: getAttendance(),
    getAttendanceByEmployee,
    getAttendanceByDateRange,
    createAttendance,

    // // Salary & Payslips
    // salaryPeriods: getSalaryPeriods(),
    // createSalaryPeriod,
    // calculateEmployeeSalary,
    // generatePayslip,
    // payslips: getPayslips(),
    // getPayslip,

    // // Accounts
    // accounts: getAccounts(),
    // getAccount,
    // updateAccountBalance,
    // calculateAccountBalances,

    // // Journal Entries
    // journalEntries: getJournalEntries(),
    // getJournalEntry,
    // createJournalEntry,

    // // Ledger
    // getLedgerEntries,

    // Admin - Role Management (additional functions)
    createRole,
    updateRole,
    deleteRole,

    // Admin - Module Management (additional functions)
    updateModule,
    toggleModuleActive,

    // Admin - Role-Module Assignments
    getRoleModules,
    getModulesForRole,
    assignModuleToRole,
    unassignModuleFromRole,

    // Admin - User-Role Assignments
    getUserRoles,
    getRolesForUser,
    assignRoleToUser,
    unassignRoleFromUser,
  };
};
