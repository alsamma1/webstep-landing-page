import type { Metadata } from 'next'
import { resolvePageMetadata } from '@/lib/seo'

export const revalidate = 60

const fallbackMetadata: Metadata = {
  title: 'تطبيقات الجوال | اكتشف تطبيقات WebStep',
  description: 'اكتشف تطبيقات WebStep للجوال: تفاصيل المنتجات، لقطات الشاشة، الميزات، الفيديو، وروابط التنزيل من متاجر التطبيقات.',
  alternates: { canonical: 'https://wepstep.sa/services/apps' },
  keywords: ['تطبيقات جوال', 'تطوير تطبيقات', 'تطبيقات أندرويد', 'تطبيقات آيفون', 'WebStep'],
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    url: 'https://wepstep.sa/services/apps',
    siteName: 'WebStep',
    title: 'تطبيقات الجوال | WebStep',
    description: 'استكشف تطبيقات الجوال والمنتجات الرقمية من WebStep.',
    images: [{ url: '/assets/og/og-image.png', width: 1200, height: 630, alt: 'تطبيقات WebStep للجوال' }],
  },
}

export async function generateMetadata(): Promise<Metadata> {
  return resolvePageMetadata('services/apps', fallbackMetadata)
}

export default function AppsServiceLayout({ children }: { children: React.ReactNode }) {
  return children
}
