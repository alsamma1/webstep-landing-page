import type { Metadata } from 'next'
import { DEFAULT_MANAGED_SERVICES, SERVICE_CONFIG, type ManagedServiceKey } from '@/data/managed-services'
import { getManagedServiceContent } from '@/lib/managed-services-server'

export async function getServicePageData(serviceKey: ManagedServiceKey) {
  try {
    const { content } = await getManagedServiceContent(serviceKey)
    return { content, errorMessage: undefined }
  } catch (error) {
    console.error(`Managed service page fetch failed (${serviceKey}):`, error)
    return {
      content: DEFAULT_MANAGED_SERVICES[serviceKey],
      errorMessage: 'تعذر تحميل بيانات الخدمة من Supabase؛ تظهر حالياً بيانات العرض الافتراضية.',
    }
  }
}

export async function getServiceMetadata(serviceKey: ManagedServiceKey): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://wepste.com'
  const { content } = await getServicePageData(serviceKey)
  const url = `${baseUrl}${SERVICE_CONFIG[serviceKey].path}`
  return {
    title: content.seo.title,
    description: content.seo.description,
    keywords: content.seo.keywords,
    alternates: { canonical: url, languages: { 'ar-SA': url } },
    openGraph: {
      type: 'website',
      locale: 'ar_SA',
      url,
      siteName: 'WebStep',
      title: content.seo.title,
      description: content.seo.description,
    },
    twitter: { card: 'summary_large_image', title: content.seo.title, description: content.seo.description },
  }
}

export async function findManagedProject(serviceKey: ManagedServiceKey, slug: string) {
  const { content } = await getServicePageData(serviceKey)
  const project = content.projects.find(item => item.slug === slug && item.published)
  return { content, project }
}
