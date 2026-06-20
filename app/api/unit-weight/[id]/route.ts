import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { mockJson, withMockFallbackRaw } from "@/lib/db/mockFallback";
import { mockHandlers } from "@/lib/mocks/mockHandlers";

// GET /api/unit-weights/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numId = Number(id);

  return withMockFallbackRaw(
    async () => {
      const unitWeight = await prisma.unit_weights.findUnique({
        where: { id: numId },
        include: {
          size: true,
          gage: true,
        },
      });

      if (!unitWeight) {
        return NextResponse.json(
          { error: "Unit weight not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(unitWeight);
    },
    async () => {
      const unitWeight = mockHandlers.getUnitWeight(numId);
      if (!unitWeight) {
        return NextResponse.json(
          { error: "Unit weight not found" },
          { status: 404 }
        );
      }
      return mockJson(unitWeight);
    },
    "Failed to fetch unit weight"
  );
}

// DELETE /api/unit-weights/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.unit_weights.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Unit weight deleted successfully" });
  } catch (error) {
    console.error("Error deleting unit weight:", error);
    return NextResponse.json(
      { error: "Failed to delete unit weight" },
      { status: 500 }
    );
  }
}
