import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { mockJson, withMockFallbackRaw } from "@/lib/db/mockFallback";
import { mockHandlers } from "@/lib/mocks/mockHandlers";

// GET /api/product-types/[id] - Get single product type
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numId = Number(id);

  return withMockFallbackRaw(
    async () => {
      const productType = await prisma.product_types.findUnique({
        where: { id: numId },
      });

      if (!productType) {
        return NextResponse.json(
          { error: "Product type not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(productType);
    },
    async () => {
      const productType = mockHandlers.getProductType(numId);
      if (!productType) {
        return NextResponse.json(
          { error: "Product type not found" },
          { status: 404 }
        );
      }
      return mockJson(productType);
    },
    "Failed to fetch product type"
  );
}

// PATCH /api/product-type/[id] - Update product type
export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await _req.json();

    const { productType, description } = body;

    // productType is required
    if (!productType) {
      return NextResponse.json(
        { error: "productType is required" },
        { status: 400 }
      );
    }

    // check if product type already exists (unique constraint)
    const exists = await prisma.product_types.findFirst({
      where: {
        productType,
        NOT: { id: Number(id) }, // avoid collision with current record
      },
    });

    if (exists) {
      return NextResponse.json(
        { error: "This productType already exists" },
        { status: 409 }
      );
    }

    // update only allowed fields
    const updated = await prisma.product_types.update({
      where: { id: Number(id) },
      data: {
        productType,
        description: description || null,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating product type:", error);
    return NextResponse.json(
      { error: "Failed to update product type" },
      { status: 500 }
    );
  }
}

// DELETE /api/product-type/[id] - Delete product type
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productTypeId = Number(id);

    // 🔍 Check if product type is used in molding entries
    const isUsedInMolding = await prisma.molding_entries.findFirst({
      where: { productTypeId },
      select: { id: true },
    });

    if (isUsedInMolding) {
      return NextResponse.json(
        {
          error:
            "Cannot delete this product type because it is used in Molding Logs.",
        },
        { status: 400 }
      );
    }

    // 🔍 Check if product type is used in product rate table
    const isUsedInProductRate = await prisma.product_rates?.findFirst({
      where: { productId: productTypeId },
      select: { id: true },
    });

    if (isUsedInProductRate) {
      return NextResponse.json(
        {
          error:
            "Cannot delete this product type because it is used in Product Rate table.",
        },
        { status: 400 }
      );
    }

    // 🔍 Optional: Check if used in remaining_molding
    const isUsedInRemaining = await prisma.remaining_molding.findFirst({
      where: { productTypeId },
      select: { id: true },
    });

    if (isUsedInRemaining) {
      return NextResponse.json(
        {
          error:
            "Cannot delete this product type because it is used in Remaining Molding stock.",
        },
        { status: 400 }
      );
    }

    // If safe → delete product type
    await prisma.product_types.delete({
      where: { id: productTypeId },
    });

    return NextResponse.json({
      message: "Product type deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting product type:", error);

    return NextResponse.json(
      { error: "Failed to delete product type" },
      { status: 500 }
    );
  }
}
