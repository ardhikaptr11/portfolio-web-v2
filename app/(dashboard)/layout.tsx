import { Toaster } from "@/components/ui/sonner";
import { fontVariables } from "@/lib/font";
import { cn } from "@/lib/utils";
import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import NextTopLoader from "nextjs-toploader";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ReactNode } from "react";
import "../globals.css";
import Providers from "./components/layout/providers";
import ThemeProvider from "./components/layout/ThemeToggle/theme-provider";
import "./theme.css";

const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
};

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Panel administrasi internal untuk mengelola konten dan data.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export const viewport: Viewport = {
  themeColor: META_THEME_COLORS.light,
};

export default async function RootDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const activeThemeValue = cookieStore.get("active_theme")?.value;
  const isScaled = activeThemeValue?.endsWith("-scaled");

  return (
    <div
      className={cn(
        "overflow-hidden overscroll-none bg-background font-sans antialiased",
        activeThemeValue ? `theme-${activeThemeValue}` : "",
        isScaled && "theme-scaled",
        fontVariables,
      )}
    >
      <NextTopLoader color="var(--chart-2)" showSpinner={false} />

      <NuqsAdapter>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          enableColorScheme
        >
          <Providers activeThemeValue={`${activeThemeValue}`}>
            <Toaster />
            {children}
          </Providers>
        </ThemeProvider>
      </NuqsAdapter>
    </div>
  );
}
