import ServiceCatalog from '@/app/services/components/service-catalog'
import { getServiceMetadata, getServicePageData } from '@/app/services/components/service-pages'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export async function generateMetadata(): Promise<Metadata> {
  return getServiceMetadata('ecommerce')
}

export default async function EcommercePage() {
  const { content, errorMessage } = await getServicePageData('ecommerce')
  return <ServiceCatalog serviceKey="ecommerce" content={content} errorMessage={errorMessage} />
}
