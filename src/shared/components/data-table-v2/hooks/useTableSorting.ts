/**
 * useTableSorting Hook
 * Handles sorting-related state and logic for DataTableV2
 */

import { useMemo, useCallback } from "react";
import type { SortingState } from "../types";
import { DEFAULT_SORTING } from "../constants";

// ============================================================================
// Types
// ============================================================================

export interface UseTableSortingOptions {
  /** Enable multi-column sorting */
  enableMultiSort?: boolean;
  /** Maximum columns that can be sorted at once */
  maxSortColumns?: number;
  /** Sorting mode */
  sortingMode?: "client" | "server";
  /** Initial sorting state */
  initialSorting?: SortingState;
  /** Callback when sorting changes */
  onSortingChange?: (sorting: SortingState) => void;
}

export interface UseTableSortingReturn {
  /** Whether any sorting is active */
  isSorted: boolean;
  /** Number of sorted columns */
  sortedColumnCount: number;
  /** Get sort direction for a column */
  getSortDirection: (columnId: string) => "asc" | "desc" | false;
  /** Get sort index for a column (for multi-sort) */
  getSortIndex: (columnId: string) => number;
  /** Actions */
  actions: {
    /** Toggle sort for a column */
    toggleSort: (
      columnId: string,
      currentSorting: SortingState,
      multiSort?: boolean,
    ) => SortingState;
    /** Set sort for a column */
    setColumnSort: (
      columnId: string,
      direction: "asc" | "desc",
      currentSorting: SortingState,
      multiSort?: boolean,
    ) => SortingState;
    /** Clear sort for a column */
    clearColumnSort: (
      columnId: string,
      currentSorting: SortingState,
    ) => SortingState;
    /** Clear all sorting */
    clearAllSorting: () => SortingState;
    /** Reorder sort priorities */
    reorderSort: (
      columnId: string,
      newIndex: number,
      currentSorting: SortingState,
    ) => SortingState;
  };
}

// ============================================================================
// Hook Implementation
// ============================================================================

/**
 * Hook for handling table sorting logic
 * Can be used standalone or integrated with DataTableContext
 */
export function useTableSorting(
  options: UseTableSortingOptions = {},
): UseTableSortingReturn {
  const {
    enableMultiSort = true,
    maxSortColumns = 3,
    initialSorting = DEFAULT_SORTING,
  } = options;

  // Check if sorting is active
  const isSorted = useMemo(() => {
    return initialSorting.length > 0;
  }, [initialSorting]);

  // Count sorted columns
  const sortedColumnCount = useMemo(() => {
    return initialSorting.length;
  }, [initialSorting]);

  // Get sort direction for a column
  const getSortDirection = useCallback(
    (columnId: string): "asc" | "desc" | false => {
      const sort = initialSorting.find((s) => s.id === columnId);
      if (!sort) return false;
      return sort.desc ? "desc" : "asc";
    },
    [initialSorting],
  );

  // Get sort index for a column (for multi-sort display)
  const getSortIndex = useCallback(
    (columnId: string): number => {
      const index = initialSorting.findIndex((s) => s.id === columnId);
      return index;
    },
    [initialSorting],
  );

  // Toggle sort for a column
  const toggleSort = useCallback(
    (
      columnId: string,
      currentSorting: SortingState,
      multiSort = false,
    ): SortingState => {
      const existingIndex = currentSorting.findIndex((s) => s.id === columnId);
      const existing = currentSorting[existingIndex];

      // Cycle: none -> asc -> desc -> none
      if (!existing) {
        // Add new sort (asc)
        const newSort = { id: columnId, desc: false };
        if (multiSort && enableMultiSort) {
          const newSorting = [...currentSorting, newSort];
          // Respect max sort columns
          return newSorting.slice(-maxSortColumns);
        }
        return [newSort];
      }

      if (!existing.desc) {
        // Currently asc, change to desc
        const newSorting = [...currentSorting];
        newSorting[existingIndex] = { ...existing, desc: true };
        return newSorting;
      }

      // Currently desc, remove sort
      return currentSorting.filter((s) => s.id !== columnId);
    },
    [enableMultiSort, maxSortColumns],
  );

  // Set sort for a column explicitly
  const setColumnSort = useCallback(
    (
      columnId: string,
      direction: "asc" | "desc",
      currentSorting: SortingState,
      multiSort = false,
    ): SortingState => {
      const existingIndex = currentSorting.findIndex((s) => s.id === columnId);
      const newSort = { id: columnId, desc: direction === "desc" };

      if (existingIndex >= 0) {
        // Update existing
        const newSorting = [...currentSorting];
        newSorting[existingIndex] = newSort;
        return newSorting;
      }

      // Add new
      if (multiSort && enableMultiSort) {
        const newSorting = [...currentSorting, newSort];
        return newSorting.slice(-maxSortColumns);
      }

      return [newSort];
    },
    [enableMultiSort, maxSortColumns],
  );

  // Clear sort for a specific column
  const clearColumnSort = useCallback(
    (columnId: string, currentSorting: SortingState): SortingState => {
      return currentSorting.filter((s) => s.id !== columnId);
    },
    [],
  );

  // Clear all sorting
  const clearAllSorting = useCallback((): SortingState => {
    return [];
  }, []);

  // Reorder sort priorities
  const reorderSort = useCallback(
    (
      columnId: string,
      newIndex: number,
      currentSorting: SortingState,
    ): SortingState => {
      const currentIndex = currentSorting.findIndex((s) => s.id === columnId);
      if (currentIndex < 0 || currentIndex === newIndex) {
        return currentSorting;
      }

      const newSorting = [...currentSorting];
      const [removed] = newSorting.splice(currentIndex, 1);
      newSorting.splice(newIndex, 0, removed);
      return newSorting;
    },
    [],
  );

  return {
    isSorted,
    sortedColumnCount,
    getSortDirection,
    getSortIndex,
    actions: {
      toggleSort,
      setColumnSort,
      clearColumnSort,
      clearAllSorting,
      reorderSort,
    },
  };
}
