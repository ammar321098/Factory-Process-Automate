import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { mockJson, withMockFallbackRaw } from "@/lib/db/mockFallback";
import { mockHandlers } from "@/lib/mocks/mockHandlers";

// GET /api/product-rates/[id] - Get single product rate
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numId = parseInt(id);

  return withMockFallbackRaw(
    async () => {
      const productRate = await prisma.product_rates.findUnique({
        where: { id: numId },
        include: {
          product_types: true,
          employees: true,
        },
      });

      if (!productRate) {
        return NextResponse.json(
          { error: "Product rate not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(productRate);
    },
    async () => {
      const productRate = mockHandlers.getProductRate(numId);
      if (!productRate) {
        return NextResponse.json(
          { error: "Product rate not found" },
          { status: 404 }
        );
      }
      return mockJson(productRate);
    },
    "Failed to fetch product rate"
  );
}

// PATCH /api/product-rate/[id] - Update product rate
export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // product_rates.id
    const body = await _req.json();

    const { productRate, description } = body;

    // validate required field
    if (productRate === undefined || productRate === null) {
      return NextResponse.json(
        { error: "productRate is required" },
        { status: 400 }
      );
    }

    // Find the existing product rate entry
    const existing = await prisma.product_rates.findUnique({
      where: { id: Number(id) },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Product rate entry not found" },
        { status: 404 }
      );
    }

    // Perform update
    const updated = await prisma.product_rates.update({
      where: { id: Number(id) },
      data: {
        productRate: Number(productRate),
        description: description ?? existing.description,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating product rate:", error);
    return NextResponse.json(
      { error: "Failed to update product rate" },
      { status: 500 }
    );
  }
}

// DELETE /api/product-rate/[id] - Delete product rate
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.product_rates.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: "Product type deleted successfully" });
  } catch (error) {
    console.error("Error deleting product rate:", error);
    return NextResponse.json(
      { error: "Failed to delete product rate" },
      { status: 500 }
    );
  }
}
