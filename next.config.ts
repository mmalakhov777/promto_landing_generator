import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    '*.proxy.daytona.works',
  ],
};

export default nextConfig;
