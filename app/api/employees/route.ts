import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { withMockFallback } from "@/lib/db/mockFallback";
import { mockHandlers } from "@/lib/mocks/mockHandlers";

// GET /api/employees - List all employees with pagination, search, filters
export async function GET(request: NextRequest) {
  return withMockFallback(
    async () => {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const department = searchParams.get("department");
    const status = searchParams.get("status");
    const salaryType = searchParams.get("salaryType");
    const taskType = searchParams.get("taskType"); // 'MOLDING' | 'POLISHING' | 'PACKING'
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const where: any = {};

    // Search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ];
    }

    if (department) where.department = department;
    if (status) where.status = status;
    if (salaryType) where.salaryType = salaryType;

    // Task filter
    if (taskType === "MOLDING") {
      where.molding_entries = { some: {} };
    } else if (taskType === "POLISHING") {
      where.polishing_entries = { some: {} };
    } else if (taskType === "PACKING") {
      where.packing_entries = { some: {} };
    }

    const total = await prisma.employees.count({ where });

    const employees = await prisma.employees.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: employees,
      total,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
    },
    () => mockHandlers.listEmployees(request),
    { errorMessage: "Failed to fetch employees" }
  );
}

// POST /api/employees - Create new employee
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      department,
      position,
      salaryType,
      monthlySalary,
      status,
      address,
      qualityNotes,
    } = body;

    if (!name || !phone || !department || !salaryType) {
      return NextResponse.json(
        { error: "Name, phone, department, and salary type are required" },
        { status: 400 }
      );
    }

    const employee = await prisma.employees.create({
      data: {
        name,
        email,
        phone,
        department,
        position,
        salaryType, // must be "PIECE" or "MONTHLY"
        monthlySalary: monthlySalary ? Number(monthlySalary) : null,
        status: status || "ACTIVE",
        address,
        qualityNotes,
      },
    });

    return NextResponse.json(employee, { status: 201 });
  } catch (error) {
    console.error("Error creating employee:", error);
    return NextResponse.json(
      { error: "Failed to create employee" },
      { status: 500 }
    );
  }
}
