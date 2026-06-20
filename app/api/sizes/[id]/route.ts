import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { mockJson, withMockFallbackRaw } from "@/lib/db/mockFallback";
import { mockHandlers } from "@/lib/mocks/mockHandlers";

// GET /api/sizes/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numId = Number(id);

  return withMockFallbackRaw(
    async () => {
      const size = await prisma.sizes.findUnique({
        where: { id: numId },
      });

      if (!size) {
        return NextResponse.json({ error: "Size not found" }, { status: 404 });
      }

      return NextResponse.json(size);
    },
    async () => {
      const size = mockHandlers.getSize(numId);
      if (!size) {
        return NextResponse.json({ error: "Size not found" }, { status: 404 });
      }
      return mockJson(size);
    },
    "Failed to fetch size"
  );
}

// PATCH /api/sizes/[id]
export async function PATCH(
   _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await _req.json();
    const { name, length, width, description } = body;

    const size = await prisma.sizes.update({
      where: { id: Number(id) },
      data: {
        name,
        length: length !== undefined ? parseFloat(length) : undefined,
        width: width !== undefined ? parseFloat(width) : undefined,
        description: description !== undefined ? description : undefined,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.error("Error updating size:", error);
    return NextResponse.json(
      { error: "Failed to update size" },
      { status: 500 }
    );
  }
}

// DELETE /api/sizes/[id]
export async function DELETE(
    _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sizeId = Number(id);

    // Check if size exists
    const exists = await prisma.sizes.findUnique({
      where: { id: sizeId },
    });

    if (!exists) {
      return NextResponse.json({ error: "Size not found." }, { status: 404 });
    }

    // Find all materials linked to this size
    const usedMaterials = await prisma.materials.findMany({
      where: { sizeId },
      select: { id: true, name: true },
    });

    // If used, block deletion and send descriptive message
    if (usedMaterials.length > 0) {
      const names = usedMaterials.map((m) => m.name);

      return NextResponse.json(
        {
          error: `This size cannot be deleted because it is linked to ${usedMaterials.length} material(s). Please unlink or delete following materials from this size before delete this size.`,
          materialsInUse: names,
        },
        { status: 400 }
      );
    }

    // Check if unit weight uses this size
    const usedInUnitWeight = await prisma.unit_weights.findMany({
      where: { sizeId },
      select: { id: true, weight: true },
    });

    if (usedInUnitWeight.length > 0) {
      return NextResponse.json(
        {
          error: `This size cannot be deleted because a unit weight entry is linked to it. Please unlink or delete unit weight that uses this size.`,
          unitWeights: usedInUnitWeight,
        },
        { status: 400 }
      );
    }

    // Safe to delete
    await prisma.sizes.delete({
      where: { id: sizeId },
    });

    return NextResponse.json({
      message: "Size deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting size:", error);
    return NextResponse.json(
      { error: "Failed to delete size" },
      { status: 500 }
    );
  }
}
