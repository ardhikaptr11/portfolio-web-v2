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

const BRAND = "Ardhika Putra";
const FULL_TITLE = `${BRAND} - Fullstack Developer`;

export const constructMetadata = ({
  title,
  description,
  image = "/og-logo.webp",
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
  const isDashboard = pathname.startsWith("/dashboard");
  const isAuth = pathname.startsWith("/auth");
  const shouldIndex = isDashboard || isAuth ? false : indexable;

  // This is to avoid possibility of double slashes
  const safePath = pathname
    ? pathname.startsWith("/")
      ? pathname
      : `/${pathname}`
    : "";

  const url =
    locale === "en"
      ? `${BASE_URL}${safePath}`
      : `${BASE_URL}/${locale}${safePath}`;

  const displayTitle = isDashboard
    ? title || { template: "%s | Dashboard", default: `Dashboard | ${BRAND}` }
    : title
      ? title === FULL_TITLE
        ? { absolute: title }
        : title
      : { template: `%s | ${BRAND}`, default: FULL_TITLE };

  const seoTitle = isDashboard
    ? title
      ? `${title} | Dashboard`
      : `Dashboard | ${BRAND}`
    : title
      ? title === FULL_TITLE
        ? title
        : `${title} | ${BRAND}`
      : FULL_TITLE;

  return {
    // Core Metadata
    title: displayTitle,
    description,
    applicationName: isDashboard
      ? "Admin Dashboard"
      : "Ardhika Putra's Web Portfolio",
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
    referrer: isDashboard ? "no-referrer" : "origin-when-cross-origin",
    creator: "Ardhika Putra",
    publisher: "Ardhika Putra",

    // Localization & Canonical
    alternates: {
      canonical: url,
      languages: isDashboard
        ? { en: `${BASE_URL}${safePath}` }
        : {
            en: `${BASE_URL}${safePath}`,
            id: `${BASE_URL}/id${safePath}`,
            "x-default": `${BASE_URL}${safePath}`,
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
      index: shouldIndex,
      follow: shouldIndex,
      nocache: !shouldIndex,
      googleBot: {
        index: shouldIndex,
        follow: shouldIndex,
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
        { url: "/logo-dark-16.png", sizes: "16x16", type: "image/png" },
        { url: "/logo-dark-32.png", sizes: "32x32", type: "image/png" },
        { url: "/logo-dark-48.png", sizes: "48x48", type: "image/png" },
      ],
      shortcut: "/logo.svg",
      apple: [
        { url: "/logo-dark-180.png", sizes: "180x180", type: "image/png" },
      ],
    },
    manifest: `${BASE_URL}/site.webmanifest`,
  };
};
