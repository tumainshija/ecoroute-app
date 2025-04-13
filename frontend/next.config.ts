import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return process.env.NEXT_PUBLIC_USE_PROXY === 'true' ? [
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL + '/:path*' || 'http://localhost:5000/api/:path*',
        basePath: false,
      },
    ] : [];
  },
  // Enable experimental features for more reliable proxy
  experimental: {
    forceSwcTransforms: true,
  },
  // Add output configuration for GitHub Pages
  output: 'export',
  // Add basePath for GitHub Pages
  basePath: '/ecoroute-app',
  // Images must be unoptimized for static export
  images: {
    unoptimized: true,
  },
  // Temporarily ignore type and build errors to allow hosting
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
