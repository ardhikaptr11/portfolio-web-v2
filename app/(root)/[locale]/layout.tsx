import { JsonLd } from "@/components/json-ld";
import { fontVariablesMain } from "@/lib/font";
import { constructMetadata } from "@/lib/metadata";
import { getSchemaGraph } from "@/lib/schema";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Fragment, ReactNode } from "react";
import { Toaster } from "sonner";
import FloatingBackToTopButton from "../components/floating-back-top-button";
import { ThemeProvider } from "../components/theme-provider";
import "../globals.css";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import LanguageSwitcher from "../components/language-switcher";

export const metadata = constructMetadata();
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

  const schemaGraph = await getSchemaGraph();

  return (
    <Fragment>
      <JsonLd schema={schemaGraph} />

      <NuqsAdapter>
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
              <LanguageSwitcher />
            </NextIntlClientProvider>
            <FloatingBackToTopButton />
          </main>
        </ThemeProvider>
      </NuqsAdapter>
    </Fragment>
  );
};

export default BaseLayout;
