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
      },
      {
        protocol: 'https',
        hostname: 'shunlin-blog-1306235438.cos.ap-guangzhou.myqcloud.com',
        port: '',
        pathname: '/**'
      }
    ]
  },
  output: 'standalone'
};

export default nextConfig;
