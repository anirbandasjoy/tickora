import type { NextConfig } from "next";

const API_URL = process.env.API_URL ?? "http://localhost:8000";

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/ui", "@repo/database"],
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${API_URL}/api/:path*` }];
  },
  async redirects() {
    // Legacy authorize URL (backend issued this path before the fix).
    // Query string (?requestId=) is preserved automatically.
    return [
      { source: "/desktop/authorize", destination: "/authorize-device", permanent: false },
    ];
  },
};

export default nextConfig;
