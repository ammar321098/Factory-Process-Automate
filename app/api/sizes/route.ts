import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { withMockFallback } from "@/lib/db/mockFallback";
import { mockHandlers } from "@/lib/mocks/mockHandlers";

export async function GET(request: NextRequest) {
  return withMockFallback(
    async () => {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // Count total sizes in the table
    const total = await prisma.sizes.count();

    // Fetch all sizes
    const data = await prisma.sizes.findMany({
      where,
      orderBy: { name: "asc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total };
    },
    () => mockHandlers.listSizes(request),
    { errorMessage: "Failed to fetch sizes" }
  );
}

// POST /api/sizes - Create new size

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, length, width, description } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const size = await prisma.sizes.create({
      data: {
        name,
        length: length ? parseFloat(length) : 0,
        width: width ? parseFloat(width) : 0,
        description: description || null,
      },
    });

    return NextResponse.json(size, { status: 201 });
  } catch (error) {
    console.error("Error creating size:", error);
    return NextResponse.json(
      { error: "Failed to create size" },
      { status: 500 }
    );
  }
}
