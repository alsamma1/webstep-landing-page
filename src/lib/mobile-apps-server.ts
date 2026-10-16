import 'server-only'
import { DEFAULT_MOBILE_APPS, parseMobileAppsCatalog, type MobileApp } from '@/data/mobile-apps'
import { getServerClient, isSupabaseConfigured } from '@/lib/supabase-server'

const CATALOG_KEY = 'mobile_apps_catalog'

export async function getMobileAppsCatalog(): Promise<{ apps: MobileApp[]; saved: boolean }> {
  if (!isSupabaseConfigured()) throw new Error('إعدادات Supabase غير مكتملة')

  const { data, error } = await getServerClient()
    .from('site_settings')
    .select('value')
    .eq('key', CATALOG_KEY)
    .maybeSingle()

  if (error) throw new Error(`تعذر تحميل كتالوج التطبيقات: ${error.message}`)
  if (!data) return { apps: DEFAULT_MOBILE_APPS, saved: false }
  return { apps: parseMobileAppsCatalog(data.value), saved: true }
}

export async function saveMobileAppsCatalog(apps: MobileApp[]): Promise<void> {
  if (!isSupabaseConfigured()) throw new Error('إعدادات Supabase غير مكتملة')

  const { error } = await getServerClient()
    .from('site_settings')
    .upsert({
      key: CATALOG_KEY,
      value: { apps },
      updated_at: new Date().toISOString(),
    }, { onConflict: 'key' })

  if (error) throw new Error(`تعذر حفظ كتالوج التطبيقات: ${error.message}`)
}
