import { headers as NextHeaders } from "next/headers";
import { ReactNode } from "react";
import "../node_modules/flag-icons/css/flag-icons.min.css";
import CustomCursor from "./(root)/components/custom-cursor";
import "./globals.css";

const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const headers = await NextHeaders();
  const pathname = headers.get("x-pathname") || "";

  const isDashboard = pathname.startsWith("/dashboard") || pathname === "/auth";

  const currentLocale = isDashboard
    ? "en"
    : pathname.startsWith("/id")
      ? "id"
      : "en";

  return (
    <html
      lang={currentLocale}
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
