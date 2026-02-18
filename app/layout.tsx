"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import "./globals.css";
import "../node_modules/flag-icons/css/flag-icons.min.css";
import CustomCursor from "./(root)/components/custom-cursor";

const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={isDashboard ? "no-scrollbar!" : "oceanic-scrollbar!"}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                // Set meta theme color
                if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '${META_THEME_COLORS.dark}')
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body>
        {!isDashboard && <CustomCursor />}
        {children}
      </body>
    </html>
  );
}
