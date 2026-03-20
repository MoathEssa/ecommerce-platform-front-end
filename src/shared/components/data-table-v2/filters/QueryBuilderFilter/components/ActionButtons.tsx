/**
 * Action Buttons Components
 * Add, remove, clone buttons for query builder rules and groups
 */

import type { ActionWithRulesAndAddersProps } from "react-querybuilder";
import { Button } from "@/shared/ui/button";
import { Trash2, Plus, Copy } from "lucide-react";
import { cn } from "@/shared/lib/utils";

// ============================================================================
// Add Rule Action
// ============================================================================

export function AddRuleAction({
  handleOnClick,
  disabled,
  className,
  label,
  title,
}: ActionWithRulesAndAddersProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleOnClick}
      disabled={disabled}
      className={cn("h-8 gap-1", className)}
      title={title}
    >
      <Plus className="h-3.5 w-3.5" />
      {label}
    </Button>
  );
}

// ============================================================================
// Add Group Action
// ============================================================================

export function AddGroupAction({
  handleOnClick,
  disabled,
  className,
  label,
  title,
}: ActionWithRulesAndAddersProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleOnClick}
      disabled={disabled}
      className={cn("h-8 gap-1", className)}
      title={title}
    >
      <Plus className="h-3.5 w-3.5" />
      {label}
    </Button>
  );
}

// ============================================================================
// Remove Rule Action
// ============================================================================

export function RemoveRuleAction({
  handleOnClick,
  disabled,
  className,
  title,
}: ActionWithRulesAndAddersProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleOnClick}
      disabled={disabled}
      className={cn(
        "h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10",
        className,
      )}
      title={title}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}

// ============================================================================
// Remove Group Action
// ============================================================================

export function RemoveGroupAction({
  handleOnClick,
  disabled,
  className,
  title,
}: ActionWithRulesAndAddersProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleOnClick}
      disabled={disabled}
      className={cn(
        "h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10",
        className,
      )}
      title={title}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}

// ============================================================================
// Clone Rule Action
// ============================================================================

export function CloneRuleAction({
  handleOnClick,
  disabled,
  className,
  title,
}: ActionWithRulesAndAddersProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleOnClick}
      disabled={disabled}
      className={cn("h-8 w-8 p-0", className)}
      title={title}
    >
      <Copy className="h-4 w-4" />
    </Button>
  );
}

// ============================================================================
// Clone Group Action
// ============================================================================

export function CloneGroupAction({
  handleOnClick,
  disabled,
  className,
  title,
}: ActionWithRulesAndAddersProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleOnClick}
      disabled={disabled}
      className={cn("h-8 w-8 p-0", className)}
      title={title}
    >
      <Copy className="h-4 w-4" />
    </Button>
  );
}
