/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    unoptimized: false,
  },
  output: 'standalone',
  trailingSlash: false,
  poweredByHeader: false,
  compress: true,
}

module.exports = nextConfig
