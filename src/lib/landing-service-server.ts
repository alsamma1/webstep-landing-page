import 'server-only'
import { DEFAULT_LANDING_SERVICE_CONTENT, parseLandingServiceContent, type LandingServiceContent } from '@/data/landing-service'
import { getServerClient, isSupabaseConfigured } from '@/lib/supabase-server'

export async function getLandingServiceContent(): Promise<{ content: LandingServiceContent; saved: boolean }> {
  if (!isSupabaseConfigured()) throw new Error('إعدادات Supabase غير مكتملة')
  const { data, error } = await getServerClient()
    .from('landing_service_content')
    .select('content')
    .eq('page_slug', 'services/landing')
    .maybeSingle()
  if (error) throw new Error(`تعذر تحميل محتوى صفحات الهبوط: ${error.message}`)
  if (!data) return { content: DEFAULT_LANDING_SERVICE_CONTENT, saved: false }
  const parsed = parseLandingServiceContent(data.content)
  if (!parsed.success) throw new Error('محتوى صفحات الهبوط المخزن غير صالح')
  return { content: parsed.data, saved: true }
}

export async function saveLandingServiceContent(content: LandingServiceContent): Promise<void> {
  if (!isSupabaseConfigured()) throw new Error('إعدادات Supabase غير مكتملة')
  const { error } = await getServerClient()
    .from('landing_service_content')
    .upsert({
      page_slug: 'services/landing',
      content,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'page_slug' })
  if (error) throw new Error(`تعذر حفظ محتوى صفحات الهبوط: ${error.message}`)
}
