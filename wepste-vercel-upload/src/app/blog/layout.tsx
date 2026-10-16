import type { Metadata } from 'next'
import { resolvePageMetadata } from '@/lib/seo'

export const revalidate = 60

const fallbackMetadata: Metadata = {
  title: 'المدونة الرقمية | WebStep',
  description: 'مقالات ونصائح تقنية متخصصة في تطوير الويب والتطبيقات.',
  alternates: { canonical: 'https://wepstep.sa/blog' },
}

export async function generateMetadata(): Promise<Metadata> {
  return resolvePageMetadata('blog', fallbackMetadata)
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children
}
