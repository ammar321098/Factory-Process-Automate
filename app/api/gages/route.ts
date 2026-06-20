import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { withMockFallback } from "@/lib/db/mockFallback";
import { mockHandlers } from "@/lib/mocks/mockHandlers";

export async function GET(request: NextRequest) {
  return withMockFallback(
    async () => {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // Count total gages in the table
    const total = await prisma.gages.count();

    // Fetch all gages
    const data = await prisma.gages.findMany({
      where,
      orderBy: { name: "asc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total };
    },
    () => mockHandlers.listGages(request),
    { errorMessage: "Failed to fetch gages" }
  );
}

// export async function GET(request: NextRequest) {
//   try {
//     const searchParams = request.nextUrl.searchParams;
//     const page = parseInt(searchParams.get("page") || "1");
//     const limit = parseInt(searchParams.get("limit") || "10");
//     const search = searchParams.get("search") || "";

//     const where: any = search
//       ? {
//           OR: [
//             { name: { contains: search, mode: "insensitive" } },
//             { description: { contains: search, mode: "insensitive" } },
//           ],
//         }
//       : {};

//     const total = await prisma.gages.count({ where });

//     const gages = await prisma.gages.findMany({
//       where,
//       skip: (page - 1) * limit,
//       take: limit,
//       orderBy: { createdAt: "desc" },
//     });

//     return NextResponse.json({
//       data: gages,
//       pagination: {
//         total,
//         page,
//         limit,
//         totalPages: Math.ceil(total / limit),
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching gages:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch gages" },
//       { status: 500 }
//     );
//   }
// }

// POST /api/gages - Create new gage

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, gage, description } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const makeGage = await prisma.gages.create({
      data: {
        name,
        gage: gage ? parseFloat(gage) : 0,
        description: description || null,
      },
    });

    return NextResponse.json(gage, { status: 201 });
  } catch (error) {
    console.error("Error creating gage:", error);
    return NextResponse.json(
      { error: "Failed to create gage" },
      { status: 500 }
    );
  }
}
