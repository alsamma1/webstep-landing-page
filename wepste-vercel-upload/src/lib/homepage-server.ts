import { getServerClient, isSupabaseConfigured } from '@/lib/supabase-server'
import { DEFAULT_HOMEPAGE_DATA, type HomepageData } from './homepage-types'

export * from './homepage-types'

export async function getHomepageData(): Promise<HomepageData> {
  if (!isSupabaseConfigured()) return DEFAULT_HOMEPAGE_DATA
  try {
    const supabase = getServerClient()
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'homepage_content')
      .single()

    if (error || !data?.value) {
      return DEFAULT_HOMEPAGE_DATA
    }

    const val = data.value as Partial<HomepageData>
    return {
      ...DEFAULT_HOMEPAGE_DATA,
      ...val,
      sectionOrder: Array.isArray(val.sectionOrder) && val.sectionOrder.length > 0
        ? val.sectionOrder
        : DEFAULT_HOMEPAGE_DATA.sectionOrder,
      sectionsMeta: {
        ...DEFAULT_HOMEPAGE_DATA.sectionsMeta,
        ...(val.sectionsMeta || {}),
      },
      hero: { ...DEFAULT_HOMEPAGE_DATA.hero, ...(val.hero || {}) },
      servicesExperience: {
        ...DEFAULT_HOMEPAGE_DATA.servicesExperience,
        ...(val.servicesExperience || {}),
        items: val.servicesExperience?.items || DEFAULT_HOMEPAGE_DATA.servicesExperience.items,
      },
      story: {
        ...DEFAULT_HOMEPAGE_DATA.story,
        ...(val.story || {}),
        steps: val.story?.steps || DEFAULT_HOMEPAGE_DATA.story.steps,
      },
      process: {
        ...DEFAULT_HOMEPAGE_DATA.process,
        ...(val.process || {}),
        steps: val.process?.steps || DEFAULT_HOMEPAGE_DATA.process.steps,
      },
      servicesNav: {
        ...DEFAULT_HOMEPAGE_DATA.servicesNav,
        ...(val.servicesNav || {}),
        items: (() => {
          const dbItems = val.servicesNav?.items
          if (!Array.isArray(dbItems) || dbItems.length === 0) return DEFAULT_HOMEPAGE_DATA.servicesNav.items
          const existingHrefs = new Set(dbItems.map((i: any) => i.href))
          const missing = DEFAULT_HOMEPAGE_DATA.servicesNav.items.filter(i => !existingHrefs.has(i.href))
          return [...dbItems, ...missing]
        })(),
      },
      statsFeatures: {
        ...DEFAULT_HOMEPAGE_DATA.statsFeatures,
        ...(val.statsFeatures || {}),
        stats: val.statsFeatures?.stats || DEFAULT_HOMEPAGE_DATA.statsFeatures.stats,
        features: val.statsFeatures?.features || DEFAULT_HOMEPAGE_DATA.statsFeatures.features,
      },
      portfolio: {
        ...DEFAULT_HOMEPAGE_DATA.portfolio,
        ...(val.portfolio || {}),
        items: val.portfolio?.items || DEFAULT_HOMEPAGE_DATA.portfolio.items,
      },
    }
  } catch (err) {
    console.error('Error fetching homepage_content from Supabase:', err)
    return DEFAULT_HOMEPAGE_DATA
  }
}

export async function saveHomepageData(data: HomepageData): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    throw new Error('إعدادات Supabase غير متوفرة')
  }

  const supabase = getServerClient()
  const now = new Date().toISOString()

  // 1. Save rich homepage_content
  const { error } = await supabase
    .from('site_settings')
    .upsert({
      key: 'homepage_content',
      value: data,
      updated_at: now,
    }, { onConflict: 'key' })

  if (error) {
    console.error('Failed to save homepage_content:', error.message)
    throw new Error(error.message)
  }

  // 2. Also keep legacy homeContent synced for any other components
  try {
    await supabase.from('site_settings').upsert({
      key: 'homeContent',
      value: {
        heroBadge: data.hero.badge,
        heroWords: data.hero.rotatingWords,
        heroSubtitle: data.hero.subtitle,
      },
      updated_at: now,
    }, { onConflict: 'key' })
  } catch (e) {
    console.warn('Sync legacy homeContent notice:', e)
  }

  return true
}
