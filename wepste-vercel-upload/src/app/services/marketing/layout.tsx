import type { Metadata } from 'next'
import { resolvePageMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  return resolvePageMetadata('services/marketing')
}

export default function MarketingServiceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
