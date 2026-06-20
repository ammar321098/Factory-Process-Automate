import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";

// GET /api/employees/[id] - Get single employee
// export async function GET(
//   request: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const { id } = await params;

//     const employee = await prisma.employees.findUnique({
//       where: { id: parseInt(id) },
//       include: {
//         departments: {
//           select: {
//             id: true,
//             name: true,
//             description: true,
//           },
//         },
//         attendance: {
//           select: {
//             id: true,
//             date: true,
//             status: true,
//             checkIn: true,
//             checkOut: true,
//           },
//           orderBy: { date: 'desc' },
//           take: 10,
//         },
//         payslips: {
//           select: {
//             id: true,
//             month: true,
//             year: true,
//             grossSalary: true,
//             netSalary: true,
//             status: true,
//           },
//           orderBy: { createdAt: 'desc' },
//           take: 5,
//         },
//       },
//     });

//     if (!employee) {
//       return NextResponse.json(
//         { error: 'Employee not found' },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(employee);
//   } catch (error) {
//     console.error('Error fetching employee:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch employee' },
//       { status: 500 }
//     );
//   }
// }

// PATCH /api/employees/[id] - Update employee
export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await _req.json();
    const { name, phone, position, address, qualityNotes } = body;

    // Validate required fields
    if (!name || !phone) {
      return NextResponse.json(
        {
          error:
            "Employee ID, name, email, phone, department, position, hire date, and salary type are required",
        },
        { status: 400 }
      );
    }

    const employee = await prisma.employees.update({
      where: { id: parseInt(id) },
      data: {
        name,
        phone,
        position,
        address,
        qualityNotes,
      },
    });

    return NextResponse.json(employee);
  } catch (error) {
    console.error("Error updating employee:", error);
    return NextResponse.json(
      { error: "Failed to update employee" },
      { status: 500 }
    );
  }
}

// DELETE /api/employees/[id] - Delete employee
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const employeeId = parseInt(id);

    // Check if employee exists
    const employee = await prisma.employees.findUnique({
      where: { id: employeeId },
    });

    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    // Check related records
    const [moldingCount, polishingCount, productRateCount, polishingRateCount] =
      await Promise.all([
        prisma.molding_entries.count({ where: { employeeId } }),
        prisma.polishing_entries.count({ where: { employeeId } }),
        prisma.product_rates.count({ where: { employeeId } }),
        prisma.polishing_rates.count({ where: { employeeId } }),
      ]);

    // If employee is used anywhere → block deletion
    if (
      moldingCount > 0 ||
      polishingCount > 0 ||
      productRateCount > 0 ||
      polishingRateCount > 0
    ) {
      let message = `Employee cannot be deleted because they are used in: `;

      const usedIn: string[] = [];

      if (moldingCount > 0) usedIn.push("Molding Records");
      if (polishingCount > 0) usedIn.push("Polishing Records");
      if (productRateCount > 0) usedIn.push("Product Rates");
      if (polishingRateCount > 0) usedIn.push("Polishing Rates");

      message += usedIn.join(", ");

      return NextResponse.json({ error: message }, { status: 400 });
    }

    // Safe to delete employee
    await prisma.employees.delete({
      where: { id: employeeId },
    });

    return NextResponse.json({
      message: "Employee deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting employee:", error);
    return NextResponse.json(
      { error: "Failed to delete employee" },
      { status: 500 }
    );
  }
}
