import prisma from "@/lib/db/prisma";
import { withMockFallback } from "@/lib/db/mockFallback";
import { mockHandlers } from "@/lib/mocks/mockHandlers";

export async function GET() {
  return withMockFallback(
    async () => {
      const totalMaterials = await prisma.materials.count();

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayMaterials = await prisma.materials.count({
        where: {
          createdAt: {
            gte: today,
          },
        },
      });

      const totalWeight = await prisma.materials.aggregate({
        _sum: {
          weight: true,
        },
      });

      const totalStock = await prisma.materials.aggregate({
        _sum: {
          totalQuantity: true,
        },
      });

      return {
        totalMaterials,
        todayMaterials,
        totalWeight: totalWeight._sum.weight || 0,
        remainingQuantity: totalStock._sum.totalQuantity || 0,
      };
    },
    () => mockHandlers.rawMaterialStats(),
    { errorMessage: "Failed to fetch materials stats" }
  );
}
