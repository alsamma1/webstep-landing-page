import ManagedServiceAdmin from '@/app/admin/services/components/managed-service-admin'
import { isManagedServiceKey, SERVICE_CONFIG } from '@/data/managed-services'
import { notFound } from 'next/navigation'

type PageProps = { params: Promise<{ service: string }> }

export default async function ManagedServiceAdminPage({ params }: PageProps) {
  const { service } = await params
  if (!isManagedServiceKey(service)) notFound()
  return <ManagedServiceAdmin serviceKey={service} serviceName={SERVICE_CONFIG[service].name} />
}
