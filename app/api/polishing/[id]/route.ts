import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { mockJson, withMockFallbackRaw } from "@/lib/db/mockFallback";
import { mockHandlers } from "@/lib/mocks/mockHandlers";

// GET /api/polishing-entries/[id] - Get single polishing entry
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numId = parseInt(id);

  return withMockFallbackRaw(
    async () => {
      const polishingEntry = await prisma.polishing_entries.findUnique({
        where: { id: numId },
      });

      if (!polishingEntry) {
        return NextResponse.json(
          { error: "Polishing entry not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(polishingEntry);
    },
    async () => {
      const polishingEntry = mockHandlers.getPolishingEntry(numId);
      if (!polishingEntry) {
        return NextResponse.json(
          { error: "Polishing entry not found" },
          { status: 404 }
        );
      }
      return mockJson(polishingEntry);
    },
    "Failed to fetch polishing entry"
  );
}

// PATCH /api/polishing-entries/[id] - Update polishing entry
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
        { error: "Polishing Quantity is required" },
        { status: 400 }
      );
    }

    // Fetch existing polishing entry
    const existingEntry = await prisma.polishing_entries.findUnique({
      where: { id: Number(id) },
    });

    if (!existingEntry) {
      return NextResponse.json(
        { error: "Polishing entry not found" },
        { status: 404 }
      );
    }

    // Fetch related remaining_molding to get productTypeId
    const molding = await prisma.remaining_molding.findUnique({
      where: { id: existingEntry.productId },
    });

    if (!molding) {
      return NextResponse.json(
        { error: "Related molded product not found" },
        { status: 404 }
      );
    }

    const oldQuantity = existingEntry.quantity;
    const diff = quantity - oldQuantity;

    // Update remaining_molding and remaining_polishing
    if (diff > 0) {
      // Increased quantity
      await prisma.remaining_molding.update({
        where: { id: molding.id },
        data: { remaining: { decrement: diff } },
      });

      await prisma.remaining_polishing.updateMany({
        where: { productTypeId: molding.productTypeId },
        data: {
          remaining: { increment: diff },
          totalQuantity: { increment: diff },
        },
      });
    } else if (diff < 0) {
      // Decreased quantity
      const absDiff = Math.abs(diff);

      await prisma.remaining_molding.update({
        where: { id: molding.id },
        data: { remaining: { increment: absDiff } },
      });

      await prisma.remaining_polishing.updateMany({
        where: { productTypeId: molding.productTypeId },
        data: {
          remaining: { decrement: absDiff },
          totalQuantity: { decrement: absDiff },
        },
      });
    }

    // Update polishing entry
    const updatedEntry = await prisma.polishing_entries.update({
      where: { id: Number(id) },
      data: {
        quantity: Number(quantity),
        qualityNotes: qualityNotes || null,
      },
    });

    return NextResponse.json({ success: true, updatedEntry });
  } catch (error) {
    console.error("Error updating polishing entry:", error);
    return NextResponse.json(
      { error: "Failed to update polishing entry" },
      { status: 500 }
    );
  }
}

// DELETE /api/polishing-entries/[id] - Delete polishing entry
export async function DELETE(
   _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Fetch polishing entry
    const entry = await prisma.polishing_entries.findUnique({
      where: { id: Number(id) },
    });

    if (!entry) {
      return NextResponse.json(
        { error: "Polishing entry not found" },
        { status: 404 }
      );
    }

    const { productId, quantity } = entry;

    // Fetch remaining_molding to get productTypeId
    const molding = await prisma.remaining_molding.findUnique({
      where: { id: productId },
    });

    if (!molding) {
      return NextResponse.json(
        { error: "Related molded product not found" },
        { status: 404 }
      );
    }

    const productTypeId = molding.productTypeId;

    // Transaction - revert everything
    await prisma.$transaction(async (tx) => {
      // Add back quantity to remaining_molding
      await tx.remaining_molding.update({
        where: { id: molding.id },
        data: { remaining: { increment: quantity } },
      });

      // Reduce remaining_polishing
      await tx.remaining_polishing.updateMany({
        where: { productTypeId },
        data: {
          remaining: { decrement: quantity },
          totalQuantity: { decrement: quantity },
        },
      });

      // Delete polishing entry
      await tx.polishing_entries.delete({
        where: { id: Number(id) },
      });
    });

    return NextResponse.json({
      success: true,
      message: "Polishing entry deleted and stock adjusted successfully",
    });
  } catch (error) {
    console.error("Error deleting polishing entry:", error);
    return NextResponse.json(
      { error: "Failed to delete polishing entry" },
      { status: 500 }
    );
  }
}
