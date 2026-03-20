/**
 * useTableFiltering Hook
 * Handles filter-related state and logic for DataTableV2
 */

import { useMemo, useCallback } from "react";
import type { RuleGroupType } from "react-querybuilder";
import { applyFilter } from "../engine";
import { DEFAULT_QUERY } from "../constants";

// ============================================================================
// Types
// ============================================================================

export interface UseTableFilteringOptions<TData> {
  /** Data to filter */
  data: TData[];
  /** Filter mode: 'client' applies filters locally, 'server' expects pre-filtered data */
  filterMode?: "client" | "server";
  /** Initial query state */
  initialQuery?: RuleGroupType;
  /** Initial global filter value */
  initialGlobalFilter?: string;
  /** Callback when query changes */
  onQueryChange?: (query: RuleGroupType) => void;
  /** Callback when global filter changes */
  onGlobalFilterChange?: (value: string) => void;
}

export interface UseTableFilteringReturn<TData> {
  /** Filtered data */
  filteredData: TData[];
  /** Whether any filters are active */
  isFiltering: boolean;
  /** Number of active filter rules */
  activeFilterCount: number;
  /** Actions for state management */
  actions: {
    /** Apply query filter */
    applyQuery: (query: RuleGroupType) => TData[];
    /** Apply global filter to data */
    applyGlobalFilter: (data: TData[], searchTerm: string) => TData[];
    /** Check if row matches filter */
    rowMatchesFilter: (row: TData, query: RuleGroupType) => boolean;
  };
}

// ============================================================================
// Hook Implementation
// ============================================================================

/**
 * Hook for handling table filtering logic
 * Can be used standalone or integrated with DataTableContext
 */
export function useTableFiltering<TData extends Record<string, unknown>>(
  options: UseTableFilteringOptions<TData>,
): UseTableFilteringReturn<TData> {
  const {
    data,
    filterMode = "client",
    initialQuery = DEFAULT_QUERY,
    initialGlobalFilter = "",
  } = options;

  // Check if filtering is active
  const isFiltering = useMemo(() => {
    return initialQuery.rules && initialQuery.rules.length > 0;
  }, [initialQuery.rules]);

  // Count active filter rules
  const activeFilterCount = useMemo(() => {
    return initialQuery.rules?.length ?? 0;
  }, [initialQuery.rules]);

  // Apply query filter to data
  const applyQueryFilter = useCallback(
    (query: RuleGroupType): TData[] => {
      if (filterMode === "server") return data;
      if (!query.rules || query.rules.length === 0) return data;
      return applyFilter(data, query);
    },
    [data, filterMode],
  );

  // Apply global filter (quick search)
  const applyGlobalFilterFn = useCallback(
    (dataToFilter: TData[], searchTerm: string): TData[] => {
      if (!searchTerm || !searchTerm.trim()) return dataToFilter;

      const term = searchTerm.toLowerCase().trim();
      return dataToFilter.filter((row) => {
        return Object.values(row).some((value) => {
          if (value === null || value === undefined) return false;
          return String(value).toLowerCase().includes(term);
        });
      });
    },
    [],
  );

  // Check if a single row matches the filter
  const rowMatchesFilter = useCallback(
    (row: TData, query: RuleGroupType): boolean => {
      if (!query.rules || query.rules.length === 0) return true;
      const filtered = applyFilter([row], query);
      return filtered.length > 0;
    },
    [],
  );

  // Compute filtered data
  const filteredData = useMemo(() => {
    if (filterMode === "server") return data;

    let result = data;

    // Apply advanced filter
    if (initialQuery.rules && initialQuery.rules.length > 0) {
      result = applyFilter(result, initialQuery);
    }

    // Apply global filter
    if (initialGlobalFilter && initialGlobalFilter.trim()) {
      result = applyGlobalFilterFn(result, initialGlobalFilter);
    }

    return result;
  }, [
    data,
    initialQuery,
    initialGlobalFilter,
    filterMode,
    applyGlobalFilterFn,
  ]);

  return {
    filteredData,
    isFiltering,
    activeFilterCount,
    actions: {
      applyQuery: applyQueryFilter,
      applyGlobalFilter: applyGlobalFilterFn,
      rowMatchesFilter,
    },
  };
}
