import type { DataTableState, DataTableAction } from "./types";
import {
  DEFAULT_QUERY,
  DEFAULT_SORTING,
  DEFAULT_PAGINATION,
  DEFAULT_COLUMN_VISIBILITY,
  DEFAULT_ROW_SELECTION,
} from "../constants";

export function dataTableReducer(
  state: DataTableState,
  action: DataTableAction,
): DataTableState {
  switch (action.type) {
    case "SET_QUERY":
      return {
        ...state,
        query: action.payload,
        // Reset to first page when filter changes
        pagination: { ...state.pagination, pageIndex: 0 },
      };

    case "SET_GLOBAL_FILTER":
      return {
        ...state,
        globalFilter: action.payload,
        pagination: { ...state.pagination, pageIndex: 0 },
      };

    case "SET_SORTING":
      return {
        ...state,
        sorting: action.payload,
      };

    case "SET_PAGINATION":
      return {
        ...state,
        pagination: action.payload,
      };

    case "SET_PAGE_INDEX":
      return {
        ...state,
        pagination: { ...state.pagination, pageIndex: action.payload },
      };

    case "SET_PAGE_SIZE":
      return {
        ...state,
        pagination: {
          ...state.pagination,
          pageSize: action.payload,
          // Reset to first page when page size changes
          pageIndex: 0,
        },
      };

    case "SET_COLUMN_VISIBILITY":
      return {
        ...state,
        columnVisibility: action.payload,
      };

    case "TOGGLE_COLUMN_VISIBILITY":
      return {
        ...state,
        columnVisibility: {
          ...state.columnVisibility,
          [action.payload.columnId]: action.payload.visible,
        },
      };

    // ========== Row Selection Actions ==========
    case "SET_ROW_SELECTION":
      return {
        ...state,
        rowSelection: action.payload,
      };

    case "TOGGLE_ROW_SELECTION": {
      const rowId = action.payload;
      const isSelected = state.rowSelection[rowId];
      return {
        ...state,
        rowSelection: {
          ...state.rowSelection,
          [rowId]: !isSelected,
        },
      };
    }

    case "SELECT_ALL_ROWS":
      return {
        ...state,
        rowSelection: action.payload ? state.rowSelection : {},
      };

    case "TOGGLE_FILTER_PANEL":
      return {
        ...state,
        isFilterPanelOpen: !state.isFilterPanelOpen,
      };

    case "OPEN_FILTER_PANEL":
      return {
        ...state,
        isFilterPanelOpen: true,
      };

    case "CLOSE_FILTER_PANEL":
      return {
        ...state,
        isFilterPanelOpen: false,
      };

    case "RESET_FILTERS":
      return {
        ...state,
        query: DEFAULT_QUERY,
        globalFilter: "",
        pagination: { ...state.pagination, pageIndex: 0 },
      };

    case "RESET_SORTING":
      return {
        ...state,
        sorting: DEFAULT_SORTING,
      };

    case "RESET_PAGINATION":
      return {
        ...state,
        pagination: DEFAULT_PAGINATION,
      };

    case "RESET_COLUMN_VISIBILITY":
      return {
        ...state,
        columnVisibility: DEFAULT_COLUMN_VISIBILITY,
      };

    case "RESET_ROW_SELECTION":
      return {
        ...state,
        rowSelection: DEFAULT_ROW_SELECTION,
      };

    case "RESET_ALL":
      return {
        query: DEFAULT_QUERY,
        sorting: DEFAULT_SORTING,
        pagination: DEFAULT_PAGINATION,
        columnVisibility: DEFAULT_COLUMN_VISIBILITY,
        rowSelection: DEFAULT_ROW_SELECTION,
        globalFilter: "",
        isFilterPanelOpen: false,
      };

    default:
      return state;
  }
}


export function createInitialState(
  overrides?: Partial<DataTableState>,
): DataTableState {
  return {
    query: overrides?.query ?? DEFAULT_QUERY,
    sorting: overrides?.sorting ?? DEFAULT_SORTING,
    pagination: overrides?.pagination ?? DEFAULT_PAGINATION,
    columnVisibility: overrides?.columnVisibility ?? DEFAULT_COLUMN_VISIBILITY,
    rowSelection: overrides?.rowSelection ?? DEFAULT_ROW_SELECTION,
    globalFilter: overrides?.globalFilter ?? "",
    isFilterPanelOpen: overrides?.isFilterPanelOpen ?? false,
  };
}
