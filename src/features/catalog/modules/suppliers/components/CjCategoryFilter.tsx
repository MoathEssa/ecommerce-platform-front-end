import { useState, useMemo, useRef, useCallback } from "react";
import {
  ChevronDown,
  Check,
  AlertTriangle,
  Store,
  X,
  Search,
  Info,
} from "lucide-react";

import { useAdminGetCategoriesQuery } from "@features/catalog/api/catalogApi";
import { Popover, PopoverContent, PopoverTrigger } from "@shared/ui/popover";
import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import { Badge } from "@shared/ui/badge";
import { Separator } from "@shared/ui/separator";

// ── Types ─────────────────────────────────────────────────────────────────────

interface CjCategoryFilterProps {
  /** The currently active CJ category ID (externalCategoryId) */
  value: string | undefined;
  onChange: (categoryId: string | undefined) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function CjCategoryFilter({ value, onChange }: CjCategoryFilterProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: allCategories = [], isLoading } = useAdminGetCategoriesQuery();

  // Only CJ-mapped leaf categories (externalCategoryId present + supplier = 1)
  const cjMapped = useMemo(
    () => allCategories.filter((c) => c.externalCategoryId && c.supplier === 1),
    [allCategories],
  );

  // IDs of imported CJ categories that have at least one child → they are L1/L2 parents
  const cjParentIds = useMemo(() => {
    const allParentIds = new Set(
      allCategories.map((c) => c.parentId).filter(Boolean),
    );
    return new Set(
      cjMapped.filter((c) => allParentIds.has(c.id)).map((c) => c.id),
    );
  }, [cjMapped, allCategories]);

  // Build a name-lookup map for parent display
  const nameById = useMemo(
    () => new Map(allCategories.map((c) => [c.id, c.name])),
    [allCategories],
  );

