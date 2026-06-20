import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { withMockFallback } from "@/lib/db/mockFallback";
import { mockHandlers } from "@/lib/mocks/mockHandlers";

// GET /api/raw-material/all
export async function GET(request: NextRequest) {
  return withMockFallback(
    async () => {
      const materials = await prisma.materials.findMany({
        where: {
          deletedAt: null,
        },
        select: {
          id: true,
          name: true,
          category: true,
          unit: true,
          totalQuantity: true,
        },
        orderBy: { name: "asc" },
      });

      return { data: materials };
    },
    () => mockHandlers.listAllMaterials(),
    { errorMessage: "Failed to fetch materials" }
  );
}
