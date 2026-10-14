import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    reactCompiler: true,
  },
  allowedDevOrigins: ['192.168.1.103'],
  images: {
    qualities: [50, 75, 100],
  },
};

export default nextConfig;
