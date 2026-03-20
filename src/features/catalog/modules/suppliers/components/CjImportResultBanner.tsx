import { CheckCircle2, AlertCircle, XCircle, X } from "lucide-react";
import { cn } from "@shared/lib/utils";

export type ImportStatus =
  | "success"
  | "category_missing"
  | "duplicate"
  | "error";

export interface ImportResult {
  status: ImportStatus;
  productName: string;
  message: string;
  /** Only set for success: the new store product ID */
  productId?: number;
}

interface CjImportToastProps {
  result: ImportResult;
  onDismiss: () => void;
}

const CONFIG: Record<
  ImportStatus,
  { icon: React.ElementType; color: string; title: string }
> = {
  success: {
    icon: CheckCircle2,
    color: "text-green-600 dark:text-green-400",
    title: "Imported successfully",
  },
  category_missing: {
    icon: AlertCircle,
    color: "text-amber-600 dark:text-amber-400",
    title: "Category not mapped",
  },
  duplicate: {
    icon: AlertCircle,
    color: "text-blue-600 dark:text-blue-400",
    title: "Already imported",
  },
  error: {
    icon: XCircle,
    color: "text-destructive",
    title: "Import failed",
  },
};

export function CjImportResultBanner({
  result,
  onDismiss,
}: CjImportToastProps) {
  const { icon: Icon, color, title } = CONFIG[result.status];

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border p-4 text-sm relative",
        result.status === "success" &&
          "border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-950/40",
        result.status === "category_missing" &&
          "border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/40",
        result.status === "duplicate" &&
          "border-blue-300 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/40",
        result.status === "error" && "border-destructive/40 bg-destructive/5",
      )}
    >
      <Icon className={cn("h-4 w-4 mt-0.5 shrink-0", color)} />
      <div className="flex-1 min-w-0">
        <p className={cn("font-semibold", color)}>{title}</p>
        <p className="text-muted-foreground mt-0.5 leading-snug">
          {result.message}
        </p>
      </div>
      <button
        onClick={onDismiss}
        className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
