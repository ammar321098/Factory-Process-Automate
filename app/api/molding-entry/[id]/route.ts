import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { mockJson, withMockFallbackRaw } from "@/lib/db/mockFallback";
import { mockHandlers } from "@/lib/mocks/mockHandlers";

// GET /api/molding-entries/[id] - Get single molding entry
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numId = parseInt(id);

  return withMockFallbackRaw(
    async () => {
      const moldingEntry = await prisma.molding_entries.findUnique({
        where: { id: numId },
        include: {
          materials: {
            select: {
              id: true,
              name: true,
              category: true,
              supplier: true,
              unit: true,
              cost: true,
            },
          },
          product_types: {
            select: {
              id: true,
              productType: true,
              description: true,
            },
          },
        },
      });

      if (!moldingEntry) {
        return NextResponse.json(
          { error: "Molding entry not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(moldingEntry);
    },
    async () => {
      const moldingEntry = mockHandlers.getMoldingEntry(numId);
      if (!moldingEntry) {
        return NextResponse.json(
          { error: "Molding entry not found" },
          { status: 404 }
        );
      }
      return mockJson(moldingEntry);
    },
    "Failed to fetch molding entry"
  );
}

// PATCH /api/molding-entries/[id] - Update molding entry
export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await _req.json();

    // parse numbers defensively
    const newQuantity = Number(body.quantity ?? 0);
    const newDamage = Number(body.damage ?? 0);
    const newFinal = Number(body.finalQuantity ?? 0);
    const qualityNotes = body.qualityNotes ?? null;

    // Basic validation
    if (newQuantity < 0 || newDamage < 0 || newFinal < 0) {
      return NextResponse.json(
        { error: "Quantities must be non-negative" },
        { status: 400 }
      );
    }

    // Transactional update
    const updatedEntry = await prisma.$transaction(async (tx) => {
      // 1) load the existing entry
      const oldEntry = await tx.molding_entries.findUnique({
        where: { id: Number(id) },
      });

      if (!oldEntry) {
        throw { status: 404, message: "Molding entry not found" };
      }

      // Use the original productTypeId & materialId from old entry
      const productTypeId = oldEntry.productTypeId;
      const materialId = oldEntry.materialId;

      // 2) compute diffs = new - old (can be negative)
      const diffQuantity = newQuantity - Number(oldEntry.quantity ?? 0);
      const diffDamage = newDamage - Number(oldEntry.damage ?? 0);
      const diffFinal = newFinal - Number(oldEntry.finalQuantity ?? 0);

      // 3) load remaining_molding for this productType + material
      const remaining = await tx.remaining_molding.findFirst({
        where: {
          productTypeId,
        },
      });

      // If remaining record doesn't exist:
      // - if diffs are positive (adding produced items) we will create it
      // - if diffs are negative (removing) -> cannot remove from missing record
      if (!remaining) {
        if (diffQuantity < 0 || diffDamage < 0 || diffFinal < 0) {
          throw {
            status: 400,
            message: "Remaining molding record missing; cannot subtract",
          };
        }
      }

      // 4) load material & unitWeight info
      // Assumes materials has: quantity (pieces) and weight (kg)
      // and a relation unitWeight { weight: number } where weight is grams per piece
      const material = await tx.materials.findUnique({
        where: { id: materialId },
        include: {
          unitWeight: true,
        },
      });

      if (!material) {
        throw { status: 404, message: "Material not found" };
      }

      // unitWeight: grams per piece (assumption). If absent, treat as 0
      const unitWeightGrams = Number(material.unitWeight?.weight ?? 0); // grams per piece
      const weightChangeKg = (diffQuantity * unitWeightGrams) / 1000; // kg change (can be negative)

      // 5) VALIDATIONS BEFORE UPDATING
      // If diffFinal > 0 (we need more material), ensure material has enough quantity & weight
      if (diffQuantity > 0) {
        if (material.totalQuantity - diffQuantity < 0) {
          throw {
            status: 400,
            message: "Insufficient material quantity for this update",
          };
        }
        if (
          unitWeightGrams > 0 &&
          (material.weight ?? 0) - weightChangeKg < 0
        ) {
          throw {
            status: 400,
            message: "Insufficient material weight for this update",
          };
        }
      }

      // If diffFinal < 0 (user decreased finalQuantity), we will add pieces/weight back to material — that is always allowed.
      // For remaining_molding: compute new totals (if record exists)
      let newRemainingTotals = null;
      if (remaining) {
        newRemainingTotals = {
          totalQuantity: Number(remaining.totalQuantity ?? 0) + diffQuantity,
          totalDamage: Number(remaining.totalDamage ?? 0) + diffDamage,
          remaining: Number(remaining.remaining ?? 0) + diffFinal,
        };

        // Validate remaining totals not negative
        if (
          newRemainingTotals.totalQuantity < 0 ||
          newRemainingTotals.totalDamage < 0 ||
          newRemainingTotals.remaining < 0
        ) {
          throw {
            status: 400,
            message: "Insufficient remaining molding stock for this update",
          };
        }
      } else {
        // remaining doesn't exist and diffs are >= 0 (we checked earlier).
        newRemainingTotals = {
          totalQuantity: diffQuantity,
          totalDamage: diffDamage,
          finalQuantity: diffFinal,
        };
      }

      // 6) Perform updates (all inside transaction)
      // 6a) Update or create remaining_molding
      if (remaining) {
        await tx.remaining_molding.update({
          where: { id: remaining.id },
          data: {
            totalQuantity: newRemainingTotals.totalQuantity,
            totalDamage: newRemainingTotals.totalDamage,
            remaining: newRemainingTotals.remaining,
          },
        });
      } else {
        // create new remaining_molding row
        await tx.remaining_molding.create({
          data: {
            totalQuantity: newRemainingTotals.totalQuantity,
            totalDamage: newRemainingTotals.totalDamage,
            remaining: newRemainingTotals.remaining,
          },
        });
      }

      // 6b) Update material: adjust pieces and weight (add or subtract depending on diffFinal sign)
      const updatedMaterialData: any = {};
      if (diffQuantity !== 0) {
        updatedMaterialData.totalQuantity =
          Number(material.totalQuantity ?? 0) - diffQuantity;
        // Update weight only if unitWeight present (kg)
        if (unitWeightGrams > 0) {
          updatedMaterialData.weight =
            Number(material.weight ?? 0) - weightChangeKg;
        }
      }

      // If there is nothing to change on material, skip update
      if (Object.keys(updatedMaterialData).length > 0) {
        // Ensure we never store negative numbers (just in case)
        updatedMaterialData.totalQuantity = Math.max(
          0,
          updatedMaterialData.totalQuantity
        );
        if (updatedMaterialData.weight !== undefined) {
          updatedMaterialData.weight = Math.max(0, updatedMaterialData.weight);
        }

        await tx.materials.update({
          where: { id: materialId },
          data: updatedMaterialData,
        });
      }

      // 6c) Update molding_entries row with new values
      const updatedEntry = await tx.molding_entries.update({
        where: { id: Number(id) },
        data: {
          quantity: newQuantity,
          damage: newDamage,
          finalQuantity: newFinal,
          qualityNotes,
        },
      });

      // return updated entry
      return updatedEntry;
    }); // end transaction

    return NextResponse.json(updatedEntry);
  } catch (err: any) {
    console.error("Error updating molding entry:", err);
    // custom thrown errors have shape { status, message }
    if (err && err.status && err.message) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    return NextResponse.json(
      { error: "Failed to update molding entry" },
      { status: 500 }
    );
  }
}

