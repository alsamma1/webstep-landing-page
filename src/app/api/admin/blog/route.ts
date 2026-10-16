import { NextRequest, NextResponse } from 'next/server'
import { getServerClient, isSupabaseConfigured } from '@/lib/supabase-server'

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'إعدادات Supabase غير مكتملة' }, { status: 503 })
  }
  const { data, error } = await getServerClient().from('blog_posts').select('*').order('created_at', { ascending: false })
  if (error) {
    console.error('Supabase blog fetch failed:', error.message)
    return NextResponse.json({ error: 'تعذر تحميل المقالات' }, { status: 502 })
  }
  return NextResponse.json(data || [])
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // تنظيف الحقول الخاصة بالنظام
  const { id: _id, created_at: _ca, updated_at: _ua, views: _v, ...clean } = body as Record<string, unknown>

  if (!clean.title) return NextResponse.json({ error: 'العنوان مطلوب' }, { status: 400 })
  if (!clean.slug) return NextResponse.json({ error: 'الـ Slug مطلوب' }, { status: 400 })

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'إعدادات Supabase غير مكتملة' }, { status: 503 })
  }
  const { data, error } = await getServerClient().from('blog_posts').insert(clean).select().single()
  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'الـ Slug مستخدم من قبل، اختر رابطاً مختلفاً' }, { status: 409 })
    }
    console.error('Supabase blog insert failed:', error.message)
    return NextResponse.json({ error: 'تعذر حفظ المقال؛ تحقق من تطبيق مخطط Supabase الحالي' }, { status: 502 })
  }
  return NextResponse.json(data, { status: 201 })
}
