import { useState, useRef, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, LayoutGrid } from "lucide-react";
import { cn } from "@shared/lib/utils";
import { useGetStorefrontCategoriesQuery } from "../../api/storeCatalogApi";
import type { CategoryTreeDto } from "../../types";

// ── Right panel: L2 group headers + L3 items in a responsive column grid ──────

function MegaMenuPanel({
  category,
  onClose,
}: {
  category: CategoryTreeDto;
  onClose: () => void;
}) {
  const l2Groups = category.children;

  if (l2Groups.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        No subcategories
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-6 p-6 lg:grid-cols-3 xl:grid-cols-4">
      {l2Groups.map((l2) => (
        <div key={l2.id} className="min-w-0">
          {/* L2 header */}
          <Link
            to={`/store/products?categorySlug=${l2.slug}`}
            onClick={onClose}
            className="mb-2 block border-b border-border pb-1.5 text-sm font-semibold text-foreground transition-colors hover:text-primary"
          >
            {l2.name}
          </Link>
          {/* L3 items */}
          {l2.children.length > 0 && (
            <ul className="space-y-1">
              {l2.children.map((l3) => (
                <li key={l3.id}>
                  <Link
                    to={`/store/products?categorySlug=${l3.slug}`}
                    onClick={onClose}
                    className="block truncate text-xs text-muted-foreground transition-colors hover:text-primary"
                  >
                    {l3.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Main mega-menu component ───────────────────────────────────────────────────

export default function CategoryNav() {
  const { data: categories } = useGetStorefrontCategoriesQuery();
  const [isOpen, setIsOpen] = useState(false);
  const [activeL1Id, setActiveL1Id] = useState<number | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const navigate = useNavigate();

  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    [],
  );

  const openMenu = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setIsOpen(true);
  }, []);

  const scheduleClose = useCallback(() => {
    closeTimer.current = setTimeout(() => setIsOpen(false), 180);
  }, []);

  if (!categories || categories.length === 0) return null;

  const activeCategory =
    categories.find((c) => c.id === activeL1Id) ?? categories[0];

  return (
    <div
      className="relative border-b bg-background"
      onMouseLeave={scheduleClose}
    >
      {/* ── Trigger bar ───────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4">
        <button
          type="button"
          className="flex items-center gap-2 py-2.5 text-sm font-medium text-foreground transition-colors hover:text-primary"
          onMouseEnter={openMenu}
          onClick={() => setIsOpen((o) => !o)}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <LayoutGrid className="h-4 w-4" />
          All Categories
          <ChevronRight
            className={cn(
              "h-3.5 w-3.5 transition-transform duration-200",
              isOpen && "rotate-90",
            )}
          />
        </button>
      </div>

      {/* ── Mega-menu panel ───────────────────────────────────────────────── */}
      {isOpen && (
        <div
          className="absolute left-0 right-0 z-50 border-b bg-popover shadow-2xl"
          onMouseEnter={openMenu}
        >
          <div className="mx-auto flex max-w-7xl" style={{ height: 420 }}>
            {/* L1 sidebar */}
            <aside className="w-56 shrink-0 overflow-y-auto border-r py-2">
              {categories.map((l1) => (
                <button
                  key={l1.id}
                  type="button"
                  onMouseEnter={() => setActiveL1Id(l1.id)}
                  onClick={() => {
                    setIsOpen(false);
                    navigate(`/store/products?categorySlug=${l1.slug}`);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors",
                    l1.id === activeL1Id
                      ? "bg-primary/10 font-medium text-primary"
                      : "text-foreground hover:bg-accent",
                  )}
                >
                  <span className="truncate">{l1.name}</span>
                  {l1.children.length > 0 && (
                    <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  )}
                </button>
              ))}
            </aside>

            {/* L2 + L3 content */}
            <div className="flex-1 overflow-y-auto">
              <MegaMenuPanel
                category={activeCategory}
                onClose={() => setIsOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
