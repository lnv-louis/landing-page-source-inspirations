import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
const root = dirname(fileURLToPath(import.meta.url));
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/pages/launch-ui",
  assetPrefix: "/pages/launch-ui",
  images: { unoptimized: true },
  turbopack: { root },
};
export default nextConfig;
