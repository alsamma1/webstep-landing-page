import type { Metadata } from 'next'
import { resolvePageMetadata } from '@/lib/seo'

export const revalidate = 60

const fallbackMetadata: Metadata = {
  title: 'تطوير المواقع الاحترافية | WebStep',
  description: 'نبني مواقع احترافية سريعة وآمنة بأحدث التقنيات.',
  alternates: { canonical: 'https://wepste.com/services/web' },
}

export async function generateMetadata(): Promise<Metadata> {
  return resolvePageMetadata('services/web', fallbackMetadata)
}

export default function WebServiceLayout({ children }: { children: React.ReactNode }) {
  return children
}
