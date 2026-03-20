import { useMemo, useState } from "react";
import {
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  CheckCircle,
  Download,
  Search,
  Tag,
  Layers,
} from "lucide-react";

import type { CjCategoryNodeDto, CjImportCategoryPayload } from "../types";
import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import { Badge } from "@shared/ui/badge";
import { Skeleton } from "@shared/ui/skeleton";
import { cn } from "@shared/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

interface FlatLeaf {
  categoryId: string;
  name: string;
  level1Id: string | null;
  level1Name: string;
  level2Id: string | null;
  level2Name: string;
  isImported: boolean;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function flattenLeaves(tree: CjCategoryNodeDto[]): FlatLeaf[] {
  const rows: FlatLeaf[] = [];
  for (const l1 of tree) {
    for (const l2 of l1.children) {
      for (const l3 of l2.children) {
        if (l3.categoryId) {
          rows.push({
            categoryId: l3.categoryId,
            name: l3.name,
            level1Id: l1.categoryId ?? null,
            level1Name: l1.name,
            level2Id: l2.categoryId ?? null,
            level2Name: l2.name,
            isImported: l3.isImported ?? false,
          });
        }
      }
    }
  }
  return rows;
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function TreeSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="rounded-lg border overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 bg-muted/40">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-40 rounded" />
            <Skeleton className="h-5 w-20 rounded ml-auto" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Flat search row ───────────────────────────────────────────────────────────

function FlatLeafRow({
  row,
  onImport,
}: {
  row: FlatLeaf;
  onImport: (payload: CjImportCategoryPayload) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b last:border-0 hover:bg-muted/30 transition-colors">
      <div className="min-w-0 flex-1">
        <span className="font-medium text-sm">{row.name}</span>
        <span className="text-muted-foreground text-xs ml-2">
          {row.level1Name} → {row.level2Name}
        </span>
      </div>
      <code className="text-xs bg-muted px-1.5 py-0.5 rounded hidden sm:block shrink-0 max-w-50 truncate">
        {row.categoryId}
      </code>
      <Button
        variant="outline"
        size="sm"
        className="h-7 gap-1.5 text-xs shrink-0"
        disabled={row.isImported}
        onClick={() =>
          !row.isImported &&
          onImport({
            leafId: row.categoryId,
            leafName: row.name,
            level1Id: row.level1Id,
            level1Name: row.level1Name,
            level2Id: row.level2Id,
            level2Name: row.level2Name,
            targetLevel: 3,
          })
        }
      >
        {row.isImported ? (
          <>
            <CheckCircle className="h-3 w-3" />
            Imported
          </>
        ) : (
          <>
            <Download className="h-3 w-3" />
            Import
          </>
        )}
      </Button>
    </div>
  );
}

// ── L3 leaf row ───────────────────────────────────────────────────────────────

function LeafRow({
  node,
  l1Name,
  l2Name,
  l1Id,
  l2Id,
  onImport,
}: {
  node: CjCategoryNodeDto;
  l1Name: string;
  l2Name: string;
  l1Id: string | null;
  l2Id: string | null;
  onImport: (payload: CjImportCategoryPayload) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 pl-10 pr-4 py-2 border-b last:border-0 hover:bg-muted/20 transition-colors">
      <div className="flex items-center gap-2 min-w-0">
        <Tag className="h-3 w-3 text-muted-foreground shrink-0" />
        <span className="text-sm truncate">{node.name}</span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {node.categoryId && (
          <code className="text-xs bg-muted px-1.5 py-0.5 rounded hidden md:block max-w-45 truncate">
            {node.categoryId}
          </code>
        )}
        <Button
          variant="outline"
          size="sm"
          className="h-7 gap-1.5 text-xs"
          disabled={!node.categoryId || node.isImported}
          onClick={() =>
            node.categoryId &&
            !node.isImported &&
            onImport({
              leafId: node.categoryId,
              leafName: node.name,
              level1Id: l1Id,
              level1Name: l1Name,
              level2Id: l2Id,
              level2Name: l2Name,
              targetLevel: 3,
            })
          }
        >
          {node.isImported ? (
            <>
              <CheckCircle className="h-3 w-3" />
              Imported
            </>
          ) : (
            <>
              <Download className="h-3 w-3" />
              Import
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

// ── L2 collapsible group ──────────────────────────────────────────────────────

function Level2Group({
  node,
  l1Name,
  l1Id,
  onImport,
}: {
  node: CjCategoryNodeDto;
  l1Name: string;
  l1Id: string | null;
  onImport: (payload: CjImportCategoryPayload) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b last:border-0">
      <div className="flex w-full items-center gap-2 px-6 py-2 text-sm hover:bg-muted/30 transition-colors select-none">
        <button
          className="flex flex-1 items-center gap-2 min-w-0"
          onClick={() => setOpen((v) => !v)}
        >
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 text-muted-foreground transition-transform shrink-0",
              open ? "rotate-0" : "-rotate-90",
            )}
          />
          <Layers className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span className="font-medium truncate">{node.name}</span>
          <Badge
            variant="secondary"
            className="ml-2 text-xs font-normal shrink-0"
          >
            {node.children.length}
          </Badge>
        </button>
        <Button
          variant="outline"
          size="sm"
          className="h-6 gap-1 text-xs shrink-0"
          disabled={!node.categoryId || node.isImported}
          onClick={() =>
            node.categoryId &&
            !node.isImported &&
            onImport({
              leafId: node.categoryId,
              leafName: node.name,
              level1Id: l1Id,
              level1Name: l1Name,
              level2Id: null,
              level2Name: "",
              targetLevel: 2,
              subtreeChildren: node.children,
            })
          }
        >
          {node.isImported ? (
            <>
              <CheckCircle className="h-3 w-3" />
              Imported
            </>
          ) : (
            <>
              <Download className="h-3 w-3" />
              Import
            </>
          )}
        </Button>
      </div>

      {open && (
        <div className="bg-muted/10">
          {node.children.map((leaf) => (
            <LeafRow
              key={leaf.name}
              node={leaf}
              l1Name={l1Name}
              l1Id={l1Id}
              l2Name={node.name}
              l2Id={node.categoryId ?? null}
              onImport={onImport}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── L1 collapsible section ────────────────────────────────────────────────────

function Level1Section({
  node,
  onImport,
}: {
  node: CjCategoryNodeDto;
  onImport: (payload: CjImportCategoryPayload) => void;
}) {
  const [open, setOpen] = useState(false);
  const totalLeaves = node.children.reduce(
    (sum, l2) => sum + l2.children.length,
    0,
  );

  return (
    <div className="rounded-lg border overflow-hidden">
      <div className="flex w-full items-center gap-3 px-4 py-3 bg-muted/40 hover:bg-muted/60 transition-colors select-none">
        <button
          className="flex flex-1 items-center gap-3 min-w-0"
          onClick={() => setOpen((v) => !v)}
        >
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform shrink-0",
              open ? "rotate-0" : "-rotate-90",
            )}
          />
          <span className="font-semibold text-sm truncate">{node.name}</span>
          <div className="flex items-center gap-1.5 ml-auto shrink-0">
            <Badge variant="outline" className="text-xs font-normal">
              {node.children.length} sub-categories
            </Badge>
            <Badge variant="secondary" className="text-xs font-normal">
              {totalLeaves} items
            </Badge>
          </div>
        </button>
        <Button
          variant="outline"
          size="sm"
          className="h-7 gap-1.5 text-xs shrink-0"
          disabled={!node.categoryId || node.isImported}
          onClick={() =>
            node.categoryId &&
            !node.isImported &&
            onImport({
              leafId: node.categoryId,
              leafName: node.name,
              level1Id: null,
              level1Name: "",
              level2Id: null,
              level2Name: "",
              targetLevel: 1,
              subtreeChildren: node.children,
            })
          }
        >
          {node.isImported ? (
            <>
              <CheckCircle className="h-3.5 w-3.5" />
              Imported
            </>
          ) : (
            <>
              <Download className="h-3.5 w-3.5" />
              Import
            </>
          )}
        </Button>
      </div>

      {open && (
        <div>
          {node.children.map((l2) => (
            <Level2Group
              key={l2.name}
              node={l2}
              l1Name={node.name}
              l1Id={node.categoryId ?? null}
              onImport={onImport}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface CjCategoryTreeProps {
  tree: CjCategoryNodeDto[];
  isLoading: boolean;
  isError: boolean;
  /** Called when the user clicks Import on a leaf category */
  onImport: (payload: CjImportCategoryPayload) => void;
}

// ── Page-size constant ────────────────────────────────────────────────────────

const L1_PAGE_SIZE = 10;

// ── Component ─────────────────────────────────────────────────────────────────

export function CjCategoryTree({
  tree,
  isLoading,
  isError,
  onImport,
}: CjCategoryTreeProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Flat search results
  const searchResults = useMemo(() => {
    if (!search.trim()) return null;
    const q = search.toLowerCase();
    return flattenLeaves(tree).filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.level1Name.toLowerCase().includes(q) ||
        r.level2Name.toLowerCase().includes(q) ||
        r.categoryId.toLowerCase().includes(q),
    );
  }, [tree, search]);

  // Paginated L1 list (tree mode)
  const pagedL1 = useMemo(() => {
    if (searchResults !== null) return [];
    const start = (page - 1) * L1_PAGE_SIZE;
    return tree.slice(start, start + L1_PAGE_SIZE);
  }, [tree, page, searchResults]);

  const totalPages = Math.ceil(tree.length / L1_PAGE_SIZE);

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search all categories…"
          className="pl-9"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* Error */}
      {isError && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          Failed to load CJ categories. Ensure the CJ supplier credentials are
          configured and the access token is valid.
        </div>
      )}

      {/* Loading skeleton */}
      {isLoading && <TreeSkeleton />}

      {/* Search results — flat list */}
      {!isLoading && !isError && searchResults !== null && (
        <>
          <div className="rounded-lg border overflow-hidden">
            {searchResults.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground text-sm">
                No categories match your search.
              </p>
            ) : (
              searchResults.map((row) => (
                <FlatLeafRow
                  key={row.categoryId}
                  row={row}
                  onImport={onImport}
                />
              ))
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {searchResults.length} result
            {searchResults.length !== 1 ? "s" : ""} found
          </p>
        </>
      )}

      {/* Tree view with pagination */}
      {!isLoading && !isError && searchResults === null && (
        <>
          <div className="space-y-3">
            {pagedL1.map((node) => (
              <Level1Section key={node.name} node={node} onImport={onImport} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Page {page} of {totalPages} ({tree.length} top-level categories)
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
