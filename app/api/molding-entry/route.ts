import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { withMockFallback } from "@/lib/db/mockFallback";
import { mockHandlers } from "@/lib/mocks/mockHandlers";

// GET /api/molding-entries - List all molding entries with pagination, search, filters
export async function GET(request: NextRequest) {
  return withMockFallback(
    async () => {
    const searchParams = request.nextUrl.searchParams;

    // Optional filter by employeeId
    const employeeId = searchParams.get("employeeId");

    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    // Build where clause
    const where: any = {};
    if (search) {
      where.OR = [
        { qualityNotes: { contains: search, mode: "insensitive" } },
        {
          employees: {
            name: { contains: search, mode: "insensitive" },
          },
        },
        {
          product_types: {
            productType: { contains: search, mode: "insensitive" },
          },
        },
        {
          materials: {
            name: { contains: search, mode: "insensitive" },
          },
        },
      ];
    }

    if (employeeId) where.employeeId = parseInt(employeeId);

    // Count total records for pagination
    const total = await prisma.molding_entries.count({ where });

    // Fetch molding entries with relations
    const data = await prisma.molding_entries.findMany({
      where,
      include: {
        employees: {
          select: {
            id: true,
            name: true,
            salaryType: true,
          },
        },
        product_types: {
          select: {
            id: true,
            productType: true,
          },
        },
        materials: {
          select: {
            id: true,
            name: true,
            unit: true,
            cost: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Aggregate employee performance
    const employeeMap: any = {};

    data.forEach((entry) => {
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
      if (entry.productTypeId)
        employeeMap[empId].productTypesSet.add(entry.productTypeId);
    });

    // Convert productTypesSet to count
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
      data,
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
    () => mockHandlers.listMoldingEntries(request),
    { errorMessage: "Failed to fetch molding entries and performance" }
  );
}

// POST /api/molding-entries - Create new molding entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      productTypeId,
      productId,
      employeeId,
      productRate,
      totalEarn,
      quantity,
      damage,
      finalQuantity,
      qualityNotes,
      date,
    } = body;

    if (!productTypeId || !productId || !employeeId || quantity == null) {
      return NextResponse.json(
        {
          error: "Product type, material, operator, and quantity are required",
        },
        { status: 400 }
      );
    }

    const quantityNum = Number(quantity ?? 0);
    const damageNum = Number(damage ?? 0);
    const finalQuantityNum = Number(finalQuantity ?? 0);
    const productRateNum = Number(productRate ?? 0);
    const totalEarnNum = Number(totalEarn ?? 0);

    const moldingEntry = await prisma.$transaction(async (tx) => {
      const material = await tx.materials.findUnique({
        where: { id: Number(productId) },
        select: {
          id: true,
          weight: true,
          unitWeight: true,
          totalQuantity: true,
        },
      });

      if (!material) throw new Error("Material not found");

      const unitWeightKg = material.unitWeight
        ? material.unitWeight.weight / 1000
        : 0;
      const totalWeightUsed = quantityNum * unitWeightKg;

      if (
        (material.weight ?? 0) < totalWeightUsed ||
        (material.totalQuantity ?? 0) < quantityNum
      ) {
        throw new Error("Insufficient material stock");
      }

      // Update material
      await tx.materials.update({
        where: { id: Number(productId) },
        data: {
          weight: (material.weight ?? 0) - totalWeightUsed,
          totalQuantity: (material.totalQuantity ?? 0) - quantityNum,
        },
      });

      // Update remaining_molding
      const existingRemaining = await tx.remaining_molding.findFirst({
        where: { productTypeId: Number(productTypeId) },
      });

      if (existingRemaining) {
        await tx.remaining_molding.update({
          where: { id: existingRemaining.id },
          data: {
            totalQuantity:
              Number(existingRemaining.totalQuantity) + Number(quantityNum),
            totalDamage:
              Number(existingRemaining.totalDamage) + Number(damageNum),
            remaining:
              Number(existingRemaining.remaining) + Number(finalQuantityNum),
          },
        });
      } else {
        await tx.remaining_molding.create({
          data: {
            productTypeId: Number(productTypeId),
            totalQuantity: quantityNum,
            totalDamage: damageNum,
            remaining: finalQuantityNum,
          },
        });
      }

      // Create molding entry
      const entry = await tx.molding_entries.create({
        data: {
          productTypeId: Number(productTypeId),
          materialId: Number(productId),
          employeeId: Number(employeeId),
          productRate: productRateNum,
          totalEarn: totalEarnNum,
          quantity: quantityNum,
          damage: damageNum,
          finalQuantity: finalQuantityNum,
          qualityNotes: qualityNotes ?? null,
        },
        include: {
          product_types: true,
          employees: true,
          materials: true, // Only for querying, not creating nested
        },
      });

      return entry;
    });

    return NextResponse.json(moldingEntry, { status: 201 });
  } catch (error: any) {
    console.error("Error creating molding entry:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create molding entry" },
      { status: 500 }
    );
  }
}
