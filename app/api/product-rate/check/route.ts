import { prisma } from "@/lib/db/prisma";
import { NextRequest, NextResponse } from "next/server";
import { mockJson, withMockFallbackRaw } from "@/lib/db/mockFallback";
import { mockHandlers } from "@/lib/mocks/mockHandlers";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const productTypeId = Number(searchParams.get("productTypeId"));
  const employeeId = Number(searchParams.get("employeeId"));

  if (!productTypeId || !employeeId) {
    return NextResponse.json(
      { error: "Product Type and Employee ID are required" },
      { status: 400 }
    );
  }

  return withMockFallbackRaw(
    async () => {
      const employee = await prisma.employees.findUnique({
        where: { id: employeeId },
        select: { salaryType: true },
      });

      if (!employee) {
        return NextResponse.json(
          { error: "Employee not found" },
          { status: 404 }
        );
      }

      if (employee.salaryType === "MONTHLY") {
        return NextResponse.json({ productRate: "0", salaryType: "MONTHLY" });
      }

      const rateRecord = await prisma.product_rates.findFirst({
        where: { productId: productTypeId, employeeId },
        select: { productRate: true },
      });

      return NextResponse.json({
        productRate: rateRecord?.productRate ?? 0,
        salaryType: employee.salaryType,
      });
    },
    async () => {
      const result = mockHandlers.checkProductRate(productTypeId, employeeId);
      if ("status" in result && result.status === 404) {
        return NextResponse.json({ error: result.error }, { status: 404 });
      }
      return mockJson(result);
    },
    "Failed to fetch product rate"
  );
}
