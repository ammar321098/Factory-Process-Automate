import prisma from "@/lib/db/prisma";
import { withMockFallback } from "@/lib/db/mockFallback";
import { mockHandlers } from "@/lib/mocks/mockHandlers";

export async function GET() {
  return withMockFallback(
    async () => {
      const [materialAgg, moldingAgg, polishingAgg, packingAgg] =
        await Promise.all([
          prisma.materials.aggregate({
            _sum: { weight: true },
          }),
          prisma.remaining_molding.aggregate({
            _sum: { remaining: true },
          }),
          prisma.remaining_polishing.aggregate({
            _sum: { remaining: true },
          }),
          prisma.remaining_packing.aggregate({
            _sum: { remaining: true },
          }),
        ]);

      return {
        totalMaterialAvailable: materialAgg._sum.weight || 0,
        totalRemainingMolding: moldingAgg._sum.remaining || 0,
        totalRemainingPolishing: polishingAgg._sum.remaining || 0,
        totalRemainingPacking: packingAgg._sum.remaining || 0,
      };
    },
    () => mockHandlers.dashboardStats(),
    { errorMessage: "Failed to load dashboard stats" }
  );
}
