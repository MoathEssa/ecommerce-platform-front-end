import { useContext } from "react";
import type { Table } from "@tanstack/react-table";
import type {
  DataTableState,
  DataTableAction,
  DataTableContextValue,
  DataTableContextConfig,
} from "./types";
import { DataTableContext } from "./DataTableContext";

export function useDataTableContext<
  TData = unknown,
>(): DataTableContextValue<TData> {
  const context = useContext(DataTableContext);

  if (!context) {
    throw new Error(
      "useDataTableContext must be used within a DataTableProvider. " +
        "Wrap your component tree with <DataTableProvider>.",
    );
  }

  return context as DataTableContextValue<TData>;
}

export function useDataTable<TData = unknown>(): Table<TData> {
  const { table } = useDataTableContext<TData>();
  return table;
}

export function useDataTableState(): DataTableState {
  const { state } = useDataTableContext();
  return state;
}

export function useDataTableDispatch(): React.Dispatch<DataTableAction> {
  const { dispatch } = useDataTableContext();
  return dispatch;
}

export function useDataTableComputed<TData = unknown>() {
  const { computed } = useDataTableContext<TData>();
  return computed;
}

export function useDataTableFields() {
  const { fields } = useDataTableContext();
  return fields;
}

export function useDataTableConfig(): DataTableContextConfig {
  const { config } = useDataTableContext();
  return config;
}

export function useDataTableActions() {
  const { dispatch } = useDataTableContext();

  return {
    setQuery: (query: DataTableState["query"]) =>
      dispatch({ type: "SET_QUERY", payload: query }),
    setGlobalFilter: (filter: string) =>
      dispatch({ type: "SET_GLOBAL_FILTER", payload: filter }),
    setSorting: (sorting: DataTableState["sorting"]) =>
      dispatch({ type: "SET_SORTING", payload: sorting }),
    setPagination: (pagination: DataTableState["pagination"]) =>
      dispatch({ type: "SET_PAGINATION", payload: pagination }),
    setRowSelection: (selection: DataTableState["rowSelection"]) =>
      dispatch({ type: "SET_ROW_SELECTION", payload: selection }),
    setColumnVisibility: (visibility: DataTableState["columnVisibility"]) =>
      dispatch({ type: "SET_COLUMN_VISIBILITY", payload: visibility }),
    toggleFilterPanel: () => dispatch({ type: "TOGGLE_FILTER_PANEL" }),
    resetFilters: () => dispatch({ type: "RESET_FILTERS" }),
    resetAll: () => dispatch({ type: "RESET_ALL" }),
  };
}
