/**
 * Default Error Fallback Component
 * Displays error information with retry option
 */

import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

// ============================================================================
// Types
// ============================================================================

export interface DefaultErrorFallbackProps {
  error: Error;
  onReset: () => void;
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

export function DefaultErrorFallback({
  error,
  onReset,
  className,
}: DefaultErrorFallbackProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 border border-destructive/20 rounded-lg bg-destructive/5",
        className,
      )}
    >
      <AlertCircle className="h-12 w-12 text-destructive mb-4" />
      <h3 className="text-lg font-semibold text-destructive mb-2">
        Something went wrong
      </h3>
      <p className="text-sm text-muted-foreground text-center mb-4 max-w-md">
        An error occurred while rendering the data table. This might be due to
        invalid data or a configuration issue.
      </p>
      {import.meta.env.DEV && (
        <details className="text-xs text-muted-foreground mb-4 max-w-md">
          <summary className="cursor-pointer hover:text-foreground">
            Error details
          </summary>
          <pre className="mt-2 p-2 bg-muted rounded text-left overflow-auto max-h-32">
            {error.message}
            {error.stack && (
              <>
                {"\n\n"}
                {error.stack}
              </>
            )}
          </pre>
        </details>
      )}
      <Button onClick={onReset} variant="outline" className="gap-2">
        <RefreshCw className="h-4 w-4" />
        Try again
      </Button>
    </div>
  );
}
