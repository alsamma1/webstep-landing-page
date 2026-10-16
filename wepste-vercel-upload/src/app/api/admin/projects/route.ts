import { NextRequest, NextResponse } from 'next/server'
import { getServerClient, isSupabaseConfigured } from '@/lib/supabase-server'

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'إعدادات Supabase غير مكتملة' }, { status: 503 })
  }
  const { data, error } = await getServerClient().from('projects')
    .select('*').order('sort_order', { ascending: true }).order('created_at', { ascending: false })
  if (error) {
    console.error('Supabase projects fetch failed:', error.message)
    return NextResponse.json({ error: 'تعذر تحميل المشاريع' }, { status: 502 })
  }
  return NextResponse.json(data || [])
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'JSON غير صالح' }, { status: 400 })
  }
  if (typeof body.title !== 'string' || !body.title.trim()) {
    return NextResponse.json({ error: 'اسم المشروع مطلوب' }, { status: 400 })
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'إعدادات Supabase غير مكتملة' }, { status: 503 })
  }
  const { id: _id, created_at: _created, updated_at: _updated, createdAt: _legacy, ...insertData } = body
  const { data, error } = await getServerClient().from('projects').insert(insertData).select().single()
  if (error) {
    console.error('Supabase project insert failed:', error.message)
    return NextResponse.json({ error: 'تعذر حفظ المشروع' }, { status: 502 })
  }
  return NextResponse.json(data, { status: 201 })
}
