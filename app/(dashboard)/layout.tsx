import { Toaster } from "@/components/ui/sonner";
import { fontVariablesDashboard } from "@/lib/font";
import { cn } from "@/lib/utils";
import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import NextTopLoader from "nextjs-toploader";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ReactNode } from "react";
import IdleTimer from "./components/idle-timer";
import Providers from "./components/layout/providers";
import ThemeProvider from "../theme-provider";
import { DEFAULT_THEME } from "./components/themes/theme.config";
import "./globals.css";
import "./theme.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { constructMetadata } from "@/lib/metadata";

const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
};

export const metadata = constructMetadata({
  pathname: "/dashboard",
});

export const viewport: Viewport = {
  themeColor: META_THEME_COLORS.light,
};

const RootDashboardLayout = async ({ children }: { children: ReactNode }) => {
  const cookieStore = await cookies();
  const activeThemeValue = cookieStore.get("active_theme")?.value;
  const themeToApply = activeThemeValue || DEFAULT_THEME;

  return (
    <main
      className={cn(
        "bg-background overflow-hidden overscroll-none font-sans antialiased",
        fontVariablesDashboard,
      )}
    >
      <NextTopLoader showSpinner={false} />
      <NextTopLoader color="var(--primary)" showSpinner={false} />
      <IdleTimer timeoutInMinutes={30} />

      <NuqsAdapter>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          enableColorScheme
        >
          <Providers activeThemeValue={themeToApply}>
            <Toaster expand />
            <TooltipProvider>{children}</TooltipProvider>
          </Providers>
        </ThemeProvider>
      </NuqsAdapter>
    </main>
  );
};

export default RootDashboardLayout;
