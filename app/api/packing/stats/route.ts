import prisma from "@/lib/db/prisma";
import { withMockFallback } from "@/lib/db/mockFallback";
import { mockHandlers } from "@/lib/mocks/mockHandlers";

export async function GET() {
  return withMockFallback(
    async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const totalPolishedUsed = await prisma.packing_entries.aggregate({
        _sum: {
          quantity: true,
        },
      });

      const todayPacked = await prisma.packing_entries.aggregate({
        _sum: {
          quantity: true,
        },
        where: {
          createdAt: {
            gte: today,
          },
        },
      });

      const totalProductTypesPacked = await prisma.remaining_packing.count({
        where: {
          totalQuantity: {
            gt: 0,
          },
        },
      });

      const remainingPacking = await prisma.remaining_packing.aggregate({
        _sum: {
          remaining: true,
        },
      });

      return {
        totalPolishedItemsUsed: totalPolishedUsed._sum.quantity || 0,
        todayPackedItems: todayPacked._sum.quantity || 0,
        totalProductsPacked: totalProductTypesPacked || 0,
        totalRemainingPacking: remainingPacking._sum.remaining || 0,
      };
    },
    () => mockHandlers.packingStats(),
    { errorMessage: "Failed to fetch packing stats" }
  );
}
