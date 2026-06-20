import prisma from "@/lib/db/prisma";
import { withMockFallback } from "@/lib/db/mockFallback";
import { mockHandlers } from "@/lib/mocks/mockHandlers";

export async function GET() {
  return withMockFallback(
    async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayMolding = await prisma.molding_entries.aggregate({
        _sum: {
          quantity: true,
        },
        where: {
          createdAt: {
            gte: today,
          },
        },
      });

      const totalMaterialUsed = await prisma.molding_entries.aggregate({
        _sum: {
          quantity: true,
        },
      });

      const remainingProducts = await prisma.remaining_molding.aggregate({
        _sum: {
          remaining: true,
          totalDamage: true,
        },
      });

      return {
        todayMoldingQuantity: todayMolding._sum.quantity || 0,
        totalMaterialUsed: totalMaterialUsed._sum.quantity || 0,
        totalDamage: remainingProducts._sum.totalDamage || 0,
        totalRemainingMoldedProducts: remainingProducts._sum.remaining || 0,
      };
    },
    () => mockHandlers.moldingStats(),
    { errorMessage: "Failed to fetch molding stats" }
  );
}
