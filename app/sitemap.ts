import { MetadataRoute } from "next";
import { environments } from "./environments";
import { getProjects } from "./(root)/lib/queries/home";

export const revalidate = 3600;

const BASE_URL = environments.VERCEL_ENV === "production"
  ? environments.BASE_URL_PROD
  : environments.BASE_URL_DEV;

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {

  const locales = ["en", "id"];
  const defaultLocale = "en";

  const projects = await getProjects();

  const staticPaths = ["", "projects"];

  const staticEntries = staticPaths.flatMap((path) =>
    locales.map((locale) => {
      const isDefault = locale === defaultLocale;
      const url =
        isDefault
          ? path
            ? `${BASE_URL}/${path}`
            : BASE_URL
          : `${BASE_URL}/${locale}${path ? `/${path}` : ""}`;

      return {
        url,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: path === "" ? 1.0 : 0.8,
        languages: {
          en: path ? `${BASE_URL}/${path}` : BASE_URL,
          id: `${BASE_URL}/id${path ? `/${path}` : ""}`,
          "x-default": `${BASE_URL}${path ? `/${path}` : ""}`
        },
      };
    })
  );

  const projectEntries = projects?.flatMap((project) =>
    locales.map((locale) => {
      const isDefault = locale === defaultLocale;
      const path = `projects/${project.slug}`;

      const url = isDefault
        ? `${BASE_URL}/${path}`
        : `${BASE_URL}/${locale}/${path}`;

      return {
        url,
        lastModified: project.updated_at ? new Date(project.updated_at) : new Date(),
        changeFrequency: "yearly" as const,
        priority: 0.6,
        languages: {
          en: `${BASE_URL}/${path}`,
          id: `${BASE_URL}/id/${path}`,
          "x-default": `${BASE_URL}/${path}`
        },
      };
    })
  ) ?? [];

  return [...staticEntries, ...projectEntries];
};

export default sitemap;