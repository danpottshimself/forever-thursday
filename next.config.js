/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      },
    ],
    unoptimized: false,
  },
  output: 'standalone',
  trailingSlash: false,
  poweredByHeader: false,
  compress: true,
}

module.exports = nextConfig
