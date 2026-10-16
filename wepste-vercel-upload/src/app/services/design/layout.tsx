import type { Metadata } from 'next'
import { resolvePageMetadata } from '@/lib/seo'

export const revalidate = 60

const fallbackMetadata: Metadata = {
  title: 'تصميم UI/UX احترافي | هوية بصرية ومحاكاة Figma | WebStep',
  description: 'نصمم واجهات مستخدم (UI) وتجارب مستخدم (UX) بمستوى Figma وGoogle. تصميم هوية بصرية كاملة، Design System، Prototype تفاعلي، وتسليم Handoff جاهز للمطور. نرفع معدل التحويل +240٪.',
  keywords: ['تصميم UI', 'تصميم UX', 'هوية بصرية', 'Figma', 'Design System', 'تصميم مواقع احترافي', 'UI UX السعودية', 'تصميم تطبيقات'],
  openGraph: {
    title: 'تصميم UI/UX احترافي | WebStep',
    description: 'تصاميم تخلق مشاعر وتُحقق نتائج. منهجية مبنية على البحث والبيانات وليس الذوق فقط.',
    locale: 'ar_SA',
    type: 'website',
    url: 'https://wepstep.sa/services/design',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'تصميم UI/UX احترافي | WebStep',
    description: 'واجهات مستخدم بمستوى الشركات العالمية — Figma Prototype جاهز للتطوير.',
  },
  alternates: {
    canonical: 'https://wepstep.sa/services/design',
  },
}

export async function generateMetadata(): Promise<Metadata> {
  return resolvePageMetadata('services/design', fallbackMetadata)
}

export default function DesignLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'تصميم UI/UX احترافي',
            description: 'خدمة تصميم واجهات مستخدم وتجربة مستخدم متكاملة تشمل Wireframes، Design System، وPrototype تفاعلي.',
            provider: {
              '@type': 'Organization',
              name: 'WebStep — ويب ستيب',
              url: 'https://wepstep.sa',
            },
            areaServed: { '@type': 'Country', name: 'Saudi Arabia' },
            serviceType: 'UI/UX Design',
            offers: {
              '@type': 'AggregateOffer',
              priceCurrency: 'SAR',
              lowPrice: '800',
              highPrice: '2000',
            },
          }),
        }}
      />
      {children}
    </>
  )
}
