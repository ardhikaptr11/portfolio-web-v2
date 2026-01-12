import KBar from "../components/kbar";
import AppSidebar from "../components/layout/app-sidebar";
import Header from "../components/layout/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
// import { getUserRole } from "@/utils/supabase/queries";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { SIDEBAR_ITEMS } from "../constants/items.constants";
import { getAccountInfo } from "../lib/queries/user";
import readUserSession from "@/lib/read-session";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Next Shadcn Dashboard Starter",
  description: "Basic dashboard with Next.js and Shadcn",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Persisting the sidebar state in the cookie.
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  const authUser = await readUserSession();

  if (!authUser) redirect("/auth");

  const user = await getAccountInfo();

  return (
    <KBar items={SIDEBAR_ITEMS}>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar
          items={SIDEBAR_ITEMS}
          user={user}
        />
        <SidebarInset>
          <Header />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </KBar>
  );
}
