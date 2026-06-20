/**
 * Format number as kilograms (KG) with thousand separators
 * @param weight - The weight to format
 * @returns Formatted string with "KG" suffix
 */
export function formatKG(weight: number | string): string {
  const numWeight = typeof weight === "string" ? parseFloat(weight) : weight;

  if (isNaN(numWeight)) {
    return "0 KG";
  }

  // Keep up to 2 decimal places if needed
  const formattedWeight =
    numWeight % 1 === 0
      ? numWeight.toLocaleString("en-PK", { maximumFractionDigits: 0 })
      : numWeight.toLocaleString("en-PK", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

  return `${formattedWeight} KG`;
}

/**
 * Alias for backward compatibility
 */
export const formatWeight = formatKG;

/**
 * Parse formatted KG string back to number
 * @param kgString - e.g. "1,250 KG"
 * @returns The numeric value (e.g. 1250)
 */
export function parseKG(kgString: string): number {
  const cleanString = kgString.replace(/KG|,/gi, "").trim();
  return parseFloat(cleanString) || 0;
}

/**
 * Format weight change with indicator (optional)
 * @param weight - The main weight
 * @param change - Change in weight (optional)
 * @returns e.g. "1,200 KG (+50 KG)"
 */
export function formatKGWithChange(
  weight: number | string,
  change?: number | string
): string {
  const formattedWeight = formatKG(weight);

  if (change !== undefined) {
    const numChange = typeof change === "string" ? parseFloat(change) : change;
    const changeSymbol = numChange >= 0 ? "+" : "-";
    const formattedChange = formatKG(Math.abs(numChange));
    return `${formattedWeight} (${changeSymbol}${formattedChange})`;
  }

  return formattedWeight;
}

/**
 * Format weight for compact display (e.g., 1.2K KG, 3.4M KG)
 * @param weight - The weight value
 * @returns Formatted compact string
 */
export function formatCompactKG(weight: number | string): string {
  const numWeight = typeof weight === "string" ? parseFloat(weight) : weight;

  if (isNaN(numWeight)) {
    return "0 KG";
  }

  const formatter = new Intl.NumberFormat("en-PK", {
    notation: "compact",
    maximumFractionDigits: 1,
  });

  return `${formatter.format(numWeight)} KG`;
}
