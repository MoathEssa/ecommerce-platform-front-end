import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@shared/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@shared/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { cn } from "@shared/lib/utils";
import { useAppSelector } from "@app/store";
import {
  navigationConfig,
  type NavItem,
  type NavGroup,
} from "../navigation-config";

// ─── role filtering helpers ──────────────────────────────────────────────────

function itemVisible(item: NavItem, roles: string[]): boolean {
  if (!item.roles?.length) return true;
  return item.roles.some((r) => roles.includes(r));
}

function filterItems(items: NavItem[], roles: string[]): NavItem[] {
  return items
    .filter((item) => itemVisible(item, roles))
    .map((item) =>
      item.items ? { ...item, items: filterItems(item.items, roles) } : item,
    );
}

function filterGroups(groups: NavGroup[], roles: string[]): NavGroup[] {
  return groups
    .map((g) => ({ ...g, items: filterItems(g.items, roles) }))
    .filter((g) => g.items.length > 0);
}

// ─── helpers ─────────────────────────────────────────────────────────────────

function isAnyDescendantActive(item: NavItem, pathname: string): boolean {
  if (item.url === pathname) return true;
  return (
    item.items?.some((child) => isAnyDescendantActive(child, pathname)) ?? false
  );
}

// ─── Chevron that respects RTL & open state ───────────────────────────────────

function DirectionalChevron({
  open,
  className,
}: {
  open: boolean;
  className?: string;
}) {
  const isRtl = useAppSelector((s) => s.language.current) === "ar";
  const rotation = open ? "rotate-0" : isRtl ? "rotate-90" : "-rotate-90";

  return (
    <ChevronDown
      className={cn(
        "h-3.5 w-3.5 shrink-0 transition-transform duration-200",
        rotation,
        className,
      )}
    />
  );
}

// ─── Level-2+ sub-item ───────────────────────────────────────────────────────

function SubNavItem({ item }: { item: NavItem }) {
  const { t } = useTranslation("layout");
  const { pathname } = useLocation();

  const hasChildren = !!item.items?.length;
  const isActive = item.url === pathname;
  const childActive = isAnyDescendantActive(item, pathname);
  const [open, setOpen] = useState(childActive);

  if (!hasChildren) {
    return (
      <SidebarMenuSubItem>
        <SidebarMenuSubButton asChild isActive={isActive} className="gap-2.5">
          <Link to={item.url ?? "#"}>
            {item.icon && <item.icon className="h-4 w-4 shrink-0 opacity-70" />}
            <span className="truncate">{t(item.titleKey)}</span>
          </Link>
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
    );
  }

  return (
    <SidebarMenuSubItem>
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <SidebarMenuSubButton className="justify-between cursor-pointer select-none gap-2.5">
            <span className="flex min-w-0 items-center gap-2.5">
              {item.icon && (
                <item.icon className="h-4 w-4 shrink-0 opacity-70" />
              )}
              <span className="truncate">{t(item.titleKey)}</span>
            </span>
            <DirectionalChevron open={open} />
          </SidebarMenuSubButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub className="ms-0 border-s border-sidebar-border ps-2 mt-0.5">
            {item.items!.map((child) => (
              <SubNavItem key={child.id} item={child} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuSubItem>
  );
}

// ─── Level-1 top item ────────────────────────────────────────────────────────

function NavItemComponent({ item }: { item: NavItem }) {
  const { t } = useTranslation("layout");
  const { pathname } = useLocation();

  const isActive = item.url === pathname;
  const hasChildren = !!item.items?.length;
  const childActive = isAnyDescendantActive(item, pathname);
  const [open, setOpen] = useState(childActive);

  if (!hasChildren) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          isActive={isActive}
          tooltip={t(item.titleKey)}
        >
          <Link to={item.url ?? "#"}>
            {item.icon && <item.icon />}
            <span className="truncate">{t(item.titleKey)}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={t(item.titleKey)}>
            {item.icon && <item.icon />}
            <span className="truncate">{t(item.titleKey)}</span>
            <DirectionalChevron open={open} className="ms-auto" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.items!.map((child) => (
              <SubNavItem key={child.id} item={child} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

// ─── Root component ──────────────────────────────────────────────────────────

export function SidebarNav() {
  const userRoles = useAppSelector((s) => s.auth.user?.roles ?? []);
  const visibleGroups = filterGroups(navigationConfig, userRoles);
  const { t } = useTranslation("layout");

  return (
    <>
      {visibleGroups.map((group) => (
        <SidebarGroup key={group.id}>
          <SidebarGroupLabel>{t(group.titleKey)}</SidebarGroupLabel>
          <SidebarMenu>
            {group.items.map((item) => (
              <NavItemComponent key={item.id} item={item} />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
}
