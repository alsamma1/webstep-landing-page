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

  // تنظيف الحقول التي لا يجب تعديلها
  const { id: _id, created_at: _ca, ...clean } = body
  clean.updated_at = new Date().toISOString()

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'إعدادات Supabase غير مكتملة' }, { status: 503 })
  }
  const { data, error } = await getServerClient().from('blog_posts').update(clean).eq('id', id).select().single()
  if (error) {
    console.error('Supabase blog update failed:', error.message)
    return NextResponse.json({ error: 'تعذر تحديث المقال؛ تحقق من مخطط Supabase الحالي' }, { status: 502 })
  }
  return NextResponse.json(data)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'إعدادات Supabase غير مكتملة' }, { status: 503 })
  }
  const { error } = await getServerClient().from('blog_posts').delete().eq('id', id)
  if (error) {
    console.error('Supabase blog delete failed:', error.message)
    return NextResponse.json({ error: 'تعذر حذف المقال' }, { status: 502 })
  }
  return NextResponse.json({ success: true })
}
