import { NextRequest, NextResponse } from 'next/server'
import { parseUiuxDesign } from '@/data/uiux-designs'
import { getUiuxDesigns, saveUiuxDesign } from '@/lib/uiux-designs-server'
import { getServerClient, isSupabaseConfigured } from '@/lib/supabase-server'

export async function GET() {
  try {
    return NextResponse.json({ designs: await getUiuxDesigns() })
  } catch (error) {
    console.error('Admin UI/UX portfolio fetch failed:', error)
    return NextResponse.json({ error: 'تعذر تحميل التصاميم؛ تحقق من تطبيق ترحيل قاعدة البيانات' }, { status: 502 })
  }
}

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'بيانات JSON غير صالحة' }, { status: 400 })
  }
  const parsed = parseUiuxDesign(body)
  if (!parsed.success) {
    return NextResponse.json({
      error: 'تحقق من بيانات التصميم قبل الحفظ',
      details: parsed.error.issues.map(issue => ({ path: issue.path.join('.'), message: issue.message })),
    }, { status: 400 })
  }
  try {
    const designs = await getUiuxDesigns()
    if (designs.some(design => design.id === parsed.data.id || design.slug === parsed.data.slug)) {
      return NextResponse.json({ error: 'معرّف أو رابط التصميم مستخدم بالفعل' }, { status: 409 })
    }
    await saveUiuxDesign(parsed.data)
    return NextResponse.json({ design: parsed.data }, { status: 201 })
  } catch (error) {
    console.error('Admin UI/UX design create failed:', error)
    return NextResponse.json({ error: 'تعذر إضافة التصميم إلى Supabase' }, { status: 502 })
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
  const parsed = parseUiuxDesign(body)
  if (!parsed.success) {
    return NextResponse.json({
      error: 'تحقق من بيانات التصميم قبل الحفظ',
      details: parsed.error.issues.map(issue => ({ path: issue.path.join('.'), message: issue.message })),
    }, { status: 400 })
  }
  try {
    const client = getServerClient()
    const { data: existing, error: findError } = await client
      .from('uiux_designs').select('id').eq('id', parsed.data.id).maybeSingle()
    if (findError) throw findError
    if (!existing) return NextResponse.json({ error: 'التصميم غير موجود' }, { status: 404 })
    const { data: slugOwner, error: slugError } = await client
      .from('uiux_designs').select('id').eq('slug', parsed.data.slug).neq('id', parsed.data.id).maybeSingle()
    if (slugError) throw slugError
    if (slugOwner) return NextResponse.json({ error: 'رابط التصميم مستخدم بالفعل' }, { status: 409 })
    await saveUiuxDesign(parsed.data)
    return NextResponse.json({ design: parsed.data })
  } catch (error) {
    console.error('Admin UI/UX design update failed:', error)
    return NextResponse.json({ error: 'تعذر تحديث التصميم في Supabase' }, { status: 502 })
  }
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'معرّف التصميم مطلوب' }, { status: 400 })
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'إعدادات Supabase غير مكتملة' }, { status: 503 })
  }
  try {
    const { data, error } = await getServerClient()
      .from('uiux_designs').delete().eq('id', id).select('id').maybeSingle()
    if (error) throw error
    if (!data) return NextResponse.json({ error: 'التصميم غير موجود' }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Admin UI/UX design delete failed:', error)
    return NextResponse.json({ error: 'تعذر حذف التصميم من Supabase' }, { status: 502 })
  }
}
