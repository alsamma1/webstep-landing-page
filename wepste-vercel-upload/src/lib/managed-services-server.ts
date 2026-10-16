import 'server-only'
import {
  DEFAULT_MANAGED_SERVICES,
  SERVICE_CONFIG,
  isManagedServiceKey,
  mergeManagedServiceContent,
  type ManagedServiceContent,
  type ManagedServiceKey,
} from '@/data/managed-services'
import { getServerClient, isSupabaseConfigured } from '@/lib/supabase-server'

export async function getManagedServiceContent(key: ManagedServiceKey): Promise<{ content: ManagedServiceContent; saved: boolean }> {
  if (!isSupabaseConfigured()) throw new Error('إعدادات Supabase غير مكتملة')
  const table = SERVICE_CONFIG[key].table
  const { data, error } = await getServerClient()
    .from(table)
    .select('content')
    .eq('service_key', key)
    .maybeSingle()

  if (error) throw new Error(`تعذر تحميل محتوى ${SERVICE_CONFIG[key].name}: ${error.message}`)
  if (!data) return { content: DEFAULT_MANAGED_SERVICES[key], saved: false }
  const parsed = mergeManagedServiceContent(data.content, key)
  if (!parsed.success) throw new Error(`محتوى ${SERVICE_CONFIG[key].name} المخزن غير صالح`)
  return { content: parsed.data, saved: true }
}

export async function saveManagedServiceContent(key: ManagedServiceKey, content: ManagedServiceContent): Promise<void> {
  if (!isSupabaseConfigured()) throw new Error('إعدادات Supabase غير مكتملة')
  const { error } = await getServerClient()
    .from(SERVICE_CONFIG[key].table)
    .upsert({
      service_key: key,
      content,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'service_key' })

  if (error) throw new Error(`تعذر حفظ ${SERVICE_CONFIG[key].name}: ${error.message}`)
}

export function isValidServiceKey(value: string): value is ManagedServiceKey {
  return isManagedServiceKey(value)
}
