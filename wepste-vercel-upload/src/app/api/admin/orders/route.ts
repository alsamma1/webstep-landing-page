import { NextRequest, NextResponse } from 'next/server'
import { getServerClient, isSupabaseConfigured } from '@/lib/supabase-server'

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'إعدادات Supabase غير مكتملة' }, { status: 503 })
  }
  const { data, error } = await getServerClient().from('orders').select('*').order('created_at', { ascending: false })
  if (error) {
    console.error('Supabase orders fetch failed:', error.message)
    return NextResponse.json({ error: 'تعذر تحميل الطلبات' }, { status: 502 })
  }
  return NextResponse.json(data || [])
}

export async function POST(req: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'إعدادات Supabase غير مكتملة' }, { status: 503 })
  }
  const body = await req.json().catch(() => null)
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'بيانات الطلب غير صالحة' }, { status: 400 })
  }
  const { data, error } = await getServerClient().from('orders').insert(body).select().single()
  if (error) {
    console.error('Supabase order insert failed:', error.message)
    return NextResponse.json({ error: 'تعذر حفظ الطلب' }, { status: 502 })
  }
  return NextResponse.json(data, { status: 201 })
}
