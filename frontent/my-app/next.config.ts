import type { NextConfig } from "next";
import { resolve } from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: resolve(process.cwd(), `${process.env.PROJECT_ROOT}/frontent/my-app`),
  },
};

export default nextConfig;
