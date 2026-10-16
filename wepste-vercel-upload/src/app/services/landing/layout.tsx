import type { Metadata } from 'next'
import { resolvePageMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  return resolvePageMetadata('services/landing')
}

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return children
}
