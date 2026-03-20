import {
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@shared/ui/sidebar";
import { ShoppingBag } from "lucide-react";

export function SidebarLogo() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <SidebarMenuItem>
      <SidebarMenuButton size="lg" asChild>
        <div className="flex items-center gap-2 cursor-default">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ShoppingBag className="size-4" />
          </div>
          {!isCollapsed && (
            <div className="grid flex-1 text-start text-sm leading-tight">
              <span className="truncate font-semibold">E-Commerce</span>
              <span className="truncate text-xs text-muted-foreground">
                Commerce Center
              </span>
            </div>
          )}
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
