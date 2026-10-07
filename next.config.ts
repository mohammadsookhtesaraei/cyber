import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    reactCompiler: true,
  },
  allowedDevOrigins: ['192.168.1.103'],
};

export default nextConfig;
