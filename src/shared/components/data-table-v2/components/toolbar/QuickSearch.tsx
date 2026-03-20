/**
 * Quick Search Component
 * Search input with debounced filtering for DataTableV2
 */

import { useState, useEffect, useCallback } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import { DEBOUNCE_DELAYS } from "../../constants";

// ============================================================================
// Types
// ============================================================================

export interface QuickSearchProps {
  /** Current search value */
  value: string;
  /** Callback when search value changes */
  onChange: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Debounce delay in ms */
  debounceMs?: number;
  /** Show clear button */
  showClear?: boolean;
  /** Additional CSS class */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Auto focus on mount */
  autoFocus?: boolean;
}

// ============================================================================
// Component
// ============================================================================

export function QuickSearch({
  value,
  onChange,
  placeholder = "Search...",
  debounceMs = DEBOUNCE_DELAYS.globalFilter,
  showClear = true,
  className,
  disabled = false,
  autoFocus = false,
}: QuickSearchProps) {
  // Local state for immediate UI feedback
  const [localValue, setLocalValue] = useState(value);

  // Sync local value when external value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounced change handler
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localValue, value, onChange, debounceMs]);

  // Handle input change
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
  }, []);

  // Handle clear
  const handleClear = useCallback(() => {
    setLocalValue("");
    onChange("");
  }, [onChange]);

  // Handle key down (Enter to search immediately)
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        onChange(localValue);
      }
      if (e.key === "Escape") {
        handleClear();
      }
    },
    [localValue, onChange, handleClear],
  );

  return (
    <div className={cn("relative flex-1 max-w-sm", className)}>
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
      <Input
        type="text"
        value={localValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        autoFocus={autoFocus}
        className="pl-8 pr-8"
      />
      {showClear && localValue && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="absolute right-1 top-1 h-7 w-7 p-0 hover:bg-transparent"
          disabled={disabled}
        >
          <X className="h-4 w-4 text-muted-foreground" />
          <span className="sr-only">Clear search</span>
        </Button>
      )}
    </div>
  );
}
