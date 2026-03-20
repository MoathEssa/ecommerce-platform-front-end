/**
 * Drag Handle Component
 * Visual drag handle for reordering rules and groups
 */

import { GripVertical } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface DragHandleProps {
  className?: string;
}

export function DragHandle({ className }: DragHandleProps) {
  return (
    <div className={cn("cursor-grab text-muted-foreground", className)}>
      <GripVertical className="h-4 w-4" />
    </div>
  );
}
