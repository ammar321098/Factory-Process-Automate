import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { withMockFallback } from "@/lib/db/mockFallback";
import { mockHandlers } from "@/lib/mocks/mockHandlers";

// GET /api/product-types - List all product types
export async function GET(request: NextRequest) {
  return withMockFallback(
    async () => {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { productType: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // Count total records
    const total = await prisma.product_types.count({ where });

    // Fetch product types
    const productTypes = await prisma.product_types.findMany({
      where,
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data: productTypes, total };
    },
    () => mockHandlers.listProductTypes(request),
    { errorMessage: "Failed to fetch product types" }
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productType, description } = body;

    // Validate required fields
    if (!productType || productType.trim() === "") {
      return NextResponse.json(
        { error: "Product type name is required" },
        { status: 400 }
      );
    }

    // Check if product type already exists
    const existingProductType = await prisma.product_types.findUnique({
      where: {
        productType: productType.trim(), // assuming your DB field is `name` and unique
      },
    });

    if (existingProductType) {
      return NextResponse.json(
        { error: "Product type already exists" },
        { status: 400 }
      );
    }

    // Create new product type
    const productTypes = await prisma.product_types.create({
      data: {
        productType: productType.trim(), // DB field is `name`
        description: description || null,
      },
    });

    return NextResponse.json(productTypes, { status: 201 });
  } catch (error) {
    console.error("Error creating product type:", error);
    return NextResponse.json(
      { error: "Failed to create product type" },
      { status: 500 }
    );
  }
}
