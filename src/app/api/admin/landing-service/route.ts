import { NextRequest, NextResponse } from 'next/server'
import { parseLandingServiceContent } from '@/data/landing-service'
import { getLandingServiceContent, saveLandingServiceContent } from '@/lib/landing-service-server'
import { getServerClient, isSupabaseConfigured } from '@/lib/supabase-server'

export async function GET() {
  try {
    return NextResponse.json(await getLandingServiceContent())
  } catch (error) {
    console.error('Admin landing service content fetch failed:', error)
    return NextResponse.json({ error: 'تعذر تحميل محتوى صفحات الهبوط؛ تحقق من ترحيل Supabase' }, { status: 502 })
  }
}

export async function PATCH(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'بيانات JSON غير صالحة' }, { status: 400 })
  }
  if (!body || typeof body !== 'object' || !('content' in body)) {
    return NextResponse.json({ error: 'محتوى صفحة الهبوط مطلوب' }, { status: 400 })
  }
  const parsed = parseLandingServiceContent(body.content)
  if (!parsed.success) {
    return NextResponse.json({
      error: 'تحقق من محتوى الصفحة قبل الحفظ',
      details: parsed.error.issues.map(issue => ({ path: issue.path.join('.'), message: issue.message })),
    }, { status: 400 })
  }
  if (JSON.stringify(parsed.data).length > 1_000_000) {
    return NextResponse.json({ error: 'حجم محتوى الصفحة أكبر من الحد المسموح' }, { status: 413 })
  }
  try {
    await saveLandingServiceContent(parsed.data)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Admin landing service content save failed:', error)
    return NextResponse.json({ error: 'تعذر حفظ محتوى صفحة الهبوط في Supabase' }, { status: 502 })
  }
}

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) return NextResponse.json({ error: 'إعدادات Supabase غير مكتملة' }, { status: 503 })
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'بيانات JSON غير صالحة' }, { status: 400 })
  }
  if (!body || typeof body !== 'object' || !('content' in body)) {
    return NextResponse.json({ error: 'محتوى صفحة الهبوط مطلوب' }, { status: 400 })
  }
  const parsed = parseLandingServiceContent(body.content)
  if (!parsed.success) return NextResponse.json({ error: 'محتوى صفحة الهبوط غير صالح' }, { status: 400 })
  try {
    const client = getServerClient()
    const { data, error } = await client.from('landing_service_content')
      .upsert({ page_slug: 'services/landing', content: parsed.data, updated_at: new Date().toISOString() }, { onConflict: 'page_slug' })
      .select('page_slug').single()
    if (error) throw error
    return NextResponse.json({ success: true, pageSlug: data.page_slug })
  } catch (error) {
    console.error('Admin landing service content initialization failed:', error)
    return NextResponse.json({ error: 'تعذر إنشاء سجل محتوى صفحة الهبوط' }, { status: 502 })
  }
}
