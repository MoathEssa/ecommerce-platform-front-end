/**
 * Loading State Component
 * Skeleton loading for table content
 */

import { Skeleton } from "@/shared/ui/skeleton";
import { cn } from "@/shared/lib/utils";

// ============================================================================
// Types
// ============================================================================

export interface LoadingStateProps {
  /** Number of columns */
  columns?: number;
  /** Number of rows */
  rows?: number;
  /** Show header skeleton */
  showHeader?: boolean;
  /** Additional CSS class */
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

export function LoadingState({
  columns = 5,
  rows = 5,
  showHeader = true,
  className,
}: LoadingStateProps) {
  return (
    <div className={cn("w-full", className)}>
      {/* Header skeleton */}
      {showHeader && (
        <div className="flex gap-4 p-4 border-b">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton
              key={`header-${i}`}
              className="h-4 flex-1"
              style={{ maxWidth: i === 0 ? "150px" : undefined }}
            />
          ))}
        </div>
      )}

      {/* Row skeletons */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={`row-${rowIndex}`}
          className="flex gap-4 p-4 border-b last:border-b-0"
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={`cell-${rowIndex}-${colIndex}`}
              className="h-6 flex-1"
              style={{
                maxWidth: colIndex === 0 ? "150px" : undefined,
                // Vary widths slightly for more realistic appearance
                width: `${70 + Math.random() * 30}%`,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// Table Body Loading (for use inside table structure)
// ============================================================================

export interface TableLoadingBodyProps {
  /** Number of columns */
  columns: number;
  /** Number of rows */
  rows?: number;
}

export function TableLoadingBody({ columns, rows = 5 }: TableLoadingBodyProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={`loading-row-${rowIndex}`} className="border-b">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <td key={`loading-cell-${rowIndex}-${colIndex}`} className="p-4">
              <Skeleton className="h-6 w-full" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
