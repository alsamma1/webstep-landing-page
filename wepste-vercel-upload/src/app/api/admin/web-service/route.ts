import { NextRequest, NextResponse } from 'next/server'
import { getServerClient, isSupabaseConfigured } from '@/lib/supabase-server'
import {
  getDefaultWebServiceContent,
  isJsonValue,
  parseWebServiceContent,
  webServiceContentSchema,
} from '@/lib/web-service-content'

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'إعدادات Supabase غير مكتملة' }, { status: 503 })
  }

  try {
    const { data, error } = await getServerClient()
      .from('web_service_page_content')
      .select('content, updated_at')
      .eq('page_slug', 'services/web')
      .maybeSingle()

    if (error) {
      console.error('Admin website service content fetch failed:', error.message)
      return NextResponse.json({ error: 'تعذر تحميل محتوى الصفحة من Supabase' }, { status: 502 })
    }
    if (!data) return NextResponse.json({ content: getDefaultWebServiceContent(), saved: false })

    const parsed = parseWebServiceContent(data.content)
    if (!parsed.success) {
      console.error('Stored website service content is invalid:', parsed.error.issues)
      return NextResponse.json({ error: 'محتوى الصفحة المخزن غير صالح؛ صحح بيانات الجدول قبل تعديلها' }, { status: 502 })
    }
    return NextResponse.json({ content: parsed.data, saved: true, updatedAt: data.updated_at })
  } catch (error) {
    console.error('Admin website service content request failed:', error)
    return NextResponse.json({ error: 'تعذر الاتصال بقاعدة بيانات محتوى الصفحة' }, { status: 502 })
  }
}

export async function PATCH(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'إعدادات Supabase غير مكتملة' }, { status: 503 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'بيانات JSON غير صالحة' }, { status: 400 })
  }
  if (!body || typeof body !== 'object' || Array.isArray(body) || !('content' in body)) {
    return NextResponse.json({ error: 'بيانات محتوى الصفحة غير مكتملة' }, { status: 400 })
  }

  const parsed = webServiceContentSchema.safeParse(body.content)
  if (!parsed.success) {
    return NextResponse.json({
      error: 'تحقق من الحقول؛ بعض البيانات ناقصة أو غير صالحة',
      details: parsed.error.issues.map(issue => ({ path: issue.path.join('.'), message: issue.message })),
    }, { status: 400 })
  }
  if (JSON.stringify(parsed.data).length > 1_000_000) {
    return NextResponse.json({ error: 'حجم محتوى الصفحة أكبر من الحد المسموح' }, { status: 413 })
  }
  if (!isJsonValue(parsed.data)) {
    return NextResponse.json({ error: 'محتوى الصفحة يحتوي على قيمة غير مدعومة' }, { status: 400 })
  }

  try {
    const { error } = await getServerClient()
      .from('web_service_page_content')
      .upsert({
        page_slug: 'services/web',
        content: parsed.data,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'page_slug' })

    if (error) {
      console.error('Admin website service content save failed:', error.message)
      return NextResponse.json({ error: 'تعذر حفظ محتوى الصفحة في Supabase' }, { status: 502 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Admin website service content save request failed:', error)
    return NextResponse.json({ error: 'تعذر الاتصال بقاعدة بيانات محتوى الصفحة' }, { status: 502 })
  }
}
