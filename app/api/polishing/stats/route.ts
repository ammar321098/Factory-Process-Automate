import prisma from "@/lib/db/prisma";
import { withMockFallback } from "@/lib/db/mockFallback";
import { mockHandlers } from "@/lib/mocks/mockHandlers";

export async function GET() {
  return withMockFallback(
    async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const moldedItemsUsed = await prisma.polishing_entries.aggregate({
        _sum: {
          quantity: true,
        },
      });

      const activePolishingEmployees = await prisma.employees.count({
        where: {
          department: "Polishing",
          status: "ACTIVE",
        },
      });

      const todayPolished = await prisma.polishing_entries.aggregate({
        _sum: {
          quantity: true,
        },
        where: {
          createdAt: {
            gte: today,
          },
        },
      });

      const polishedItems = await prisma.remaining_polishing.aggregate({
        _sum: {
          remaining: true,
        },
      });

      return {
        moldedItemsUsed: moldedItemsUsed._sum.quantity || 0,
        activePolishingEmployees,
        todayPolished: todayPolished._sum.quantity || 0,
        totalPolishedItems: polishedItems._sum.remaining || 0,
      };
    },
    () => mockHandlers.polishingStats(),
    { errorMessage: "Failed to fetch polishing stats" }
  );
}
