import { Plus, Pencil } from "lucide-react";
import type { CategoryTreeDto } from "../types";
import { findNode, type CascadeLevel } from "../utils/categoryUtils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/ui/select";
import { Button } from "@shared/ui/button";

const ADD_NEW_VALUE = "__add_new__";

export type { CascadeLevel };

// ── Props ─────────────────────────────────────────────────────────────────────

interface CategoryCascadeSelectorProps {
  levels: CascadeLevel[];
  onLevelsChange: (levels: CascadeLevel[]) => void;
  onEditNode: (id: number) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function CategoryCascadeSelector({
  levels,
  onLevelsChange,
  onEditNode,
}: CategoryCascadeSelectorProps) {
  function handleSelect(levelIndex: number, rawValue: string) {
    const isAddNew = rawValue === ADD_NEW_VALUE;
    const selectedId = isAddNew ? null : Number(rawValue);

    let children: CategoryTreeDto[] = [];
    if (!isAddNew && selectedId !== null) {
      const node = findNode(levels[levelIndex].options, selectedId);
      children = node?.children ?? [];
    }

    const updated: CascadeLevel[] = [
      ...levels.slice(0, levelIndex),
      { ...levels[levelIndex], selectedId },
    ];

    if (!isAddNew && children.length > 0) {
      updated.push({ selectedId: null, options: children });
    }

    onLevelsChange(updated);
  }

  return (
    <div className="space-y-3">
      {levels.map((level, i) => {
        const selectValue =
          level.selectedId === null
            ? ADD_NEW_VALUE
            : level.selectedId.toString();

        return (
          <div key={i} className="flex items-center gap-2">
            {i > 0 && (
              <div
                className="shrink-0 border-l-2 border-muted-foreground/20"
                style={{ width: `${i * 16}px`, height: "36px" }}
              />
            )}

            <Select
              value={selectValue}
              onValueChange={(val) => handleSelect(i, val)}
            >
              <SelectTrigger className="flex-1">
                <SelectValue
                  placeholder={
                    i === 0
                      ? "Select root category or add new…"
                      : "Select subcategory or add new…"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ADD_NEW_VALUE}>
                  <span className="flex items-center gap-2 text-primary font-medium">
                    <Plus className="h-3.5 w-3.5" />
                    Add new category here
                  </span>
                </SelectItem>
                {level.options.map((opt) => (
                  <SelectItem key={opt.id} value={opt.id.toString()}>
                    <span className="flex items-center gap-3">
                      <span>
                        {opt.name}
                        {opt.children.length > 0 && (
                          <span className="ml-1.5 text-muted-foreground text-xs">
                            ({opt.children.length})
                          </span>
                        )}
                      </span>
                      <span className="ml-auto text-muted-foreground text-xs tabular-nums">
                        #{opt.sortOrder}
                      </span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {level.selectedId !== null && (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => onEditNode(level.selectedId!)}
                title={`Edit ${findNode(level.options, level.selectedId)?.name ?? ""}`}
              >
                <Pencil className="h-3.5 w-3.5" />
                <span className="sr-only">Edit</span>
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}
