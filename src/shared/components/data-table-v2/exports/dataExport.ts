/**
 * Data Export Utilities
 * Export table data to CSV, Excel, and other formats
 */

import type { Table, Row } from "@tanstack/react-table";

// ============================================================================
// Type Definitions
// ============================================================================

export interface ExportColumn {
  id: string;
  header: string;
}

export interface DataExportOptions {
  /** Columns to include (defaults to all visible columns) */
  columns?: ExportColumn[];
  /** Export only selected rows */
  selectedOnly?: boolean;
  /** Include headers */
  includeHeaders?: boolean;
  /** File name (without extension) */
  fileName?: string;
  /** Sheet name for Excel */
  sheetName?: string;
  /** Custom value getter */
  getValue?: (row: Record<string, unknown>, columnId: string) => unknown;
}

// ============================================================================
// CSV Export
// ============================================================================

/**
 * Convert data to CSV string
 */
export function toCSV<TData extends Record<string, unknown>>(
  data: TData[],
  columns: ExportColumn[],
  options: Pick<DataExportOptions, "includeHeaders" | "getValue"> = {},
): string {
  const { includeHeaders = true, getValue } = options;
  const lines: string[] = [];

  // Headers
  if (includeHeaders) {
    lines.push(columns.map((col) => escapeCSV(col.header)).join(","));
  }

  // Data rows
  for (const row of data) {
    const values = columns.map((col) => {
      const value = getValue ? getValue(row, col.id) : row[col.id];
      return escapeCSV(formatValue(value));
    });
    lines.push(values.join(","));
  }

  return lines.join("\n");
}

/**
 * Export table to CSV file
 */
export function exportToCSV<TData extends Record<string, unknown>>(
  table: Table<TData>,
  options: DataExportOptions = {},
): void {
  const { fileName = "export", ...csvOptions } = options;

  const { data, columns } = getExportData(table, options);
  const csv = toCSV(data, columns, csvOptions);

  downloadFile(csv, `${fileName}.csv`, "text/csv;charset=utf-8;");
}

// ============================================================================
// JSON Export
// ============================================================================

/**
 * Export table to JSON file
 */
export function exportToJSON<TData extends Record<string, unknown>>(
  table: Table<TData>,
  options: DataExportOptions = {},
): void {
  const { fileName = "export", getValue } = options;

  const { data, columns } = getExportData(table, options);

  // Transform data to include only selected columns
  const exportData = data.map((row) => {
    const obj: Record<string, unknown> = {};
    for (const col of columns) {
      obj[col.id] = getValue ? getValue(row, col.id) : row[col.id];
    }
    return obj;
  });

  const json = JSON.stringify(exportData, null, 2);
  downloadFile(json, `${fileName}.json`, "application/json");
}

// ============================================================================
// Excel Export (using simple xlsx format)
// ============================================================================

/**
 * Generate simple XLSX workbook XML
 * Note: For production use, consider using libraries like xlsx or exceljs
 */
export function exportToExcel<TData extends Record<string, unknown>>(
  table: Table<TData>,
  options: DataExportOptions = {},
): void {
  const { fileName = "export", ...rest } = options;

  const { data, columns } = getExportData(table, options);

  // For simple CSV-based Excel export (most browsers will open CSV in Excel)
  // For proper XLSX support, integrate a library like xlsx
  const csv = toCSV(data, columns, rest);

  // Use CSV with Excel MIME type as a simple solution
  downloadFile(csv, `${fileName}.csv`, "application/vnd.ms-excel");
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get data and columns for export
 */
function getExportData<TData extends Record<string, unknown>>(
  table: Table<TData>,
  options: DataExportOptions,
): { data: TData[]; columns: ExportColumn[] } {
  const { selectedOnly = false, columns: customColumns } = options;

  // Get columns
  const columns: ExportColumn[] =
    customColumns ||
    table
      .getVisibleFlatColumns()
      .filter((col) => col.id !== "select" && col.id !== "actions")
      .map((col) => ({
        id: col.id,
        header:
          typeof col.columnDef.header === "string"
            ? col.columnDef.header
            : col.id,
      }));

  // Get rows
  let rows: Row<TData>[];
  if (selectedOnly) {
    rows = table.getSelectedRowModel().rows;
  } else {
    rows = table.getFilteredRowModel().rows;
  }

  const data = rows.map((row) => row.original);

  return { data, columns };
}

/**
 * Escape CSV special characters
 */
function escapeCSV(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Format value for export
 */
function formatValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return String(value);
}

/**
 * Trigger file download in browser
 */
function downloadFile(
  content: string,
  filename: string,
  mimeType: string,
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Export hook for use in components
 */
export function createExportHandlers<TData extends Record<string, unknown>>(
  table: Table<TData>,
  defaultOptions: DataExportOptions = {},
) {
  return {
    exportCSV: (options?: DataExportOptions) =>
      exportToCSV(table, { ...defaultOptions, ...options }),
    exportJSON: (options?: DataExportOptions) =>
      exportToJSON(table, { ...defaultOptions, ...options }),
    exportExcel: (options?: DataExportOptions) =>
      exportToExcel(table, { ...defaultOptions, ...options }),
  };
}
