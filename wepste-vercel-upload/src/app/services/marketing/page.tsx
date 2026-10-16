import ServiceCatalog from '@/app/services/components/service-catalog'
import { getServiceMetadata, getServicePageData } from '@/app/services/components/service-pages'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export async function generateMetadata(): Promise<Metadata> {
  return getServiceMetadata('marketing')
}

export default async function MarketingPage() {
  const { content, errorMessage } = await getServicePageData('marketing')
  return <ServiceCatalog serviceKey="marketing" content={content} errorMessage={errorMessage} />
}
