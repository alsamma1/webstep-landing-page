import { NextRequest, NextResponse } from 'next/server'
import { getServerClient, isSupabaseConfigured } from '@/lib/supabase-server'

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'إعدادات Supabase غير مكتملة' }, { status: 503 })
  }
  const { data, error } = await getServerClient().from('messages').select('*').order('created_at', { ascending: false })
  if (error) {
    console.error('Supabase messages fetch failed:', error.message)
    return NextResponse.json({ error: 'تعذر تحميل الرسائل' }, { status: 502 })
  }
  return NextResponse.json(data || [])
}

export async function POST(req: NextRequest) {
  return NextResponse.json({ error: 'استخدم نقطة استقبال النماذج العامة' }, { status: 405 })
}
