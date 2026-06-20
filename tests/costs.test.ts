import { describe, it, expect } from 'vitest';
import { calculateCostFromInput } from '../lib/costs';

describe('calculateCostFromInput', () => {
  it('should calculate costs for a simple scenario', () => {
    const input = {
      quantity: 10,
      materialWastage: 5,
      labourWastage: 10,
      materials: [
        {
          materialId: '1',
          requiredQuantity: 2,
          unitCost: 25.50,
        },
      ],
      labour: [
        {
          hours: 2,
          rate: 25.00,
        },
      ],
      overheads: [
        {
          name: 'Equipment',
          amount: 50.00,
        },
      ],
      salePrice: 299.99,
    };

    const result = calculateCostFromInput(input);

    // Expected calculations:
    // Material cost: 2 * (1 + 0.05) * 25.50 = 2.1 * 25.50 = 53.55
    // Labour cost: 2 * 25.00 * (1 + 0.10) = 50 * 1.1 = 55.00
    // Overhead cost: 50.00
    // Total cost: 53.55 + 55.00 + 50.00 = 158.55
    // Cost per piece: 158.55 / 10 = 15.855
    // Profit per piece: 299.99 - 15.855 = 284.135
    // Profit margin: (284.135 / 299.99) * 100 = 94.71%

    expect(result.totalMaterialCost).toBeCloseTo(53.55, 2);
    expect(result.totalLabourCost).toBeCloseTo(55.00, 2);
    expect(result.totalOverheadCost).toBeCloseTo(50.00, 2);
    expect(result.totalCost).toBeCloseTo(158.55, 2);
    expect(result.costPerPiece).toBeCloseTo(15.855, 2);
    expect(result.profitPerPiece).toBeCloseTo(284.135, 2);
    expect(result.profitMargin).toBeCloseTo(94.71, 1);
  });

  it('should calculate costs for a complex scenario with multiple materials and labour', () => {
    const input = {
      quantity: 25,
      materialWastage: 8,
      labourWastage: 15,
      materials: [
        {
          materialId: '1',
          requiredQuantity: 5,
          unitCost: 30.00,
        },
        {
          materialId: '2',
          requiredQuantity: 10,
          unitCost: 15.50,
        },
        {
          materialId: '3',
          requiredQuantity: 3,
          unitCost: 45.00,
        },
      ],
      labour: [
        {
          hours: 4,
          rate: 30.00,
        },
        {
          hours: 2,
          rate: 25.00,
        },
        {
          hours: 1,
          rate: 40.00,
        },
      ],
      overheads: [
        {
          name: 'Equipment',
          amount: 100.00,
        },
        {
          name: 'Utilities',
          amount: 75.00,
        },
        {
          name: 'Maintenance',
          amount: 50.00,
        },
      ],
      salePrice: 450.00,
    };

    const result = calculateCostFromInput(input);

    // Expected calculations:
    // Material cost: 
    //   - Material 1: 5 * (1 + 0.08) * 30.00 = 5.4 * 30.00 = 162.00
    //   - Material 2: 10 * (1 + 0.08) * 15.50 = 10.8 * 15.50 = 167.40
    //   - Material 3: 3 * (1 + 0.08) * 45.00 = 3.24 * 45.00 = 145.80
    //   - Total material cost: 162.00 + 167.40 + 145.80 = 475.20
    
    // Labour cost:
    //   - Labour 1: 4 * 30.00 = 120.00
    //   - Labour 2: 2 * 25.00 = 50.00
    //   - Labour 3: 1 * 40.00 = 40.00
    //   - Total before wastage: 120.00 + 50.00 + 40.00 = 210.00
    //   - Total with wastage: 210.00 * (1 + 0.15) = 241.50
    
    // Overhead cost: 100.00 + 75.00 + 50.00 = 225.00
    
    // Total cost: 475.20 + 241.50 + 225.00 = 941.70
    // Cost per piece: 941.70 / 25 = 37.668
    // Profit per piece: 450.00 - 37.668 = 412.332
    // Profit margin: (412.332 / 450.00) * 100 = 91.63%

    expect(result.totalMaterialCost).toBeCloseTo(475.20, 2);
    expect(result.totalLabourCost).toBeCloseTo(241.50, 2);
    expect(result.totalOverheadCost).toBeCloseTo(225.00, 2);
    expect(result.totalCost).toBeCloseTo(941.70, 2);
    expect(result.costPerPiece).toBeCloseTo(37.668, 2);
    expect(result.profitPerPiece).toBeCloseTo(412.332, 2);
    expect(result.profitMargin).toBeCloseTo(91.63, 1);
  });

  it('should handle zero quantity gracefully', () => {
    const input = {
      quantity: 0,
      materialWastage: 5,
      labourWastage: 10,
      materials: [
        {
          materialId: '1',
          requiredQuantity: 2,
          unitCost: 25.50,
        },
      ],
      labour: [
        {
          hours: 2,
          rate: 25.00,
        },
      ],
      overheads: [
        {
          name: 'Equipment',
          amount: 50.00,
        },
      ],
      salePrice: 299.99,
    };

    const result = calculateCostFromInput(input);

    expect(result.costPerPiece).toBe(0);
    expect(result.profitPerPiece).toBeCloseTo(299.99, 2);
    expect(result.profitMargin).toBeCloseTo(100, 1);
  });

  it('should handle zero sale price gracefully', () => {
    const input = {
      quantity: 10,
      materialWastage: 5,
      labourWastage: 10,
      materials: [
        {
          materialId: '1',
          requiredQuantity: 2,
          unitCost: 25.50,
        },
      ],
      labour: [
        {
          hours: 2,
          rate: 25.00,
        },
      ],
      overheads: [
        {
          name: 'Equipment',
          amount: 50.00,
        },
      ],
      salePrice: 0,
    };

    const result = calculateCostFromInput(input);

    expect(result.profitPerPiece).toBeCloseTo(-15.855, 2);
    expect(result.profitMargin).toBe(0);
  });
});
