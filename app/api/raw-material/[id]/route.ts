import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { mockJson, withMockFallbackRaw } from "@/lib/db/mockFallback";
import { mockHandlers } from "@/lib/mocks/mockHandlers";

// GET /api/materials/[id] - Get single material by ID
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numId = Number(id);

  return withMockFallbackRaw(
    async () => {
      const material = await prisma.materials.findUnique({
        where: { id: numId },
        include: {
          size: true,
          gage: true,
          unitWeight: true,
        },
      });

      if (!material) {
        return NextResponse.json(
          { error: "Material not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(material);
    },
    async () => {
      const material = mockHandlers.getMaterial(numId);
      if (!material) {
        return NextResponse.json(
          { error: "Material not found" },
          { status: 404 }
        );
      }
      return mockJson(material);
    },
    "Failed to fetch material"
  );
}

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await _req.json();

    const updated = await prisma.materials.update({
      where: { id: Number(id) },
      data: body,
    });

    return NextResponse.json({ success: true, updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}

// DELETE /api/materials/[id] - Delete material
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const materialId = Number(id);

    //  Check if material exists
    const material = await prisma.materials.findUnique({
      where: { id: materialId },
      select: { id: true, name: true },
    });

    if (!material) {
      return NextResponse.json(
        { error: "Material not found." },
        { status: 404 }
      );
    }

    // Check if used in molding_entries
    const usedInMoldingEntries = await prisma.molding_entries.findMany({
      where: { materialId },
      select: { id: true, quantity: true, finalQuantity: true },
    });

    if (usedInMoldingEntries.length > 0) {
      return NextResponse.json(
        {
          error: `This material cannot be deleted because it is used in ${usedInMoldingEntries.length} molding record(s).`,
          moldingUsage: usedInMoldingEntries,
        },
        { status: 400 }
      );
    }

    // Safe to delete
    await prisma.materials.delete({
      where: { id: materialId },
    });

    return NextResponse.json({
      message: "Material deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting material:", error);
    return NextResponse.json(
      { error: "Failed to delete material" },
      { status: 500 }
    );
  }
}
