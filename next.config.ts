
import type {NextConfig} from 'next';
// i18n config import is not needed here if the i18n block is removed.
// import { i18n } from './src/lib/i18n-config'; 

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
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
    ],
  },
  // Removed i18n block as it's for Pages Router
  // i18n: {
  //   locales: i18n.locales,
  //   defaultLocale: i18n.defaultLocale,
  // },
};

export default nextConfig;
