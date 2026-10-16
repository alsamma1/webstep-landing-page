import { NextRequest, NextResponse } from 'next/server'
import { managedServiceContentSchema } from '@/data/managed-services'
import { getManagedServiceContent, isValidServiceKey, saveManagedServiceContent } from '@/lib/managed-services-server'

type RouteContext = { params: Promise<{ service: string }> }

export async function GET(_request: NextRequest, { params }: RouteContext) {
  const { service } = await params
  if (!isValidServiceKey(service)) return NextResponse.json({ error: 'الخدمة المطلوبة غير معروفة' }, { status: 404 })
  try {
    return NextResponse.json(await getManagedServiceContent(service))
  } catch (error) {
    console.error(`Admin managed service fetch failed (${service}):`, error)
    return NextResponse.json({ error: 'تعذر تحميل بيانات الخدمة؛ تحقق من تطبيق ترحيل Supabase' }, { status: 502 })
  }
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const { service } = await params
  if (!isValidServiceKey(service)) return NextResponse.json({ error: 'الخدمة المطلوبة غير معروفة' }, { status: 404 })
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'بيانات JSON غير صالحة' }, { status: 400 })
  }
  if (!body || typeof body !== 'object' || !('content' in body)) {
    return NextResponse.json({ error: 'محتوى الخدمة مطلوب' }, { status: 400 })
  }
  const parsed = managedServiceContentSchema.safeParse(body.content)
  if (!parsed.success) {
    return NextResponse.json({
      error: 'تحقق من محتوى الخدمة قبل الحفظ',
      details: parsed.error.issues.map(issue => ({ path: issue.path.join('.'), message: issue.message })),
    }, { status: 400 })
  }
  if (JSON.stringify(parsed.data).length > 2_000_000) {
    return NextResponse.json({ error: 'حجم محتوى الخدمة أكبر من الحد المسموح' }, { status: 413 })
  }
  try {
    await saveManagedServiceContent(service, parsed.data)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Admin managed service save failed (${service}):`, error)
    return NextResponse.json({ error: 'تعذر حفظ بيانات الخدمة في Supabase' }, { status: 502 })
  }
}
