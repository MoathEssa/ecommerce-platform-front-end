import { Separator } from "@shared/ui/separator";
import { Badge } from "@shared/ui/badge";
import { Skeleton } from "@shared/ui/skeleton";

import CategoryCascadeSelector, {
  type CascadeLevel,
} from "./CategoryCascadeSelector";

// ── Props ─────────────────────────────────────────────────────────────────────

interface CascadeSelectorPanelProps {
  levels: CascadeLevel[];
  onLevelsChange: (levels: CascadeLevel[]) => void;
  onEditNode: (id: number) => void;
  treeLoading: boolean;
  breadcrumb: string[];
  formMode: "create" | "edit";
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function CascadeSelectorPanel({
  levels,
  onLevelsChange,
  onEditNode,
  treeLoading,
  breadcrumb,
  formMode,
}: CascadeSelectorPanelProps) {
  return (
    <div className="rounded-lg border p-5 space-y-4 h-fit">
      <div>
        <h2 className="text-sm font-semibold">Category Position</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Select where this category belongs in the hierarchy.
        </p>
      </div>

      {treeLoading ? (
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      ) : (
        <CategoryCascadeSelector
          levels={levels}
          onLevelsChange={onLevelsChange}
          onEditNode={onEditNode}
        />
      )}

      {/* Breadcrumb preview */}
      {breadcrumb.length > 0 && (
        <>
          <Separator />
          <div>
            <p className="text-xs text-muted-foreground mb-2">Current path:</p>
            <div className="flex flex-wrap gap-1 items-center">
              {breadcrumb.map((name, i) => (
                <span key={i} className="flex items-center gap-1">
                  {i > 0 && (
                    <span className="text-muted-foreground text-xs">›</span>
                  )}
                  <Badge variant="outline" className="text-xs font-normal">
                    {name}
                  </Badge>
                </span>
              ))}
              {formMode === "create" && (
                <>
                  {breadcrumb.length > 0 && (
                    <span className="text-muted-foreground text-xs">›</span>
                  )}
                  <Badge className="text-xs">New</Badge>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
