import { IProject } from "@/app/(root)/types/data";
import { environments } from "@/app/environments";
import { getLocale, getTranslations } from "next-intl/server";

const BASE_URL =
  environments.VERCEL_ENV === "production"
    ? environments.BASE_URL_PROD
    : environments.BASE_URL_DEV;

export const getSchemaGraph = async () => {
  const locale = await getLocale();
  const t = await getTranslations("Schema.person");

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": `${BASE_URL}/#profilepage`,
        url: BASE_URL,
        dateCreated: "2026-01-15T10:00:00+07:00",
        dateModified: new Date().toISOString(),
        mainEntity: { "@id": `${BASE_URL}/#person` },
      },
      {
        "@type": "WebSite",
        "@id": `${BASE_URL}/#website`,
        url: BASE_URL,
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
        description: t("description"),
      },
      {
        "@type": "Person",
        "@id": `${BASE_URL}/#person`,
        name: "Ardhika Putra",
        birthDate: "2000-10-11",
        email: "mailto:ardhikaptr11@gmail.com",
        url: BASE_URL,
        mainEntityOfPage: BASE_URL,
        image: {
          "@type": "ImageObject",
          url: `${BASE_URL}/og-image.webp`,
          width: 1200,
          height: 630,
        },
        jobTitle: t("jobTitle"),
        description: t("description"),
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
          {
            "@type": "Language",
            name: "English",
            alternateName: "en",
          },
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
};

export const getProjectListSchemaGraph = async (projects: IProject[]) => {
  const locale = await getLocale();

  const localePrefix = locale === "id" ? "/id" : "";

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: locale === "id" ? "Arsip Proyek" : "Project Archives",
    itemListElement: projects.map((project, index) => {
      const description =
        locale === "id" ? project.description_id : project.description;

      return {
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "SoftwareApplication",
          name: project.title,
          url: `${BASE_URL}${localePrefix}/projects/${project.slug}`,
          image: project.thumbnail_url,
          applicationCategory: "WebApplication",
          operatingSystem: "Windows, OSX, Android, iOS",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
          description,
        },
      };
    }),
  };
};

export const getProjectDetailsSchemaGraph = async (project: IProject) => {
  const locale = await getLocale();

  const description =
    locale === "id" ? project.description_id : project.description;

  const localePrefix = locale === "id" ? "/id" : "";

  const projectListUrl = `${BASE_URL}${localePrefix}/projects`;
  const projectDetailsUrl = `${BASE_URL}${localePrefix}/projects/${project.slug}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": `${BASE_URL}/${locale}/projects/${project.slug}/#software`,
        name: project.title,
        description,
        applicationCategory: "WebApplication",
        operatingSystem: "Web Browser",
        image: project.thumbnail_url,
        url: `${BASE_URL}/${locale}/projects/${project.slug}`,
        author: {
          "@type": "Person",
          "@id": `${BASE_URL}/#person`,
        },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: locale === "id" ? "Beranda" : "Home",
            item: BASE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: locale === "id" ? "Proyek" : "Projects",
            item: projectListUrl,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: project.title,
            item: projectDetailsUrl,
          },
        ],
      },
    ],
  };
};
