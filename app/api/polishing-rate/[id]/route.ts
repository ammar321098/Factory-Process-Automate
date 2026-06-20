import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { mockJson, withMockFallbackRaw } from "@/lib/db/mockFallback";
import { mockHandlers } from "@/lib/mocks/mockHandlers";

// GET /api/polishing-rates/[id] - Get single polishing rate
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numId = parseInt(id);

  return withMockFallbackRaw(
    async () => {
      const polishingRate = await prisma.polishing_rates.findUnique({
        where: { id: numId },
        include: {
          product_types: true,
          employees: true,
        },
      });

      if (!polishingRate) {
        return NextResponse.json(
          { error: "Polishing rate not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(polishingRate);
    },
    async () => {
      const polishingRate = mockHandlers.getPolishingRate(numId);
      if (!polishingRate) {
        return NextResponse.json(
          { error: "Polishing rate not found" },
          { status: 404 }
        );
      }
      return mockJson(polishingRate);
    },
    "Failed to fetch polishing rate"
  );
}

// PATCH /api/polishing-rate/[id] - Update polishing rate
export async function PATCH(
   _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // polishing_rates.id
    const body = await _req.json();

    const { polishingRate, description } = body;

    // validate required field
    if (polishingRate === undefined || polishingRate === null) {
      return NextResponse.json(
        { error: "Polishing rate is required" },
        { status: 400 }
      );
    }

    // Find the existing polishing rate entry
    const existing = await prisma.polishing_rates.findUnique({
      where: { id: Number(id) },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Polishing rate entry not found" },
        { status: 404 }
      );
    }

    // Perform update
    const updated = await prisma.polishing_rates.update({
      where: { id: Number(id) },
      data: {
        polishingRate: Number(polishingRate),
        description: description ?? existing.description,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating polishing rate:", error);
    return NextResponse.json(
      { error: "Failed to update polishing rate" },
      { status: 500 }
    );
  }
}

// DELETE /api/polishing-rate/[id] - Delete polishing rate
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.polishing_rates.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({
      message: "Polishing rate deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting polishing rate:", error);
    return NextResponse.json(
      { error: "Failed to delete polishing rate" },
      { status: 500 }
    );
  }
}
