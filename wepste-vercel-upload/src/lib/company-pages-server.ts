import { getServerClient, isSupabaseConfigured } from '@/lib/supabase-server'
export * from './company-pages-types'

// ─── Database Operations Helpers ────────────────────────────────────────────
export async function getCompanyPageContent<T>(key: 'page_about' | 'page_contact' | 'page_order' | 'page_careers', defaultData: T): Promise<T> {
  if (!isSupabaseConfigured()) return defaultData
  try {
    const { data, error } = await getServerClient()
      .from('site_settings')
      .select('value')
      .eq('key', key)
      .single()
    if (error || !data?.value) return defaultData
    return { ...defaultData, ...(data.value as Record<string, unknown>) } as T
  } catch (err) {
    console.error(`Error loading ${key} from Supabase:`, err)
    return defaultData
  }
}

export async function saveCompanyPageContent<T = any>(key: 'page_about' | 'page_contact' | 'page_order' | 'page_careers', value: T): Promise<boolean> {
  if (!isSupabaseConfigured()) throw new Error('إعدادات Supabase غير متوفرة')
  const { error } = await getServerClient()
    .from('site_settings')
    .upsert({
      key,
      value,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'key' })

  if (error) {
    console.error(`Error saving ${key} to Supabase:`, error.message)
    throw new Error(error.message)
  }
  return true
}
