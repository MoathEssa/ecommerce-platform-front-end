/**
 * Context Module Index
 * Re-exports all context-related functionality
 */

// Main context and provider
export {
  DataTableProvider,
  DataTableContext,
  type DataTableProviderProps,
} from "./DataTableContext";

// Hooks (separated for Fast Refresh compatibility)
export {
  useDataTableContext,
  useDataTable,
  useDataTableState,
  useDataTableDispatch,
  useDataTableComputed,
  useDataTableFields,
  useDataTableConfig,
  useDataTableActions,
} from "./hooks";

// Reducer
export { dataTableReducer, createInitialState } from "./reducer";

// Types
export type {
  DataTableState,
  DataTableAction,
  DataTableContextValue,
  DataTableContextConfig,
  UseDataTableStateReturn,
} from "./types";
