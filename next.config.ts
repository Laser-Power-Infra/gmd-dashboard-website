import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: __dirname,
  },
  // Allow the LAN IP to load dev JS bundles in development. Without this,
  // Next.js 16 blocks cross-origin requests to dev resources, so pages
  // render HTML but never hydrate (buttons/forms go dead).
  allowedDevOrigins: ['192.168.1.196','192.168.1.190'],
};

export default nextConfig;
