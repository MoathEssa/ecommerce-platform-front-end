/**
 * useDebouncedValue Hook
 * Debounces a value for performance optimization
 */

import { useState, useEffect, useRef } from "react";
import { DEBOUNCE_DELAYS } from "../constants";

// ============================================================================
// Types
// ============================================================================

export interface UseDebouncedValueOptions {
  /** Delay in milliseconds */
  delay?: number;
  /** Leading edge trigger */
  leading?: boolean;
}

// ============================================================================
// Hook Implementation
// ============================================================================

/**
 * Hook that debounces a value
 * Useful for search inputs, filter changes, etc.
 */
export function useDebouncedValue<T>(
  value: T,
  options: UseDebouncedValueOptions = {},
): T {
  const { delay = DEBOUNCE_DELAYS.globalFilter, leading = false } = options;

  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // On first render with leading=true, update immediately
    if (isFirstRender.current && leading) {
      isFirstRender.current = false;
      setDebouncedValue(value);
      return;
    }

    isFirstRender.current = false;

    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay, leading]);

  return debouncedValue;
}

/**
 * Hook that returns a debounced callback
 */
export function useDebouncedCallback<
  T extends (...args: Parameters<T>) => ReturnType<T>,
>(callback: T, delay: number = DEBOUNCE_DELAYS.globalFilter): T {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const callbackRef = useRef(callback);

  // Update callback ref on each render
  callbackRef.current = callback;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return ((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callbackRef.current(...args);
    }, delay);
  }) as T;
}
