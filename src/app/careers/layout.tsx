import type { Metadata } from 'next'
import { resolvePageMetadata } from '@/lib/seo'

export const revalidate = 60

const fallbackMetadata: Metadata = {
  title: 'الوظائف والانضمام لفريق WebStep | فرص العمل',
  description: 'انضم لفريق WebStep وكن جزءاً من مستقبل التطوير الرقمي في السعودية. فرص عمل في تطوير المواقع، تطبيقات الجوال، تصميم UI/UX، وتسويق رقمي.',
  keywords: ['وظائف تقنية', 'وظائف مطور', 'وظائف مصمم', 'العمل مع WebStep', 'وظائف تسويق رقمي'],
  openGraph: {
    title: 'وظائف WebStep | انضم للفريق',
    description: 'كن جزءاً من فريق يبني مستقبل التحول الرقمي في السعودية.',
    locale: 'ar_SA',
    type: 'website',
    url: 'https://wepstep.sa/careers',
  },
  alternates: { canonical: 'https://wepstep.sa/careers' },
}

export async function generateMetadata(): Promise<Metadata> {
  return resolvePageMetadata('careers', fallbackMetadata)
}

export default function CareersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
