import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { withMockFallback } from "@/lib/db/mockFallback";
import { mockHandlers } from "@/lib/mocks/mockHandlers";

// GET /api/materials - List all materials with pagination, search, filters

export async function GET(request: NextRequest) {
  return withMockFallback(
    async () => {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const sizeId = searchParams.get("sizeId");
    const gageId = searchParams.get("gageId");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (sizeId) where.sizeId = Number(sizeId);
    if (gageId) where.gageId = Number(gageId);

    // Count total materials
    const total = await prisma.materials.count({
      where,
    });

    // Fetch paginated materials
    const materials = await prisma.materials.findMany({
      where,
      include: {
        size: true,
        gage: true,
        unitWeight: true,
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Grouped Summary (only materials with quantity > 0)
    const grouped = await prisma.materials.groupBy({
      by: ["name", "sizeId", "gageId"],
      _sum: { totalQuantity: true },
      where: {
        ...where,
        totalQuantity: { gt: 0 },
      },
      orderBy: [{ name: "asc" }, { sizeId: "asc" }, { gageId: "asc" }],
    });

    const sizeIds = Array.from(
      new Set(
        grouped.map((g) => g.sizeId).filter((id): id is number => id !== null)
      )
    );
    const gageIds = Array.from(
      new Set(
        grouped.map((g) => g.gageId).filter((id): id is number => id !== null)
      )
    );

    const [sizes, gages] = await Promise.all([
      prisma.sizes.findMany({ where: { id: { in: sizeIds } } }),
      prisma.gages.findMany({ where: { id: { in: gageIds } } }),
    ]);

    const summary = grouped.map((g) => {
      const size = sizes.find((s) => s.id === g.sizeId) || null;
      const gage = gages.find((ga) => ga.id === g.gageId) || null;

      return {
        name: g.name,
        totalQuantity: g._sum.totalQuantity || 0,
        size: size?.name || null,
        gage: gage?.name || null,
      };
    });
    const totalRemaining = summary.length;

    return {
      data: materials,
      summary,
      total,
      totalRemaining,
    };
    },
    () => mockHandlers.listMaterials(request),
    { errorMessage: "Failed to fetch materials" }
  );
}

// POST /api/materials - Create new material
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, sizeId, gageId, weight, totalQuantity, description } = body;

    if (!sizeId || !gageId || !weight) {
      return NextResponse.json(
        { error: "Size, Gage, and Weight are required" },
        { status: 400 }
      );
    }

    // Check if a material already exists with same size + gage
    const existingMaterial = await prisma.materials.findFirst({
      where: {
        sizeId: Number(sizeId),
        gageId: Number(gageId),
      },
    });

    if (existingMaterial) {
      return NextResponse.json(
        {
          error:
            "Material with this Size & Gage already exists. Just update their Weight or Quantity.",
        },
        { status: 400 }
      );
    }

    // Find the matching unit weight
    const existingUnitWeight = await prisma.unit_weights.findFirst({
      where: {
        sizeId: Number(sizeId),
        gageId: Number(gageId),
      },
    });

    if (!existingUnitWeight) {
      return NextResponse.json(
        { error: "No matching unit weight found for selected size & gage" },
        { status: 404 }
      );
    }

    // Create new material with the linked unit weight
    const material = await prisma.materials.create({
      data: {
        name,
        sizeId: Number(sizeId),
        gageId: Number(gageId),
        weight: parseFloat(weight),
        unitWeightId: existingUnitWeight.id, // Link it
        totalQuantity: Number(totalQuantity),
        description: description || null,
      },
    });

    return NextResponse.json(material, { status: 201 });
  } catch (error) {
    console.error("Error creating material:", error);
    return NextResponse.json(
      { error: "Failed to create material" },
      { status: 500 }
    );
  }
}
