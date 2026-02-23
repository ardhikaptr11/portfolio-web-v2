import { MetadataRoute } from "next";
import { environments } from "./environments";

const BASE_URL = environments.VERCEL_ENV === "production"
  ? environments.BASE_URL_PROD
  : environments.BASE_URL_DEV;
  
const robots = (): MetadataRoute.Robots => {

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/auth/", "/dashboard/", "/api/"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
};

export default robots;