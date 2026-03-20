/**
 * DataTable Error Boundary
 * Catches and handles errors in DataTableV2 components
 */

import { Component, type ErrorInfo, type ReactNode } from "react";
import { DefaultErrorFallback } from "./DefaultErrorFallback";

// ============================================================================
// Types
// ============================================================================

export interface DataTableErrorBoundaryProps {
  /** Child components */
  children: ReactNode;
  /** Custom fallback UI */
  fallback?: ReactNode;
  /** Custom error renderer */
  renderError?: (error: Error, reset: () => void) => ReactNode;
  /** Callback when error occurs */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** Additional CSS class for fallback */
  className?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

// ============================================================================
// Error Boundary Component
// ============================================================================

export class DataTableErrorBoundary extends Component<
  DataTableErrorBoundaryProps,
  State
> {
  constructor(props: DataTableErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error("DataTable Error:", error);
      console.error("Component Stack:", errorInfo.componentStack);
    }

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback, renderError, className } = this.props;

    if (hasError && error) {
      // Custom render function takes precedence
      if (renderError) {
        return renderError(error, this.handleReset);
      }

      // Custom fallback
      if (fallback) {
        return fallback;
      }

      // Default fallback
      return (
        <DefaultErrorFallback
          error={error}
          onReset={this.handleReset}
          className={className}
        />
      );
    }

    return children;
  }
}

// ============================================================================
// Hook for programmatic error handling
// ============================================================================

/**
 * Create an error handler that can be used with try-catch blocks
 */
export function createDataTableErrorHandler(onError?: (error: Error) => void) {
  return (error: unknown): void => {
    const errorObj = error instanceof Error ? error : new Error(String(error));

    if (import.meta.env.DEV) {
      console.error("DataTable Error:", errorObj);
    }

    onError?.(errorObj);
  };
}
