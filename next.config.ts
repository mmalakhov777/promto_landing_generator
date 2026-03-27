import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'dist',
  allowedDevOrigins: [
    '*.proxy.daytona.works',
  ],
};

export default nextConfig;
