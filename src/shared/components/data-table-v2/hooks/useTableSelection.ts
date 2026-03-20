/**
 * useTableSelection Hook
 * Handles row selection state and logic for DataTableV2
 */

import { useMemo, useCallback } from "react";
import type { Row } from "@tanstack/react-table";

// ============================================================================
// Types
// ============================================================================

export interface UseTableSelectionOptions {
  /** Enable row selection */
  enableRowSelection?: boolean;
  /** Enable multi-row selection */
  enableMultiRowSelection?: boolean;
  /** Initial selection state */
  initialSelection?: Record<string, boolean>;
  /** All row IDs (for select all functionality) */
  allRowIds?: string[];
  /** Callback when selection changes */
  onSelectionChange?: (selection: Record<string, boolean>) => void;
}

export interface UseTableSelectionReturn {
  /** Whether any rows are selected */
  hasSelection: boolean;
  /** Number of selected rows */
  selectedCount: number;
  /** Whether all rows are selected */
  isAllSelected: boolean;
  /** Whether some (but not all) rows are selected */
  isSomeSelected: boolean;
  /** Check if a specific row is selected */
  isRowSelected: (rowId: string) => boolean;
  /** Actions */
  actions: {
    /** Toggle selection for a single row */
    toggleRowSelection: (
      rowId: string,
      currentSelection: Record<string, boolean>,
    ) => Record<string, boolean>;
    /** Select a single row */
    selectRow: (
      rowId: string,
      currentSelection: Record<string, boolean>,
    ) => Record<string, boolean>;
    /** Deselect a single row */
    deselectRow: (
      rowId: string,
      currentSelection: Record<string, boolean>,
    ) => Record<string, boolean>;
    /** Select multiple rows */
    selectRows: (
      rowIds: string[],
      currentSelection: Record<string, boolean>,
    ) => Record<string, boolean>;
    /** Deselect multiple rows */
    deselectRows: (
      rowIds: string[],
      currentSelection: Record<string, boolean>,
    ) => Record<string, boolean>;
    /** Select all rows */
    selectAll: (allRowIds: string[]) => Record<string, boolean>;
    /** Deselect all rows */
    deselectAll: () => Record<string, boolean>;
    /** Toggle all rows */
    toggleAll: (
      allRowIds: string[],
      currentSelection: Record<string, boolean>,
    ) => Record<string, boolean>;
    /** Get selected row IDs */
    getSelectedIds: (selection: Record<string, boolean>) => string[];
    /** Get selected rows from table rows */
    getSelectedRows: <T>(
      rows: Row<T>[],
      selection: Record<string, boolean>,
    ) => Row<T>[];
  };
}

// ============================================================================
// Hook Implementation
// ============================================================================

/**
 * Hook for handling table row selection logic
 * Can be used standalone or integrated with DataTableContext
 */
