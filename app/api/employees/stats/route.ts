import prisma from "@/lib/db/prisma";
import { withMockFallback } from "@/lib/db/mockFallback";
import { mockHandlers } from "@/lib/mocks/mockHandlers";

export async function GET() {
  return withMockFallback(
    async () => {
      const [
        totalEmployees,
        moldingEmployees,
        polishingEmployees,
        monthlySalaryEmployees,
        pieceRateEmployees,
      ] = await Promise.all([
        prisma.employees.count(),
        prisma.employees.count({
          where: { department: "Molding" },
        }),
        prisma.employees.count({
          where: { department: "Polishing" },
        }),
        prisma.employees.count({
          where: { salaryType: "MONTHLY" },
        }),
        prisma.employees.count({
          where: { salaryType: "PIECE" },
        }),
      ]);

      return {
        totalEmployees,
        moldingEmployees,
        polishingEmployees,
        monthlySalaryEmployees,
        pieceRateEmployees,
      };
    },
    () => mockHandlers.employeeStats(),
    { errorMessage: "Failed to fetch employee stats" }
  );
}
