import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'dist',
  trailingSlash: false,
  images: { unoptimized: true },
  allowedDevOrigins: [
    '*.proxy.daytona.works',
  ],
};

export default nextConfig;
