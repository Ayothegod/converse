// import TopBar from "@/components/layout/TopBar";
import ThemeToggle from "@/components/build/ThemeToggle";
import MainSidebar from "@/components/sections/MainSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet, useLocation } from "react-router-dom";

export default function MainLayout() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="border">
      <SidebarProvider>
        <div className="flex">
          <MainSidebar />
          <main>
            <ThemeToggle />
            Hello
            <SidebarTrigger />
            <div className="z-50">

            <Outlet />
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}
