import { NextResponse } from 'next/server'
import { getServerClient, isSupabaseConfigured } from '@/lib/supabase-server'

const PUBLIC_DEFAULTS = {
  siteName: 'WebStep',
  siteUrl: 'https://wepstep.sa',
  email: 'hello@wepstep.sa',
  phone: '+966500000000',
  whatsapp: '966500000000',
  address: 'الرياض، المملكة العربية السعودية',
  primaryColor: '#1F8A54',
  socialLinks: { instagram: '', twitter: '', linkedin: '', tiktok: '' },
  allowOrders: true,
  maintenanceMode: false,
}

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'إعدادات Supabase غير مكتملة' }, { status: 503 })
  }
  const { data, error } = await getServerClient().from('site_settings').select('*')
  if (error) {
    console.error('Supabase public settings fetch failed:', error.message)
    return NextResponse.json({ error: 'تعذر تحميل إعدادات الموقع' }, { status: 502 })
  }
  const merged: Record<string, unknown> = { ...PUBLIC_DEFAULTS }
  for (const row of data || []) {
    if (row.key === 'admin_account') continue
    const value = row.value && typeof row.value === 'object' ? row.value as Record<string, unknown> : {}
    if (row.key === 'seo') {
      if (value.title) merged.seoTitle = value.title
      if (value.description) merged.seoDescription = value.description
    }
    if (row.key === 'social') {
      merged.socialLinks = { ...PUBLIC_DEFAULTS.socialLinks, ...value }
    } else {
      Object.assign(merged, value)
    }
  }
  return NextResponse.json(merged, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  })
}
