// lib/metadata.ts
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

export const constructMetadata = ({
  title = "Ardhika Putra - Fullstack Developer",
  description = "Fullstack Developer focused on Next.js, TypeScript, and React. Building scalable, high-performance web applications and modern digital solutions.",
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
  const BASE_URL = environments.IS_DOMAIN_APPROVED
    ? "https://ardhikaputra.is-a.dev"
    : "https://ardhikaputra.vercel.app";

  const url = locale === "en"
    ? pathname
      ? `${BASE_URL}/${pathname}`
      : BASE_URL
    : `${BASE_URL}/${locale}${pathname ? `/${pathname}` : ""}`;

  return {
    // Core Metadata
    title: {
      default: title,
      template: `%s | Ardhika Putra`,
    },
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
      title,
      description,
      url,
      siteName: "Ardhika Putra",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: "Ardhika Putra Portfolio Preview",
        },
      ],
      locale: locale === "id" ? "id_ID" : "en_US",
      type: "website",
    },

    // Twitter (X) Card
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
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

    // This is for the Google Search Console, uncomment later if needed
    // verification: {
    //   google: "your-verification-code",
    // },

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