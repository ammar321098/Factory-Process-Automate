import { JobOrder, JobOrderLabour, JobOrderMaterial, JobOrderWastage, Product, Material } from './mocks';

export interface CostBreakdown {
  materialCost: number;
  labourCost: number;
  totalCost: number;
  costPerPiece: number;
  profitMargin: number;
  profitPerPiece: number;
}

export interface CalculatorInput {
  quantity: number;
  materialWastage: number;
  labourWastage: number;
  materials: Array<{
    materialId: string;
    requiredQuantity: number;
    unitCost: number;
  }>;
  labour: Array<{
    hours: number;
    rate: number;
  }>;
  overheads: Array<{
    name: string;
    amount: number;
  }>;
  salePrice: number;
}

export interface CalculatorResult {
  totalMaterialCost: number;
  totalLabourCost: number;
  totalOverheadCost: number;
  totalCost: number;
  costPerPiece: number;
  profitPerPiece: number;
  profitMargin: number;
}

/**
 * Pure function to calculate cost per piece from calculator input
 * @param input - Calculator input parameters
 * @returns Cost breakdown and profit calculations
 */
export function calculateCostFromInput(input: CalculatorInput): CalculatorResult {
  const { quantity, materialWastage, labourWastage, materials, labour, overheads, salePrice } = input;

  // Calculate material cost with wastage
  const totalMaterialCost = materials.reduce((total, material) => {
    const adjustedQuantity = material.requiredQuantity * (1 + materialWastage / 100);
    return total + (adjustedQuantity * material.unitCost);
  }, 0);

  // Calculate labour cost with wastage
  const totalLabourCost = labour.reduce((total, labourItem) => {
    return total + (labourItem.hours * labourItem.rate);
  }, 0) * (1 + labourWastage / 100);

  // Calculate overhead cost
  const totalOverheadCost = overheads.reduce((total, overhead) => {
    return total + overhead.amount;
  }, 0);

  // Total cost
  const totalCost = totalMaterialCost + totalLabourCost + totalOverheadCost;
  
  // Cost per piece
  const costPerPiece = quantity > 0 ? totalCost / quantity : 0;
  
  // Profit calculations
  const profitPerPiece = salePrice - costPerPiece;
  const profitMargin = salePrice > 0 ? (profitPerPiece / salePrice) * 100 : 0;
  
  return {
    totalMaterialCost,
    totalLabourCost,
    totalOverheadCost,
    totalCost,
    costPerPiece,
    profitPerPiece,
    profitMargin,
  };
}

/**
 * Calculates the cost per piece for a job order
 * @param jobOrder - The job order to calculate costs for
 * @param products - Array of all products (to get sale price)
 * @param materials - Array of all materials (to get unit costs)
 * @returns Cost breakdown including profit calculations
 */
export function calculateCostPerPiece(
  jobOrder: JobOrder,
  products: Product[],
  materials: Material[]
): CostBreakdown {
  const product = products.find(p => p.id === jobOrder.productId);
  if (!product) {
    throw new Error(`Product with ID ${jobOrder.productId} not found`);
  }

  // Calculate material cost
  const materialCost = calculateMaterialCost(jobOrder.materials, materials, jobOrder.wastage.materialWastage);
  
  // Calculate labour cost
  const labourCost = calculateLabourCost(jobOrder.labour, jobOrder.wastage.labourWastage);
  
  // Total cost
  const totalCost = materialCost + labourCost;
  
  // Cost per piece
  const costPerPiece = jobOrder.quantity > 0 ? totalCost / jobOrder.quantity : 0;
  
  // Profit calculations
  const profitPerPiece = product.price - costPerPiece;
  const profitMargin = product.price > 0 ? (profitPerPiece / product.price) * 100 : 0;
  
  return {
    materialCost,
    labourCost,
    totalCost,
    costPerPiece,
    profitMargin,
    profitPerPiece,
  };
}

/**
 * Calculates the total material cost for a job order
 */
function calculateMaterialCost(
  materials: JobOrderMaterial[],
  materialData: Material[],
  wastagePercentage: number
): number {
  let totalCost = 0;
  
  materials.forEach(material => {
    const materialInfo = materialData.find(m => m.id === material.materialId);
    if (materialInfo) {
      // Apply wastage to required quantity
      const adjustedQuantity = material.requiredQuantity * (1 + wastagePercentage / 100);
      totalCost += adjustedQuantity * materialInfo.cost;
    }
  });
  
  return totalCost;
}

/**
 * Calculates the total labour cost for a job order
 */
function calculateLabourCost(
  labour: JobOrderLabour[],
  wastagePercentage: number
): number {
  let totalCost = 0;
  
  labour.forEach(labourItem => {
    let itemCost = 0;
    
    if (labourItem.hours) {
      // Hourly rate calculation
      itemCost = labourItem.hours * labourItem.rate;
    } else if (labourItem.pieceRate) {
      // Piece rate calculation
      itemCost = labourItem.pieceRate * labourItem.rate;
    }
    
    totalCost += itemCost;
  });
  
  // Apply labour wastage
  return totalCost * (1 + wastagePercentage / 100);
}

/**
 * Formats currency values
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

/**
 * Formats percentage values
 */
export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}
