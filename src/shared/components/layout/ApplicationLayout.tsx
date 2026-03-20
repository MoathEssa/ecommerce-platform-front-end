import { Outlet, useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@shared/ui/sidebar";
import { useAppDispatch, useAppSelector } from "@app/store";
import { logout, useLogoutMutation } from "@features/auth";
import { toggleLanguage } from "@app/store/slices/languageSlice";
import { AUTH_ROUTES } from "@shared/constants";
import { AppSidebar } from "./sidebar";
import { SiteHeader } from "./SiteHeader";

export function ApplicationLayout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const language = useAppSelector((s) => s.language.current);
  const [triggerLogout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await triggerLogout();
    } finally {
      dispatch(logout());
      navigate(AUTH_ROUTES.SIGN_IN, { replace: true });
    }
  };

  const handleLanguageChange = () => {
    dispatch(toggleLanguage());
    // Update document direction for RTL support
    document.documentElement.dir = language === "en" ? "rtl" : "ltr";
    document.documentElement.lang = language === "en" ? "ar" : "en";
  };

  return (
    <SidebarProvider>
      <AppSidebar
        onLogout={handleLogout}
        onLanguageChange={handleLanguageChange}
      />
      <SidebarInset className="flex flex-col min-w-0 overflow-hidden">
        <SiteHeader />
        <div className="flex-1 min-h-0 overflow-auto p-4">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default ApplicationLayout;
