import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
  },
  async redirects() {
    // Compatibilidade: o painel antigo /cms agora é /admin.
    return [
      { source: '/cms', destination: '/admin', permanent: false },
      { source: '/cms/:path*', destination: '/admin/:path*', permanent: false },
      { source: '/cms-login', destination: '/admin-login', permanent: false },
    ]
  },
}

export default nextConfig
