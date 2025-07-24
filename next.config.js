/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === 'development';
const isDocker = process.env.DOCKER_BUILD === 'true';

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: isDocker || false, // Disable PWA during Docker build to prevent hanging
  register: true,
  skipWaiting: true,
  buildExcludes: [/middleware-manifest\.json$/],
  // Reduce cache and precache in development to minimize warnings
  ...(isDev && {
    publicExcludes: ['!robots.txt', '!sitemap.xml'],
    fallbacks: {
      document: '/offline',
    },
  }),
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: isDev ? 'NetworkFirst' : 'StaleWhileRevalidate',
      options: {
        cacheName: 'offlineCache',
        expiration: {
          maxEntries: isDev ? 50 : 200, // Smaller cache in dev
          maxAgeSeconds: isDev ? 24 * 60 * 60 : 30 * 24 * 60 * 60, // 1 day in dev, 30 days in prod
        },
      },
    },
  ],
});

const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  // Reduce build warnings
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false, // Keep type checking for better development experience
  },
  experimental: {
    optimizeCss: true,
  },
  // Enable standalone output for containerization
  output: 'standalone',
}

module.exports = withPWA(nextConfig);