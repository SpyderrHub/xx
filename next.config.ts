import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    minimumCacheTTL: 31536000, // 1 year cache TTL for optimized images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.quantisai.org',
        port: '',
        pathname: '/**',
      },
      // Robust support for dynamic R2 domain
      ...(process.env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN ? [
        {
          protocol: 'https' as const,
          hostname: process.env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN.replace(/^https?:\/\//, '').split('/')[0],
          port: '',
          pathname: '/**' as const,
        }
      ] : []),
    ],
  },
};

export default nextConfig;
