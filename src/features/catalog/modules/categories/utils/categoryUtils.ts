import type { AdminCategoryDto, CategoryTreeDto } from "../types";
import type { FlatCategory } from "../types";

// ── Admin → tree conversion ──────────────────────────────────────────────────

/**
 * Converts the flat AdminCategoryDto[] (from the admin endpoint, which returns
 * ALL categories regardless of isActive) into the nested CategoryTreeDto[] tree
 * shape required by flattenTree, buildLevelsForId, and the cascade selector.
 */
export function adminFlatToTree(flat: AdminCategoryDto[]): CategoryTreeDto[] {
  const map = new Map<number, CategoryTreeDto>();
  for (const dto of flat) {
    map.set(dto.id, {
      id: dto.id,
      name: dto.name,
      slug: dto.slug,
      imageUrl: dto.imageUrl,
      sortOrder: dto.sortOrder,
      children: [],
    });
  }
  const roots: CategoryTreeDto[] = [];
  for (const dto of flat) {
    const node = map.get(dto.id)!;
    if (dto.parentId != null && map.has(dto.parentId)) {
      map.get(dto.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }
  map.forEach((node) =>
    node.children.sort((a, b) => a.sortOrder - b.sortOrder),
  );
  return roots.sort((a, b) => a.sortOrder - b.sortOrder);
}

// ── Shared types ──────────────────────────────────────────────────────────────

export interface CascadeLevel {
  /** The category selected at this level, or null = "Add new here" */
  selectedId: number | null;
  /** The children shown in this level's select */
  options: CategoryTreeDto[];
}

// ── Tree helpers ──────────────────────────────────────────────────────────────

export function flattenTree(
  nodes: CategoryTreeDto[],
  parentId: number | null = null,
  parentName: string | undefined = undefined,
  depth = 0,
): FlatCategory[] {
  return nodes.flatMap((node) => [
    {
      id: node.id,
      name: node.name,
      slug: node.slug,
      imageUrl: node.imageUrl,
      parentId: parentId ?? null,
      parentName,
      depth,
    },
    ...flattenTree(node.children, node.id, node.name, depth + 1),
  ]);
}

export function findNode(
  nodes: CategoryTreeDto[],
  id: number,
): CategoryTreeDto | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    const found = findNode(node.children, id);
    if (found) return found;
  }
  return null;
}

/**
 * Given a category id, reconstruct the cascade levels by walking down
 * the tree. Returns the full level array with each level's options and
 * selectedId set correctly.
 */
export function buildLevelsForId(
  tree: CategoryTreeDto[],
  targetId: number,
): CascadeLevel[] {
  function walk(
    nodes: CategoryTreeDto[],
    id: number,
    accumulated: CascadeLevel[],
  ): CascadeLevel[] | null {
    for (const node of nodes) {
      const level: CascadeLevel = { selectedId: node.id, options: nodes };
      if (node.id === id) return [...accumulated, level];
      if (node.children.length > 0) {
        const found = walk(node.children, id, [...accumulated, level]);
        if (found) return found;
      }
    }
    return null;
  }

  return walk(tree, targetId, []) ?? [{ selectedId: null, options: tree }];
}
