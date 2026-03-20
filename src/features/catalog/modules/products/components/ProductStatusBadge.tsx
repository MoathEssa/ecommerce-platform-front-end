import type { ProductStatus } from "../types";
import { Badge } from "@shared/ui/badge";
import { cn } from "@shared/lib/utils";

const config: Record<ProductStatus, { label: string; className: string }> = {
  1: {
    label: "Draft",
    className:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  2: {
    label: "Active",
    className:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  },
  3: {
    label: "Archived",
    className: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  },
};

interface ProductStatusBadgeProps {
  status: ProductStatus;
  className?: string;
}

export default function ProductStatusBadge({
  status,
  className,
}: ProductStatusBadgeProps) {
  const { label, className: colorClass } = config[status] ?? config[1];
  return (
    <Badge className={cn("capitalize border-0", colorClass, className)}>
      {label}
    </Badge>
  );
}
