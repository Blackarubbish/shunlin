import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.picui.cn',
        port: '',
        pathname: '/**'
      }
    ]
  },
  output: 'standalone'
};

export default nextConfig;
