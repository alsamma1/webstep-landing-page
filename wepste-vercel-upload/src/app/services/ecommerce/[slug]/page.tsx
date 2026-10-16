import type { Metadata } from 'next'
import { ManagedServiceProjectDetail, generateManagedProjectMetadata } from '@/app/services/components/service-project-detail'

type PageProps = { params: Promise<{ slug: string }> }
export const dynamic = 'force-dynamic'

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  return generateManagedProjectMetadata('ecommerce', props)
}

export default async function EcommerceProjectPage({ params }: PageProps) {
  return await ManagedServiceProjectDetail({ serviceKey: 'ecommerce', params })
}
