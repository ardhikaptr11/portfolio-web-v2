import { fontVariablesMain } from "@/lib/font";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import { ThemeProvider } from "../components/theme-provider";
import "../globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Ardhika Putra",
    default: "Ardhika Putra - Fullstack Developer",
  },
};

const BaseLayout = async ({
  children,
  params,
}: Readonly<{
  children: ReactNode;
  params: Promise<{ locale: string }>;
}>) => {
  const { locale } = await params;
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <Toaster
        position="bottom-right"
        toastOptions={{
          unstyled: true,
          classNames: {
            toast: "bg-transparent border-none shadow-none",
          },
        }}
      />
      <main className={`${fontVariablesMain}`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </main>
    </ThemeProvider>
  );
};

export default BaseLayout;
