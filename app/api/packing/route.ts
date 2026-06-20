import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { withMockFallback } from "@/lib/db/mockFallback";
import { mockHandlers } from "@/lib/mocks/mockHandlers";

// GET /api/packing-entries - List all packing entries with pagination, search, filters
export async function GET(request: NextRequest) {
  return withMockFallback(
    async () => {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { qualityNotes: { contains: search, mode: "insensitive" } },
        {
          remaining_polishing: {
            product_types: {
              productType: { contains: search, mode: "insensitive" },
            },
          },
        },
      ];
    }

    if (dateFrom || dateTo) {
      where.date = {};
      if (dateFrom) where.date.gte = new Date(dateFrom);
      if (dateTo) where.date.lte = new Date(dateTo);
    }

    // Count total records
    const total = await prisma.packing_entries.count({ where });

    // Fetch packing entries with relations
    const packingEntries = await prisma.packing_entries.findMany({
      where,
      include: {
        remaining_polishing: {
          include: {
            product_types: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: packingEntries,
      total,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
    },
    () => mockHandlers.listPackingEntries(request),
    { errorMessage: "Failed to fetch packing entries" }
  );
}

// POST /api/packing-entries - Create new packing entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { productId, quantity, qualityNotes } = body; // productId = productTypeId

    if (!productId || quantity == null) {
      return NextResponse.json(
        { error: "Polished product and quantity are required" },
        { status: 400 }
      );
    }

    const quantityNum = Number(quantity);

    const packingEntry = await prisma.$transaction(async (tx) => {
      // FETCH POLISHED STOCK BY productTypeId
      const polished = await tx.remaining_polishing.findFirst({
        where: { productTypeId: Number(productId) },
        select: {
          id: true,
          productTypeId: true,
          remaining: true,
        },
      });

      if (!polished) throw new Error("Polished product not found");

      // Check stock
      if ((polished.remaining ?? 0) < quantityNum) {
        throw new Error("Not enough polished stock remaining");
      }

      // UPDATE remaining_polishing (subtract used quantity)
      await tx.remaining_polishing.update({
        where: { id: polished.id },
        data: {
          remaining: polished.remaining - quantityNum,
        },
      });

      // UPDATE / CREATE remaining_packing
      const existingPackingRemaining = await tx.remaining_packing.findFirst({
        where: { productTypeId: polished.productTypeId },
      });

      if (existingPackingRemaining) {
        await tx.remaining_packing.update({
          where: { id: existingPackingRemaining.id },
          data: {
            totalQuantity: existingPackingRemaining.totalQuantity + quantityNum,
            remaining: existingPackingRemaining.remaining + quantityNum,
          },
        });
      } else {
        await tx.remaining_packing.create({
          data: {
            productTypeId: polished.productTypeId,
            totalQuantity: quantityNum,
            remaining: quantityNum,
          },
        });
      }

      // CREATE packing entry
      const entry = await tx.packing_entries.create({
        data: {
          productId: polished.id, // link to remaining_polishing row
          quantity: quantityNum,
          qualityNotes: qualityNotes || null,
        },
        include: {
          remaining_polishing: {
            include: { product_types: true },
          },
        },
      });

      return entry;
    });

    return NextResponse.json(packingEntry, { status: 201 });
  } catch (error: any) {
    console.error("Error creating packing entry:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create packing entry" },
      { status: 500 }
    );
  }
}
