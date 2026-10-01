import type { NextConfig } from "next";

/**
 * Next.js configuration.
 *
 * Deployment (Vercel): no custom build settings are needed — the "Next.js" preset
 * runs `npm install` and `next build`. Required environment variable:
 *   NEXT_PUBLIC_SANITY_PROJECT_ID  (see .env.example for the full list)
 */
const nextConfig: NextConfig = {
  images: {
    // Sanity images are served through Sanity's own image CDN via a custom loader,
    // but allow the host in case next/image is used with a plain cdn.sanity.io URL.
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
};

export default nextConfig;
