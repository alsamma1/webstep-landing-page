import { NextRequest, NextResponse } from 'next/server'
import { getServerClient, isSupabaseConfigured } from '@/lib/supabase-server'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'JSON غير صالح' }, { status: 400 })
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'إعدادات Supabase غير مكتملة' }, { status: 503 })
  }
  const { id: _id, created_at: _created, updated_at: _updated, createdAt: _legacy, ...updateData } = body
  const { data, error } = await getServerClient().from('projects').update(updateData).eq('id', id).select().single()
  if (error) {
    console.error('Supabase project update failed:', error.message)
    return NextResponse.json({ error: 'تعذر تحديث المشروع' }, { status: 502 })
  }
  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'إعدادات Supabase غير مكتملة' }, { status: 503 })
  }
  const { error } = await getServerClient().from('projects').delete().eq('id', id)
  if (error) {
    console.error('Supabase project delete failed:', error.message)
    return NextResponse.json({ error: 'تعذر حذف المشروع' }, { status: 502 })
  }
  return NextResponse.json({ success: true })
}
