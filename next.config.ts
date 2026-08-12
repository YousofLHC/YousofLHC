import type { NextConfig } from "next";

const exportMode = process.env.EXPORT_MODE === "1";

const nextConfig: NextConfig = {
  ...(exportMode
    ? {
        output: "export" as const,
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
  ...(process.env.PAGES_BASE_PATH ? { basePath: process.env.PAGES_BASE_PATH } : {}),
};

export default nextConfig;