import ServiceCatalog from '@/app/services/components/service-catalog'
import { getServiceMetadata, getServicePageData } from '@/app/services/components/service-pages'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export async function generateMetadata(): Promise<Metadata> {
  return getServiceMetadata('systems')
}

export default async function SystemsPage() {
  const { content, errorMessage } = await getServicePageData('systems')
  return <ServiceCatalog serviceKey="systems" content={content} errorMessage={errorMessage} />
}
