import type { NextConfig } from "next";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8000";

const nextConfig: NextConfig = {
  /*
   * I add a rewrite so the frontend can call the backend with relative paths
   * like `/api/v1/...` during development without CORS issues.
   */
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${API_BASE_URL}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
