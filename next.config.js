/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: false, // Enable PWA in all environments
  register: true,
  skipWaiting: true,
});

const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
}

module.exports = withPWA(nextConfig);