export function useTableSelection(
  options: UseTableSelectionOptions = {},
): UseTableSelectionReturn {
  const {
    enableRowSelection = false,
    enableMultiRowSelection = true,
    initialSelection = {},
    allRowIds = [],
  } = options;

  // Check if any rows are selected
  const hasSelection = useMemo(() => {
    return Object.values(initialSelection).some(Boolean);
  }, [initialSelection]);

  // Count selected rows
  const selectedCount = useMemo(() => {
    return Object.values(initialSelection).filter(Boolean).length;
  }, [initialSelection]);

  // Check if all rows are selected
  const isAllSelected = useMemo(() => {
    if (allRowIds.length === 0) return false;
    return allRowIds.every((id: string) => initialSelection[id]);
  }, [initialSelection, allRowIds]);

  // Check if some (but not all) rows are selected
  const isSomeSelected = useMemo(() => {
    return hasSelection && !isAllSelected;
  }, [hasSelection, isAllSelected]);

  // Check if a specific row is selected
  const isRowSelected = useCallback(
    (rowId: string): boolean => {
      return Boolean(initialSelection[rowId]);
    },
    [initialSelection],
  );

  // Toggle selection for a single row
  const toggleRowSelection = useCallback(
    (
      rowId: string,
      currentSelection: Record<string, boolean>,
    ): Record<string, boolean> => {
      if (!enableRowSelection) return currentSelection;

      const isSelected = currentSelection[rowId];

      if (!enableMultiRowSelection) {
        // Single selection mode - clear others
        return { [rowId]: !isSelected };
      }

      return {
        ...currentSelection,
        [rowId]: !isSelected,
      };
    },
    [enableRowSelection, enableMultiRowSelection],
  );

  // Select a single row
  const selectRow = useCallback(
    (
      rowId: string,
      currentSelection: Record<string, boolean>,
    ): Record<string, boolean> => {
      if (!enableRowSelection) return currentSelection;

      if (!enableMultiRowSelection) {
        return { [rowId]: true };
      }

      return {
        ...currentSelection,
        [rowId]: true,
      };
    },
    [enableRowSelection, enableMultiRowSelection],
  );

  // Deselect a single row
  const deselectRow = useCallback(
    (
      rowId: string,
      currentSelection: Record<string, boolean>,
    ): Record<string, boolean> => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [rowId]: _removed, ...rest } = currentSelection;
      return rest;
    },
    [],
  );

  // Select multiple rows
  const selectRows = useCallback(
    (
      rowIds: string[],
      currentSelection: Record<string, boolean>,
    ): Record<string, boolean> => {
      if (!enableRowSelection || !enableMultiRowSelection) {
        return currentSelection;
      }

      const newSelection = { ...currentSelection };
      rowIds.forEach((id) => {
        newSelection[id] = true;
      });
      return newSelection;
    },
    [enableRowSelection, enableMultiRowSelection],
  );

  // Deselect multiple rows
  const deselectRows = useCallback(
    (
      rowIds: string[],
      currentSelection: Record<string, boolean>,
    ): Record<string, boolean> => {
      const newSelection = { ...currentSelection };
      rowIds.forEach((id) => {
        delete newSelection[id];
      });
      return newSelection;
    },
    [],
  );

  // Select all rows
  const selectAll = useCallback(
    (rowIds: string[]): Record<string, boolean> => {
      if (!enableRowSelection || !enableMultiRowSelection) {
        return {};
      }

      const selection: Record<string, boolean> = {};
      rowIds.forEach((id) => {
        selection[id] = true;
      });
      return selection;
    },
    [enableRowSelection, enableMultiRowSelection],
  );

  // Deselect all rows
  const deselectAll = useCallback((): Record<string, boolean> => {
    return {};
  }, []);

  // Toggle all rows
  const toggleAll = useCallback(
    (
      rowIds: string[],
      currentSelection: Record<string, boolean>,
    ): Record<string, boolean> => {
      const allSelected = rowIds.every((id) => currentSelection[id]);
      return allSelected ? deselectAll() : selectAll(rowIds);
    },
    [selectAll, deselectAll],
  );

  // Get selected row IDs
  const getSelectedIds = useCallback(
    (selection: Record<string, boolean>): string[] => {
      return Object.entries(selection)
        .filter(([, isSelected]) => isSelected)
        .map(([id]) => id);
    },
    [],
  );

  // Get selected rows from table rows
  const getSelectedRows = useCallback(
    <T>(rows: Row<T>[], selection: Record<string, boolean>): Row<T>[] => {
      return rows.filter((row) => selection[row.id]);
    },
    [],
  );

  return {
    hasSelection,
    selectedCount,
    isAllSelected,
    isSomeSelected,
    isRowSelected,
    actions: {
      toggleRowSelection,
      selectRow,
      deselectRow,
      selectRows,
      deselectRows,
      selectAll,
      deselectAll,
      toggleAll,
      getSelectedIds,
      getSelectedRows,
    },
  };
}
