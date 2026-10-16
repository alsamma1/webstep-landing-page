import type { Metadata } from 'next'
import { resolvePageMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  return resolvePageMetadata('services/systems')
}

export default function SystemsServiceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
