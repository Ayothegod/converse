// import ThemeToggle from "@/components/build/ThemeToggle";
import MainSidebar from "@/components/sections/MainSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuthStore } from "@/lib/store/stateStore";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export default function MainLayout() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      return navigate("/login", {});
    }
  }, [user, navigate]);

  if (!user) {
    return;
  }

  return (
    <div className="">
      <SidebarProvider>
        {/* <ThemeToggle /> */}
        <div className="flex w-full">
          <MainSidebar />

          <main className="w-full pl-4">
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
