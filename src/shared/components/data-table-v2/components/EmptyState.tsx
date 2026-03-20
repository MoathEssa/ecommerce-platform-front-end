/**
 * Empty State Component
 * Displayed when table has no data
 */

import { FileQuestion } from "lucide-react";
import { cn } from "@/shared/lib/utils";

// ============================================================================
// Types
// ============================================================================

export interface EmptyStateProps {
  /** Title text */
  title?: string;
  /** Description text */
  description?: string;
  /** Custom icon */
  icon?: React.ReactNode;
  /** Action button/content */
  action?: React.ReactNode;
  /** Additional CSS class */
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

export function EmptyState({
  title = "No results found",
  description = "Try adjusting your search or filter to find what you're looking for.",
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center w-full py-16 px-4 text-center",
        className,
      )}
    >
      {icon ?? (
        <FileQuestion className="h-16 w-16 text-muted-foreground/40 mb-4" />
      )}
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-md">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
