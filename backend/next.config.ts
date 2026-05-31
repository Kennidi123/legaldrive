import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  serverExternalPackages: ['pino', 'pino-abstract-transport', 'sharp'],
}

export default withPayload(nextConfig, {
  configPath: path.resolve(__dirname, 'payload.config.ts'),
})
