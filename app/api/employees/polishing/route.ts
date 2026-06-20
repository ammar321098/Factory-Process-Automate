import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { withMockFallback } from "@/lib/db/mockFallback";
import { mockHandlers } from "@/lib/mocks/mockHandlers";

export async function GET(request: NextRequest) {
  return withMockFallback(
    async () => {
      const employees = await prisma.employees.findMany({
        where: {
          status: "ACTIVE",
          department: "Polishing",
        },
        select: {
          id: true,
          name: true,
          department: true,
          status: true,
          salaryType: true,
        },
        orderBy: { name: "asc" },
      });

      return { data: employees };
    },
    () => mockHandlers.listPolishingEmployees(request),
    { errorMessage: "Failed to fetch employees" }
  );
}
