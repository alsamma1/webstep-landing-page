import type { Metadata } from 'next'
import { resolvePageMetadata } from '@/lib/seo'

export const revalidate = 60

const fallbackMetadata: Metadata = {
  title: 'الشروط والأحكام | WebStep',
  description: 'اقرأ شروط وأحكام استخدام خدمات WebStep — سياسات الأسعار، التسليم، الملكية الفكرية، والاسترداد.',
  alternates: { canonical: 'https://wepste.com/terms' },
}

export async function generateMetadata(): Promise<Metadata> {
  return resolvePageMetadata('terms', fallbackMetadata)
}

export default function TermsLayout({ children }: { children: React.ReactNode }) { return <>{children}</> }
