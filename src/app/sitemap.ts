import { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://wepste.com'
export const dynamic = 'force-dynamic'

// Static pages with their priorities and change frequencies
const STATIC_PAGES: Array<{
  url: string
  lastModified: Date
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority: number
}> = [
  {
    url: BASE_URL,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 1.0,
  },
  {
    url: `${BASE_URL}/about`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.9,
  },
  {
    url: `${BASE_URL}/contact`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.9,
  },
  {
    url: `${BASE_URL}/order`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.95,
  },
  {
    url: `${BASE_URL}/careers`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  },
  {
    url: `${BASE_URL}/blog`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.85,
  },
  {
    url: `${BASE_URL}/privacy`,
    lastModified: new Date(),
    changeFrequency: 'yearly',
    priority: 0.4,
  },
  {
    url: `${BASE_URL}/terms`,
    lastModified: new Date(),
    changeFrequency: 'yearly',
    priority: 0.4,
  },
  // ─── Service Pages ─────────────────────────────────────
  {
    url: `${BASE_URL}/services/web`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.9,
  },
  {
    url: `${BASE_URL}/services/apps`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.9,
  },
  {
    url: `${BASE_URL}/services/design`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.85,
  },
  {
    url: `${BASE_URL}/services/ecommerce`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.9,
  },
  {
    url: `${BASE_URL}/services/systems`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.85,
  },
  {
    url: `${BASE_URL}/services/landing`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.85,
  },
  {
    url: `${BASE_URL}/services/marketing`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.85,
  },
  {
    url: `${BASE_URL}/services/support`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch dynamic blog posts from API (server-side)
  let blogEntries: Array<{
    url: string
    lastModified: Date
    changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
    priority: number
  }> = []

  try {
    const { isSupabaseConfigured, getServerClient } = await import('@/lib/supabase-server')
    const { db } = await import('@/lib/db')

    let posts: Array<{ slug: string; published?: boolean; updatedAt?: string; updated_at?: string }> = []

    if (isSupabaseConfigured()) {
      try {
        const client = getServerClient()
        const { data, error } = await client
          .from('blog_posts')
          .select('slug, published, updated_at')
          .eq('published', true)
        if (!error && Array.isArray(data) && data.length > 0) {
          posts = data
        }
      } catch (e) {
        console.warn('Supabase sitemap blog fetch fallback:', e)
      }
    }

    if (posts.length === 0) {
      posts = db.blog.getAll().filter(p => p.published)
    }

    blogEntries = posts.map(p => ({
      url: `${BASE_URL}/blog/${p.slug}`,
      lastModified: new Date(p.updated_at || p.updatedAt || Date.now()),
      changeFrequency: 'weekly' as const,
      priority: 0.75,
    }))
  } catch {
    // Silently handle if blog unavailable
  }

  let appEntries: MetadataRoute.Sitemap = []
  try {
    const { getMobileAppsCatalog } = await import('@/lib/mobile-apps-server')
    const { apps } = await getMobileAppsCatalog()
    appEntries = apps.filter(app => app.published).map(app => ({
      url: `${BASE_URL}/services/apps/${app.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: app.featured ? 0.85 : 0.75,
    }))
  } catch (error) {
    console.error('Sitemap mobile app fetch failed:', error)
  }

  let designEntries: MetadataRoute.Sitemap = []
  try {
    const { getUiuxDesigns } = await import('@/lib/uiux-designs-server')
    const designs = await getUiuxDesigns()
    designEntries = designs.filter(design => design.published).map(design => ({
      url: `${BASE_URL}/services/design/${design.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: design.featured ? 0.85 : 0.75,
    }))
  } catch (error) {
    console.error('Sitemap UI/UX design fetch failed:', error)
  }

  let managedServiceEntries: MetadataRoute.Sitemap = []
  try {
    const { getManagedServiceContent } = await import('@/lib/managed-services-server')
    const { SERVICE_KEYS, SERVICE_CONFIG } = await import('@/data/managed-services')
    for (const serviceKey of SERVICE_KEYS) {
      const { content } = await getManagedServiceContent(serviceKey)
      managedServiceEntries.push(...content.projects.filter(project => project.published).map(project => ({
        url: `${BASE_URL}${SERVICE_CONFIG[serviceKey].path}/${project.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: project.featured ? 0.8 : 0.7,
      })))
    }
  } catch (error) {
    console.error('Sitemap managed service fetch failed:', error)
  }

  return [...STATIC_PAGES, ...blogEntries, ...appEntries, ...designEntries, ...managedServiceEntries]
}
