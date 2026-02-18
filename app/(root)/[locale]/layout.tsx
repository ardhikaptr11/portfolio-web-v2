import { fontVariablesMain } from "@/lib/font";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import FloatingBackToTopButton from "../components/floating-back-top-button";
import Footer from "../components/footer";
import LanguageSwitcher from "../components/language-switcher";
import Navbar from "../components/navbar";
import ScreenLoader from "../components/screen-loader";
import { ThemeProvider } from "../components/theme-provider";
import { NAV_ITEMS } from "../constants/items.constants";
import "../globals.css";
import { getAllData } from "../lib/queries/home";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Ardhika Putra - Fullstack Developer",
  description:
    "Welcome to my personal digital space where you can learn all about me!",
};

const NAV_ITEMS_SLICED = NAV_ITEMS.slice(1);
NAV_ITEMS_SLICED.splice(3, 1);

const LandingPageLayout = async ({
  children,
  params,
}: Readonly<{
  children: ReactNode;
  params: Promise<{ locale: string }>;
}>) => {
  const { locale } = await params;
  setRequestLocale(locale);

  const { profile } = await getAllData();

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
        {/* <CustomCursor /> */}
        <ScreenLoader tagline={profile.tagline}>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <Navbar items={NAV_ITEMS_SLICED} socials={profile.social_links} />
            {children}
            <Footer items={NAV_ITEMS} profile={profile} />
            <FloatingBackToTopButton />
            <LanguageSwitcher />
          </NextIntlClientProvider>
        </ScreenLoader>
      </main>
    </ThemeProvider>
  );
};

export default LandingPageLayout;
