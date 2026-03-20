import { Button } from "@shared/ui/button";
import { Separator } from "@shared/ui/separator";
import { PanelLeftIcon, PanelRightIcon } from "lucide-react";
import { useSidebar } from "@shared/ui/sidebar";
import { useAppSelector } from "@app/store";
import { ThemeToggle } from "./ThemeToggle";

export function SiteHeader() {
  const { toggleSidebar, state } = useSidebar();
  const language = useAppSelector((s) => s.language.current);
  const isRtl = language === "ar";

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4">
      <Button variant="ghost" size="icon" onClick={toggleSidebar}>
        {state === "expanded" ? (
          isRtl ? (
            <PanelRightIcon className="h-5 w-5" />
          ) : (
            <PanelLeftIcon className="h-5 w-5" />
          )
        ) : isRtl ? (
          <PanelLeftIcon className="h-5 w-5" />
        ) : (
          <PanelRightIcon className="h-5 w-5" />
        )}
      </Button>
      <Separator orientation="vertical" className="h-6" />
      <div className="flex-1" />
      <ThemeToggle />
    </header>
  );
}
