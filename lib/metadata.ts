import { environments } from "@/app/environments";
import { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#d7e8ee" },
    { media: "(prefers-color-scheme: dark)", color: "#010d16" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const BASE_URL =
  environments.VERCEL_ENV === "production"
    ? environments.BASE_URL_PROD
    : environments.BASE_URL_DEV;

export const constructMetadata = ({
  title,
  description,
  image = "/og-image.webp",
  locale = "en",
  pathname = "",
  indexable = true,
}: {
  title?: string;
  description?: string;
  image?: string;
  locale?: string;
  pathname?: string;
  indexable?: boolean;
} = {}): Metadata => {
  const url = locale === "en"
    ? pathname
      ? `${BASE_URL}/${pathname}`
      : BASE_URL
    : `${BASE_URL}/${locale}${pathname ? `/${pathname}` : ""}`;

  const displayTitle = title?.startsWith("Ardhika Putra")
    ? { absolute: title }
    : { default: title || "Ardhika Putra - Fullstack Developer", template: `%s | Ardhika Putra` };

  const seoTitle = title?.startsWith("Ardhika Putra")
    ? title
    : title
      ? `${title} | Ardhika Putra`
      : "Ardhika Putra - Fullstack Developer";

  return {
    // Core Metadata
    title: displayTitle,
    description,
    applicationName: "Ardhika Putra's Web Portfolio",
    authors: [{ name: "Ardhika Putra", url: BASE_URL }],
    generator: "Next.js",
    keywords: [
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
    referrer: "origin-when-cross-origin",
    creator: "Ardhika Putra",
    publisher: "Ardhika Putra",

    // Localization & Canonical
    alternates: {
      canonical: url,
      languages: {
        en: pathname ? `${BASE_URL}/${pathname}` : BASE_URL,
        id: `${BASE_URL}/id${pathname ? `/${pathname}` : ""}`,
        "x-default": `${BASE_URL}${pathname ? `/${pathname}` : ""}`
      },
    },

    // Open Graph
    openGraph: {
      title: seoTitle,
      description,
      url,
      siteName: "Ardhika Putra",
      images: [
        {
          url: `${BASE_URL}${image}`,
          width: 1200,
          height: 630,
          alt: "Ardhika Putra Logo",
        },
      ],
      locale: locale === "id" ? "id_ID" : "en_US",
      type: "website",
    },

    // Twitter (X) Card
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description,
      images: [`${BASE_URL}${image}`],
      creator: "@ardhikaptr11",
      site: "@ardhikaptr11",
    },

    // Robots & Verification
    robots: {
      index: indexable,
      follow: indexable,
      nocache: !indexable,
      googleBot: {
        index: indexable,
        follow: indexable,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    verification: {
      google: environments.GOOGLE_SITE_VERIFICATION,
    },

    // Icons & Basic PWA
    icons: {
      icon: [
        { url: "/logo.svg", type: "image/svg+xml" },
        { url: "/logo-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/logo-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/logo-48x48.png", sizes: "48x48", type: "image/png" },
      ],
      shortcut: "/logo.svg",
      apple: [
        { url: "/logo-180x180.png", sizes: "180x180", type: "image/png" },
      ],
    },
    manifest: `${BASE_URL}/site.webmanifest`,
  };
};