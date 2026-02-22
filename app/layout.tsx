"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import "./globals.css";
import "../node_modules/flag-icons/css/flag-icons.min.css";
import CustomCursor from "./(root)/components/custom-cursor";
import { Metadata } from "next";

// export const metadata: Metadata = {
//   icons: {
//     icon: "/logo.svg",
//     apple: "/logo.svg",
//   },
// };

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
  const isDashboard = pathname.startsWith("/dashboard") || pathname === "/auth";

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={isDashboard ? "no-scrollbar!" : "oceanic-scrollbar!"}
      suppressHydrationWarning
    >
      <head>
        <link
          rel="icon"
          href="/logo-dark.svg"
          media="(prefers-color-scheme: light)"
          type="image/svg+xml"
        />

        <link
          rel="icon"
          href="/logo.svg"
          media="(prefers-color-scheme: dark)"
          type="image/svg+xml"
        />

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
