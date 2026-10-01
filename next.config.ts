import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Sanity images are served through Sanity's own image CDN via a custom loader,
    // but allow the host in case next/image is used with a plain cdn.sanity.io URL.
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
};

export default nextConfig;
