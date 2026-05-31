import type { Metadata } from 'next'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import config from '@payload-config'
import { importMap } from '../importMap'

type Args = {
  params: Promise<{ segments: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] }>
}

export async function generateMetadata({ params, searchParams }: Args): Promise<Metadata> {
  try {
    return await generatePageMetadata({ config, params, searchParams })
  } catch {
    return {}
  }
}

export default async function Page({ params, searchParams }: Args) {
  return RootPage({ config, params, searchParams, importMap })
}
