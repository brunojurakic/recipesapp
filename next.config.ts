import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'zavrad.vercel.app',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
    domains: ['zavrad.vercel.app'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],    formats: ['image/webp', 'image/avif'],    localPatterns: [
      {
        pathname: '/uploads/**',
        search: '',
      }
    ],
    minimumCacheTTL: 60,
    qualities: [25, 50, 75, 85, 90, 100],
  },
};

export default nextConfig;
