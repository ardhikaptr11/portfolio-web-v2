import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';
import { environments } from "./app/environments";

const nextConfig: NextConfig = {
  experimental: {
    turbopackFileSystemCacheForDev: true,
    serverActions: {
      bodySizeLimit: "5mb"
    }
  },
  images: {
    remotePatterns: [
      new URL(`${environments.SUPABASE_URL}/storage/v1/object/public/**`),
    ]
  },
};

const withNextIntl = createNextIntlPlugin("./app/(root)/i18n/request.ts");

export default withNextIntl(nextConfig);
