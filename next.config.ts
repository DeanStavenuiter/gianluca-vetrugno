import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'gianluca-vetrugno.s3.eu-west-3.amazonaws.com' },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
    qualities: [60, 70, 80, 90],
  }
};

export default nextConfig;
