import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { mockJson, withMockFallbackRaw } from "@/lib/db/mockFallback";
import { mockHandlers } from "@/lib/mocks/mockHandlers";

// GET /api/gages/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numId = Number(id);

  return withMockFallbackRaw(
    async () => {
      const gage = await prisma.gages.findUnique({
        where: { id: numId },
      });

      if (!gage) {
        return NextResponse.json({ error: "Gage not found" }, { status: 404 });
      }

      return NextResponse.json(gage);
    },
    async () => {
      const gage = mockHandlers.getGage(numId);
      if (!gage) {
        return NextResponse.json({ error: "Gage not found" }, { status: 404 });
      }
      return mockJson(gage);
    },
    "Failed to fetch gage"
  );
}

// PATCH /api/gages/[id]
export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await _req.json();
    const { name, gage, description } = body;

    const gageData = await prisma.gages.update({
      where: { id: Number(id) },
      data: {
        name,
        gage: gage !== undefined ? parseFloat(gage) : undefined,
        description: description !== undefined ? description : undefined,
      },
    });

    return NextResponse.json(gageData);
  } catch (error) {
    console.error("Error updating gage:", error);
    return NextResponse.json(
      { error: "Failed to update gage" },
      { status: 500 }
    );
  }
}

// DELETE /api/sizes/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const gageId = Number(id);

    // Check if size exists
    const exists = await prisma.gages.findUnique({
      where: { id: gageId },
    });

    if (!exists) {
      return NextResponse.json({ error: "Size not found." }, { status: 404 });
    }

    // Find all materials linked to this size
    const usedMaterials = await prisma.materials.findMany({
      where: { gageId },
      select: { id: true, name: true },
    });

    // If used, block deletion and send descriptive message
    if (usedMaterials.length > 0) {
      const names = usedMaterials.map((m) => m.name);

      return NextResponse.json(
        {
          error: `This gage cannot be deleted because it is linked to ${usedMaterials.length} material(s). Please unlink or delete following materials from this gage before delete this gage.`,
          materialsInUse: names,
        },
        { status: 400 }
      );
    }

    // Check if unit weight uses this size
    const usedInUnitWeight = await prisma.unit_weights.findMany({
      where: { gageId },
      select: { id: true, weight: true },
    });

    if (usedInUnitWeight.length > 0) {
      return NextResponse.json(
        {
          error: `This gage cannot be deleted because a unit weight entry is linked to it. Please unlink or delete unit weight that uses this gage.`,
          unitWeights: usedInUnitWeight,
        },
        { status: 400 }
      );
    }

    // Safe to delete
    await prisma.gages.delete({
      where: { id: gageId },
    });

    return NextResponse.json({
      message: "Gage deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting gage:", error);
    return NextResponse.json(
      { error: "Failed to delete gage" },
      { status: 500 }
    );
  }
}
