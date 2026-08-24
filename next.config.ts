import type { NextConfig } from "next";

const exportMode = process.env.EXPORT_MODE === "1";

const nextConfig: NextConfig = {
  // Pin the workspace root so Turbopack never guesses wrong when this config
  // runs inside the disposable .pages-project copy (which contains its own
  // package-lock.json while the real one sits in the parent directory).
  // export-static.mjs injects NEXT_PROJECT_ROOT for dashboard-triggered
  // exports of the disposable copy; normal dev/build fall back to cwd.
  turbopack: {
    root: process.env.NEXT_PROJECT_ROOT || process.cwd(),
  },
  ...(exportMode
    ? {
        output: "export" as const,
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
  ...(process.env.PAGES_BASE_PATH ? { basePath: process.env.PAGES_BASE_PATH } : {}),
  // katex + mhchem must stay a SINGLE runtime instance: bundling them into
  // server chunks while rehype-katex loads its own copy splits the module in
  // two and \ce{...} renders as raw text. Keep the whole chain external.
  serverExternalPackages: ["katex", "rehype-katex", "next-mdx-remote-client"],
  experimental: {
    // Massive dev/build speedup for the icon barrel used across the app.
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;