// Currency formatting utilities for PKR (Pakistani Rupees)

/**
 * Format number as PKR currency without decimal places
 * @param amount - The amount to format
 * @returns Formatted string with PKR symbol
 */
export function formatPKR(amount: number | string): string {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(numAmount)) {
    return "₨0";
  }

  // Round to nearest integer (no decimal places)
  const roundedAmount = Math.round(numAmount);

  // Add thousand separators
  const formattedAmount = roundedAmount.toLocaleString("en-PK");

  return `₨${formattedAmount}`;
}

/**
 * Alias for formatPKR for backward compatibility
 * @param amount - The amount to format
 * @returns Formatted string with PKR symbol
 */
export const formatCurrency = formatPKR;

/**
 * Format number with thousand separators (for non-currency numbers)
 * @param number - The number to format
 * @returns Formatted number string
 */
export function formatNumber(number: number | string): string {
  const numNumber = typeof number === "string" ? parseFloat(number) : number;

  if (isNaN(numNumber)) {
    return "0";
  }

  // Round to nearest integer
  const roundedNumber = Math.round(numNumber);

  // Add thousand separators
  return roundedNumber.toLocaleString("en-PK");
}

/**
 * Format number as PKR currency with change indicator
 * @param amount - The amount to format
 * @param change - The change amount (optional)
 * @returns Formatted string with PKR symbol and change
 */
export function formatPKRWithChange(
  amount: number | string,
  change?: number | string
): string {
  const formattedAmount = formatPKR(amount);

  if (change !== undefined) {
    const numChange = typeof change === "string" ? parseFloat(change) : change;
    const changeSymbol = numChange >= 0 ? "+" : "";
    const formattedChange = formatPKR(Math.abs(numChange));
    return `${formattedAmount} (${changeSymbol}${formattedChange})`;
  }

  return formattedAmount;
}

/**
 * Parse PKR string back to number
 * @param pkrString - The PKR formatted string
 * @returns The numeric value
 */
export function parsePKR(pkrString: string): number {
  // Remove ₨ symbol and commas
  const cleanString = pkrString.replace(/₨|,/g, "");
  return parseFloat(cleanString) || 0;
}

/**
 * Format percentage change
 * @param change - The change percentage
 * @returns Formatted percentage string
 */
export function formatPercentageChange(change: number | string): string {
  const numChange = typeof change === "string" ? parseFloat(change) : change;

  if (isNaN(numChange)) {
    return "0%";
  }

  const roundedChange = Math.round(numChange);
  const symbol = roundedChange >= 0 ? "+" : "";

  return `${symbol}${roundedChange}%`;
}
