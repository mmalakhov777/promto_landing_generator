import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'dist',
  images: { unoptimized: true },
  allowedDevOrigins: [
    '*.proxy.daytona.works',
  ],
};

export default nextConfig;
