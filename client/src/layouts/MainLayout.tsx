// import ThemeToggle from "@/components/build/ThemeToggle";
import MainSidebar from "@/components/sections/MainSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="">
      <SidebarProvider>
        {/* <ThemeToggle /> */}
        <div className="flex w-full">
          <MainSidebar />

          <main className="w-full">
            {/* <SidebarTrigger /> */}
            <div className="max-w-full w-full shrink-0 min-h-screen">
              <Outlet />
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}
