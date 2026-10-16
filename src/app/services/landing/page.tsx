import type { Metadata } from 'next'
import LandingServicePage from './service-client'
import { DEFAULT_LANDING_SERVICE_CONTENT, parseLandingServiceContent } from '@/data/landing-service'
import { getLandingServiceContent } from '@/lib/landing-service-server'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://wepste.com'
  let seo = DEFAULT_LANDING_SERVICE_CONTENT.seo
  try {
    const result = await getLandingServiceContent()
    seo = result.content.seo
  } catch (error) {
    console.error('Landing service metadata fetch failed:', error)
  }
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: { canonical: `${baseUrl}/services/landing`, languages: { 'ar-SA': `${baseUrl}/services/landing` } },
    openGraph: { type: 'website', locale: 'ar_SA', url: `${baseUrl}/services/landing`, siteName: 'WebStep', title: seo.title, description: seo.description },
    twitter: { card: 'summary_large_image', title: seo.title, description: seo.description },
  }
}

export default async function LandingPage() {
  let content = DEFAULT_LANDING_SERVICE_CONTENT
  let errorMessage: string | undefined
  try {
    const result = await getLandingServiceContent()
    const parsed = parseLandingServiceContent(result.content)
    if (!parsed.success) throw new Error('Stored landing page content did not validate')
    content = parsed.data
  } catch (error) {
    console.error('Landing service page content fetch failed:', error)
    errorMessage = 'تعذر تحميل بعض بيانات الصفحة من قاعدة البيانات؛ نعرض نسخة افتراضية حالياً.'
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://wepste.com'
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: content.seo.title,
    description: content.seo.description,
    serviceType: 'Landing Page Design and Development',
    provider: { '@type': 'Organization', name: 'WebStep', url: baseUrl },
    areaServed: { '@type': 'Country', name: 'Saudi Arabia' },
    url: `${baseUrl}/services/landing`,
    offers: { '@type': 'AggregateOffer', priceCurrency: 'SAR', lowPrice: '600', highPrice: '2000' },
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
      <LandingServicePage content={content} errorMessage={errorMessage} />
    </>
  )
}
