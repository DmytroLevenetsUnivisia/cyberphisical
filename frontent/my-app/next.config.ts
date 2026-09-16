import type {NextConfig} from "next";
import {resolve} from "node:path";

const nextConfig: NextConfig = {
    turbopack: {
        root: resolve(process.cwd(), `${process.env.PROJECT_ROOT}/frontent/my-app`),
    },
    async headers() {
        return [
            {
                // matching all API routes
                source: "/:path*",
                headers: [
                    {key: "Access-Control-Allow-Origin", value: process.env.ALLOWED_HOST || "*"},
                ]
            }
        ]
    }
};

export default nextConfig;
