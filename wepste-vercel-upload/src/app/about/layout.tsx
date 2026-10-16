import type { Metadata } from 'next'
import { resolvePageMetadata } from '@/lib/seo'

export const revalidate = 60

const fallbackMetadata: Metadata = {
  title: 'من نحن | رؤيتنا وأهدافنا | WebStep — ويب ستيب',
  description: 'تعرّف على فريق WebStep، رؤيتنا في التحول الرقمي للسوق السعودي، وأهدافنا في تمكين كل مشروع بحضور رقمي احترافي يُنافس أكبر الشركات العالمية.',
  keywords: ['من نحن', 'ويب ستيب', 'رؤية WebStep', 'فريق التطوير', 'شركة تطوير مواقع السعودية'],
  openGraph: {
    title: 'من نحن | WebStep',
    description: 'نبني مواقع وتطبيقات بمستوى عالمي للسوق السعودي والخليجي.',
    locale: 'ar_SA',
    type: 'website',
    url: 'https://wepstep.sa/about',
  },
  alternates: { canonical: 'https://wepstep.sa/about' },
}

export async function generateMetadata(): Promise<Metadata> {
  return resolvePageMetadata('about', fallbackMetadata)
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
