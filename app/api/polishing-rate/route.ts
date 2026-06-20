import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { withMockFallback } from "@/lib/db/mockFallback";
import { mockHandlers } from "@/lib/mocks/mockHandlers";

// GET /api/polishing-rates - List all product rates
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

    const total = await prisma.polishing_rates.count({ where });

    const polishingRates = await prisma.polishing_rates.findMany({
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

    return { data: polishingRates, total };
    },
    () => mockHandlers.listPolishingRates(request),
    { errorMessage: "Failed to fetch polishing rates" }
  );
}

// POST /api/polishing-types - Create new product type
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, employeeId, rate, description } = body;

    if (!productId || !employeeId || rate === undefined || rate === null) {
      return NextResponse.json(
        { error: "Product, Employee, and Rate are required" },
        { status: 400 }
      );
    }

    const existingRate = await prisma.polishing_rates.findMany({
      where: {
        productId: Number(productId),
        employeeId: Number(employeeId),
      },
    });

    if (existingRate.length > 0) {
      return NextResponse.json(
        { error: "Rate for this Product & Employee already exists" },
        { status: 400 }
      );
    }

    const newRate = await prisma.polishing_rates.create({
      data: {
        productId: Number(productId),
        employeeId: Number(employeeId),
        polishingRate: Number(rate),
        description: description || null,
      },
    });

    return NextResponse.json(newRate, { status: 201 });
  } catch (error) {
    console.error("Error creating product rate:", error);
    return NextResponse.json(
      { error: "Failed to create product rate" },
      { status: 500 }
    );
  }
}
