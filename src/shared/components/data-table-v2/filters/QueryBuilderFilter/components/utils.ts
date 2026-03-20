/**
 * Shadcn UI Components for React Query Builder
 * Split into separate files for better maintainability
 * This file contains shared utilities and helper functions
 */

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Check if option is an OptionGroup
 */
export function isOptionGroup(
  option: unknown,
): option is { label: string; options: unknown[] } {
  return (
    typeof option === "object" &&
    option !== null &&
    "options" in option &&
    Array.isArray((option as { options: unknown[] }).options)
  );
}

/**
 * Get option value/name
 */
export function getOptionValue(option: unknown): string {
  if (typeof option === "string") return option;
  if (
    typeof option === "object" &&
    option !== null &&
    "name" in option &&
    typeof (option as { name: unknown }).name === "string"
  ) {
    return (option as { name: string }).name;
  }
  if (
    typeof option === "object" &&
    option !== null &&
    "value" in option &&
    typeof (option as { value: unknown }).value === "string"
  ) {
    return (option as { value: string }).value;
  }
  return String(option);
}

/**
 * Get option label
 */
export function getOptionLabel(option: unknown): string {
  if (typeof option === "string") return option;
  if (
    typeof option === "object" &&
    option !== null &&
    "label" in option &&
    typeof (option as { label: unknown }).label === "string"
  ) {
    return (option as { label: string }).label;
  }
  return getOptionValue(option);
}

/**
 * Flatten options array (handle option groups)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function flattenOptions(options: any[]): any[] {
  return options.flatMap((opt) => (isOptionGroup(opt) ? opt.options : [opt]));
}
