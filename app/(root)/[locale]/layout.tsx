import { environments } from "@/app/environments";
import { JsonLd } from "@/components/json-ld";
import { fontVariablesMain } from "@/lib/font";
import { constructMetadata } from "@/lib/metadata";
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

export const metadata = constructMetadata();

const BASE_URL =
  environments.VERCEL_ENV === "production"
    ? environments.BASE_URL_PROD
    : environments.BASE_URL_DEV;

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

  const schemaGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${BASE_URL}/#website`,
        url: `${BASE_URL}`,
        name: "Ardhika Putra's Portfolio Web",
        alternateName: "Ardhika Putra",
        publisher: {
          "@id": `${BASE_URL}/#person`,
          logo: {
            "@type": "ImageObject",
            url: `${BASE_URL}/logo-512x512.png`,
          },
        },
        inLanguage: locale,
        description: t("person.description"),
      },
      {
        "@type": "Person",
        "@id": `${BASE_URL}/#person`,
        name: "Ardhika Putra",
        birthDate: "2000-10-11",
        url: `${BASE_URL}`,
        mainEntityOfPage: `${BASE_URL}`,
        image: {
          "@type": "ImageObject",
          url: `${BASE_URL}/og-image.webp`,
          width: 1200,
          height: 630,
        },
        jobTitle: t("person.jobTitle"),
        description: t("person.description"),
        gender: "Male",
        nationality: {
          "@type": "Country",
          name: "Indonesia",
        },
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
        knowsLanguage: [
          {
            "@type": "Language",
            name: "Bahasa Indonesia",
            alternateName: "id",
          },
          { "@type": "Language", name: "English", alternateName: "en" },
        ],
        knowsAbout: [
          "Fullstack Web Development",
          "Software Development",
          "Web Programming",
          "Python Programming",
          "Next.js",
          "React.js",
          "TypeScript",
          "Node.js",
          "Machine Learning",
          "Artificial Intelligence",
        ],
        sameAs: [
          "https://github.com/ardhikaputra",
          "https://linkedin.com/in/ardhikaputra",
          "https://instagram.com/ardhikaptr",
          "https://threads.com/@ardhikaptr",
        ],
        hasCredential: [
          {
            "@type": "EducationalOccupationalCredential",
            name: "Fullstack Software Development Bootcamp",
            credentialCategory: "Certification",
            recognizedBy: {
              "@type": "Organization",
              name: "Harisenin.com",
            },
          },
          {
            "@type": "EducationalOccupationalCredential",
            name: "Machine Learning Path - Bangkit Academy 2023",
            credentialCategory: "Certification",
            recognizedBy: {
              "@type": "Organization",
              name: "Bangkit Academy (Google, GoTo, Traveloka)",
            },
          },
          {
            "@type": "EducationalOccupationalCredential",
            name: "Tensorflow Developer Specialization",
            credentialCategory: "Certification",
            recognizedBy: {
              "@type": "Organization",
              name: "DeepLearning.AI",
            },
          },
        ],
      },
    ],
  };

  return (
    <Fragment>
      <head>
        <JsonLd schema={schemaGraph} />
      </head>

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
