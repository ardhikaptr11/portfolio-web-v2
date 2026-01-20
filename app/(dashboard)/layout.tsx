import { Toaster } from "@/components/ui/sonner";
import { fontVariables } from "@/lib/font";
import { cn } from "@/lib/utils";
import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import NextTopLoader from "nextjs-toploader";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ReactNode } from "react";
import "../globals.css";
import IdleTimer from "./components/idle-timer";
import Providers from "./components/layout/providers";
import ThemeProvider from "./components/layout/ThemeToggle/theme-provider";
import "./theme.css";

const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
};

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Internal administration panel for managing content shows on the website",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export const viewport: Viewport = {
  themeColor: META_THEME_COLORS.light,
};

const RootDashboardLayout = async ({ children }: { children: ReactNode }) => {
  const cookieStore = await cookies();
  const activeThemeValue = cookieStore.get("active_theme")?.value;

  return (
    <div
      className={cn(
        "overflow-hidden overscroll-none bg-background font-sans antialiased",
        activeThemeValue ? `theme-${activeThemeValue}` : "",
        fontVariables,
      )}
    >
      <NextTopLoader color="var(--chart-2)" showSpinner={false} />
      <IdleTimer timeoutInMinutes={30} />

      <NuqsAdapter>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          enableColorScheme
        >
          <Providers activeThemeValue={`${activeThemeValue}`}>
            <Toaster expand />
            {children}
          </Providers>
        </ThemeProvider>
      </NuqsAdapter>
    </div>
  );
};

export default RootDashboardLayout;
