import { getServerClient, isSupabaseConfigured } from '@/lib/supabase-server'
import { DEFAULT_GEO_SETTINGS, type GeoSettings } from '@/lib/geo'

export async function getGeoSettings(): Promise<GeoSettings> {
  if (!isSupabaseConfigured()) {
    return DEFAULT_GEO_SETTINGS
  }

  try {
    const { data, error } = await getServerClient()
      .from('site_settings')
      .select('value')
      .eq('key', 'geo_settings')
      .single()

    if (error || !data?.value) {
      return DEFAULT_GEO_SETTINGS
    }

    const val = data.value as Partial<GeoSettings>
    return {
      ...DEFAULT_GEO_SETTINGS,
      ...val,
      yemen: {
        ...DEFAULT_GEO_SETTINGS.yemen,
        ...(val.yemen || {}),
      },
      saudi: {
        ...DEFAULT_GEO_SETTINGS.saudi,
        ...(val.saudi || {}),
      },
      pricing: {
        ...DEFAULT_GEO_SETTINGS.pricing,
        ...(val.pricing || {}),
        customPackagePrices: {
          ...DEFAULT_GEO_SETTINGS.pricing.customPackagePrices,
          ...(val.pricing?.customPackagePrices || {}),
        },
      },
      images: {
        ...DEFAULT_GEO_SETTINGS.images,
        ...(val.images || {}),
      },
      social: {
        ...DEFAULT_GEO_SETTINGS.social,
        ...(val.social || {}),
      },
    }
  } catch (err) {
    console.error('Error fetching geo_settings from Supabase:', err)
    return DEFAULT_GEO_SETTINGS
  }
}

export async function saveGeoSettings(settings: GeoSettings): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    throw new Error('إعدادات Supabase غير متوفرة')
  }

  const supabase = getServerClient()
  const now = new Date().toISOString()

  const { error } = await supabase
    .from('site_settings')
    .upsert({
      key: 'geo_settings',
      value: settings,
      updated_at: now,
    }, { onConflict: 'key' })

  if (error) {
    console.error('Failed to save geo_settings:', error.message)
    throw new Error(error.message)
  }

  return true
}
