import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  output: "standalone",
  trailingSlash: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  allowedDevOrigins: [
    "3001-c6b3792e-4c04-4e34-9e5e-df33d062c96a.preview.promto.ai",
    "3000-c6b3792e-4c04-4e34-9e5e-df33d062c96a.preview.promto.ai",
    "4000-c6b3792e-4c04-4e34-9e5e-df33d062c96a.preview.promto.ai",
  ],
};

export default withNextIntl(nextConfig);
