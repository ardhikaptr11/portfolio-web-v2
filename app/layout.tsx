import { fontVariables } from "@/lib/font";
import type { Metadata } from "next";
import { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ardhika's portfolio website",
  description:
    "Welcome to my personal digital space where you can learn all about me!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const isDark =
                  localStorage.theme === 'dark' ||
                  (
                    (!('theme' in localStorage) || localStorage.theme === 'system') &&
                    window.matchMedia('(prefers-color-scheme: dark)').matches
                  );

                if (isDark) {
                  document
                    .querySelector('meta[name="theme-color"]')
                    ?.setAttribute('content', '#09090b');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body
        className={`${fontVariables} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
