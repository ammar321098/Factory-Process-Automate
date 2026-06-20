import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { mockJson, withMockFallbackRaw } from "@/lib/db/mockFallback";
import { mockHandlers } from "@/lib/mocks/mockHandlers";

// GET /api/packing-entries/[id] - Get single packing entry
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numId = parseInt(id);

  return withMockFallbackRaw(
    async () => {
      const packingEntry = await prisma.packing_entries.findUnique({
        where: { id: numId },
        include: {},
      });

      if (!packingEntry) {
        return NextResponse.json(
          { error: "Packing entry not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(packingEntry);
    },
    async () => {
      const packingEntry = mockHandlers.getPackingEntry(numId);
      if (!packingEntry) {
        return NextResponse.json(
          { error: "Packing entry not found" },
          { status: 404 }
        );
      }
      return mockJson(packingEntry);
    },
    "Failed to fetch packing entry"
  );
}




// PATCH /api/packing-entries/[id] - Update packing entry
export async function PATCH(
   _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) {
  try {
    const { id } = await params;
    const body = await _req.json();
    const { quantity, qualityNotes } = body;

    if (quantity === undefined || quantity === null) {
      return NextResponse.json(
        { error: "Packing quantity is required" },
        { status: 400 }
      );
    }

    // Fetch existing packing entry
    const existingEntry = await prisma.packing_entries.findUnique({
      where: { id: Number(id) },
    });

    if (!existingEntry) {
      return NextResponse.json(
        { error: "Packing entry not found" },
        { status: 404 }
      );
    }

    // Fetch the related remaining_polishing record
    const polished = await prisma.remaining_polishing.findUnique({
      where: { id: existingEntry.productId },
    });

    if (!polished) {
      return NextResponse.json(
        { error: "Related polished product not found" },
        { status: 404 }
      );
    }

    const oldQuantity = existingEntry.quantity;
    const diff = Number(quantity) - oldQuantity;

    // Adjust remaining_polishing and remaining_packing
    if (diff > 0) {
      // User increased quantity: subtract from remaining_polishing, add to remaining_packing
      await prisma.remaining_polishing.update({
        where: { id: polished.id },
        data: { remaining: { decrement: diff } },
      });

      await prisma.remaining_packing.updateMany({
        where: { productTypeId: polished.productTypeId },
        data: {
          remaining: { increment: diff },
          totalQuantity: { increment: diff },
        },
      });
    } else if (diff < 0) {
      // User decreased quantity: add back to remaining_polishing, subtract from remaining_packing
      const absDiff = Math.abs(diff);

      await prisma.remaining_polishing.update({
        where: { id: polished.id },
        data: { remaining: { increment: absDiff } },
      });

      await prisma.remaining_packing.updateMany({
        where: { productTypeId: polished.productTypeId },
        data: {
          remaining: { decrement: absDiff },
          totalQuantity: { decrement: absDiff },
        },
      });
    }

    // Update packing entry with new quantity
    const updatedEntry = await prisma.packing_entries.update({
      where: { id: Number(id) },
      data: {
        quantity: Number(quantity),
        qualityNotes: qualityNotes || null,
      },
    });

    return NextResponse.json({ success: true, updatedEntry });
  } catch (error) {
    console.error("Error updating packing entry:", error);
    return NextResponse.json(
      { error: "Failed to update packing entry" },
      { status: 500 }
    );
  }
}



// DELETE /api/packing-entries/[id] - Delete packing entry
export async function DELETE(
   _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Fetch packing entry
    const entry = await prisma.packing_entries.findUnique({
      where: { id: Number(id) },
    });

    if (!entry) {
      return NextResponse.json(
        { error: "Packing entry not found" },
        { status: 404 }
      );
    }

    const { productId, quantity } = entry;

    // Fetch related remaining_polishing to get productTypeId
    const polished = await prisma.remaining_polishing.findUnique({
      where: { id: productId },
    });

    if (!polished) {
      return NextResponse.json(
        { error: "Related polished product not found" },
        { status: 404 }
      );
    }

    const productTypeId = polished.productTypeId;

    // Perform full stock reversal inside transaction
    await prisma.$transaction(async (tx) => {
      // Add deleted quantity back to remaining polishing
      await tx.remaining_polishing.update({
        where: { id: polished.id },
        data: { remaining: { increment: quantity } },
      });

      // Reduce quantity from remaining packing
      await tx.remaining_packing.updateMany({
        where: { productTypeId },
        data: {
          remaining: { decrement: quantity },
          totalQuantity: { decrement: quantity },
        },
      });

      // Delete packing entry
      await tx.packing_entries.delete({
        where: { id: Number(id) },
      });
    });

    return NextResponse.json({
      success: true,
      message: "Packing entry deleted and stock updated successfully",
    });
  } catch (error) {
    console.error("Error deleting packing entry:", error);
    return NextResponse.json(
      { error: "Failed to delete packing entry" },
      { status: 500 }
    );
  }
}
