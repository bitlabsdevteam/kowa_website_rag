import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
  turbopack: {},
  // Legacy kowatrade.com paths (from data/legacy-pages.json) redirected to their
  // equivalents on this site, so indexed/bookmarked legacy URLs survive the domain cutover.
  async redirects() {
    return [
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/access1.html', destination: '/access', permanent: true },
      { source: '/history1.html', destination: '/company_profile', permanent: true },
      { source: '/new1.html', destination: '/news', permanent: true },
      { source: '/productsindex2.html', destination: '/products', permanent: true },
      { source: '/form1.html', destination: '/contact_us', permanent: true },
    ];
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ...(config.watchOptions ?? {}),
        poll: 1000,
        aggregateTimeout: 300,
      };
    }

    return config;
  },
};

export default nextConfig;
