import { MetadataRoute } from 'next';
import { environments } from './environments';

const robots = (): MetadataRoute.Robots => {
  const BASE_URL = environments.VERCEL_ENV === "production"
    ? "https://ardhikaputra.is-a.dev"
    : "https://ardhikaputra.vercel.app";

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/'],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
};

export default robots;