import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { mockJson, withMockFallback, withMockFallbackRaw } from "@/lib/db/mockFallback";
import { mockHandlers } from "@/lib/mocks/mockHandlers";

// GET /api/unit-weights - List all unit weights
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sizeId = searchParams.get("sizeId");
  const gageId = searchParams.get("gageId");

  return withMockFallbackRaw(
    async () => {
      const page = parseInt(searchParams.get("page") || "1");
      const limit = parseInt(searchParams.get("limit") || "10");
      const search = searchParams.get("search") || "";
      const sortBy = searchParams.get("sortBy") || "createdAt";
      const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";

      if (sizeId && gageId) {
        const weight = await prisma.unit_weights.findFirst({
          where: {
            sizeId: Number(sizeId),
            gageId: Number(gageId),
          },
        });

        if (!weight) {
          return NextResponse.json(
            { message: "No matching unit weight found" },
            { status: 404 }
          );
        }

        return NextResponse.json({ data: weight });
      }

      const where: any = {};

      if (search) {
        where.OR = [
          { description: { contains: search, mode: "insensitive" } },
          {
            size: {
              name: { contains: search, mode: "insensitive" },
            },
          },
          {
            gage: {
              name: { contains: search, mode: "insensitive" },
            },
          },
        ];
      }

      if (sizeId) where.sizeId = Number(sizeId);
      if (gageId) where.gageId = Number(gageId);

      const total = await prisma.unit_weights.count();

      const data = await prisma.unit_weights.findMany({
        where,
        include: {
          size: true,
          gage: true,
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip: (page - 1) * limit,
        take: limit,
      });

      return NextResponse.json({ data, total });
    },
    async () => {
      const result = mockHandlers.listUnitWeights(request);
      if (result === null) {
        return NextResponse.json(
          { message: "No matching unit weight found" },
          { status: 404 }
        );
      }
      if ("data" in result && !("total" in result)) {
        return mockJson(result);
      }
      return mockJson(result);
    }
  );
}

// POST /api/unit-weights - Create new unit weight
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sizeId, gageId, weight, description } = body;

    if (!sizeId || !gageId || !weight) {
      return NextResponse.json(
        { error: "Size, Gage, and Weight are required" },
        { status: 400 }
      );
    }

    const unitWeight = await prisma.unit_weights.create({
      data: {
        sizeId: Number(sizeId),
        gageId: Number(gageId),
        weight: parseFloat(weight),
        description: description || null,
      },
    });

    return NextResponse.json(unitWeight, { status: 201 });
  } catch (error) {
    console.error("Error creating unit weight:", error);
    return NextResponse.json(
      { error: "Failed to create unit weight" },
      { status: 500 }
    );
  }
}
