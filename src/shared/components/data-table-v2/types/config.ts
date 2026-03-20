/**
 * Default configuration values for DataTableV2
 */

import type { DataTableV2Config } from "./index";

/**
 * Default configuration that can be overridden
 */
export const defaultConfig: DataTableV2Config<unknown> = {
  // Filter Configuration
  filterMode: "client",
  enableAdvancedFilter: true,
  enableSimpleFilter: true,
  filterDebounceMs: 300,

  // Export Configuration
  enableExport: false,
  queryExportFormats: ["jsonLogic", "json"],
  dataExportFormats: ["csv"],

  // Pagination Configuration
  enablePagination: true,
  paginationMode: "client",
  defaultPageSize: 10,
  pageSizeOptions: [10, 20, 50, 100],
  totalRowCount: 0,

  // Selection Configuration
  enableRowSelection: false,
  selectionMode: "multi",

  // Column Configuration
  enableColumnResizing: false,
  enableColumnReordering: false,
  enableColumnPinning: false,
  enableColumnVisibility: true,

  // Display Configuration
  displayMode: "flat",
  enableVirtualization: false,
  estimatedRowHeight: 48,

  // Sorting Configuration
  enableSorting: true,
  enableMultiSort: true,
  sortingMode: "client",
  maxSortColumns: 3,

  // Loading & Empty States
  isLoading: false,
};

/**
 * Merge user config with defaults
 */
export function mergeConfig<TData>(
  userConfig?: Partial<DataTableV2Config<TData>>,
): DataTableV2Config<TData> {
  return {
    ...defaultConfig,
    ...userConfig,
  } as DataTableV2Config<TData>;
}
