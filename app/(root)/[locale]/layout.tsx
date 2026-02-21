import { environments } from "@/app/environments";
import { JsonLd } from "@/components/json-ld";
import { fontVariablesMain } from "@/lib/font";
import { NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { Fragment, ReactNode } from "react";
import { Toaster } from "sonner";
import { ThemeProvider } from "../components/theme-provider";
import "../globals.css";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata();

const BASE_URL = environments.IS_DOMAIN_APPROVED
  ? "https://ardhikaputra.is-a.dev"
  : "https://ardhikaputra.vercel.app";

const BaseLayout = async ({
  children,
  params,
}: Readonly<{
  children: ReactNode;
  params: Promise<{ locale: string }>;
}>) => {
  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations("Schema");
  const messages = await getMessages();

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${BASE_URL}/#person`,
    name: "Ardhika Putra",
    url: `${BASE_URL}`,
    image: `${BASE_URL}/og-image.webp`,
    gender: "Male",
    description: t("person.description"),
    jobTitle: t("person.jobTitle"),
    mainEntityOfPage: `${BASE_URL}`,
    nationality: {
      "@type": "Country",
      name: "Indonesia",
    },
    knowsLanguage: [
      { "@type": "Language", name: "Bahasa Indonesia", alternateName: "id" },
      { "@type": "Language", name: "English", alternateName: "en" },
    ],
    sameAs: [
      "https://github.com/ardhikaputra",
      "https://linkedin.com/in/ardhikaputra",
      "https://threads.com/@ardhikaptr",
      "https://instagram.com/ardhikaptr",
    ],
    knowsAbout: [
      "Ardhika Putra",
      "Next.js Portfolio",
      "Fullstack Developer",
      "Frontend Developer",
      "Backend Developer",
      "Machine Learning Developer",
      "Python Developer",
      "React Developer",
      "Software Developer",
      "Web Development",
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Surabaya",
      addressRegion: "East Java",
      addressCountry: "ID",
    },
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "Institut Teknologi Sepuluh Nopember",
      sameAs: "https://www.its.ac.id",
    },
  };

  return (
    <Fragment>
      <JsonLd schema={personSchema} />

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
    </Fragment>
  );
};

export default BaseLayout;
