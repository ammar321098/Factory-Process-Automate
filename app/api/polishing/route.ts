import { ProductType } from "./../../../lib/api/moldingApi";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { withMockFallback } from "@/lib/db/mockFallback";
import { mockHandlers } from "@/lib/mocks/mockHandlers";

// GET /api/polishing-entries - List all polishing entries with pagination, search, filters
export async function GET(request: NextRequest) {
  return withMockFallback(
    async () => {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const operator = searchParams.get("operator");
    const moldedMaterial = searchParams.get("moldedMaterial");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const sortBy = searchParams.get("sortBy") || "date";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { qualityNotes: { contains: search, mode: "insensitive" } },

        { employees: { name: { contains: search, mode: "insensitive" } } },
        {
          remaining_molding: {
            product_types: {
              productType: { contains: search, mode: "insensitive" },
            },
          },
        },
      ];
    }

    if (operator) where.operator = operator;
    if (moldedMaterial) where.moldedMaterial = moldedMaterial;

    if (dateFrom || dateTo) {
      where.date = {};
      if (dateFrom) where.date.gte = new Date(dateFrom);
      if (dateTo) where.date.lte = new Date(dateTo);
    }

    // Count total records
    const total = await prisma.polishing_entries.count({ where });

    // Fetch polishing entries with relations
    const polishingEntries = await prisma.polishing_entries.findMany({
      where,
      include: {
        employees: true,
        remaining_molding: {
          include: {
            product_types: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Aggregate employee performance
    const employeeMap: any = {};

    polishingEntries.forEach((entry) => {
      const empId = entry.employeeId;
      const empName = entry.employees?.name || "Unknown";
      const salaryType = entry.employees?.salaryType || "PIECE";

      if (!employeeMap[empId]) {
        employeeMap[empId] = {
          employeeId: empId,
          employeeName: empName,
          salaryType,
          totalEntries: 0,
          totalQuantity: 0,
          totalEarning: 0,
          productTypesSet: new Set<number>(),
        };
      }

      employeeMap[empId].totalEntries += 1;
      employeeMap[empId].totalQuantity += entry.quantity || 0;
      employeeMap[empId].totalEarning += entry.totalEarn || 0;

      const productTypeId = entry.remaining_molding?.productTypeId ?? null;

      if (productTypeId) {
        employeeMap[empId].productTypesSet.add(productTypeId);
      }
    });

    const employeePerformance = Object.values(employeeMap).map((emp: any) => ({
      employeeId: emp.employeeId,
      employeeName: emp.employeeName,
      salaryType: emp.salaryType,
      totalEntries: emp.totalEntries,
      totalQuantity: emp.totalQuantity,
      totalEarning: emp.totalEarning,
      productTypesCount: emp.productTypesSet.size,
    }));

    const employeeTotal = employeePerformance.length;

    return {
      data: polishingEntries,
      employeePerformance,
      total,
      employeeTotal,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
    },
    () => mockHandlers.listPolishingEntries(request),
    { errorMessage: "Failed to fetch polishing entries" }
  );
}

// POST /api/polishing-entries - Create new polishing entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      productId, // This is now productTypeId
      employeeId,
      polishingRate,
      quantity,
      totalEarn,
      qualityNotes,
    } = body;

    if (!productId || !employeeId || quantity == null) {
      return NextResponse.json(
        {
          error: "Product type, Employee, and quantity are required",
        },
        { status: 400 }
      );
    }

    const quantityNum = Number(quantity ?? 0);
    const polishingRateNum = Number(polishingRate ?? 0);
    const totalEarnNum = Number(totalEarn ?? 0);

    const polishingEntry = await prisma.$transaction(async (tx) => {
      // FETCH MOLDED STOCK (remaining_molding) by productTypeId
      const molded = await tx.remaining_molding.findFirst({
        where: { productTypeId: Number(productId) },
        select: {
          id: true,
          productTypeId: true,
          remaining: true,
        },
      });

      if (!molded) throw new Error("Molded product not found");

      // VALIDATE STOCK
      if ((molded.remaining ?? 0) < quantityNum) {
        throw new Error("Not enough molded stock remaining");
      }

      // UPDATE remaining_molding (subtract used quantity)
      await tx.remaining_molding.update({
        where: { id: molded.id },
        data: {
          remaining: Number(molded.remaining) - quantityNum,
        },
      });

      // UPDATE OR CREATE remaining_polishing
      const existingPolishingRemaining = await tx.remaining_polishing.findFirst(
        {
          where: { productTypeId: molded.productTypeId },
        }
      );

      if (existingPolishingRemaining) {
        // Update existing remaining polishing
        await tx.remaining_polishing.update({
          where: { id: existingPolishingRemaining.id },
          data: {
            totalQuantity:
              Number(existingPolishingRemaining.totalQuantity) + quantityNum,
            remaining:
              Number(existingPolishingRemaining.remaining) + quantityNum,
          },
        });
      } else {
        // Create first time remaining polishing entry
        await tx.remaining_polishing.create({
          data: {
            productTypeId: molded.productTypeId,
            totalQuantity: quantityNum,
            remaining: quantityNum,
          },
        });
      }

      // CREATE polishing entry
      const entry = await tx.polishing_entries.create({
        data: {
          productId: molded.id, // Link to remaining_molding
          employeeId: Number(employeeId),
          polishingRate: polishingRateNum,
          quantity: quantityNum,
          totalEarn: totalEarnNum,
          qualityNotes: qualityNotes || null,
        },
        include: {
          employees: true,
          remaining_molding: {
            include: { product_types: true },
          },
        },
      });

      return entry;
    });

    return NextResponse.json(polishingEntry, { status: 201 });
  } catch (error: any) {
    console.error("Error creating polishing entry:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create polishing entry" },
      { status: 500 }
    );
  }
}
