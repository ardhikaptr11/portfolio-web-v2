import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import readUserSession from "@/lib/read-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import KBar from "../components/kbar";
import AppSidebar from "../components/layout/app-sidebar";
import Header from "../components/layout/header";
import { SIDEBAR_ITEMS } from "../constants/items.constants";
import { getAccountInfo } from "../lib/queries/user/actions";

const DashboardLayout = async ({ children }: { children: ReactNode }) => {
  // Persisting the sidebar state in the cookie.
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  const authUser = await readUserSession();

  if (!authUser) redirect("/auth");

  const user = await getAccountInfo();

  return (
    <KBar items={SIDEBAR_ITEMS}>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar items={SIDEBAR_ITEMS} user={user} />
        <SidebarInset>
          <Header />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </KBar>
  );
};

export default DashboardLayout;
