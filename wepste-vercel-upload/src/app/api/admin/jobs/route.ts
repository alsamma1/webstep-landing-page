import { NextRequest, NextResponse } from 'next/server'
import { getServerClient, isSupabaseConfigured } from '@/lib/supabase-server'

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'إعدادات Supabase غير مكتملة' }, { status: 503 })
  }
  const { data, error } = await getServerClient().from('jobs').select('*').order('created_at', { ascending: false })
  if (error) {
    console.error('Supabase jobs fetch failed:', error.message)
    return NextResponse.json({ error: 'تعذر تحميل الوظائف' }, { status: 502 })
  }
  return NextResponse.json(data || [])
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body || typeof body.title !== 'string' || !body.title.trim() || typeof body.department !== 'string' || !body.department.trim()) {
    return NextResponse.json({ error: 'عنوان الوظيفة والقسم مطلوبان' }, { status: 400 })
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'إعدادات Supabase غير مكتملة' }, { status: 503 })
  }
  const { data, error } = await getServerClient().from('jobs').insert(body).select().single()
  if (error) {
    console.error('Supabase job insert failed:', error.message)
    return NextResponse.json({ error: 'تعذر حفظ الوظيفة' }, { status: 502 })
  }
  return NextResponse.json(data, { status: 201 })
}
