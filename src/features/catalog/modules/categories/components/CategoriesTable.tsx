import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";
import { ChevronRight, Eye, Pencil, Trash2 } from "lucide-react";

import { useAdminGetCategoriesQuery } from "@features/catalog/api/catalogApi";
import type { FlatCategory } from "../types";
import { adminFlatToTree, flattenTree } from "../utils/categoryUtils";

import { DataTableV2 } from "@shared/components/data-table-v2";
import { Button } from "@shared/ui/button";
import { Badge } from "@shared/ui/badge";
import { cn } from "@shared/lib/utils";

// -- Helpers -------------------------------------------------------------------

/** Returns only the rows that should be rendered given the current expansion state */
function computeVisibleRows(
  flatData: FlatCategory[],
  expandedIds: Set<number>,
): FlatCategory[] {
  const hidden = new Set<number>();
  const result: FlatCategory[] = [];
  for (const row of flatData) {
    if (
      row.parentId != null &&
      (hidden.has(row.parentId) || !expandedIds.has(row.parentId))
    ) {
      hidden.add(row.id);
    } else {
      result.push(row);
    }
  }
  return result;
}

// -- Props --------------------------------------------------------------------

interface CategoriesTableProps {
  onViewDetails: (category: FlatCategory) => void;
  onDelete: (category: FlatCategory) => void;
  /** When true (default) rows are shown in tree order with expand/collapse.
   *  When false all rows are shown flat -- full sorting and filtering work. */
  hierarchy?: boolean;
}

// -- Component ----------------------------------------------------------------

export default function CategoriesTable({
  onViewDetails,
  onDelete,
  hierarchy = true,
}: CategoriesTableProps) {
  const navigate = useNavigate();
  const { data: adminCats = [], isLoading } = useAdminGetCategoriesQuery();

  // Flatten tree once; this is the source of truth for all modes
  const flatData = useMemo(
    () => flattenTree(adminFlatToTree(adminCats)),
    [adminCats],
  );

  // Set of IDs that have at least one child (needed for chevron visibility)
  const hasChildrenSet = useMemo(
    () =>
      new Set(
        flatData.filter((r) => r.parentId != null).map((r) => r.parentId!),
      ),
    [flatData],
  );

  // Expansion state -- root nodes start expanded
  const [expandedIds, setExpandedIds] = useState<Set<number>>(
    () => new Set(flatData.filter((r) => r.depth === 0).map((r) => r.id)),
  );

  function toggleExpand(id: number) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  // Data passed to the table varies by mode
  const tableData = useMemo(
    () => (hierarchy ? computeVisibleRows(flatData, expandedIds) : flatData),
    [flatData, expandedIds, hierarchy],
  );

  // -- Column definitions ------------------------------------------------------

  const columns: ColumnDef<FlatCategory>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        // In hierarchy mode disable table-level sorting (visual order IS the order)
        enableSorting: !hierarchy,
        meta: { label: "Name", filterable: true, sortable: !hierarchy },
        cell: ({ row }) => {
          const cat = row.original;
          const isExpanded = expandedIds.has(cat.id);
          const hasKids = hasChildrenSet.has(cat.id);
          return (
            <div
              className="flex items-center gap-1"
              style={
                hierarchy ? { paddingLeft: `${cat.depth * 20}px` } : undefined
              }
            >
              {hierarchy && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpand(cat.id);
                  }}
                  className={cn(
                    "shrink-0 rounded p-0.5 text-muted-foreground transition-colors",
                    hasKids
                      ? "hover:text-foreground hover:bg-muted"
                      : "pointer-events-none opacity-0",
                  )}
                  aria-label={isExpanded ? "Collapse" : "Expand"}
                >
                  <ChevronRight
                    className={cn(
                      "h-3.5 w-3.5 transition-transform",
                      isExpanded && "rotate-90",
                    )}
                  />
                </button>
              )}
              <span className="font-medium text-sm">{cat.name}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "slug",
        header: "Slug",
        meta: { label: "Slug", filterable: true, sortable: true },
        cell: ({ row }) => (
          <span className="font-mono text-xs text-muted-foreground">
            {row.original.slug}
          </span>
        ),
      },
      {
        accessorKey: "parentName",
        header: "Parent",
        meta: { label: "Parent", filterable: true, sortable: true },
        cell: ({ row }) =>
          row.original.parentName ? (
            <Badge variant="secondary" className="text-xs">
              {row.original.parentName}
            </Badge>
          ) : (
            <span className="text-muted-foreground text-xs">Root</span>
          ),
      },
      {
        id: "actions",
        header: "",
        enableSorting: false,
        enableColumnFilter: false,
        enableHiding: false,
        cell: ({ row }) => {
          const cat = row.original;
          return (
            <div className="flex items-center gap-1 justify-end">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => onViewDetails(cat)}
                title="View details"
              >
                <Eye className="h-3.5 w-3.5" />
                <span className="sr-only">View details</span>
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() =>
                  navigate(`/catalog/categories/manage?id=${cat.id}`)
                }
                title="Edit"
              >
                <Pencil className="h-3.5 w-3.5" />
                <span className="sr-only">Edit</span>
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-destructive hover:text-destructive"
                onClick={() => onDelete(cat)}
                title="Delete"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hierarchy, expandedIds, hasChildrenSet],
  );

  return (
    <DataTableV2
      data={tableData}
      columns={columns}
      isLoading={isLoading}
      config={{
        filterMode: "client",
        enableAdvancedFilter: false,
      }}
      showToolbar
      showQuickSearch
      showPagination
      showColumnVisibility
    />
  );
}
