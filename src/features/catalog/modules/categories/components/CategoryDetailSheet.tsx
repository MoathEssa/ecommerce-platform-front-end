import { ChevronRight, ImageOff } from "lucide-react";

import type { CategoryTreeDto, FlatCategory } from "../types";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@shared/ui/sheet";
import { Badge } from "@shared/ui/badge";
import { Separator } from "@shared/ui/separator";

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildAncestorChain(
  tree: CategoryTreeDto[],
  targetId: number,
  chain: string[] = [],
): string[] | null {
  for (const node of tree) {
    const current = [...chain, node.name];
    if (node.id === targetId) return current;
    const found = buildAncestorChain(node.children, targetId, current);
    if (found) return found;
  }
  return null;
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface CategoryDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: FlatCategory | null;
  tree: CategoryTreeDto[];
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function CategoryDetailSheet({
  open,
  onOpenChange,
  category,
  tree,
}: CategoryDetailSheetProps) {
  if (!category) return null;

  const ancestors = buildAncestorChain(tree, category.id) ?? [category.name];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle>Category Details</SheetTitle>
        </SheetHeader>

        {/* Image */}
        <div className="mb-6 rounded-lg border overflow-hidden bg-muted/30 flex items-center justify-center h-48">
          {category.imageUrl ? (
            <img
              src={category.imageUrl}
              alt={category.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <ImageOff className="h-8 w-8" />
              <span className="text-xs">No image</span>
            </div>
          )}
        </div>

        {/* Breadcrumb path */}
        <div className="mb-4">
          <p className="text-xs text-muted-foreground mb-1.5 uppercase tracking-wide font-medium">
            Path
          </p>
          <div className="flex items-center flex-wrap gap-1">
            {ancestors.map((name, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && (
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                )}
                <span
                  className={
                    i === ancestors.length - 1
                      ? "text-sm font-semibold"
                      : "text-sm text-muted-foreground"
                  }
                >
                  {name}
                </span>
              </span>
            ))}
          </div>
        </div>

        <Separator className="my-4" />

        {/* Fields */}
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Name</dt>
            <dd className="font-medium text-right">{category.name}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Slug</dt>
            <dd className="font-mono text-xs text-right">{category.slug}</dd>
          </div>
          {category.description && (
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground">Description</dt>
              <dd className="text-sm">{category.description}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Status</dt>
            <dd>
              {category.isActive !== false ? (
                <Badge variant="default" className="text-xs">
                  Active
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-xs">
                  Inactive
                </Badge>
              )}
            </dd>
          </div>
          {category.sortOrder !== undefined && (
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Sort Order</dt>
              <dd className="font-medium">{category.sortOrder}</dd>
            </div>
          )}
          {category.createdAt && (
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Created</dt>
              <dd className="text-xs">
                {new Date(category.createdAt).toLocaleDateString()}
              </dd>
            </div>
          )}
          {category.updatedAt && (
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Updated</dt>
              <dd className="text-xs">
                {new Date(category.updatedAt).toLocaleDateString()}
              </dd>
            </div>
          )}
        </dl>
      </SheetContent>
    </Sheet>
  );
}
