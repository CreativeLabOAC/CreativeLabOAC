import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  ...(process.env.GITHUB_PAGES === "true" ? {
    output: "export",
    basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "/CreativeLabOAC",
    images: { unoptimized: true },
    typescript: { tsconfigPath: "tsconfig.pages.json" },
  } : {}),
};

export default nextConfig;
