import type { Metadata } from 'next'
import { resolvePageMetadata } from '@/lib/seo'

export const revalidate = 60

const fallbackMetadata: Metadata = {
  title: 'تواصل معنا | WebStep — ويب ستيب',
  description: 'تواصل مع فريق WebStep لمناقشة مشروعك الرقمي. نرد خلال ساعتين. واتساب، بريد إلكتروني، أو نموذج التواصل المباشر.',
  keywords: ['تواصل مع ويب ستيب', 'contact WebStep', 'استشارة مجانية', 'دعم فني'],
  openGraph: {
    title: 'تواصل معنا | WebStep',
    description: 'فريقنا جاهز للإجابة على كل أسئلتك ومناقشة مشروعك.',
    locale: 'ar_SA',
    type: 'website',
    url: 'https://wepstep.sa/contact',
  },
  alternates: { canonical: 'https://wepstep.sa/contact' },
}

export async function generateMetadata(): Promise<Metadata> {
  return resolvePageMetadata('contact', fallbackMetadata)
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
