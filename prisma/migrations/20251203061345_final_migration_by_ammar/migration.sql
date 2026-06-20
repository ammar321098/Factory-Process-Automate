-- CreateEnum
CREATE TYPE "EmployeeSalaryType" AS ENUM ('PIECE', 'MONTHLY');

-- CreateEnum
CREATE TYPE "EmployeeStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateTable
CREATE TABLE "materials" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "supplier" TEXT,
    "totalQuantity" INTEGER NOT NULL DEFAULT 0,
    "unit" TEXT,
    "cost" DECIMAL(65,30),
    "weight" DOUBLE PRECISION,
    "sizeId" INTEGER,
    "gageId" INTEGER,
    "unitWeightId" INTEGER,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "materials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sizes" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "length" DOUBLE PRECISION NOT NULL,
    "width" DOUBLE PRECISION NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "sizes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gages" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "gage" DOUBLE PRECISION NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "gages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unit_weights" (
    "id" SERIAL NOT NULL,
    "sizeId" INTEGER NOT NULL,
    "gageId" INTEGER NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "unit_weights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "molding_entries" (
    "id" SERIAL NOT NULL,
    "productTypeId" INTEGER NOT NULL,
    "productRate" INTEGER NOT NULL,
    "totalEarn" INTEGER NOT NULL,
    "materialId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "damage" INTEGER NOT NULL DEFAULT 0,
    "finalQuantity" INTEGER NOT NULL DEFAULT 0,
    "qualityNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "userId" INTEGER,
    "employeeId" INTEGER NOT NULL,

    CONSTRAINT "molding_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_types" (
    "id" SERIAL NOT NULL,
    "productType" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "product_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_rates" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "productRate" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "product_rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "remaining_molding" (
    "id" SERIAL NOT NULL,
    "productTypeId" INTEGER,
    "totalQuantity" INTEGER NOT NULL DEFAULT 0,
    "totalDamage" INTEGER DEFAULT 0,
    "remaining" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "remaining_molding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "polishing_entries" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "polishingRate" INTEGER NOT NULL,
    "totalEarn" INTEGER NOT NULL,
    "qualityNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "polishing_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "polishing_rates" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "polishingRate" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "polishing_rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "remaining_polishing" (
    "id" SERIAL NOT NULL,
    "productTypeId" INTEGER,
    "totalQuantity" INTEGER NOT NULL DEFAULT 0,
    "remaining" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "remaining_polishing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "packing_entries" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "qualityNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "packing_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "remaining_packing" (
    "id" SERIAL NOT NULL,
    "productTypeId" INTEGER,
    "totalQuantity" INTEGER NOT NULL DEFAULT 0,
    "remaining" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "remaining_packing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employees" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "position" TEXT,
    "salaryType" "EmployeeSalaryType" NOT NULL,
    "pieceRate" DECIMAL(65,30),
    "monthlySalary" DECIMAL(65,30),
    "status" "EmployeeStatus" NOT NULL DEFAULT 'ACTIVE',
    "address" TEXT,
    "qualityNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "departmentId" INTEGER,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_types_productType_key" ON "product_types"("productType");

-- AddForeignKey
ALTER TABLE "materials" ADD CONSTRAINT "materials_sizeId_fkey" FOREIGN KEY ("sizeId") REFERENCES "sizes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "materials" ADD CONSTRAINT "materials_gageId_fkey" FOREIGN KEY ("gageId") REFERENCES "gages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "materials" ADD CONSTRAINT "materials_unitWeightId_fkey" FOREIGN KEY ("unitWeightId") REFERENCES "unit_weights"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unit_weights" ADD CONSTRAINT "unit_weights_sizeId_fkey" FOREIGN KEY ("sizeId") REFERENCES "sizes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unit_weights" ADD CONSTRAINT "unit_weights_gageId_fkey" FOREIGN KEY ("gageId") REFERENCES "gages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "molding_entries" ADD CONSTRAINT "molding_entries_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "materials"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "molding_entries" ADD CONSTRAINT "molding_entries_productTypeId_fkey" FOREIGN KEY ("productTypeId") REFERENCES "product_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "molding_entries" ADD CONSTRAINT "molding_entries_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_rates" ADD CONSTRAINT "product_rates_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_rates" ADD CONSTRAINT "product_rates_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "remaining_molding" ADD CONSTRAINT "remaining_molding_productTypeId_fkey" FOREIGN KEY ("productTypeId") REFERENCES "product_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "polishing_entries" ADD CONSTRAINT "polishing_entries_productId_fkey" FOREIGN KEY ("productId") REFERENCES "remaining_molding"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "polishing_entries" ADD CONSTRAINT "polishing_entries_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "polishing_rates" ADD CONSTRAINT "polishing_rates_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "polishing_rates" ADD CONSTRAINT "polishing_rates_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "remaining_polishing" ADD CONSTRAINT "remaining_polishing_productTypeId_fkey" FOREIGN KEY ("productTypeId") REFERENCES "product_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "packing_entries" ADD CONSTRAINT "packing_entries_productId_fkey" FOREIGN KEY ("productId") REFERENCES "remaining_polishing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "remaining_packing" ADD CONSTRAINT "remaining_packing_productTypeId_fkey" FOREIGN KEY ("productTypeId") REFERENCES "product_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;
