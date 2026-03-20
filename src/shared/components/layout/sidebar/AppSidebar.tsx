import { useAppSelector } from "@app/store";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarRail,
} from "@shared/ui/sidebar";
import { SidebarLogo } from "./SidebarLogo";
import { SidebarNav } from "./SidebarNav";
import { SidebarUserMenu } from "./SidebarUserMenu";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  onLogout: () => void;
  onLanguageChange: () => void;
}

export function AppSidebar({
  onLogout,
  onLanguageChange,
  ...props
}: AppSidebarProps) {
  const language = useAppSelector((state) => state.language.current);
  const sidebarSide = language === "ar" ? "right" : "left";

  return (
    <Sidebar
      variant="inset"
      side={sidebarSide}
      collapsible="icon"
      className="overflow-hidden"
      {...props}
    >
      <SidebarHeader className="border-b border-sidebar-border py-4">
        <SidebarMenu>
          <SidebarLogo />
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="py-2">
        <SidebarNav />
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarUserMenu
            onLogout={onLogout}
            onLanguageChange={onLanguageChange}
          />
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
