import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { withMockFallback } from "@/lib/db/mockFallback";
import { mockHandlers } from "@/lib/mocks/mockHandlers";

export async function GET(request: Request) {
  return withMockFallback(
    async () => {
      const url = new URL(request.url);
      const page = parseInt(url.searchParams.get("page") || "1");
      const limit = parseInt(url.searchParams.get("limit") || "10");
      const skip = (page - 1) * limit;

      const search = url.searchParams.get("search") || "";
      const department = url.searchParams.get("department") || "";
      const status = url.searchParams.get("status") || "";
      const salaryType = url.searchParams.get("salaryType") || "";
      const sortOrder = (url.searchParams.get("sortOrder") || "desc") as
        | "asc"
        | "desc";

      const employeeWhere: any = {};
      if (search) employeeWhere.name = { contains: search, mode: "insensitive" };
      if (department) employeeWhere.department = department;
      if (status) employeeWhere.status = status;
      if (salaryType) employeeWhere.salaryType = salaryType;

      const employees = await prisma.employees.findMany({
        where: employeeWhere,
        include: {
          molding_entries: {
            include: { product_types: true },
          },
          polishing_entries: {
            include: { remaining_molding: { include: { product_types: true } } },
          },
        },
      });

      const productionData: any[] = [];

      employees.forEach((emp) => {
        emp.molding_entries.forEach((m) => {
          productionData.push({
            name: emp.name,
            department: emp.department,
            product: m.product_types.productType,
            totalPieces: m.finalQuantity,
            pricePerPiece: m.productRate,
            totalAmount: m.totalEarn,
            date: m.createdAt.toISOString(),
          });
        });

        emp.polishing_entries.forEach((p) => {
          productionData.push({
            name: emp.name,
            department: emp.department,
            product: p.remaining_molding.product_types?.productType || "",
            totalPieces: p.quantity,
            pricePerPiece: p.polishingRate,
            totalAmount: p.totalEarn,
            date: p.createdAt.toISOString(),
          });
        });
      });

      productionData.sort((a, b) => {
        if (sortOrder === "asc")
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });

      const paginatedData = productionData.slice(skip, skip + limit);

      return {
        data: paginatedData,
        total: productionData.length,
        pagination: {
          total: productionData.length,
          page,
          limit,
          totalPages: Math.ceil(productionData.length / limit),
        },
      };
    },
    () => mockHandlers.productionStats(request),
    { errorMessage: "Failed to fetch production stats" }
  );
}
