const NOW = new Date("2025-06-01T10:00:00.000Z");

function paginate<T>(items: T[], page: number, limit: number) {
  const total = items.length;
  return {
    data: items.slice((page - 1) * limit, page * limit),
    total,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}

function includesSearch(value: string | null | undefined, search: string) {
  return (value ?? "").toLowerCase().includes(search.toLowerCase());
}

export const mockDbSeed = {
  sizes: [
    {
      id: 1,
      name: "6x4 inch",
      length: 6,
      width: 4,
      description: "Standard plate size",
      createdAt: NOW,
      updatedAt: NOW,
    },
    {
      id: 2,
      name: "8x6 inch",
      length: 8,
      width: 6,
      description: "Medium plate size",
      createdAt: NOW,
      updatedAt: NOW,
    },
    {
      id: 3,
      name: "10x8 inch",
      length: 10,
      width: 8,
      description: "Large plate size",
      createdAt: NOW,
      updatedAt: NOW,
    },
  ],
  gages: [
    {
      id: 1,
      name: "18 Gage",
      gage: 18,
      description: "Light steel sheet",
      createdAt: NOW,
      updatedAt: NOW,
    },
    {
      id: 2,
      name: "16 Gage",
      gage: 16,
      description: "Medium steel sheet",
      createdAt: NOW,
      updatedAt: NOW,
    },
  ],
  unit_weights: [
    {
      id: 1,
      sizeId: 1,
      gageId: 1,
      weight: 450,
      description: "6x4 @ 18 gage",
      createdAt: NOW,
      updatedAt: NOW,
    },
    {
      id: 2,
      sizeId: 1,
      gageId: 2,
      weight: 580,
      description: "6x4 @ 16 gage",
      createdAt: NOW,
      updatedAt: NOW,
    },
    {
      id: 3,
      sizeId: 2,
      gageId: 1,
      weight: 720,
      description: "8x6 @ 18 gage",
      createdAt: NOW,
      updatedAt: NOW,
    },
    {
      id: 4,
      sizeId: 2,
      gageId: 2,
      weight: 910,
      description: "8x6 @ 16 gage",
      createdAt: NOW,
      updatedAt: NOW,
    },
  ],
  materials: [
    {
      id: 1,
      name: "MS Sheet",
      category: "Raw Steel",
      supplier: "Al-Hafiz Steel",
      totalQuantity: 250,
      unit: "pcs",
      cost: 850,
      weight: 112.5,
      sizeId: 1,
      gageId: 1,
      unitWeightId: 1,
      description: "Mild steel sheet stock",
      createdAt: NOW,
      updatedAt: NOW,
      deletedAt: null as Date | null,
    },
    {
      id: 2,
      name: "MS Sheet",
      category: "Raw Steel",
      supplier: "Al-Hafiz Steel",
      totalQuantity: 180,
      unit: "pcs",
      cost: 920,
      weight: 104.4,
      sizeId: 1,
      gageId: 2,
      unitWeightId: 2,
      description: "Heavier gage stock",
      createdAt: NOW,
      updatedAt: NOW,
      deletedAt: null as Date | null,
    },
    {
      id: 3,
      name: "GI Sheet",
      category: "Galvanized",
      supplier: "National Steel",
      totalQuantity: 120,
      unit: "pcs",
      cost: 1100,
      weight: 86.4,
      sizeId: 2,
      gageId: 1,
      unitWeightId: 3,
      description: "Galvanized iron sheet",
      createdAt: NOW,
      updatedAt: NOW,
      deletedAt: null as Date | null,
    },
  ],
  product_types: [
    {
      id: 1,
      productType: "Steel Tray",
      description: "Standard steel tray",
      createdAt: NOW,
      updatedAt: NOW,
      deletedAt: null as Date | null,
    },
    {
      id: 2,
      productType: "Steel Bowl",
      description: "Deep steel bowl",
      createdAt: NOW,
      updatedAt: NOW,
      deletedAt: null as Date | null,
    },
    {
      id: 3,
      productType: "Steel Plate",
      description: "Flat serving plate",
      createdAt: NOW,
      updatedAt: NOW,
      deletedAt: null as Date | null,
    },
  ],
  employees: [
    {
      id: 1,
      name: "Ahmed Khan",
      email: "ahmed@mohsinsteels.com",
      phone: "0300-1112233",
      department: "Molding",
      position: "Molding Operator",
      salaryType: "PIECE" as const,
      pieceRate: 15,
      monthlySalary: null as number | null,
      status: "ACTIVE" as const,
      address: "Lahore",
      qualityNotes: null as string | null,
      createdAt: NOW,
      updatedAt: NOW,
      deletedAt: null as Date | null,
      departmentId: null as number | null,
    },
    {
      id: 2,
      name: "Bilal Hussain",
      email: "bilal@mohsinsteels.com",
      phone: "0300-2223344",
      department: "Molding",
      position: "Senior Molder",
      salaryType: "PIECE" as const,
      pieceRate: 18,
      monthlySalary: null,
      status: "ACTIVE" as const,
      address: "Lahore",
      qualityNotes: null,
      createdAt: NOW,
      updatedAt: NOW,
      deletedAt: null,
      departmentId: null,
    },
    {
      id: 3,
      name: "Usman Ali",
      email: "usman@mohsinsteels.com",
      phone: "0300-3334455",
      department: "Polishing",
      position: "Polisher",
      salaryType: "PIECE" as const,
      pieceRate: 12,
      monthlySalary: null,
      status: "ACTIVE" as const,
      address: "Lahore",
      qualityNotes: null,
      createdAt: NOW,
      updatedAt: NOW,
      deletedAt: null,
      departmentId: null,
    },
    {
      id: 4,
      name: "Kamran Shah",
      email: "kamran@mohsinsteels.com",
      phone: "0300-4445566",
      department: "Packing",
      position: "Supervisor",
      salaryType: "MONTHLY" as const,
      pieceRate: null,
      monthlySalary: 45000,
      status: "ACTIVE" as const,
      address: "Lahore",
      qualityNotes: null,
      createdAt: NOW,
      updatedAt: NOW,
      deletedAt: null,
      departmentId: null,
    },
  ],
  product_rates: [
    {
      id: 1,
      productId: 1,
      employeeId: 1,
      productRate: 15,
      description: "Steel tray rate",
      createdAt: NOW,
      updatedAt: NOW,
      deletedAt: null as Date | null,
    },
    {
      id: 2,
      productId: 2,
      employeeId: 2,
      productRate: 18,
      description: "Steel bowl rate",
      createdAt: NOW,
      updatedAt: NOW,
      deletedAt: null,
    },
  ],
  polishing_rates: [
    {
      id: 1,
      productId: 1,
      employeeId: 3,
      polishingRate: 12,
      description: "Tray polishing",
      createdAt: NOW,
      updatedAt: NOW,
      deletedAt: null as Date | null,
    },
    {
      id: 2,
      productId: 2,
      employeeId: 3,
      polishingRate: 14,
      description: "Bowl polishing",
      createdAt: NOW,
      updatedAt: NOW,
      deletedAt: null,
    },
  ],
  remaining_molding: [
    {
      id: 1,
      productTypeId: 1,
      totalQuantity: 500,
      totalDamage: 25,
      remaining: 320,
      description: "Steel tray WIP",
      createdAt: NOW,
      updatedAt: NOW,
    },
    {
      id: 2,
      productTypeId: 2,
      totalQuantity: 350,
      totalDamage: 15,
      remaining: 210,
      description: "Steel bowl WIP",
      createdAt: NOW,
      updatedAt: NOW,
    },
    {
      id: 3,
      productTypeId: 3,
      totalQuantity: 200,
      totalDamage: 8,
      remaining: 145,
      description: "Steel plate WIP",
      createdAt: NOW,
      updatedAt: NOW,
    },
  ],
  molding_entries: [
    {
      id: 1,
      productTypeId: 1,
      productRate: 15,
      totalEarn: 750,
      materialId: 1,
      quantity: 50,
      damage: 3,
      finalQuantity: 47,
      qualityNotes: "Good batch",
      createdAt: NOW,
      updatedAt: NOW,
      deletedAt: null as Date | null,
      userId: null as number | null,
      employeeId: 1,
    },
    {
      id: 2,
      productTypeId: 2,
      productRate: 18,
      totalEarn: 900,
      materialId: 2,
      quantity: 50,
      damage: 2,
      finalQuantity: 48,
      qualityNotes: null,
      createdAt: NOW,
      updatedAt: NOW,
      deletedAt: null,
      userId: null,
      employeeId: 2,
    },
  ],
  remaining_polishing: [
    {
      id: 1,
      productTypeId: 1,
      totalQuantity: 280,
      remaining: 195,
      description: "Polished trays pending packing",
      createdAt: NOW,
      updatedAt: NOW,
    },
    {
      id: 2,
      productTypeId: 2,
      totalQuantity: 180,
      remaining: 120,
      description: "Polished bowls pending packing",
      createdAt: NOW,
      updatedAt: NOW,
    },
  ],
  polishing_entries: [
    {
      id: 1,
      productId: 1,
      employeeId: 3,
      quantity: 85,
      polishingRate: 12,
      totalEarn: 1020,
      qualityNotes: "Mirror finish",
      createdAt: NOW,
      updatedAt: NOW,
      deletedAt: null as Date | null,
    },
  ],
  remaining_packing: [
    {
      id: 1,
      productTypeId: 1,
      totalQuantity: 150,
      remaining: 95,
      description: "Packed trays in stock",
      createdAt: NOW,
      updatedAt: NOW,
    },
    {
      id: 2,
      productTypeId: 2,
      totalQuantity: 90,
      remaining: 55,
      description: "Packed bowls in stock",
      createdAt: NOW,
      updatedAt: NOW,
    },
  ],
  packing_entries: [
    {
      id: 1,
      productId: 1,
      quantity: 55,
      qualityNotes: "Carton A-12",
      createdAt: NOW,
      updatedAt: NOW,
      deletedAt: null as Date | null,
    },
  ],
};

function cloneSeed() {
  return structuredClone(mockDbSeed);
}

let store = cloneSeed();
let nextId = 1000;

export function resetMockStore() {
  store = cloneSeed();
  nextId = 1000;
}

export function getNextMockId() {
  nextId += 1;
  return nextId;
}

export function getMockStore() {
  return store;
}

function withMaterialRelations(material: (typeof store.materials)[0]) {
  return {
    ...material,
    size: store.sizes.find((s) => s.id === material.sizeId) ?? null,
    gage: store.gages.find((g) => g.id === material.gageId) ?? null,
    unitWeight:
      store.unit_weights.find((u) => u.id === material.unitWeightId) ?? null,
  };
}

function withMoldingEntryRelations(entry: (typeof store.molding_entries)[0]) {
  return {
    ...entry,
    employees: store.employees.find((e) => e.id === entry.employeeId) ?? null,
    product_types:
      store.product_types.find((p) => p.id === entry.productTypeId) ?? null,
    materials: store.materials.find((m) => m.id === entry.materialId) ?? null,
  };
}

function withPolishingEntryRelations(
  entry: (typeof store.polishing_entries)[0]
) {
  const remaining = store.remaining_molding.find((r) => r.id === entry.productId);
  return {
    ...entry,
    employees: store.employees.find((e) => e.id === entry.employeeId) ?? null,
    remaining_molding: remaining
      ? {
          ...remaining,
          product_types:
            store.product_types.find((p) => p.id === remaining.productTypeId) ??
            null,
        }
      : null,
  };
}

function withPackingEntryRelations(entry: (typeof store.packing_entries)[0]) {
  const remaining = store.remaining_polishing.find(
    (r) => r.id === entry.productId
  );
  return {
    ...entry,
    remaining_polishing: remaining
      ? {
          ...remaining,
          product_types:
            store.product_types.find((p) => p.id === remaining.productTypeId) ??
            null,
        }
      : null,
  };
}

function withRemainingMoldingRelations(
  item: (typeof store.remaining_molding)[0]
) {
  return {
    ...item,
    product_types:
      store.product_types.find((p) => p.id === item.productTypeId) ?? null,
  };
}

function withRemainingPolishingRelations(
  item: (typeof store.remaining_polishing)[0]
) {
  return {
    ...item,
    product_types:
      store.product_types.find((p) => p.id === item.productTypeId) ?? null,
  };
}

function withRemainingPackingRelations(
  item: (typeof store.remaining_packing)[0]
) {
  return {
    ...item,
    product_types:
      store.product_types.find((p) => p.id === item.productTypeId) ?? null,
  };
}

function withUnitWeightRelations(item: (typeof store.unit_weights)[0]) {
  return {
    ...item,
    size: store.sizes.find((s) => s.id === item.sizeId) ?? null,
    gage: store.gages.find((g) => g.id === item.gageId) ?? null,
  };
}

function withProductRateRelations(item: (typeof store.product_rates)[0]) {
  return {
    ...item,
    product_types: store.product_types.find((p) => p.id === item.productId) ?? null,
    employees: store.employees.find((e) => e.id === item.employeeId) ?? null,
  };
}

function withPolishingRateRelations(item: (typeof store.polishing_rates)[0]) {
  return {
    ...item,
    product_types: store.product_types.find((p) => p.id === item.productId) ?? null,
    employees: store.employees.find((e) => e.id === item.employeeId) ?? null,
  };
}

export const mockHandlers = {
  dashboardStats() {
    return {
      totalMaterialAvailable: store.materials.reduce(
        (sum, m) => sum + (m.weight ?? 0),
        0
      ),
      totalRemainingMolding: store.remaining_molding.reduce(
        (sum, r) => sum + r.remaining,
        0
      ),
      totalRemainingPolishing: store.remaining_polishing.reduce(
        (sum, r) => sum + r.remaining,
        0
      ),
      totalRemainingPacking: store.remaining_packing.reduce(
        (sum, r) => sum + r.remaining,
        0
      ),
    };
  },

  rawMaterialStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayMaterials = store.materials.filter(
      (m) => new Date(m.createdAt) >= today
    ).length;

    return {
      totalMaterials: store.materials.length,
      todayMaterials,
      totalWeight: store.materials.reduce((sum, m) => sum + (m.weight ?? 0), 0),
      remainingQuantity: store.materials.reduce(
        (sum, m) => sum + m.totalQuantity,
        0
      ),
    };
  },

  moldingStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayQty = store.molding_entries
      .filter((e) => new Date(e.createdAt) >= today)
      .reduce((sum, e) => sum + e.quantity, 0);

    return {
      todayMoldingQuantity: todayQty,
      totalMaterialUsed: store.molding_entries.reduce(
        (sum, e) => sum + e.quantity,
        0
      ),
      totalDamage: store.remaining_molding.reduce(
        (sum, r) => sum + (r.totalDamage ?? 0),
        0
      ),
      totalRemainingMoldedProducts: store.remaining_molding.reduce(
        (sum, r) => sum + r.remaining,
        0
      ),
    };
  },

  polishingStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayPolished = store.polishing_entries
      .filter((e) => new Date(e.createdAt) >= today)
      .reduce((sum, e) => sum + e.quantity, 0);

    return {
      moldedItemsUsed: store.polishing_entries.reduce(
        (sum, e) => sum + e.quantity,
        0
      ),
      activePolishingEmployees: store.employees.filter(
        (e) => e.department === "Polishing" && e.status === "ACTIVE"
      ).length,
      todayPolished,
      totalPolishedItems: store.remaining_polishing.reduce(
        (sum, r) => sum + r.remaining,
        0
      ),
    };
  },

  packingStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayPacked = store.packing_entries
      .filter((e) => new Date(e.createdAt) >= today)
      .reduce((sum, e) => sum + e.quantity, 0);

    return {
      totalPolishedItemsUsed: store.packing_entries.reduce(
        (sum, e) => sum + e.quantity,
        0
      ),
      todayPackedItems: todayPacked,
      totalProductsPacked: store.remaining_packing.filter(
        (r) => r.totalQuantity > 0
      ).length,
      totalRemainingPacking: store.remaining_packing.reduce(
        (sum, r) => sum + r.remaining,
        0
      ),
    };
  },

  employeeStats() {
    return {
      totalEmployees: store.employees.length,
      moldingEmployees: store.employees.filter((e) => e.department === "Molding")
        .length,
      polishingEmployees: store.employees.filter(
        (e) => e.department === "Polishing"
      ).length,
      monthlySalaryEmployees: store.employees.filter(
        (e) => e.salaryType === "MONTHLY"
      ).length,
      pieceRateEmployees: store.employees.filter((e) => e.salaryType === "PIECE")
        .length,
    };
  },

  listMaterials(request: Request) {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const search = url.searchParams.get("search") || "";
    const sizeId = url.searchParams.get("sizeId");
    const gageId = url.searchParams.get("gageId");

    let filtered = store.materials.filter((m) => !m.deletedAt);
    if (search) {
      filtered = filtered.filter(
        (m) =>
          includesSearch(m.name, search) ||
          includesSearch(m.description, search)
      );
    }
    if (sizeId) filtered = filtered.filter((m) => m.sizeId === Number(sizeId));
    if (gageId) filtered = filtered.filter((m) => m.gageId === Number(gageId));

    const data = filtered
      .slice((page - 1) * limit, page * limit)
      .map(withMaterialRelations);

    const grouped = store.materials
      .filter((m) => m.totalQuantity > 0)
      .reduce<
        Record<string, { name: string; totalQuantity: number; size: string | null; gage: string | null }>
      >((acc, m) => {
        const key = `${m.name}-${m.sizeId}-${m.gageId}`;
        const size = store.sizes.find((s) => s.id === m.sizeId);
        const gage = store.gages.find((g) => g.id === m.gageId);
        if (!acc[key]) {
          acc[key] = {
            name: m.name,
            totalQuantity: 0,
            size: size?.name ?? null,
            gage: gage?.name ?? null,
          };
        }
        acc[key].totalQuantity += m.totalQuantity;
        return acc;
      }, {});

    const summary = Object.values(grouped);
    return {
      data,
      summary,
      total: filtered.length,
      totalRemaining: summary.length,
    };
  },

  listAllMaterials() {
    return {
      data: store.materials
        .filter((m) => !m.deletedAt)
        .map(({ id, name, category, unit, totalQuantity }) => ({
          id,
          name,
          category,
          unit,
          totalQuantity,
        })),
    };
  },

  getMaterial(id: number) {
    const material = store.materials.find((m) => m.id === id);
    return material ? withMaterialRelations(material) : null;
  },

  listSizes(request: Request) {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const search = url.searchParams.get("search") || "";

    let filtered = [...store.sizes];
    if (search) {
      filtered = filtered.filter(
        (s) =>
          includesSearch(s.name, search) || includesSearch(s.description, search)
      );
    }

    return paginate(filtered, page, limit);
  },

  getSize(id: number) {
    return store.sizes.find((s) => s.id === id) ?? null;
  },

  listGages(request: Request) {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const search = url.searchParams.get("search") || "";

    let filtered = [...store.gages];
    if (search) {
      filtered = filtered.filter(
        (g) =>
          includesSearch(g.name, search) || includesSearch(g.description, search)
      );
    }

    return paginate(filtered, page, limit);
  },

  getGage(id: number) {
    return store.gages.find((g) => g.id === id) ?? null;
  },

  listUnitWeights(request: Request) {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const search = url.searchParams.get("search") || "";
    const sizeId = url.searchParams.get("sizeId");
    const gageId = url.searchParams.get("gageId");

    if (sizeId && gageId) {
      const weight = store.unit_weights.find(
        (u) => u.sizeId === Number(sizeId) && u.gageId === Number(gageId)
      );
      return weight ? { data: weight } : null;
    }

    let filtered = store.unit_weights.map(withUnitWeightRelations);
    if (search) {
      filtered = filtered.filter(
        (u) =>
          includesSearch(u.description, search) ||
          includesSearch(u.size?.name, search) ||
          includesSearch(u.gage?.name, search)
      );
    }
    if (sizeId) filtered = filtered.filter((u) => u.sizeId === Number(sizeId));
    if (gageId) filtered = filtered.filter((u) => u.gageId === Number(gageId));

    return paginate(filtered, page, limit);
  },

  getUnitWeight(id: number) {
    const item = store.unit_weights.find((u) => u.id === id);
    return item ? withUnitWeightRelations(item) : null;
  },

  listProductTypes(request: Request) {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const search = url.searchParams.get("search") || "";

    let filtered = store.product_types.filter((p) => !p.deletedAt);
    if (search) {
      filtered = filtered.filter(
        (p) =>
          includesSearch(p.productType, search) ||
          includesSearch(p.description, search)
      );
    }

    return paginate(filtered, page, limit);
  },

  getProductType(id: number) {
    return store.product_types.find((p) => p.id === id) ?? null;
  },

  listEmployees(request: Request) {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const search = url.searchParams.get("search") || "";
    const department = url.searchParams.get("department");
    const status = url.searchParams.get("status");
    const salaryType = url.searchParams.get("salaryType");
    const taskType = url.searchParams.get("taskType");

    let filtered = store.employees.filter((e) => !e.deletedAt);
    if (search) {
      filtered = filtered.filter(
        (e) =>
          includesSearch(e.name, search) ||
          includesSearch(e.email, search) ||
          includesSearch(e.phone, search)
      );
    }
    if (department) filtered = filtered.filter((e) => e.department === department);
    if (status) filtered = filtered.filter((e) => e.status === status);
    if (salaryType) filtered = filtered.filter((e) => e.salaryType === salaryType);
    if (taskType === "MOLDING") {
      const ids = new Set(store.molding_entries.map((m) => m.employeeId));
      filtered = filtered.filter((e) => ids.has(e.id));
    } else if (taskType === "POLISHING") {
      const ids = new Set(store.polishing_entries.map((p) => p.employeeId));
      filtered = filtered.filter((e) => ids.has(e.id));
    }

    return paginate(filtered, page, limit);
  },

  listMoldingEmployees(request: Request) {
    void request;
    return {
      data: store.employees
        .filter((e) => e.status === "ACTIVE" && e.department === "Molding")
        .map(({ id, name, department, status, salaryType }) => ({
          id,
          name,
          department,
          status,
          salaryType,
        })),
    };
  },

  listMoldingPerPieceEmployees(request: Request) {
    void request;
    return {
      data: store.employees
        .filter(
          (e) =>
            e.status === "ACTIVE" &&
            e.department === "Molding" &&
            e.salaryType === "PIECE"
        )
        .map(({ id, name, department, status, salaryType }) => ({
          id,
          name,
          department,
          status,
          salaryType,
        })),
    };
  },

  listPolishingEmployees(request: Request) {
    void request;
    return {
      data: store.employees
        .filter((e) => e.status === "ACTIVE" && e.department === "Polishing")
        .map(({ id, name, department, status, salaryType }) => ({
          id,
          name,
          department,
          status,
          salaryType,
        })),
    };
  },

  listPolishingPerPieceEmployees(request: Request) {
    void request;
    return {
      data: store.employees
        .filter(
          (e) =>
            e.status === "ACTIVE" &&
            e.department === "Polishing" &&
            e.salaryType === "PIECE"
        )
        .map(({ id, name, department, status, salaryType }) => ({
          id,
          name,
          department,
          status,
          salaryType,
        })),
    };
  },

  listMoldingEntries(request: Request) {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const search = url.searchParams.get("search") || "";
    const employeeId = url.searchParams.get("employeeId");

    let filtered = store.molding_entries.filter((e) => !e.deletedAt);
    if (employeeId) {
      filtered = filtered.filter((e) => e.employeeId === Number(employeeId));
    }
    if (search) {
      filtered = filtered.filter((e) => {
        const rel = withMoldingEntryRelations(e);
        return (
          includesSearch(e.qualityNotes, search) ||
          includesSearch(rel.employees?.name, search) ||
          includesSearch(rel.product_types?.productType, search) ||
          includesSearch(rel.materials?.name, search)
        );
      });
    }

    const data = filtered
      .slice((page - 1) * limit, page * limit)
      .map(withMoldingEntryRelations);

    const employeeMap: Record<
      number,
      {
        employeeId: number;
        employeeName: string;
        salaryType: string;
        totalEntries: number;
        totalQuantity: number;
        totalEarning: number;
        productTypesSet: Set<number>;
      }
    > = {};

    data.forEach((entry) => {
      const empId = entry.employeeId;
      if (!employeeMap[empId]) {
        employeeMap[empId] = {
          employeeId: empId,
          employeeName: entry.employees?.name ?? "Unknown",
          salaryType: entry.employees?.salaryType ?? "PIECE",
          totalEntries: 0,
          totalQuantity: 0,
          totalEarning: 0,
          productTypesSet: new Set(),
        };
      }
      employeeMap[empId].totalEntries += 1;
      employeeMap[empId].totalQuantity += entry.quantity;
      employeeMap[empId].totalEarning += entry.totalEarn;
      employeeMap[empId].productTypesSet.add(entry.productTypeId);
    });

    const employeePerformance = Object.values(employeeMap).map((emp) => ({
      employeeId: emp.employeeId,
      employeeName: emp.employeeName,
      salaryType: emp.salaryType,
      totalEntries: emp.totalEntries,
      totalQuantity: emp.totalQuantity,
      totalEarning: emp.totalEarning,
      productTypesCount: emp.productTypesSet.size,
    }));

    return {
      data,
      employeePerformance,
      total: filtered.length,
      employeeTotal: employeePerformance.length,
      pagination: {
        total: filtered.length,
        page,
        limit,
        totalPages: Math.ceil(filtered.length / limit) || 1,
      },
    };
  },

  getMoldingEntry(id: number) {
    const entry = store.molding_entries.find((e) => e.id === id);
    return entry ? withMoldingEntryRelations(entry) : null;
  },

  listPolishingEntries(request: Request) {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const search = url.searchParams.get("search") || "";

    let filtered = store.polishing_entries.filter((e) => !e.deletedAt);
    if (search) {
      filtered = filtered.filter((e) => {
        const rel = withPolishingEntryRelations(e);
        return (
          includesSearch(e.qualityNotes, search) ||
          includesSearch(rel.employees?.name, search) ||
          includesSearch(rel.remaining_molding?.product_types?.productType, search)
        );
      });
    }

    const data = filtered
      .slice((page - 1) * limit, page * limit)
      .map(withPolishingEntryRelations);

    const employeeMap: Record<
      number,
      {
        employeeId: number;
        employeeName: string;
        salaryType: string;
        totalEntries: number;
        totalQuantity: number;
        totalEarning: number;
        productTypesSet: Set<number>;
      }
    > = {};

    data.forEach((entry) => {
      const empId = entry.employeeId;
      if (!employeeMap[empId]) {
        employeeMap[empId] = {
          employeeId: empId,
          employeeName: entry.employees?.name ?? "Unknown",
          salaryType: entry.employees?.salaryType ?? "PIECE",
          totalEntries: 0,
          totalQuantity: 0,
          totalEarning: 0,
          productTypesSet: new Set(),
        };
      }
      employeeMap[empId].totalEntries += 1;
      employeeMap[empId].totalQuantity += entry.quantity;
      employeeMap[empId].totalEarning += entry.totalEarn;
      const productTypeId = entry.remaining_molding?.productTypeId ?? null;
      if (productTypeId) employeeMap[empId].productTypesSet.add(productTypeId);
    });

    const employeePerformance = Object.values(employeeMap).map((emp) => ({
      employeeId: emp.employeeId,
      employeeName: emp.employeeName,
      salaryType: emp.salaryType,
      totalEntries: emp.totalEntries,
      totalQuantity: emp.totalQuantity,
      totalEarning: emp.totalEarning,
      productTypesCount: emp.productTypesSet.size,
    }));

    return {
      data,
      employeePerformance,
      total: filtered.length,
      employeeTotal: employeePerformance.length,
      pagination: {
        total: filtered.length,
        page,
        limit,
        totalPages: Math.ceil(filtered.length / limit) || 1,
      },
    };
  },

  getPolishingEntry(id: number) {
    const entry = store.polishing_entries.find((e) => e.id === id);
    return entry ? withPolishingEntryRelations(entry) : null;
  },

  listPackingEntries(request: Request) {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const search = url.searchParams.get("search") || "";

    let filtered = store.packing_entries.filter((e) => !e.deletedAt);
    if (search) {
      filtered = filtered.filter((e) => {
        const rel = withPackingEntryRelations(e);
        return (
          includesSearch(e.qualityNotes, search) ||
          includesSearch(rel.remaining_polishing?.product_types?.productType, search)
        );
      });
    }

    return paginate(filtered.map(withPackingEntryRelations), page, limit);
  },

  getPackingEntry(id: number) {
    const entry = store.packing_entries.find((e) => e.id === id);
    return entry ? withPackingEntryRelations(entry) : null;
  },

  listRemainingMoldings(request: Request) {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const search = url.searchParams.get("search") || "";
    const productTypeId = url.searchParams.get("productTypeId");

    let filtered = [...store.remaining_molding];
    if (productTypeId) {
      filtered = filtered.filter(
        (r) => r.productTypeId === Number(productTypeId)
      );
    }
    if (search) {
      filtered = filtered.filter((r) => {
        const rel = withRemainingMoldingRelations(r);
        return includesSearch(rel.product_types?.productType, search);
      });
    }

    return paginate(filtered.map(withRemainingMoldingRelations), page, limit);
  },

  listRemainingPolishing(request: Request) {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const search = url.searchParams.get("search") || "";
    const productTypeId = url.searchParams.get("productTypeId");

    let filtered = [...store.remaining_polishing];
    if (productTypeId) {
      filtered = filtered.filter(
        (r) => r.productTypeId === Number(productTypeId)
      );
    }
    if (search) {
      filtered = filtered.filter((r) => {
        const rel = withRemainingPolishingRelations(r);
        return includesSearch(rel.product_types?.productType, search);
      });
    }

    return paginate(filtered.map(withRemainingPolishingRelations), page, limit);
  },

  listRemainingPacking(request: Request) {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const search = url.searchParams.get("search") || "";
    const productTypeId = url.searchParams.get("productTypeId");

    let filtered = [...store.remaining_packing];
    if (productTypeId) {
      filtered = filtered.filter(
        (r) => r.productTypeId === Number(productTypeId)
      );
    }
    if (search) {
      filtered = filtered.filter((r) => {
        const rel = withRemainingPackingRelations(r);
        return includesSearch(rel.product_types?.productType, search);
      });
    }

    return paginate(filtered.map(withRemainingPackingRelations), page, limit);
  },

  listProductRates(request: Request) {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const search = url.searchParams.get("search") || "";

    let filtered = store.product_rates.filter((r) => !r.deletedAt);
    if (search) {
      filtered = filtered.filter((r) => {
        const rel = withProductRateRelations(r);
        return (
          includesSearch(r.description, search) ||
          includesSearch(rel.product_types?.productType, search) ||
          includesSearch(rel.employees?.name, search)
        );
      });
    }

    return paginate(filtered.map(withProductRateRelations), page, limit);
  },

  getProductRate(id: number) {
    const item = store.product_rates.find((r) => r.id === id);
    return item ? withProductRateRelations(item) : null;
  },

  checkProductRate(productTypeId: number, employeeId: number) {
    const employee = store.employees.find((e) => e.id === employeeId);
    if (!employee) return { error: "Employee not found", status: 404 as const };
    if (employee.salaryType === "MONTHLY") {
      return { productRate: "0", salaryType: "MONTHLY" };
    }
    const rateRecord = store.product_rates.find(
      (r) => r.productId === productTypeId && r.employeeId === employeeId
    );
    return {
      productRate: rateRecord?.productRate ?? 0,
      salaryType: employee.salaryType,
    };
  },

  listPolishingRates(request: Request) {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const search = url.searchParams.get("search") || "";

    let filtered = store.polishing_rates.filter((r) => !r.deletedAt);
    if (search) {
      filtered = filtered.filter((r) => {
        const rel = withPolishingRateRelations(r);
        return (
          includesSearch(r.description, search) ||
          includesSearch(rel.product_types?.productType, search) ||
          includesSearch(rel.employees?.name, search)
        );
      });
    }

    return paginate(filtered.map(withPolishingRateRelations), page, limit);
  },

  getPolishingRate(id: number) {
    const item = store.polishing_rates.find((r) => r.id === id);
    return item ? withPolishingRateRelations(item) : null;
  },

  checkPolishingRate(productTypeId: number, employeeId: number) {
    const employee = store.employees.find((e) => e.id === employeeId);
    if (!employee) return { error: "Employee not found", status: 404 as const };
    if (employee.salaryType === "MONTHLY") {
      return { polishingRate: "0", salaryType: "MONTHLY" };
    }
    const rateRecord = store.polishing_rates.find(
      (r) => r.productId === productTypeId && r.employeeId === employeeId
    );
    return {
      polishingRate: rateRecord?.polishingRate ?? 0,
      salaryType: employee.salaryType,
    };
  },

  productionStats(request: Request) {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const search = url.searchParams.get("search") || "";
    const department = url.searchParams.get("department") || "";
    const status = url.searchParams.get("status") || "";
    const salaryType = url.searchParams.get("salaryType") || "";

    let employees = store.employees.filter((e) => !e.deletedAt);
    if (search) employees = employees.filter((e) => includesSearch(e.name, search));
    if (department) employees = employees.filter((e) => e.department === department);
    if (status) employees = employees.filter((e) => e.status === status);
    if (salaryType) employees = employees.filter((e) => e.salaryType === salaryType);

    const productionData: Array<{
      name: string;
      department: string;
      product: string;
      totalPieces: number;
      pricePerPiece: number;
      totalAmount: number;
      date: string;
    }> = [];

    employees.forEach((emp) => {
      store.molding_entries
        .filter((m) => m.employeeId === emp.id)
        .forEach((m) => {
          const product = store.product_types.find((p) => p.id === m.productTypeId);
          productionData.push({
            name: emp.name,
            department: emp.department,
            product: product?.productType ?? "",
            totalPieces: m.finalQuantity,
            pricePerPiece: m.productRate,
            totalAmount: m.totalEarn,
            date: new Date(m.createdAt).toISOString(),
          });
        });

      store.polishing_entries
        .filter((p) => p.employeeId === emp.id)
        .forEach((p) => {
          const remaining = store.remaining_molding.find((r) => r.id === p.productId);
          const product = remaining
            ? store.product_types.find((pt) => pt.id === remaining.productTypeId)
            : null;
          productionData.push({
            name: emp.name,
            department: emp.department,
            product: product?.productType ?? "",
            totalPieces: p.quantity,
            pricePerPiece: p.polishingRate,
            totalAmount: p.totalEarn,
            date: new Date(p.createdAt).toISOString(),
          });
        });
    });

    productionData.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const skip = (page - 1) * limit;
    return {
      data: productionData.slice(skip, skip + limit),
      total: productionData.length,
      pagination: {
        total: productionData.length,
        page,
        limit,
        totalPages: Math.ceil(productionData.length / limit) || 1,
      },
    };
  },
};
