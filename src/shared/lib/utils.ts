import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Extracts the most useful human-readable error message from an RTK Query
 * error. The backend returns `{ message, errors[] }` — prefer the first
 * entry in `errors` (specific validation detail) over the generic `message`.
 */
export function extractApiError(
  err: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  const body = (err as { data?: { message?: string; errors?: string[] } })
    ?.data;
  if (body?.errors?.length) return body.errors[0];
  if (body?.message) return body.message;
  return fallback;
}
