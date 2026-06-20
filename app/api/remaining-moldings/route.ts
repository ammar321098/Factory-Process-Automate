import { prisma } from "@/lib/db/prisma";
import { NextRequest, NextResponse } from "next/server";
import { withMockFallback } from "@/lib/db/mockFallback";
import { mockHandlers } from "@/lib/mocks/mockHandlers";

export async function GET(request: NextRequest) {
  return withMockFallback(
    async () => {
    const searchParams = request.nextUrl.searchParams;

    // Optional filter
    const productTypeId = searchParams.get("productTypeId");

    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        {
          product_types: {
            productType: { contains: search, mode: "insensitive" },
          },
        },
      ];
    }

    if (productTypeId) {
      where.productTypeId = Number(productTypeId);
    }

    // Count total records
    const total = await prisma.remaining_molding.count({ where });

    // Fetch remaining molding with product type info
    const data = await prisma.remaining_molding.findMany({
      where,
      include: {
        product_types: {
          select: {
            id: true,
            productType: true,
            description: true,
          },
        },
      },
      orderBy: { id: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      total,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
    },
    () => mockHandlers.listRemainingMoldings(request),
    { errorMessage: "Failed to fetch remaining molding records" }
  );
}
