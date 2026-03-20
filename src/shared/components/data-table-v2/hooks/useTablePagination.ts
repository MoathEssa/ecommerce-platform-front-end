/**
 * useTablePagination Hook
 * Handles pagination-related state and logic for DataTableV2
 */

import { useMemo, useCallback } from "react";
import type { PaginationState } from "../types";
import { DEFAULT_PAGINATION, DEFAULT_PAGE_SIZE_OPTIONS } from "../constants";

// ============================================================================
// Types
// ============================================================================

export interface UseTablePaginationOptions {
  /** Total number of rows (for server-side pagination) */
  totalRowCount?: number;
  /** Filtered row count (for client-side pagination) */
  filteredRowCount?: number;
  /** Pagination mode */
  paginationMode?: "client" | "server";
  /** Default page size */
  defaultPageSize?: number;
  /** Available page size options */
  pageSizeOptions?: readonly number[];
  /** Initial pagination state */
  initialPagination?: PaginationState;
  /** Callback when pagination changes */
  onPaginationChange?: (pagination: PaginationState) => void;
}

export interface UseTablePaginationReturn {
  /** Computed page count */
  pageCount: number;
  /** Whether there's a previous page */
  canPreviousPage: boolean;
  /** Whether there's a next page */
  canNextPage: boolean;
  /** Current page (1-indexed for display) */
  currentPage: number;
  /** Start index of current page (1-indexed for display) */
  startIndex: number;
  /** End index of current page (1-indexed for display) */
  endIndex: number;
  /** Available page size options */
  pageSizeOptions: readonly number[];
  /** Pagination info for display */
  paginationInfo: {
    start: number;
    end: number;
    total: number;
    pageCount: number;
    currentPage: number;
  };
  /** Actions */
  actions: {
    /** Go to specific page (0-indexed) */
    goToPage: (pageIndex: number) => PaginationState;
    /** Go to first page */
    goToFirstPage: () => PaginationState;
    /** Go to last page */
    goToLastPage: () => PaginationState;
    /** Go to next page */
    goToNextPage: (currentPagination: PaginationState) => PaginationState;
    /** Go to previous page */
    goToPreviousPage: (currentPagination: PaginationState) => PaginationState;
    /** Change page size */
    changePageSize: (pageSize: number) => PaginationState;
    /** Calculate page for row index */
    getPageForRow: (rowIndex: number, pageSize: number) => number;
  };
}

// ============================================================================
// Hook Implementation
// ============================================================================

/**
 * Hook for handling table pagination logic
 * Can be used standalone or integrated with DataTableContext
 */
export function useTablePagination(
  options: UseTablePaginationOptions,
): UseTablePaginationReturn {
  const {
    totalRowCount,
    filteredRowCount,
    paginationMode = "client",
    defaultPageSize = 10,
    pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
    initialPagination = DEFAULT_PAGINATION,
  } = options;

  // Determine row count based on mode
  const rowCount = useMemo(() => {
    if (paginationMode === "server" && totalRowCount !== undefined) {
      return totalRowCount;
    }
    return filteredRowCount ?? 0;
  }, [paginationMode, totalRowCount, filteredRowCount]);

  // Calculate page count
  const pageCount = useMemo(() => {
    const pageSize = initialPagination.pageSize || defaultPageSize;
    return Math.max(1, Math.ceil(rowCount / pageSize));
  }, [rowCount, initialPagination.pageSize, defaultPageSize]);

  // Current page (1-indexed for display)
  const currentPage = initialPagination.pageIndex + 1;

  // Navigation checks
  const canPreviousPage = initialPagination.pageIndex > 0;
  const canNextPage = initialPagination.pageIndex < pageCount - 1;

  // Calculate display indices
  const startIndex = useMemo(() => {
    if (rowCount === 0) return 0;
    return initialPagination.pageIndex * initialPagination.pageSize + 1;
  }, [initialPagination.pageIndex, initialPagination.pageSize, rowCount]);

  const endIndex = useMemo(() => {
    if (rowCount === 0) return 0;
    return Math.min(
      (initialPagination.pageIndex + 1) * initialPagination.pageSize,
      rowCount,
    );
  }, [initialPagination.pageIndex, initialPagination.pageSize, rowCount]);

  // Pagination info for display
  const paginationInfo = useMemo(
    () => ({
      start: startIndex,
      end: endIndex,
      total: rowCount,
      pageCount,
      currentPage,
    }),
    [startIndex, endIndex, rowCount, pageCount, currentPage],
  );

  // Actions
  const goToPage = useCallback(
    (pageIndex: number): PaginationState => {
      const safePageIndex = Math.max(0, Math.min(pageIndex, pageCount - 1));
      return {
        ...initialPagination,
        pageIndex: safePageIndex,
      };
    },
    [initialPagination, pageCount],
  );

  const goToFirstPage = useCallback((): PaginationState => {
    return {
      ...initialPagination,
      pageIndex: 0,
    };
  }, [initialPagination]);

  const goToLastPage = useCallback((): PaginationState => {
    return {
      ...initialPagination,
      pageIndex: Math.max(0, pageCount - 1),
    };
  }, [initialPagination, pageCount]);

  const goToNextPage = useCallback(
    (currentPagination: PaginationState): PaginationState => {
      const nextIndex = Math.min(
        currentPagination.pageIndex + 1,
        pageCount - 1,
      );
      return {
        ...currentPagination,
        pageIndex: nextIndex,
      };
    },
    [pageCount],
  );

  const goToPreviousPage = useCallback(
    (currentPagination: PaginationState): PaginationState => {
      const prevIndex = Math.max(0, currentPagination.pageIndex - 1);
      return {
        ...currentPagination,
        pageIndex: prevIndex,
      };
    },
    [],
  );

  const changePageSize = useCallback((pageSize: number): PaginationState => {
    return {
      pageIndex: 0, // Reset to first page
      pageSize,
    };
  }, []);

  const getPageForRow = useCallback(
    (rowIndex: number, pageSize: number): number => {
      return Math.floor(rowIndex / pageSize);
    },
    [],
  );

  return {
    pageCount,
    canPreviousPage,
    canNextPage,
    currentPage,
    startIndex,
    endIndex,
    pageSizeOptions,
    paginationInfo,
    actions: {
      goToPage,
      goToFirstPage,
      goToLastPage,
      goToNextPage,
      goToPreviousPage,
      changePageSize,
      getPageForRow,
    },
  };
}
