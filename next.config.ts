// biome-ignore-all lint: ignoring this config file
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tecvidro.com',
        port: '',
        pathname: '**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/models/:path*',
        destination: '/models/:path*',
      },
    ]
  },
  /* config options here */
}

export default nextConfig