  // Filtered list based on search input
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return cjMapped;
    return cjMapped.filter((c) => {
      const parentName = c.parentId ? (nameById.get(c.parentId) ?? "") : "";
      return (
        c.name.toLowerCase().includes(q) ||
        parentName.toLowerCase().includes(q) ||
        (c.externalCategoryId ?? "").toLowerCase().includes(q)
      );
    });
  }, [cjMapped, search, nameById]);

  // Resolve a display label for the current value
  const activeCategory = useMemo(
    () => cjMapped.find((c) => c.externalCategoryId === value),
    [cjMapped, value],
  );

  // Focus input + reset search when popover opens/closes
  const handleOpenChange = useCallback((next: boolean) => {
    setOpen(next);
    if (!next) setSearch("");
    if (next) setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  function select(externalId: string) {
    onChange(externalId);
    setOpen(false);
  }

  function clear(e: React.MouseEvent) {
    e.stopPropagation();
    onChange(undefined);
  }

  function applyRaw() {
    const trimmed = search.trim();
    if (trimmed) {
      onChange(trimmed);
      setOpen(false);
    }
  }

  // ── Trigger label (inline to avoid component-in-render) ─────────────────

  const triggerContent = !value ? (
    <span className="text-muted-foreground">All categories</span>
  ) : activeCategory ? (
    <span className="flex items-center gap-1.5 truncate">
      <Store className="h-3 w-3 text-emerald-600 shrink-0" />
      <span className="truncate">
        {activeCategory.parentId && nameById.get(activeCategory.parentId) ? (
          <span className="text-muted-foreground">
            {nameById.get(activeCategory.parentId)} /{" "}
          </span>
        ) : null}
        {activeCategory.name}
      </span>
    </span>
  ) : (
    <span className="flex items-center gap-1.5 truncate">
      <AlertTriangle className="h-3 w-3 text-amber-500 shrink-0" />
      <span className="font-mono text-xs truncate">{value}</span>
    </span>
  );

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 w-52 justify-between gap-1 text-sm px-3"
        >
          <span className="flex-1 min-w-0 text-left truncate">
            {triggerContent}
          </span>
          <span className="flex items-center gap-0.5 shrink-0">
            {value && (
              <span
                role="button"
                tabIndex={0}
                onClick={clear}
                onKeyDown={(e) => e.key === "Enter" && clear(e as never)}
                className="rounded p-0.5 hover:bg-muted"
              >
                <X className="h-3 w-3" />
              </span>
            )}
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </span>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-auto min-w-72 max-w-96 p-0"
        sideOffset={4}
      >
        {/* Search */}
        <div className="flex items-center gap-2 px-3 py-2 border-b">
          <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <Input
            ref={inputRef}
            placeholder="Search categories…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && filtered.length === 0) applyRaw();
            }}
            className="h-7 border-0 px-0 text-sm focus-visible:ring-0 shadow-none"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Hint */}
        <div className="flex items-start gap-2 px-3 py-2 bg-muted/40 border-b">
          <Info className="h-3 w-3 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-[10px] text-muted-foreground leading-snug">
            Select a{" "}
            <span className="inline-flex items-center gap-0.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 align-middle" />
            </span>{" "}
            <strong>leaf category</strong> to browse CJ products by category.
            Parent categories won&apos;t match product imports.
          </p>
        </div>

        {/* In-store list */}
        <div className="max-h-56 overflow-y-auto">
          {isLoading ? (
            <div className="px-3 py-4 text-xs text-center text-muted-foreground">
              Loading…
            </div>
          ) : filtered.length > 0 ? (
            <>
              <div className="px-3 pt-2 pb-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Store className="h-3 w-3" />
                  In your store
                  <Badge
                    variant="secondary"
                    className="ml-1 h-3.5 px-1 text-[9px]"
                  >
                    {filtered.length}
                  </Badge>
                </span>
              </div>
              {filtered.map((cat) => {
                const parentName = cat.parentId
                  ? nameById.get(cat.parentId)
                  : null;
                const isSelected = cat.externalCategoryId === value;
                const isLeaf = !cjParentIds.has(cat.id);
                return (
                  <button
                    key={cat.id}
                    onClick={() => select(cat.externalCategoryId!)}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-left hover:bg-muted/60 transition-colors"
                  >
                    <Check
                      className={`h-3.5 w-3.5 shrink-0 text-emerald-600 ${isSelected ? "opacity-100" : "opacity-0"}`}
                    />
                    {/* Leaf indicator dot */}
                    <span
                      className={`h-2 w-2 rounded-full shrink-0 ${
                        isLeaf ? "bg-emerald-500" : "bg-muted-foreground/30"
                      }`}
                      title={
                        isLeaf
                          ? "Leaf category — use this for product filtering"
                          : "Parent category"
                      }
                    />
                    <span className="flex-1 min-w-0">
                      {parentName && (
                        <span className="text-xs text-muted-foreground">
                          {parentName} /{" "}
                        </span>
                      )}
                      <span className="text-sm">{cat.name}</span>
                    </span>
                    {!isLeaf && (
                      <Badge
                        variant="outline"
                        className="text-[9px] h-4 px-1 shrink-0 text-muted-foreground"
                      >
                        parent
                      </Badge>
                    )}
                    {!cat.isActive && (
                      <Badge
                        variant="outline"
                        className="text-[9px] h-4 px-1 shrink-0 text-muted-foreground"
                      >
                        draft
                      </Badge>
                    )}
                  </button>
                );
              })}
            </>
          ) : cjMapped.length === 0 ? (
            <div className="px-3 py-3 text-xs text-muted-foreground text-center">
              No CJ-mapped categories in your store yet.
            </div>
          ) : (
            <div className="px-3 py-2 text-xs text-muted-foreground text-center">
              No matches in store
            </div>
          )}
        </div>

        {/* Raw ID option — shown when typed text matches no in-store category */}
        {search.trim() && filtered.length === 0 && (
          <>
            <Separator />
            <div className="px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1 mb-1.5">
                <AlertTriangle className="h-3 w-3 text-amber-500" />
                Not in store
              </p>
              <button
                onClick={applyRaw}
                className="w-full flex items-center gap-2 rounded px-2 py-1.5 text-left hover:bg-muted/60 transition-colors border border-dashed border-amber-300 bg-amber-50/40 dark:bg-amber-950/20"
              >
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <span className="flex-1 min-w-0">
                  <span className="text-xs text-muted-foreground block">
                    Search CJ by this ID
                  </span>
                  <code className="text-xs font-mono truncate block">
                    {search.trim()}
                  </code>
                </span>
              </button>
            </div>
          </>
        )}

        {/* Raw ID option also shown when there ARE in-store results (discover mode) */}
        {search.trim() && filtered.length > 0 && (
          <>
            <Separator />
            <div className="px-3 py-2">
              <button
                onClick={applyRaw}
                className="w-full flex items-center gap-2 rounded px-2 py-1 text-left hover:bg-muted/60 transition-colors"
              >
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <span className="text-xs text-muted-foreground">
                  Use{" "}
                  <code className="font-mono text-foreground">
                    {search.trim()}
                  </code>{" "}
                  as raw CJ ID
                  <span className="ml-1 text-amber-600 font-medium">
                    · not in store
                  </span>
                </span>
              </button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
