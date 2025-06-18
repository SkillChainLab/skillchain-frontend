import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/api/skillchain/:path*',
        destination: 'http://localhost:1317/:path*',
      },
    ];
  },
};

export default nextConfig;
