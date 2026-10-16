import type { Metadata } from 'next'
import { resolvePageMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  return resolvePageMetadata('services/ecommerce')
}

export default function EcommerceServiceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
