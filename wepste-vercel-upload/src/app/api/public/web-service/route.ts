import { NextResponse } from 'next/server'
import { getServerClient, isSupabaseConfigured } from '@/lib/supabase-server'
import { getDefaultWebServiceContent, parseWebServiceContent } from '@/lib/web-service-content'

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'إعدادات Supabase غير مكتملة' }, { status: 503 })
  }

  try {
    const { data, error } = await getServerClient()
      .from('web_service_page_content')
      .select('content')
      .eq('page_slug', 'services/web')
      .maybeSingle()

    if (error) {
      console.error('Public website service content fetch failed:', error.message)
      return NextResponse.json({ error: 'تعذر تحميل محتوى صفحة تطوير المواقع' }, { status: 502 })
    }

    if (!data) {
      return NextResponse.json(
        { content: getDefaultWebServiceContent(), saved: false },
        { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } }
      )
    }

    const parsed = parseWebServiceContent(data.content)
    if (!parsed.success) {
      console.error('Stored website service content is invalid:', parsed.error.issues)
      return NextResponse.json({ error: 'محتوى صفحة تطوير المواقع المخزن غير صالح' }, { status: 502 })
    }

    return NextResponse.json(
      { content: parsed.data, saved: true },
      { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } }
    )
  } catch (error) {
    console.error('Public website service content request failed:', error)
    return NextResponse.json({ error: 'تعذر الاتصال بقاعدة بيانات محتوى صفحة تطوير المواقع' }, { status: 502 })
  }
}