// DELETE /api/molding-entries/[id] - Delete molding entry
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const entryId = Number(id);

    // Fetch entry with related data
    const existingEntry = await prisma.molding_entries.findUnique({
      where: { id: entryId },
      include: {
        materials: { include: { unitWeight: true } },
      },
    });

    if (!existingEntry) {
      return NextResponse.json(
        { error: "Molding entry not found" },
        { status: 404 }
      );
    }

    const {
      productTypeId,
      materialId,
      quantity,
      damage,
      finalQuantity,
      materials,
    } = existingEntry;

    const unitWeightGrams = materials?.unitWeight?.weight ?? 0;
    const unitWeightKg = unitWeightGrams / 1000;

    const weightToAdd = quantity * unitWeightKg;

    await prisma.$transaction(async (tx) => {
      // Add back quantity + weight to materials
      await tx.materials.update({
        where: { id: materialId },
        data: {
          totalQuantity: { increment: quantity },
          weight: { increment: weightToAdd },
        },
      });

      // Deduct from remaining_molding
      const remaining = await tx.remaining_molding.findFirst({
        where: { productTypeId },
      });

      if (remaining) {
        await tx.remaining_molding.update({
          where: { id: remaining.id },
          data: {
            totalQuantity: { decrement: quantity },
            totalDamage: { decrement: damage },
            remaining: { decrement: finalQuantity },
          },
        });
      }

      // Delete molding entry
      await tx.molding_entries.delete({
        where: { id: entryId },
      });
    });

    return NextResponse.json({
      message: "Molding entry deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting molding entry:", error);
    return NextResponse.json(
      { error: "Failed to delete molding entry" },
      { status: 500 }
    );
  }
}
