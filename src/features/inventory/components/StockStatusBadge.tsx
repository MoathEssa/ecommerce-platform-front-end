import { Badge } from "@shared/ui/badge";
import { cn } from "@shared/lib/utils";
import type { StockStatus } from "../types";

const config: Record<StockStatus, { label: string; className: string }> = {
  inStock: {
    label: "In Stock",
    className:
      "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
  },
  lowStock: {
    label: "Low Stock",
    className:
      "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
  },
  outOfStock: {
    label: "Out of Stock",
    className:
      "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
  },
};

interface Props {
  status: StockStatus;
  className?: string;
}

export default function StockStatusBadge({ status, className }: Props) {
  const cfg = config[status] ?? config.outOfStock;
  return (
    <Badge variant="outline" className={cn(cfg.className, className)}>
      {cfg.label}
    </Badge>
  );
}
