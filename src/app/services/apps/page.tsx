import MobileAppsCatalog from './catalog-client'
import type { MobileApp } from '@/data/mobile-apps'
import { getMobileAppsCatalog } from '@/lib/mobile-apps-server'

export const dynamic = 'force-dynamic'

export default async function MobileAppsPage() {
  let initialApps: MobileApp[] = []
  let errorMessage: string | undefined
  try {
    const catalog = await getMobileAppsCatalog()
    initialApps = catalog.apps.filter(app => app.published)
  } catch (error) {
    console.error('Mobile app page catalog fetch failed:', error)
    errorMessage = 'تعذر تحميل التطبيقات من قاعدة البيانات. يرجى المحاولة لاحقاً.'
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://wepstep.sa'
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'تطبيقات WebStep للجوال',
    numberOfItems: initialApps.length,
    itemListElement: initialApps.map((app, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: app.name,
      url: `${baseUrl}/services/apps/${app.slug}`,
      image: app.coverImage || app.iconUrl || undefined,
    })),
  }
  const jsonLd = JSON.stringify(itemListSchema).replace(/</g, '\\u003c')

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <MobileAppsCatalog initialApps={initialApps} errorMessage={errorMessage} />
    </>
  )
}
