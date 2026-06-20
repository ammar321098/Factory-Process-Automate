/**
 * Utility functions for CSV export functionality
 */

export interface CSVExportOptions {
  filename: string;
  headers: string[];
  data: any[];
  delimiter?: string;
}

/**
 * Converts an array of objects to CSV format
 */
export const convertToCSV = (
  data: any[],
  headers: string[],
  delimiter: string = ','
): string => {
  if (data.length === 0) {
    return headers.join(delimiter);
  }

  // Get the property names from the first object
  const properties = headers;

  // Create CSV header row
  const headerRow = properties.join(delimiter);

  // Create CSV data rows
  const dataRows = data.map(row => {
    return properties.map(header => {
      const value = row[header];
      // Handle null/undefined values
      if (value === null || value === undefined) {
        return '';
      }
      // Convert to string and escape quotes
      const stringValue = String(value);
      // If the value contains delimiter, quotes, or newlines, wrap in quotes
      if (stringValue.includes(delimiter) || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    }).join(delimiter);
  });

  return [headerRow, ...dataRows].join('\n');
};

/**
 * Downloads CSV content as a file
 */
export const downloadCSV = (csvContent: string, filename: string): void => {
  // Create blob with CSV content
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Create download link
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  // Add to DOM, click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up URL object
  URL.revokeObjectURL(url);
};

/**
 * Exports data to CSV and triggers download
 */
export const exportToCSV = (options: CSVExportOptions): void => {
  const { filename, headers, data, delimiter = ',' } = options;
  
  // Ensure filename has .csv extension
  const csvFilename = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  
  // Convert data to CSV
  const csvContent = convertToCSV(data, headers, delimiter);
  
  // Download the CSV file
  downloadCSV(csvContent, csvFilename);
};

/**
 * Formats currency for CSV export
 */
export const formatCurrencyForCSV = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

/**
 * Formats date for CSV export
 */
export const formatDateForCSV = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US');
};

/**
 * Common CSV export configurations for different report types
 */
export const CSV_EXPORT_CONFIGS = {
  stock: {
    headers: ['Product Code', 'Product Name', 'Category', 'Current Stock', 'Unit', 'Unit Cost', 'Total Value'] as string[],
    filename: 'stock-report',
  },
  production: {
    headers: ['Job Order', 'Product', 'Quantity', 'Status', 'Start Date', 'End Date', 'Cost per Piece', 'Total Cost'] as string[],
    filename: 'production-report',
  },
  sales: {
    headers: ['Invoice Number', 'Client', 'Date', 'Total Amount', 'Status', 'Due Date'] as string[],
    filename: 'sales-report',
  },
};
