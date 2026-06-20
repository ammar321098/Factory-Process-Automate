import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { withMockFallback } from "@/lib/db/mockFallback";
import { mockHandlers } from "@/lib/mocks/mockHandlers";

// GET /api/product-rates - List all product rates
export async function GET(request: NextRequest) {
  return withMockFallback(
    async () => {
    const searchParams = request.nextUrl.searchParams;
    // LIST MODE (pagination + search + sorting)
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const where: any = {};

    if (search) {
      where.OR = [
        { description: { contains: search, mode: "insensitive" } },
        {
          product_types: {
            productType: { contains: search, mode: "insensitive" },
          },
        },
        {
          employees: { name: { contains: search, mode: "insensitive" } },
        },
      ];
    }

    const total = await prisma.product_rates.count({ where });

    const productRates = await prisma.product_rates.findMany({
      where,
      include: {
        product_types: true,
        employees: true,
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data: productRates, total };
    },
    () => mockHandlers.listProductRates(request),
    { errorMessage: "Failed to fetch product rates" }
  );
}

// POST /api/product-types - Create new product type
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productTypeId, employeeId, rate, description } = body;

    if (!productTypeId || !employeeId) {
      return NextResponse.json(
        { error: "Product and Employee are required" },
        { status: 400 }
      );
    }

    const existingRate = await prisma.product_rates.findMany({
      where: {
        productId: Number(productTypeId),
        employeeId: Number(employeeId),
      },
    });

    if (existingRate.length > 0) {
      return NextResponse.json(
        { error: "Rate for this Product & Employee already exists" },
        { status: 400 }
      );
    }

    const productTypes = await prisma.product_rates.create({
      data: {
        productId: Number(productTypeId),
        employeeId: Number(employeeId),
        productRate: Number(rate),
        description: description || null,
      },
    });

    return NextResponse.json(productTypes, { status: 201 });
  } catch (error) {
    console.error("Error creating product rate:", error);
    return NextResponse.json(
      { error: "Failed to create product rate" },
      { status: 500 }
    );
  }
}
