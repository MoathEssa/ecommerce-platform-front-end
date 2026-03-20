/**
 * Filter Button Component
 * Toggle button for opening/closing the advanced filter panel
 */

import { Filter, X } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

// ============================================================================
// Types
// ============================================================================

export interface FilterButtonProps {
  /** Whether the filter panel is open */
  isOpen: boolean;
  /** Callback to toggle filter panel */
  onToggle: () => void;
  /** Whether any filters are active */
  isFiltering: boolean;
  /** Number of active filter rules */
  activeFilterCount?: number;
  /** Callback to clear all filters */
  onClearFilters?: () => void;
  /** Label text */
  label?: string;
  /** Clear filters label */
  clearLabel?: string;
  /** Additional CSS class */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
}

// ============================================================================
// Component
// ============================================================================

export function FilterButton({
  isOpen,
  onToggle,
  isFiltering,
  activeFilterCount = 0,
  onClearFilters,
  label = "Filter",
  clearLabel = "Clear filters",
  className,
  disabled = false,
}: FilterButtonProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Filter Toggle Button */}
      <Button
        variant={isFiltering ? "default" : "outline"}
        size="sm"
        onClick={onToggle}
        disabled={disabled}
        className="gap-2"
        aria-expanded={isOpen}
        aria-controls="filter-panel"
      >
        <Filter className="h-4 w-4" />
        {label}
        {isFiltering && activeFilterCount > 0 && (
          <span className="ml-1 rounded-full bg-primary-foreground text-primary px-2 py-0.5 text-xs font-medium">
            {activeFilterCount}
          </span>
        )}
      </Button>

      {/* Clear Filters Button */}
      {isFiltering && onClearFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          disabled={disabled}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
          {clearLabel}
        </Button>
      )}
    </div>
  );
}
