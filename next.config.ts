import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/api/skillchain/:path*',
        destination: process.env.NEXT_PUBLIC_SKILLCHAIN_API + '/:path*' || 'http://45.83.20.3:1317/:path*',
      },
    ];
  },
};

export default nextConfig;
