import ServiceCatalog from '@/app/services/components/service-catalog'
import { getServiceMetadata, getServicePageData } from '@/app/services/components/service-pages'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export async function generateMetadata(): Promise<Metadata> {
  return getServiceMetadata('support')
}

export default async function SupportPage() {
  const { content, errorMessage } = await getServicePageData('support')
  return <ServiceCatalog serviceKey="support" content={content} errorMessage={errorMessage} />
}
