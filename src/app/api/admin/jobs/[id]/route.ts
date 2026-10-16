import { NextRequest, NextResponse } from 'next/server'
import { getServerClient, isSupabaseConfigured } from '@/lib/supabase-server'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json().catch(() => null)
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'بيانات غير صالحة' }, { status: 400 })
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'إعدادات Supabase غير مكتملة' }, { status: 503 })
  }
  const { data, error } = await getServerClient().from('jobs').update(body).eq('id', id).select().single()
  if (error) {
    console.error('Supabase job update failed:', error.message)
    return NextResponse.json({ error: 'تعذر تحديث الوظيفة' }, { status: 502 })
  }
  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'إعدادات Supabase غير مكتملة' }, { status: 503 })
  }
  const { error } = await getServerClient().from('jobs').delete().eq('id', id)
  if (error) {
    console.error('Supabase job delete failed:', error.message)
    return NextResponse.json({ error: 'تعذر حذف الوظيفة' }, { status: 502 })
  }
  return NextResponse.json({ success: true })
}
